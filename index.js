const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Configuración de Express
const app = express();
const server = http.createServer(app); // Crea el servidor HTTP

// Cargar variables de entorno
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

// Configuración de CORS para Express
let corsOptions;
if (process.env.NODE_ENV === 'production') {
  corsOptions = {
    origin: [
      'https://clikshoping.shop',
      'https://www.clikshoping.shop',
      'https://admin.clikshoping.shop',
      'https://www.admin.clikshoping.shop',
      'http://localhost:4000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
} else {
  corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://192.168.1.77:5173',
      'http://192.168.102.181:5173',
      'localhost:4000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Para permitir el intercambio de cookies
    optionsSuccessStatus: 204,
  };
}

app.use(cors(corsOptions));

// Middleware para manejar las opciones preflight
app.options('*', cors(corsOptions));

// Configuración de socket.io con CORS
const io = socketIo(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

// app.get('/', (req, res) => {
//   res.send('Servidor corriendo!');
//   console.log(req.ip);
// });

// Configuración de Express para leer y parsear el body
app.use(express.json());

// Configurar Express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir rutas
app.use('/api/admin/auth', require('./routes/admin'));
app.use('/api/users/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/invitation', require('./routes/invitations'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/uploads', require('./routes/images'));
app.use('/api/images', require('./routes/images'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/products/issues', require('./routes/IssueReports'));
app.use('/api/pqrs', require('./routes/pqrs'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/codes/registration/admin', require('./routes/regCodeAdmin'));
app.use('/api/accounts/recovery', require('./routes/recovery'));
app.use("/api/comments", require("./routes/comments"));

app.use(express.static('uploads'));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Configuración de socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Aquí puedes manejar eventos de WebSocket

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Escucha de peticiones en el puerto 8000 (o el que definas en .env)
const port = process.env.PORT || 4000;
server.listen(port, '0.0.0.0',() => {
  console.log(`Servidor iniciado en puerto ${port}`);
});

// const express = require('express');
// const http = require('http');
// const path = require('path');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // ==========================
// // CONFIGURACIÓN INICIAL
// // ==========================

// const app = express();
// const server = http.createServer(app);

// // ==========================
// // ENV
// // ==========================

// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: '.env.production' });
// } else {
//   dotenv.config({ path: '.env.development' });
// }

// // ==========================
// // CORS
// // ==========================

// let corsOptions;

// if (process.env.NODE_ENV === 'production') {
//   corsOptions = {
//     origin: [
//       'https://clikshoping.shop',
//       'https://www.clikshoping.shop',
//       'https://admin.clikshoping.shop',
//       'https://www.admin.clikshoping.shop',
//     ],
//     methods: 'GET,POST,PUT,PATCH,DELETE',
//     credentials: true,
//   };
// } else {
//   corsOptions = {
//     origin: [
//       'http://localhost:5173',
//       'http://localhost:4000',
//     ],
//     methods: 'GET,POST,PUT,PATCH,DELETE',
//     credentials: true,
//   };
// }

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // ==========================
// // MIDDLEWARES
// // ==========================

// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ==========================
// // 🔥 LONG POLLING LIGHT
// // ==========================

// // versión global de productos
// let productsVersion = Date.now();

// /**
//  * ENDPOINT DE ACTUALIZACIONES
//  * GET /api/products/updates?since=123456
//  */
// app.get('/api/products/updates', async (req, res) => {
//   try {
//     res.set('Cache-Control', 'no-store');

//     const since = Number(req.query.since || 0);

//     if (since < productsVersion) {
//       // ⚠️ AJUSTA esto a tu DB real
//       const Product = require('./models/Product');
//       const products = await Product.find({ active: true });

//       return res.json({
//         updated: true,
//         version: productsVersion,
//         products,
//       });
//     }

//     return res.json({
//       updated: false,
//       version: productsVersion,
//     });
//   } catch (error) {
//     console.error('Polling error:', error);
//     res.status(500).json({ updated: false });
//   }
// });

// // ==========================
// // RUTAS API
// // ==========================

// app.use('/api/admin/auth', require('./routes/admin'));
// app.use('/api/users/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/auth'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/invitation', require('./routes/invitations'));
// app.use('/api/newsletter', require('./routes/newsletter'));
// app.use('/api/uploads', require('./routes/images'));
// app.use('/api/images', require('./routes/images'));

// // 👉 INYECTAMOS productsVersion A LAS RUTAS DE PRODUCTOS
// app.use('/api/products', (req, res, next) => {
//   res.bumpProductsVersion = () => {
//     productsVersion = Date.now();
//   };
//   next();
// }, require('./routes/products'));

// app.use('/api/cart', require('./routes/cart'));
// app.use('/api/wishlist', require('./routes/wishlist'));
// app.use('/api/ratings', require('./routes/ratings'));
// app.use('/api/products/issues', require('./routes/IssueReports'));
// app.use('/api/pqrs', require('./routes/pqrs'));
// app.use('/api/likes', require('./routes/likes'));
// app.use('/api/codes/registration/admin', require('./routes/regCodeAdmin'));
// app.use('/api/accounts/recovery', require('./routes/recovery'));
// app.use('/api/comments', require('./routes/comments'));

// // ==========================
// // SPA FALLBACK
// // ==========================

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // ==========================
// // SERVER
// // ==========================

// const port = process.env.PORT || 4000;

// server.listen(port, '0.0.0.0', () => {
//   console.log(`Servidor iniciado en puerto ${port}`);
// });