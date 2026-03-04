
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const { pool } = require("../database/config");

const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SENDER_TO_RECOVERY,
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_SERVER_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_SENDER_TO_RECOVERY,
          pass: process.env.EMAIL_PASSWORD,
        },
});

const sendCode = async (req, res) => {
  const { email } = req.body
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    await pool.execute(
      "INSERT INTO recovery_codes (email, code) VALUES (?, ?)",
      [email, code]
    )

    await transporter.sendMail({
      from: "support@gclikshoping.shop",
      to: email,
      subject: "Código de recuperación",
      text: `Tu código de recuperación es: ${code}`,
    })

    res.json({ success: true, message: "Código enviado" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Error al enviar código" })
  }
}

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // 🔴 Eliminar códigos vencidos para ese correo antes de verificar
    await pool.execute(
      `DELETE FROM recovery_codes 
       WHERE email = ? AND used = 0 AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 15`,
      [email]
    );

    const [rows] = await pool.execute(
      `SELECT * FROM recovery_codes
       WHERE email = ? AND code = ? AND used = 0
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Código inválido o ya usado" });
    }

    // ✅ Ya no se marca como usado aquí
    res.json({ success: true, message: "Código válido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Código incorrecto" });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica si hay un código válido reciente y no usado
    const [codes] = await pool.execute(
      `SELECT * FROM recovery_codes
       WHERE email = ? AND used = 0
       ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (codes.length === 0) {
      return res.status(400).json({ error: "Código no válido para este usuario" });
    }

    const codeId = codes[0].id;
    const hash = await bcrypt.hash(password, 10);

    // Actualiza la contraseña del usuario
    await pool.execute(
      `UPDATE advisors SET password = ? WHERE email = ?`,
      [hash, email]
    );

    // Marca el código como usado
    await pool.execute(
      `UPDATE recovery_codes SET used = 1 WHERE id = ?`,
      [codeId]
    );

    res.json({ success: true, message: "Contraseña actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al restablecer contraseña" });
  }
};

module.exports = {
    sendCode,
    verifyCode,
    resetPassword
};