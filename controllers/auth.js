const {response} = require("express");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mysqls = require("mysql2/promise");
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const pool = require("../database/config");
const { v4: uuidv4 } = require('uuid');


// Crear usuarios
// const createUser = async (req, res) => {
//   const userId = uuidv4();
//   const verificationToken = crypto.randomBytes(32).toString('hex');
//   let connection;

//   try {
//     connection = await mysqls.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     });

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     // 1️⃣ INSERTAR USUARIO (siempre debe funcionar)
//     const [result] = await connection.execute(
//       `INSERT INTO users (
//         id, country, name, lastname, phone,
//         email, role, password, verificationToken
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         userId,
//         req.body.country,
//         req.body.name,
//         req.body.lastname,
//         req.body.phone,
//         req.body.email,
//         req.body.role,
//         hashedPassword,
//         verificationToken
//       ]
//     );

//     if (result.affectedRows === 0) {
//       throw new Error('No se pudo insertar el usuario');
//     }

//     // 2️⃣ RESPONDER INMEDIATAMENTE (el usuario ya está creado)
//     res.status(201).json({
//       success: true,
//       id: userId,
//       message: 'Usuario registrado. Por favor verifica tu correo.',
//     });

//     // 3️⃣ ENVIAR EMAIL EN SEGUNDO PLANO (después de responder)
//     try {
//       console.log(`📧 Enviando email de verificación a ${req.body.email}...`);
      
//       const emailSent = await sendVerificationEmail(
//         req.body.email,
//         userId,
//         verificationToken
//       );

//       if (emailSent) {
//         console.log(`✅ Email enviado a ${req.body.email}`);
//       } else {
//         console.error(`❌ Falló el envío a ${req.body.email}`);
//       }
//     } catch (emailError) {
//       // El error del email NO afecta la respuesta al cliente
//       console.error('❌ Error enviando email (en segundo plano):', {
//         email: req.body.email,
//         userId: userId,
//         error: emailError.message,
//         stack: emailError.stack
//       });
      
//       // Aquí podrías guardar el error en una tabla de "emails_pendientes"
//       await saveFailedEmail(req.body.email, userId, verificationToken);
//     }

//   } catch (error) {
//     console.error('❌ Error en createUser:', error);
    
//     // Solo enviamos error si el usuario NO se creó
//     if (!res.headersSent) {
//       res.status(500).json({ 
//         success: false,
//         error: "Error en el servidor",
//         message: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   } finally {
//     if (connection) await connection.end();
//   }
// };

const createUser = async (req, res) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  let connection;

  try {

    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const {
      name,
      lastname,
      email,
      password,
      phone,
      role
    } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    // validar roles permitidos
    const allowedRoles = ["admin","user","guest","advisor","seller"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    // verificar si el email ya existe
    const [userExists] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (userExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4()

    // 1️⃣ INSERTAR USUARIO
    const [result] = await connection.execute(
      `INSERT INTO users (
       id, name, lastname, email, password, phone, role, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        lastname,
        email,
        hashedPassword,
        phone || null,
        userRole,
        "unverified"
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el usuario");
    }

    const userId = id;

    // 2️⃣ GUARDAR TOKEN EN verification_token
    await connection.execute(
      `INSERT INTO verification_token (user_id, token, role)
       VALUES (?, ?, ?)`,
      [
        userId,
        verificationToken,
        userRole
      ]
    );

    // 3️⃣ RESPUESTA INMEDIATA
    res.status(201).json({
      success: true,
      id: userId,
      message: "Usuario registrado. Por favor verifica tu correo."
    });

    // 4️⃣ ENVÍO DE EMAIL EN SEGUNDO PLANO
    try {

      console.log(`📧 Enviando email de verificación a ${email}...`);

      const emailSent = await sendVerificationEmail(
        email,
        userId,
        verificationToken
      );

      if (emailSent) {
        console.log(`✅ Email enviado a ${email}`);
      } else {
        console.error(`❌ Falló el envío a ${email}`);
      }

    } catch (emailError) {

      console.error("❌ Error enviando email (en segundo plano):", {
        email: email,
        userId: userId,
        error: emailError.message
      });

      await saveFailedEmail(email, userId, verificationToken);

    }

  } catch (error) {

    console.error("❌ Error en createUser:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Error en el servidor",
        message: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }

  } finally {

    if (connection) {
      await connection.end();
    }

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
  let connection;
  const { token } = req.params;

  try {
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `SELECT u.id, u.is_verified 
       FROM verification_token vt
       INNER JOIN users u ON vt.user_id = u.id
       WHERE vt.token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        isVerified: false,
        message: 'Token inválido o expirado'
      });
    }

    return res.json({
      success: true,
      isVerified: rows[0].is_verified === 'verified'
    });

  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno'
    });
  } finally {
    if (connection) await connection.end();
  }
};

const loginUser = async (req, res) => {
  let connection;

  try {
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: "Email y contraseña son obligatorios",
      });
    }

    /* ===============================
       BUSCAR USUARIO
    =============================== */
    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (results.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrecta",
      });
    }

    const user = results[0];

    /* ===============================
       VALIDAR ROL
    =============================== */
    if (user.role !== "user") {
      return res.status(403).json({
        ok: false,
        msg: "Acceso denegado. Esta cuenta no tiene permisos de usuario normal.",
        role: user.role,
      });
    }

    /* ===============================
       VALIDAR PASSWORD
    =============================== */
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrecta",
      });
    }

    /* ===============================
       🔥 OBTENER DIRECCIÓN POR DEFECTO
    =============================== */
    const [addresses] = await connection.query(
      `
      SELECT 
        address, 
        city, 
        zip_code,
        state,
        country 
      FROM addresses 
      WHERE user_id = ? AND is_default = 1
      LIMIT 1
      `,
      [user.id]
    );

    // 🔥 DEBUG - Verificar qué viene de la base de datos
    console.log("📦 Dirección encontrada en BD:", addresses.length > 0 ? addresses[0] : "No hay dirección");
    console.log("📍 user.id:", user.id);

    // ✅ Preparar datos de dirección
    let addressData = {
      address: "",
      city: "",
      zipCode: "",  // ← Nota: usamos zipCode para la respuesta
      state: "",
      country: "Colombia"
    };

    if (addresses.length > 0) {
      addressData = {
        address: addresses[0].address || "",
        city: addresses[0].city || "",
        zipCode: addresses[0].zip_code || "",  // ← zip_code se convierte a zipCode
        state: addresses[0].state || "",
        country: addresses[0].country || "Colombia"
      };
    }

    console.log("📤 Datos de dirección a enviar:", addressData);

    /* ===============================
       GENERAR JWT
    =============================== */
    const payload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: "2h",
    });

    /* ===============================
       RESPUESTA
    =============================== */
    return res.json({
      ok: true,
      msg: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        token,
        // 🔥 DATOS DE DIRECCIÓN
        address: addressData.address,
        city: addressData.city,
        zipCode: addressData.zipCode,
        state: addressData.state,
        country: addressData.country
      },
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor, por favor contacta al administrador",
    });

  } finally {
    if (connection) await connection.end();
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

const verifyEmail = async (req, res = response) => {
  const { token } = req.params;
  let connection;

  try {
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // ✅ VALIDAR TOKEN + EXPIRACIÓN EN MYSQL
    const [tokens] = await connection.execute(
      `SELECT user_id 
       FROM verification_token 
       WHERE token = ?
       AND created_at >= NOW() - INTERVAL 120 MINUTE`,
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success:false,
        message:"Token inválido o expirado"
      });
    }

    const user_id = tokens[0].user_id;

    // 2️⃣ Verificar usuario
    const [users] = await connection.execute(
      `SELECT is_verified FROM users WHERE id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success:false,
        message:"Usuario no encontrado"
      });
    }

    if (users[0].is_verified === "verified") {
      return res.json({
        success:true,
        message:"El correo ya está verificado"
      });
    }

    // 3️⃣ Actualizar usuario
    await connection.execute(
      `UPDATE users SET is_verified = 'verified' WHERE id = ?`,
      [user_id]
    );

    // 4️⃣ Eliminar token
    await connection.execute(
      `DELETE FROM verification_token WHERE token = ?`,
      [token]
    );

    res.json({
      success:true,
      message:"Correo verificado exitosamente"
    });

  } catch (error) {
    console.error("❌ Error en verifyEmail:", error);

    res.status(500).json({
      success:false,
      message:"Error al verificar el correo"
    });

  } finally {
    if (connection) await connection.end();
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
      'SELECT user_id, token FROM verification_token WHERE id = ?', 
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

const setGuestPassword = async (req, res) => {
  const { guest_id, email, name } = req.body;

  const connection = await pool.getConnection();

  try {
    if (!guest_id || !email) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // 🔐 Generar token
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // 💾 Guardar en tabla correcta
    await connection.execute(
      `INSERT INTO send_password_guest 
       (guest_id, reset_token, reset_token_expires)
       VALUES (?, ?, ?)`,
      [guest_id, token, expires]
    );

    // 📧 Configurar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const link = `${process.env.FRONT_URL}/create-password/${token}`;

    await transporter.sendMail({
      from: `"ClickShopping" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Crea tu contraseña",
      html: `
        <h2>Hola ${name || "Invitado"}</h2>
        <p>Gracias por tu compra 🎉</p>
        <p>Crea tu cuenta aquí:</p>
        <a href="${link}">${link}</a>
        <p>Este enlace expira en 1 hora</p>
      `,
    });

    res.json({
      success: true,
      message: "Correo enviado",
    });

  } catch (error) {
    console.error("SEND PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error enviando correo",
    });
  } finally {
    connection.release();
  }
};

const createGuestPassword = async (req, res) => {
  const { token, password } = req.body;

  const connection = await pool.getConnection();

  try {
    if (!token || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // 🔍 Buscar token en TU TABLA
    const [rows] = await connection.execute(
      `SELECT guest_id 
       FROM send_password_guest
       WHERE reset_token = ?
       AND reset_token_expires > NOW()`,
      [token]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const guestId = rows[0].guest_id;

    // 🔐 Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Actualizar usuario (convertir guest a user)
    await connection.execute(
      `UPDATE users
       SET password = ?, role = 'user'
       WHERE id = ?`,
      [hashedPassword, guestId]
    );

    // 🧹 Eliminar token usado
    await connection.execute(
      `DELETE FROM send_password_guest WHERE guest_id = ?`,
      [guestId]
    );

    res.json({
      success: true,
      message: "Contraseña creada correctamente",
    });

  } catch (error) {
    console.error("CREATE PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creando contraseña",
    });
  } finally {
    connection.release();
  }
};

const getUsersGuest = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        id,
        name,
        email,
        phone
      FROM users
      WHERE role = 'guest'
      ORDER BY id DESC
    `);

    return rows;

  } catch (error) {
    console.error("❌ Error obteniendo users guest:", error);
    throw error;
  } finally {
    if (connection) connection.release(); // 🔥 IMPORTANTE (no .end())
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyEmail,
  verifyUser,
  getVerificationToken,
  setGuestPassword,
  createGuestPassword,
  getUsersGuest, 
  renewToken,
};