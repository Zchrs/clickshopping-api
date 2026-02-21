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

    // 1️⃣ INSERTAR USUARIO (siempre debe funcionar)
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

    if (result.affectedRows === 0) {
      throw new Error('No se pudo insertar el usuario');
    }

    // 2️⃣ RESPONDER INMEDIATAMENTE (el usuario ya está creado)
    res.status(201).json({
      success: true,
      id: userId,
      message: 'Usuario registrado. Por favor verifica tu correo.',
    });

    // 3️⃣ ENVIAR EMAIL EN SEGUNDO PLANO (después de responder)
    try {
      console.log(`📧 Enviando email de verificación a ${req.body.email}...`);
      
      const emailSent = await sendVerificationEmail(
        req.body.email,
        userId,
        verificationToken
      );

      if (emailSent) {
        console.log(`✅ Email enviado a ${req.body.email}`);
      } else {
        console.error(`❌ Falló el envío a ${req.body.email}`);
      }
    } catch (emailError) {
      // El error del email NO afecta la respuesta al cliente
      console.error('❌ Error enviando email (en segundo plano):', {
        email: req.body.email,
        userId: userId,
        error: emailError.message,
        stack: emailError.stack
      });
      
      // Aquí podrías guardar el error en una tabla de "emails_pendientes"
      await saveFailedEmail(req.body.email, userId, verificationToken);
    }

  } catch (error) {
    console.error('❌ Error en createUser:', error);
    
    // Solo enviamos error si el usuario NO se creó
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: "Error en el servidor",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } finally {
    if (connection) await connection.end();
  }
};

async function sendVerificationEmail(email, userId, verificationToken) {
  // Validar configuración de email
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_SENDER_TO_VERIFY) {
    console.error('❌ Configuración de email incompleta');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: parseInt(process.env.EMAIL_SERVER_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER_TO_VERIFY,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Importante para producción
      },
      // Timeout más largo para producción
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    // Verificar conexión SMTP
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada');

    const verifyUrl = `${process.env.APP_FRONT_URL}/#/clients/account/verify/${userId}/${verificationToken}`;
    
    // Usar ruta absoluta para archivos
    const emailPath = path.join(__dirname, '../services/verify-email.html');
    const logoPath = path.join(__dirname, '../services/logo.png');

    // Verificar que existe el template
    if (!fs.existsSync(emailPath)) {
      throw new Error(`Template no encontrado: ${emailPath}`);
    }

    let htmlTemplate = fs.readFileSync(emailPath, 'utf8');
    htmlTemplate = htmlTemplate
      .replace(/{{VERIFY_URL}}/g, verifyUrl)
      .replace(/{{YEAR}}/g, new Date().getFullYear());

    const mailOptions = {
      from: `"Clickshopping" <${process.env.EMAIL_SENDER_TO_VERIFY}>`,
      to: email,
      subject: 'Verifica tu correo electrónico - Clickshopping',
      html: htmlTemplate,
    };

    // Solo adjuntar logo si existe
    if (fs.existsSync(logoPath)) {
      mailOptions.attachments = [{
        filename: 'logo-blanco.png',
        path: logoPath,
        cid: 'logo-blanco@clickshopping'
      }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error('❌ Error en sendVerificationEmail:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Registrar el error para debugging
    await logEmailError(email, userId, error);
    
    return false;
  }
}

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