// const express = require('express');
// const http = require('http');
// const path = require('path');
// const cors = require('cors');
// const socketIo = require('socket.io');
// const dotenv = require('dotenv');

// // Configuración de Express
// const app = express();
// const server = http.createServer(app); // Crea el servidor HTTP

// // Cargar variables de entorno
// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: '.env.production' });
// } else {
//   dotenv.config({ path: '.env.development' });
// }

// // Configuración de CORS para Express
// let corsOptions;
// if (process.env.NODE_ENV === 'production') {
//   corsOptions = {
//     origin: [
//       'https://clikshoping.shop',
//       'https://www.clikshoping.shop',
//       'https://admin.clikshoping.shop',
//       'https://www.admin.clikshoping.shop',
//       'http://localhost:4000',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204,
//   };
// } else {
//   corsOptions = {
//     origin: [
//       'http://localhost:5173',
//       'http://192.168.1.77:5173',
//       'http://192.168.102.181:5173',
//       'localhost:4000',
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Para permitir el intercambio de cookies
//     optionsSuccessStatus: 204,
//   };
// }

// app.use(cors(corsOptions));

// // Middleware para manejar las opciones preflight
// app.options('*', cors(corsOptions));

// // Configuración de socket.io con CORS
// const io = socketIo(server, {
//   cors: {
//     origin: corsOptions.origin,
//     methods: ['GET', 'POST', 'PUT'],
//     credentials: true,
//   },
// });

// // app.get('/', (req, res) => {
// //   res.send('Servidor corriendo!');
// //   console.log(req.ip);
// // });

// // Configuración de Express para leer y parsear el body
// app.use(express.json());

// // Configurar Express para servir archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Definir rutas
// app.use('/api/admin/auth', require('./routes/admin'));
// app.use('/api/users/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/auth'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/invitation', require('./routes/invitations'));
// app.use('/api/newsletter', require('./routes/newsletter'));
// app.use('/api/uploads', require('./routes/images'));
// app.use('/api/images', require('./routes/images'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/wishlist', require('./routes/wishlist'));
// app.use('/api/ratings', require('./routes/ratings'));
// app.use('/api/products/issues', require('./routes/IssueReports'));
// app.use('/api/pqrs', require('./routes/pqrs'));
// app.use('/api/likes', require('./routes/likes'));
// app.use('/api/codes/registration/admin', require('./routes/regCodeAdmin'));
// app.use('/api/accounts/recovery', require('./routes/recovery'));
// app.use("/api/comments", require("./routes/comments"));

// app.use(express.static('uploads'));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });


// // Configuración de socket.io
// io.on('connection', (socket) => {
//   console.log('Cliente conectado');

//   // Aquí puedes manejar eventos de WebSocket

//   socket.on('disconnect', () => {
//     console.log('Cliente desconectado');
//   });
// });

// // Escucha de peticiones en el puerto 8000 (o el que definas en .env)
// const port = process.env.PORT || 4000;
// server.listen(port, '0.0.0.0',() => {
//   console.log(`Servidor iniciado en puerto ${port}`);
// });

// ========================== 
// 🔥 LONG POLLING LIGHT SERVIDOR

// ==========================
// 🔥 LONG POLLING LIGHT SERVIDOR (CORREGIDO)
// ==========================
// ==========================
// 🔥 LONG POLLING LIGHT SERVIDOR (ORDEN CORREGIDO)
// ==========================

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const server = http.createServer(app);

// ENV
dotenv.config({
  path: process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development'
});

const { pool } = require('./database/config');
// CORS (siempre primero)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://clikshoping.shop',
        'https://www.clikshoping.shop',
        'https://admin.clikshoping.shop',
        'https://www.admin.clikshoping.shop',
      ]
    : ['http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

// ==========================
// ✅ 1. PRIMERO: RUTAS API (más específicas)
// ==========================

let productsVersion = Date.now();

// Endpoint polling (MUY ESPECÍFICO)
app.get('/api/products/updates', async (req, res) => {
  console.log('📡 POLLING REQUEST:', {
    url: req.originalUrl,
    since: req.query.since,
    timestamp: new Date().toISOString()
  });
  
  try {
    res.set({
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    });

    const since = Number(req.query.since || 0);
    
    // Validar que since sea un número válido
    if (isNaN(since)) {
      return res.status(400).json({ 
        updated: false, 
        error: 'Invalid since parameter' 
      });
    }

    console.log('📊 Versión actual:', productsVersion, '| Cliente since:', since);

    // Si no hay cambios, responder inmediatamente
    if (since >= productsVersion) {
      return res.json({
        updated: false,
        version: productsVersion,
      });
    }

    // Obtener productos directamente con pool (sin depender del controlador)
    const [products] = await pool.execute(`
      SELECT 
        p.*,
        GROUP_CONCAT(pi.img_url) as images
      FROM products p
      LEFT JOIN products_img pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    console.log(`✅ ${products.length} productos obtenidos`);

    // Procesar imágenes (convertir GROUP_CONCAT a array)
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));

    return res.json({
      updated: true,
      version: productsVersion,
      products: formattedProducts,
    });

  } catch (error) {
    console.error('❌ POLLING ERROR DETALLADO:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    res.status(500).json({ 
      updated: false, 
      error: error.message || 'Error interno del servidor'
    });
  }
});

// API Products con hook de versión
app.use('/api/products', (req, res, next) => {
  res.bumpProductsVersion = () => {
    productsVersion = Date.now();
    console.log('📦 Versión actualizada:', productsVersion);
  };
  next();
}, require('./routes/products'));

// Otras rutas API
app.use('/api/admin/auth', require('./routes/admin'));
app.use('/api/users/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/invitation', require('./routes/invitations'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/uploads', require('./routes/images'));
app.use('/api/images', require('./routes/images'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/products/issues', require('./routes/IssueReports'));
app.use('/api/pqrs', require('./routes/pqrs'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/codes/registration/admin', require('./routes/regCodeAdmin'));
app.use('/api/accounts/recovery', require('./routes/recovery'));
app.use("/api/comments", require("./routes/comments"));

// ==========================
// ✅ 2. SEGUNDO: ARCHIVOS ESTÁTICOS (menos específicos)
// ==========================

// Servir archivos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir archivos estáticos públicos (después de las API)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================
// ✅ 3. TERCERO: MANEJO DE ERRORES 404 PARA API
// ==========================

// Middleware para rutas API no encontradas
app.use('/api', (req, res) => {
  res.status(404).json({ 
    error: 'API route not found',
    path: req.path,
    method: req.method
  });
});

// ==========================
// ✅ 4. CUARTO: SPA FALLBACK (catch-all)
// ==========================

app.get('*', (req, res) => {
  // Solo servir HTML para rutas que no sean API
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================
// SERVER
// ==========================

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🔥 Server running on port', PORT);
  console.log('📡 Polling endpoint: /api/products/updates');
});