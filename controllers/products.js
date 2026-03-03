
// const mysql = require('mysql');
const util = require('util');
const { pool } = require("../database/config");
const cloudinary = require("../database/cloudinary");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const v4options = {
  random: [
    0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
    0x30, 0x51
  ],
};



const createProduct = async (req) => {
  const {
    id = uuidv4(),
    name,
    price,
    previousPrice,
    category,
    description,
    quantity,
    img_url = [],
    color,
    stock
  } = req.body;

  if (!name || !price) {
    throw new Error("Nombre y precio son obligatorios");
  }

  if (!Array.isArray(img_url)) {
    throw new Error("img_url debe ser un array");
  }

  const safePrice = Number(price) || 0;
  const safePreviousPrice =
    previousPrice !== undefined && previousPrice !== ""
      ? Number(previousPrice)
      : null;

  const safeQuantity = Number(quantity) || 0;

  const isProduction = process.env.NODE_ENV === "production";
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [exists] = await connection.execute(
      "SELECT COUNT(*) AS count FROM products WHERE name = ?",
      [name]
    );

    if (exists[0].count > 0) {
      throw new Error("Producto duplicado");
    }

    await connection.execute(
      `INSERT INTO products
       (id, name, price, previousPrice, category, quantity, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        safePrice,
        safePreviousPrice,
        category,
        safeQuantity,
        description
      ]
    );

    if (img_url.length > 0) {
      const images = img_url.map(img =>
        isProduction
          ? [id, img.public_id, img.url]
          : [id, img, img]
      );

      await connection.query(
        `INSERT INTO products_img (product_id, file_id, img_url)
         VALUES ?`,
        [images]
      );
    }

    if (color && stock !== undefined) {
      await connection.execute(
        `INSERT INTO product_colors (product_id, color, stock)
         VALUES (?, ?, ?)`,
        [id, color, Number(stock) || 0]
      );
    }

    await connection.commit();

    return {
      ok: true,
      id,
      message: "Producto creado correctamente"
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getProducts = async () => {
  try {
    const [products] = await pool.execute(`
      SELECT 
        p.*,

        -- Imágenes
        GROUP_CONCAT(DISTINCT pi.img_url) AS images,

        -- Colores con stock
        JSON_ARRAYAGG(
          DISTINCT JSON_OBJECT(
            'color', pc.color,
            'stock', pc.stock
          )
        ) AS colors

      FROM products p
      LEFT JOIN products_img pi 
        ON p.id = pi.product_id
      LEFT JOIN product_colors pc 
        ON p.id = pc.product_id

      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    return products.map(product => ({
      ...product,
      images: product.images ? product.images.split(",") : [],
      colors: product.colors ? JSON.parse(product.colors) : []
    }));

  } catch (error) {
    console.error("Error en getProducts:", error);
    throw error;
  }
};

const getProductsHandler = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSoldProducts = async () => {
  const [products] = await pool.execute(`
    SELECT product_id, SUM(quantity) AS total_sales
    FROM sold_products
    GROUP BY product_id
  `);
  return products;
};

const getProductsByCategory = async (category) => {
  const connection = await pool.getConnection();

  try {
    const [products] = await connection.execute(
      "SELECT * FROM products WHERE category = ?",
      [category]
    );

    if (products.length === 0) return [];

    const ids = products.map(p => p.id);

    const [ratings] = await connection.query(
      `SELECT * FROM ratings WHERE product_id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    return products.map(product => ({
      ...product,
      ratings: ratings.filter(r => r.product_id === product.id),
    }));
  } finally {
    connection.release();
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, previousPrice, category, quantity, description } = req.body;
  const images = req.files || [];

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE products
       SET name=?, price=?, previousPrice=?, category=?, quantity=?, description=?
       WHERE id=?`,
      [name, price, previousPrice, category, quantity, description, id]
    );

    await connection.execute(
      "DELETE FROM products_img WHERE product_id = ?",
      [id]
    );

    if (images.length > 0) {
      const imageValues = images.map(img => [id, img.filename]);
      await connection.query(
        "INSERT INTO products_img (product_id, img_url) VALUES ?",
        [imageValues]
      );
    }

    await connection.commit();
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  } finally {
    connection.release();
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  const isProduction = process.env.NODE_ENV === "production";

  try {
    await connection.beginTransaction();

    /* ===============================
       Verificar producto
    =============================== */
    const [product] = await connection.execute(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );

    if (product.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no existe" });
    }

    /* ===============================
       Obtener imágenes
    =============================== */
    const [images] = await connection.execute(
      "SELECT file_id FROM products_img WHERE product_id = ?",
      [id]
    );

    /* ===============================
       Borrar Cloudinary SOLO prod
    =============================== */
    if (isProduction && images.length > 0) {
      const publicIds = images
        .map(img => img.file_id)
        .filter(id => id && !id.startsWith("/"));

      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds);
      }
    }

    /* ===============================
       Borrar relaciones
    =============================== */
    await connection.execute(
      "DELETE FROM products_img WHERE product_id = ?",
      [id]
    );

    await connection.execute(
      "DELETE FROM product_colors WHERE product_id = ?",
      [id]
    );

    /* ===============================
       Borrar producto
    =============================== */
    await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    await connection.commit();
    return res.json({ ok: true, message: "Producto eliminado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error("❌ DELETE PRODUCT ERROR:", error.message);
    return res.status(500).json({ error: "Error al eliminar producto" });
  } finally {
    connection.release();
  }
};

module.exports = {
  createProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getSoldProducts,
  getProducts
};