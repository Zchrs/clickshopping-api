
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const pool = require("../database/config");

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
      from: "support@clikshoping.shop",
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
  let connection;

  try {
    if (!email || !code) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    connection = await pool.getConnection();

    // 1️⃣ Eliminar códigos vencidos
    await connection.execute(
      `DELETE FROM recovery_codes 
       WHERE email = ? 
       AND used = 0 
       AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 15`,
      [email]
    );

    // 2️⃣ Buscar código válido
    const [rows] = await connection.execute(
      `SELECT * FROM recovery_codes
       WHERE email = ? 
       AND code = ? 
       AND used = 0
       ORDER BY created_at DESC
       LIMIT 1`,
      [email.trim(), code]
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        error: "Código inválido o expirado"
      });
    }

    // ✅ NO marcar como usado aquí - dejar que resetPassword lo haga
    // Solo verificamos que el código existe y es válido

    const validCode = rows[0];
    const minutesPassed = Math.floor(
      (new Date() - new Date(validCode.created_at)) / 1000 / 60
    );
    const remainingMinutes = 15 - minutesPassed;

    res.json({
      success: true,
      message: "Código válido",
      expires_in: remainingMinutes
    });

  } catch (err) {
    console.error("❌ Error en verifyCode:", err);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  } finally {
    if (connection) connection.release();
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔴 Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña son requeridos"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener mínimo 6 caracteres"
      });
    }

    // ✅ Normalizar datos (CLAVE)
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 🔥 Buscar código válido (NO usado)
    const [codes] = await pool.execute(
      `SELECT * FROM recovery_codes
       WHERE email = ? 
       AND used = 0
       ORDER BY created_at DESC 
       LIMIT 1`,
      [cleanEmail]
    );

    if (!codes.length) {
      return res.status(400).json({
        error: "Código no válido o expirado"
      });
    }

    const code = codes[0];

    // 🔒 Validar expiración (15 min)
    const [validTime] = await pool.execute(
      `SELECT TIMESTAMPDIFF(MINUTE, ?, NOW()) as diff`,
      [code.created_at]
    );

    if (validTime[0].diff > 15) {
      return res.status(400).json({
        error: "El código expiró"
      });
    }

    // 🔐 Hash password correctamente
    console.log("PASSWORD ORIGINAL:", password);
console.log("PASSWORD LIMPIO:", password.trim());
    const hash = await bcrypt.hash(cleanPassword, 10);

    // 🔥 Actualizar usuario + convertir guest → user
    const [result] = await pool.execute(
      `UPDATE users 
       SET password = ?, role = 'user' 
       WHERE email = ?`,
      [hash, cleanEmail]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    // 🔥 Marcar código como usado
    await pool.execute(
      `UPDATE recovery_codes 
       SET used = 1 
       WHERE email = ? AND code = ?`,
      [cleanEmail, code.code]
    );

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (err) {
    console.error("❌ Error en resetPassword:", err);
    res.status(500).json({
      error: "Error al restablecer contraseña"
    });
  }
};

module.exports = {
    sendCode,
    verifyCode,
    resetPassword
};