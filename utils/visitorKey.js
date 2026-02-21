const crypto = require("crypto");

module.exports = (ip, userAgent) =>
  crypto.createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");