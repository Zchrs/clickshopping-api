const {response} = require("express");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mysqls = require("mysql2/promise");
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Crear usuarios
const createUser = async (req, res) => {
  const userId = uuidv4();
  const verificationToken = crypto.randomBytes(32).toString('hex');
  let connection;

  try {
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const [result] = await connection.execute(
      `INSERT INTO users (
        id, country, name, lastname, phone,
        email, role, password, verificationToken
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        req.body.country,
        req.body.name,
        req.body.lastname,
        req.body.phone,
        req.body.email,
        req.body.role,
        hashedPassword,
        verificationToken
      ]
    );

    // ==========================
    // 🔥 ENVÍO DE CORREO (CORREGIDO)
    // ==========================
    try {
      console.log("📧 Preparando envío de email...");
      
      // Verificar variables de entorno
      console.log("EMAIL_SERVER:", process.env.EMAIL_SERVER);
      console.log("EMAIL_SENDER:", process.env.EMAIL_SENDER_TO_VERIFY);
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER, // ej: "smtp.gmail.com" o "smtp.hostinger.com"
        port: parseInt(process.env.EMAIL_PORT) || 465, // ✅ Número, no string
        secure: true, // true para 465, false para otros puertos
        auth: {
          user: process.env.EMAIL_SENDER_TO_VERIFY,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // Para evitar errores con certificados autofirmados
        },
        debug: true, // Muestra información de depuración
      });

      // Verificar conexión SMTP
      await transporter.verify();
      console.log("✅ Servidor SMTP conectado correctamente");

      // Construir URL de verificación
      const verifyUrl = `${process.env.APP_FRONT_URL}/#/clients/account/verify/${userId}`;
      console.log("🔗 URL de verificación:", verifyUrl);

      // Leer y procesar template HTML
      const emailPath = path.join(process.cwd(), 'services', 'verify-email.html');
      console.log("📄 Ruta del template:", emailPath);

      let htmlTemplate = fs.readFileSync(emailPath, 'utf8')
        .replace(/{{VERIFY_URL}}/g, verifyUrl)
        .replace(/{{YEAR}}/g, new Date().getFullYear());

      // Configurar email
      const mailOptions = {
        from: `"Clickshopping" <${process.env.EMAIL_SENDER_TO_VERIFY}>`,
        to: req.body.email,
        subject: 'Verifica tu correo electrónico - Clickshopping',
        html: htmlTemplate,
        attachments: []
      };

      // Verificar si existe el logo antes de adjuntar
      const logoPath = path.join(process.cwd(), 'services', 'logo.png');
      if (fs.existsSync(logoPath)) {
        mailOptions.attachments.push({
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo@clickshopping'
        });
      }

      // Enviar email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email enviado:", info.messageId);
      console.log("📬 Vista previa:", nodemailer.getTestMessageUrl(info));

    } catch (mailError) {
      console.error("❌ Error detallado enviando email:", {
        message: mailError.message,
        code: mailError.code,
        command: mailError.command,
        response: mailError.response,
        stack: mailError.stack
      });
      // El registro continúa aunque falle el email
    }

    return res.status(201).json({
      success: true,
      id: userId,
      message: 'Usuario registrado. Por favor verifica tu correo.',
    });

  } catch (error) {
    console.error('❌ Error en createUser:', error);
    return res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  } finally {
    if (connection) await connection.end();
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE verificationToken = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid token or user already verified.' });
    }

    await connection.query(
      'UPDATE users SET isVerified = 1, verificationToken = NULL WHERE verificationToken = ?',
      [token]
    );

    res.status(200).json({ message: 'User verified successfully.' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const { email, password } = req.body;
    const findUserQuery = "SELECT * FROM users WHERE email = ?";
    const [results] = await connection.query(findUserQuery, [email]);

    if (results.length === 0) {
      console.log("Usuario y/o contraseña incorrecto.");
      return res.status(400).json({ error: "Usuario y/o contraseña incorrecta." });
    }

    const user = results[0];

    if (user.password !== password) {
      console.log("Contraseña incorrecta.");
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    const role = 'user';
    const generateJwt = (id, name, lastname, email, role) => {
      const payload = { id, email, name, lastname, role };
      const secretKey = process.env.SECRET_JWT_SEED;
      const options = { expiresIn: '2h' };
      return jwt.sign(payload, secretKey, options);
    };

    const { id, name, lastname, city, phone, address, zip_code } = user;
    const token = generateJwt(id, name, lastname, email, role);

    res.json({
      ok: true,
      msg: "Login successful",
      user: {
        id,
        name,
        lastname,
        city,
        phone,
        email,
        address,
        zip_code,
        role,
        token,
      },
    });

    console.log(`Inicio de sesión exitoso.
      ID: ${id}
      Nombre: ${name}
      Apellido: ${lastname}
      Ciudad: ${city}
      Teléfono: ${phone}
      Dirección: ${address}
      Email: ${email}
      Rol: ${role}
      Token: ${token}
    `);

    await connection.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please contact the administrator",
    });
  }
};

const renewToken = async (req, res) => {
  const role = "user";
  const { id } = req;

  try {
    const connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    const user = rows[0];
    const { name, lastname, email, address, phone, city } = user;

    const generateJwtAdv = (id, name, lastname, email, role) => {
      const payload = { id, name, lastname, email, role };
      const secretKey = process.env.SECRET_JWT_SEED;
      const options = { expiresIn: "2h" };
      return jwt.sign(payload, secretKey, options);
    };

    const token = generateJwtAdv(id, name, lastname, email, role);

    res.json({
      ok: true,
      id,
      name,
      lastname,
      email,
      address,
      phone,
      city,
      role,
      token
    });

    await connection.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error renovando el token" });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params; // Obtiene el token de la URL

  try {
    // 1. Conecta a la base de datos
    const connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 2. Busca al usuario con el token de verificación
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE verificationToken = ?',
      [token]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const user = users[0];

    // 3. Si el usuario ya está verificado
    if (user.isVerified) {
      await connection.end();
      return res.status(200).json({ message: 'El correo ya está verificado' });
    }

    // 4. Actualiza el usuario como verificado y limpia el token
    await connection.execute(
      'UPDATE users SET isVerified = true, verificationToken = NULL WHERE id = ?',
      [user.id]
    );

    await connection.end();

    // 5. Respuesta exitosa
    res.status(200).json({ 
      success: true,
      message: 'Correo verificado exitosamente' 
    });

  } catch (error) {
    console.error('Error en verifyEmail:', error);
    res.status(500).json({ error: 'Error al verificar el correo' });
  }
};

async function getVerificationToken(userId) {
  let connection;
  try {
    // Crea una conexión a la base de datos
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Buscando token para usuario ID:', userId);

    // Realiza la consulta para obtener el token
    const [userRows] = await connection.execute(
      'SELECT id, verificationToken FROM users WHERE id = ?', 
      [userId]
    );

    // Verifica si se encontró el usuario
    if (userRows.length === 0) {
      console.log('No se encontró usuario con ID:', userId);
      return null; // Mejor que retornar array vacío para distinguir "no encontrado" de "error"
    }

    const userData = userRows[0];
    console.log('Datos encontrados:', userData);

    return {
      id: userData.id,
      token: userData.verificationToken
    };

  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

module.exports = {
  createUser,
  loginUser,
  verifyEmail,
  verifyUser,
  getVerificationToken,
  renewToken
};