
// const mysql = require('mysql');
const util = require('util');
const pool = require("../database/config");
const cloudinary = require("../database/cloudinary");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");


const createProduct = async (req) => {

  const user = req.user;

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  if (!isAdmin && !isSeller) {
    throw new Error("No tienes permisos para crear productos");
  }

  let {
    prodId = uuidv4(),
    name,
    description,
    price,
    previousPrice,
    category, // ahora enviamos el nombre
    brand,
    stock,
    img_url,
    color,
    variants = []
  } = req.body;

  name = name?.trim();
  description = description || null;
  price = Number(price);
  previousPrice = previousPrice ? Number(previousPrice) : null;
  stock = Number(stock) || 0;
  brand = brand || null;
  img_url = Array.isArray(img_url) ? img_url : [];

  if (!name) throw new Error("Nombre obligatorio");
  if (!price) throw new Error("Precio obligatorio");

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    /* =========================
       CREAR / OBTENER CATEGORIA
    ========================= */

    let categoryId = null;

    if (category) {

      if (isAdmin) {

        categoryId = await createCategory(connection, category);

      } else {

        const [cat] = await connection.execute(
          `SELECT id FROM categories WHERE name = ? LIMIT 1`,
          [category]
        );

        if (cat.length === 0) {
          throw new Error("La categoría no existe");
        }

        categoryId = cat[0].id;
      }
    }

    /* =========================
       EVITAR DUPLICADOS
    ========================= */

    const [exists] = await connection.execute(
      `SELECT id FROM products WHERE name = ? LIMIT 1`,
      [name]
    );

    if (exists.length > 0) {
      throw new Error("El producto ya existe");
    }

    /* =========================
       SELLER
    ========================= */

    let sellerId = null;

    if (isSeller) {
      sellerId = user.id;
    }

    // si es admin, puede asignar sellerId
    if (isAdmin) {
      sellerId = req.body.sellerId || user.id;
    }

    /* =========================
       CREAR PRODUCTO
    ========================= */
    
    const [product] = await connection.execute(
      `INSERT INTO products
      (id, name, description, price, previous_price, category_id, seller_id, brand, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        prodId,
        name,
        description,
        price,
        previousPrice,
        categoryId,
        sellerId,
        brand
      ]
    );

    

    /* =========================
       IMAGENES
    ========================= */

    if (img_url.length > 0) {

      const images = img_url.map(img => [

        prodId,
        img.public_id || null,
        typeof img === "string" ? img : img.url

      ]);

      await connection.query(
        `INSERT INTO products_img
        (product_id, file_id, img_url)
        VALUES ?`,
        [images]
      );
    }

    /* =========================
       INVENTARIO
    ========================= */

    await connection.execute(
      `INSERT INTO inventory
      (product_id, stock, reserved)
      VALUES (?, ?, 0)`,
      [prodId, stock]
    );

    /* =========================
       VARIANTE SIMPLE
    ========================= */

    const createdVariants = [];

    if (color) {

      const variant = await createVariant(
        connection,
        prodId,
        color,
        price,
        stock
      );

      createdVariants.push(variant);
    }

    /* =========================
       VARIANTES MULTIPLES
    ========================= */

    if (variants.length > 0) {

      for (const v of variants) {

        const variant = await createVariant(
          connection,
          prodId,
          v.name,
          v.price || price,
          v.stock || 0
        );

        createdVariants.push(variant);
      }
    }

    await connection.commit();

    return {
      ok: true,
      prodId,
      variants: createdVariants,
      message: "Producto creado correctamente"
    };

  } catch (error) {

    await connection.rollback();
    console.error("❌ createProduct:", error);
    throw error;

  } finally {

    connection.release();

  }
};
/* ============================================
   FUNCIÓN AUXILIAR PARA CREAR VARIANTES
============================================ */
const createVariant = async (
  connection,
  productId,
  variantName,
  price,
  stock
) => {

  const sku = `SKU-${productId}-${Date.now()}`;

  const [variant] = await connection.execute(
    `INSERT INTO product_variants
    (product_id, sku, price, stock)
    VALUES (?, ?, ?, ?)`,
    [productId, sku, price, stock]
  );

  const variantId = variant.insertId;

  return {
    variantId,
    sku,
    name: variantName,
    price,
    stock
  };
};

/* ============================================
   FUNCIÓN PARA CREAR CATEGORÍA (solo admin)
============================================ */
const createCategory = async (connection, name, parent_id = null) => {

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const [exists] = await connection.execute(
    `SELECT id FROM categories WHERE slug = ? LIMIT 1`,
    [slug]
  );

  if (exists.length > 0) {
    return exists[0].id;
  }

  const [result] = await connection.execute(
    `INSERT INTO categories
    (name, slug, parent_id, created_at)
    VALUES (?, ?, ?, NOW())`,
    [name, slug, parent_id]
  );

  return result.insertId;
};
/* ============================================
   FUNCIÓN PARA OBTENER CATEGORÍAS
============================================ */
const getCategories = async (req) => {
  try {
    const { user, admin } = req;
    const isAdmin = admin?.role === 'admin';
    
    let query = `SELECT id, name, slug, parent_id, created_at 
                 FROM clickshopping_categories`;
    let params = [];

    // Si no es admin, solo mostrar categorías activas (asumiendo que tienes un campo status)
    if (!isAdmin) {
      query += ` WHERE status = 'active'`;
    }

    query += ` ORDER BY name`;

    const [categories] = await pool.execute(query, params);
    
    return {
      ok: true,
      categories
    };
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    throw error;
  }
};



const getProducts = async () => {

  const [products] = await pool.execute(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.previous_price,
      p.brand,
      p.category_id,
      p.status,

      GROUP_CONCAT(DISTINCT pi.image_url) AS images,

      JSON_ARRAYAGG(
        DISTINCT JSON_OBJECT(
          'variant_id', pv.id,
          'sku', pv.sku,
          'price', pv.price,
          'stock', pv.stock
        )
      ) AS variants,

      ROUND(AVG(pr.rating),1) AS rating_avg,
      COUNT(DISTINCT pr.id) AS rating_count,

      COALESCE(i.stock,0) AS stock

    FROM products p

    LEFT JOIN products_img pi ON p.id = pi.product_id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN product_ratings pr ON p.id = pr.product_id
    LEFT JOIN inventory i ON p.id = i.product_id

    GROUP BY p.id
    ORDER BY p.id DESC
  `);

  return products.map(p => ({
    ...p,
    images: p.images ? p.images.split(",") : [],
    variants: p.variants ? JSON.parse(p.variants) : []
  }));
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