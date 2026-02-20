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
  // Genera ambos identificadores al inicio
  const userId = uuidv4(); // ID único para el usuario
  const verificationToken = crypto.randomBytes(32).toString('hex'); // Token para verificación

  try {
    const connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Verifica email y teléfono...
    // Inserta el usuario con AMBOS identificadores
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

    if (result.affectedRows > 0) {
      // Configura el transporter aquí mismo
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SENDER_TO_VERIFY,
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_SERVER_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_SENDER_TO_VERIFY,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Configura el correo con el verificationToken
     const verifyUrl = `${process.env.APP_FRONT_URL}/#/clients/account/verify/${userId}/${verificationToken}`;

      // Ruta absoluta del archivo HTML
      const emailPath = path.join(process.cwd(), 'services', 'verify-email.html');
          
      // Leer HTML
      let htmlTemplate = fs.readFileSync(emailPath, 'utf8');
          
      // Reemplazar variables
      htmlTemplate = htmlTemplate
        .replace(/{{VERIFY_URL}}/g, verifyUrl)
        .replace(/{{YEAR}}/g, new Date().getFullYear());
          
      // Configurar correo
      const mailBody = {
        from: '"Clickshopping" <noreply@clikshoping.shop>',
        to: req.body.email,
        subject: 'Verifica tu correo electrónico',
        html: htmlTemplate,
        attachments: [
          {
            filename: 'logo.png',
            path: path.join(process.cwd(), 'services/logo.png'),
            cid: 'logo@clickshopping'
          }
        ]
      };

      // Envía el correo y responde
      await transporter.sendMail(mailBody);
      
      res.status(201).json({
        id: userId,
        message: 'Usuario registrado. Por favor verifica tu correo.',
      });
    }

    await connection.end();
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ 
      error: "Error en el servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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