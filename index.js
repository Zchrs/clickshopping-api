const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const app = express();
const server = http.createServer(app);
const pool = require("./database/config");

// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://clikshoping.shop",
            "https://www.clikshoping.shop",
            "https://admin.clikshoping.shop",
            "https://www.admin.clikshoping.shop",
          ]
        : ["http://localhost:5173", "http://192.168.1.55:5173" ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// 🔥 SSE PRODUCTS
// ==========================
let sseClients = [];

/**
 * SSE ENDPOINT
 */

app.get("/api/products/stream", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders();

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  try {
    const [products] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.previous_price AS previousPrice,
        p.brand,
        p.status,
        c.id AS category_id,
        c.name AS category,
        c.parent_id AS category_parent_id,
        CASE 
          WHEN c.parent_id IS NOT NULL THEN c.parent_id
          ELSE NULL 
        END AS mainCategory,
        CASE 
          WHEN c.parent_id IS NOT NULL THEN c.name
          ELSE NULL 
        END AS subCategory,
        COALESCE(i.stock - i.reserved, 0) AS stock,
        (
          SELECT ROUND(AVG(rating), 1)
          FROM product_ratings
          WHERE product_id = p.id
        ) AS rating
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.status IN ('active','spent','sold')
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        try {
          // 📸 IMÁGENES
          const [images] = await pool.execute(
            "SELECT img_url FROM products_img WHERE product_id = ?",
            [product.id]
          );

          // 🎨 VARIANTES + COLORES
          const [variantsRaw] = await pool.execute(`
            SELECT 
              pv.id AS variant_id,
              pv.sku,
              pv.price,
              pv.stock,
              av.value AS color
            FROM product_variants pv
            LEFT JOIN variant_attributes pva 
              ON pva.variant_id = pv.id
            LEFT JOIN attribute_values av 
              ON av.id = pva.attribute_value_id
            WHERE pv.product_id = ?
          `, [product.id]);

          // 🧠 LIMPIAR VARIANTES (una por variant_id)
          const variantsMap = {};
          variantsRaw.forEach(v => {
            if (!variantsMap[v.variant_id]) {
              variantsMap[v.variant_id] = {
                variant_id: v.variant_id,
                sku: v.sku,
                price: v.price,
                stock: v.stock,
                color: v.color
              };
            }
          });

          const variants = Object.values(variantsMap);

          // 🎯 COLORES ÚNICOS
          const colors = [
            ...new Set(
              variants
                .map(v => v.color)
                .filter(Boolean)
            )
          ];

          return {
            ...product,
            images: images.map(img => img.img_url),
            variants,
            colors
          };

        } catch (err) {
          console.error(`Error producto ${product.id}:`, err);
          return {
            ...product,
            images: [],
            variants: [],
            colors: []
          };
        }
      })
    );

    res.write(`event: products\ndata: ${JSON.stringify(productsWithDetails)}\n\n`);

  } catch (err) {
    console.error("SSE error:", err);
    res.write(`event: error\ndata: ${JSON.stringify({ message: "Error cargando productos" })}\n\n`);
  }

  req.on("close", () => {
    clearInterval(heartbeat);
  });
});

// Función para actualizar un producto específico
function updateProduct(productId, productData) {
  if (!global.sseClients || global.sseClients.size === 0) return;
  
  const event = `event: product-update\ndata: ${JSON.stringify({ id: productId, ...productData })}\n\n`;
  
  global.sseClients.forEach((client, id) => {
    try {
      client.write(event);
    } catch (err) {
      global.sseClients.delete(id);
    }
  });
}

// ==========================
// 🔥 SSE ORDERS (ADMIN)
// ==========================
let sseOrderClients = [];

app.get("/api/orders/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders();
  console.log("🟢 Admin conectado a SSE Orders");

  sseOrderClients.push(res);

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 1000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseOrderClients = sseOrderClients.filter(c => c !== res);
    console.log("🔴 Admin desconectado SSE Orders");
  });
});

// ==========================
// 🔔 NOTIFY ORDER UPDATE
// ==========================
function notifyOrderUpdate(orderData) {
  if (sseOrderClients.length === 0) return;

  sseOrderClients.forEach(res => {
    res.write(
      `event: order-proof\ndata: ${JSON.stringify(orderData)}\n\n`
    );
  });

  console.log(`📡 SSE ORDER broadcast → ${sseOrderClients.length} admins`);
}

// ==========================
// 🔔 NOTIFY PRODUCTS UPDATE
// ==========================
async function notifyProductsUpdate() {
  if (sseClients.length === 0) return;

  try {
    const [products] = await pool.execute(`
      SELECT p.*, GROUP_CONCAT(pi.img_url) as images
      FROM products p
      LEFT JOIN products_img pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const formatted = products.map(p => ({
      ...p,
      images: p.images ? p.images.split(",") : [],
    }));

    sseClients.forEach(res => {
      res.write(`event: products\ndata: ${JSON.stringify(formatted)}\n\n`);
    });

    console.log(`📡 SSE broadcast → ${sseClients.length} clientes`);
  } catch (err) {
    console.error("❌ SSE notify error:", err.message);
  }
}

// ==========================
// 🔌 API PRODUCTS (HOOK SSE)
// ==========================
app.use("/api/products",
  (req, res, next) => {
    res.notifyProductsUpdate = notifyProductsUpdate;
    next();
  },
  require("./routes/products")
);

app.use("/api/orders",
  (req, res, next) => {
    res.notifyOrderUpdate = notifyOrderUpdate;
    next();
  },
  require("./routes/orders")
);

// ==========================
// OTRAS RUTAS
// ==========================
app.use("/api/admin/auth", require("./routes/admin"));
app.use("/api/users/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/invitation", require("./routes/invitations"));
app.use("/api/newsletter", require("./routes/newsletter"));
app.use("/api/uploads", require("./routes/images"));
app.use("/api/images", require("./routes/images"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/products/issues", require("./routes/IssueReports"));
app.use("/api/pqrs", require("./routes/pqrs"));
app.use("/api/likes", require("./routes/likes"));
app.use("/api/codes/registration/admin", require("./routes/regCodeAdmin"));
app.use("/api/accounts/recovery", require("./routes/recovery"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/turists", require("./routes/traffic"));

// ==========================
// STATIC + SPA
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("🔥 Server running on port", PORT);
  console.log("📡 SSE endpoint → /api/products/stream");
});
