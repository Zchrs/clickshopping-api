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
const { pool } = require("./database/config");

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
        : ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
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
  console.log("🟢 Cliente SSE conectado");

  sseClients.push(res);

  // ⏱ HEARTBEAT (cada 20s)
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 20000);

  // 📦 Envío inicial
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

    res.write(`event: products\ndata: ${JSON.stringify(formatted)}\n\n`);
  } catch (err) {
    console.error("❌ SSE initial error:", err.message);
  }

  // ❌ Cliente desconectado
  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c !== res);
    console.log("🔴 Cliente SSE desconectado");
  });
});

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
app.use(
  "/api/products",
  (req, res, next) => {
    res.notifyProductsUpdate = notifyProductsUpdate;
    next();
  },
  require("./routes/products")
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
app.use("/api/cart", require("./routes/cart"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/products/issues", require("./routes/IssueReports"));
app.use("/api/pqrs", require("./routes/pqrs"));
app.use("/api/likes", require("./routes/likes"));
app.use("/api/codes/registration/admin", require("./routes/regCodeAdmin"));
app.use("/api/accounts/recovery", require("./routes/recovery"));
app.use("/api/comments", require("./routes/comments"));
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
