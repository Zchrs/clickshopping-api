/* 
    rutas de usuarios / auth
    host + /api/auth
*/

const mysqls = require("mysql2/promise");
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-form-data");
const { createUser, renewToken, loginUser, verifyUser, verifyEmail, getVerificationToken } = require("../controllers/auth");
const { validateJwt } = require("../middlewares/validate-jwt");
const { isUUID } = require('validator');
const { connectionDB } = require("../database/config");

const router = Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("lastname", "Last name is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("phone", "phone is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 7 }),

    validateFields,
  ],
  createUser
);

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),

    validateFields,
  ],
  loginUser
);

router.post('/account/verify/email/:token', async (req, res) => {
  let connection;
  try {
    const { token } = req.params;
    
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE verificationToken = ?',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }

    const user = users[0];

    if (user.isVerified) {
      return res.json({ 
        success: true,
        message: 'El correo ya está verificado' 
      });
    }

    await connection.execute(
      'UPDATE users SET isVerified = true, verificationToken = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ 
      success: true,
      message: 'Correo verificado exitosamente' 
    });

  } catch (error) {
    console.error('❌ Error en verify-email:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar el correo' 
    });
  } finally {
    if (connection) await connection.end();
  }
});


router.get('/account/email/verify-status/:token', async (req, res) => {
  let connection;
  try {
    const { token } = req.params;
    
    connection = await mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [users] = await connection.execute(
      'SELECT isVerified, id FROM users WHERE verificationToken = ?',
      [token]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        isVerified: false,
        message: 'Token no encontrado' 
      });
    }

    res.json({ 
      success: true,
      isVerified: users[0].isVerified,
      userId: users[0].id
    });

  } catch (error) {
    console.error('❌ Error en verify-status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al verificar estado' 
    });
  } finally {
    if (connection) await connection.end();
  }
});

router.get('/get-verification-token/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('🔍 get-verification-token - userId:', userId);

    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID de usuario no válido'
      });
    }

    const tokenData = await getVerificationToken(userId);
    console.log('📦 tokenData:', tokenData);

    if (!tokenData) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!tokenData.token) {
      return res.status(200).json({ 
        success: false,
        message: 'Usuario ya verificado o sin token pendiente',
        userId: tokenData.id,
        isVerified: true
      });
    }

    res.json({ 
      success: true,
      userId: tokenData.id,
      token: tokenData.token 
    });

  } catch (error) {
    console.error('❌ Error en get-verification-token:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el token de verificación'
    });
  }
});

router.get('/verify/:token', verifyUser);

router.get("/renew", validateJwt , renewToken);

module.exports = router;
