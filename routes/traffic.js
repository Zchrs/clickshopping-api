const { Router } = require("express");
const { pool } = require("../database/config"); // ← cambio importante aquí
const createVisitorKey = require("../utils/visitorKey");
const {detectBrowser} = require("../utils/detectBrowser");
const {detectDevice} = require("../utils/detectDevice");
const {detectOS} = require("../utils/detectSo");

const router = Router();


router.post("/visits/track", async (req, res) => {
  const pathname = req.body?.pathname;

  if (!pathname) {
    return res.status(400).json({ error: "pathname requerido" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";
  const visitorKey = createVisitorKey(ip, userAgent);

  const browser = detectBrowser(userAgent);
  const device = detectDevice(userAgent);
  const os = detectOS(userAgent);

  try {
    const [exists] = await pool.query(
      `
      SELECT id FROM traffic
      WHERE visitor_key = ?
      AND visited_at >= NOW() - INTERVAL 24 HOUR
      LIMIT 1
      `,
      [visitorKey]
    );

    if (exists.length === 0) {
await pool.query(
  `
  INSERT INTO traffic (visitor_key, pathname, ip, browser, device, os, visited_at)
  VALUES (?, ?, ?, ?, ?, ?, NOW())
  `,
  [visitorKey, pathname, ip, browser, device, os]
);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error al registrar visita:", err);
    res.status(500).json({ error: "Error al registrar visita" });
  }
    console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);
});

router.get("/visits/stats", async (req, res) => {
  try {
    const { pathname } = req.query;

    const [[{ totalVisits }]] = await pool.query(
      `SELECT COUNT(*) AS totalVisits FROM traffic`
    );

    const [[{ pageVisits }]] = await pool.query(
      `SELECT COUNT(*) AS pageVisits FROM traffic WHERE pathname = ?`,
      [pathname]
    );

const [byDeviceOs] = await pool.query(`
  SELECT device, os, COUNT(*) AS count
  FROM traffic
  GROUP BY device, os
  ORDER BY count DESC
`);

    const [byBrowser] = await pool.query(`
      SELECT browser, COUNT(*) as count
      FROM traffic
      GROUP BY browser
      ORDER BY count DESC
    `);

    res.json({
      totalVisits,
      pageVisits,
      byDeviceOs,
      browsers: byBrowser,
    });
  } catch (err) {
    console.error("Error stats:", err);
    res.status(500).json({ error: "Error stats" });
  }
});

module.exports = router;