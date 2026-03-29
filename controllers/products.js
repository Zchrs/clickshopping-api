
// const mysql = require('mysql');
const util = require('util');
const pool = require("../database/config");
const cloudinary = require("../database/cloudinary");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");


/* ============================================
   CREAR PRODUCTO
============================================ */
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
    category,
    subCategory,
    brand,
    stock,
    img_url,
    variants = [] // [{ name: "rojo", price, stock }]
  } = req.body;

  name = name?.trim();
  price = Number(price);
  previousPrice = previousPrice ? Number(previousPrice) : null;
  stock = Number(stock) || 0;
  img_url = Array.isArray(img_url) ? img_url : [];

  if (!name) throw new Error("Nombre obligatorio");
  if (!price) throw new Error("Precio obligatorio");

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    /* =========================
       CATEGORÍAS
    ========================= */

    let categoryId = null;

    if (category) {
      if (isAdmin) {
        // crear categoría padre
        const mainCategoryId = await createCategory(connection, category, null);

        // crear subcategoría si existe
        if (subCategory) {
          categoryId = await createCategory(
            connection,
            subCategory,
            mainCategoryId
          );
        } else {
          categoryId = mainCategoryId;
        }
      } else {
        const [cat] = await connection.execute(
          `SELECT id FROM categories WHERE name = ? LIMIT 1`,
          [category]
        );

        if (!cat.length) throw new Error("Categoría no existe");
        categoryId = cat[0].id;
      }
    }

    /* =========================
       DUPLICADOS
    ========================= */

    const [exists] = await connection.execute(
      `SELECT id FROM products WHERE name = ? LIMIT 1`,
      [name]
    );

    if (exists.length) throw new Error("Producto ya existe");

    /* =========================
       SELLER
    ========================= */

    let sellerId = isSeller ? user.id : req.body.sellerId || user.id;

    /* =========================
       CREAR PRODUCTO
    ========================= */

    await connection.execute(
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
        brand,
      ]
    );

    /* =========================
       IMÁGENES
    ========================= */

    if (img_url.length) {
      const images = img_url.map((img) => [
        prodId,
        img.public_id || null,
        typeof img === "string" ? img : img.url,
      ]);

      await connection.query(
        `INSERT INTO products_img (product_id, file_id, img_url) VALUES ?`,
        [images]
      );
    }

    /* =========================
       INVENTARIO BASE
    ========================= */

    await connection.execute(
      `INSERT INTO inventory (product_id, stock, reserved)
       VALUES (?, ?, 0)`,
      [prodId, stock]
    );

    /* =========================
       ATRIBUTO COLOR (SI NO EXISTE)
    ========================= */

    const colorAttrId = await getOrCreateAttribute(connection, "color");

    /* =========================
       VARIANTES (COLORES)
    ========================= */

    const createdVariants = [];

    // si no vienen variantes → crear 1 por defecto
    if (!variants.length) {
      variants = [
        {
          name: "default",
          price,
          stock,
        },
      ];
    }

    for (const v of variants) {
      const variant = await createVariant(
        connection,
        prodId,
        v.name,
        v.price || price,
        v.stock || stock,
        colorAttrId
      );

      createdVariants.push(variant);
    }

    await connection.commit();

    return {
      ok: true,
      prodId,
      variants: createdVariants,
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
  colorName,
  price,
  stock,
  attributeId
) => {
  const sku = `SKU-${productId}-${Date.now()}`;

  // 1. crear variante
  const [variant] = await connection.execute(
    `INSERT INTO product_variants (product_id, sku, price, stock)
     VALUES (?, ?, ?, ?)`,
    [productId, sku, price, stock]
  );

  const variantId = variant.insertId;

  // 2. crear o obtener valor del atributo (color)
  const valueId = await getOrCreateAttributeValue(
    connection,
    attributeId,
    colorName
  );

  // 3. relacionar variante con atributo
  await connection.execute(
    `INSERT INTO variant_attributes (variant_id, attribute_value_id)
     VALUES (?, ?)`,
    [variantId, valueId]
  );

  return {
    variantId,
    sku,
    color: colorName,
    price,
    stock,
  };
};

const getOrCreateAttribute = async (connection, name) => {
  const [exists] = await connection.execute(
    `SELECT id FROM attributes WHERE name = ? LIMIT 1`,
    [name]
  );

  if (exists.length) return exists[0].id;

  const [result] = await connection.execute(
    `INSERT INTO attributes (name, created_at)
     VALUES (?, NOW())`,
    [name]
  );

  return result.insertId;
};

const getOrCreateAttributeValue = async (
  connection,
  attributeId,
  value
) => {
  const [exists] = await connection.execute(
    `SELECT id FROM attribute_values
     WHERE attribute_id = ? AND value = ? LIMIT 1`,
    [attributeId, value]
  );

  if (exists.length) return exists[0].id;

  const [result] = await connection.execute(
    `INSERT INTO attribute_values (attribute_id, value)
     VALUES (?, ?)`,
    [attributeId, value]
  );

  return result.insertId;
};
/* ============================================
   FUNCIÓN PARA CREAR CATEGORÍA (solo admin)
============================================ */
const createCategory = async (connection, name, parentId = null) => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const [exists] = await connection.execute(
    `SELECT id FROM categories 
     WHERE slug = ? AND parent_id <=> ? LIMIT 1`,
    [slug, parentId]
  );

  if (exists.length) return exists[0].id;

  const [result] = await connection.execute(
    `INSERT INTO categories (name, slug, parent_id, created_at)
     VALUES (?, ?, ?, NOW())`,
    [name, slug, parentId]
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
      `
      SELECT 
        p.*,
        c.name AS category,
        sc.name AS subCategory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories sc ON c.parent_id = sc.id
      WHERE c.name = ? OR sc.name = ?
      `,
      [category, category]
    );

    if (products.length === 0) return [];

    const ids = products.map(p => p.id);

    const [ratings] = await connection.query(
      `SELECT * FROM ratings 
       WHERE product_id IN (${ids.map(() => "?").join(",")})`,
      ids
    );

    return products.map(product => ({
      ...product,
      ratings: ratings.filter(r => r.product_id === product.id),
    }));

  } catch (error) {
    console.error("❌ getProductsByCategory:", error);
    throw error;
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
       VALIDAR PRODUCTO
    =============================== */
    const [product] = await connection.execute(
      "SELECT id FROM products WHERE id = ?",
      [id]
    );

    if (!product.length) {
      await connection.rollback();
      return res.status(404).json({
        ok: false,
        error: "Producto no existe",
      });
    }

    /* ===============================
       IMÁGENES (CLOUDINARY)
    =============================== */
    const [images] = await connection.execute(
      "SELECT file_id FROM products_img WHERE product_id = ?",
      [id]
    );

    if (isProduction && images.length > 0) {
      const publicIds = images
        .map((img) => img.file_id)
        .filter((fid) => fid && !fid.startsWith("/"));

      if (publicIds.length) {
        await cloudinary.api.delete_resources(publicIds);
      }
    }

    /* ===============================
       VARIANTES
    =============================== */
    const [variants] = await connection.execute(
      "SELECT id FROM product_variants WHERE product_id = ?",
      [id]
    );

    const variantIds = variants.map((v) => v.id);

    if (variantIds.length > 0) {
      // eliminar relaciones de atributos
      await connection.query(
        `DELETE FROM variant_attributes WHERE variant_id IN (?)`,
        [variantIds]
      );

      // eliminar variantes
      await connection.query(
        `DELETE FROM product_variants WHERE id IN (?)`,
        [variantIds]
      );
    }

    /* ===============================
       IMÁGENES DB
    =============================== */
    await connection.execute(
      "DELETE FROM products_img WHERE product_id = ?",
      [id]
    );

    /* ===============================
       INVENTARIO
    =============================== */
    await connection.execute(
      "DELETE FROM inventory WHERE product_id = ?",
      [id]
    );

    /* ===============================
       PRODUCTO
    =============================== */
    await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    /* ===============================
       COMMIT
    =============================== */
    await connection.commit();

    return res.status(200).json({
      ok: true,
      message: "Producto eliminado correctamente",
    });

  } catch (error) {
    await connection.rollback();

    console.error("❌ deleteProduct:", error);

    // 🔥 evita doble response
    if (!res.headersSent) {
      return res.status(500).json({
        ok: false,
        error: "Error al eliminar producto",
        detail: error.message,
      });
    }

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