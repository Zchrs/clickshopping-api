// const { Router } = require("express");
// const { 
//   createProduct, 
//   getProducts, 
//   getProductsByCategory, 
//   updateProduct, 
//   deleteProduct,
//   getSoldProducts
// } = require('../controllers/products');
// const { check } = require("express-validator");
// const { validateFields } = require("../middlewares/validate-form-data");
// const { getImagesByProductId, uploadImages } = require("../controllers/images");
// const multer = require('multer');
// const path = require('path');
// const router = Router();


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
//       return cb(new Error('Only images are allowed'), false);
//     }
//     cb(null, true);
//   }
// });

// router.post(
//   "/new-product",
//   [
//     check("name", "name is required").not().isEmpty(),
//     check("price", "price is required").not().isEmpty(),
//     check("previousPrice", "previous price is required").not().isEmpty(),
//     check("category", "category is required").not().isEmpty(),
//     check("quantity", "quantity is required").isEmail(),
//     check("description", "description is required").not().isEmpty(),
//     check("image", "url is required").not().isEmpty(),

//     validateFields,
//  ],
//  createProduct
// );

// router.get('/sold-products', async (req, res) => {
//   try {
//     const products = await getSoldProducts(req, res); // Pasa los parámetros req y res a la función getProducts
//     res.json(products); // Devuelve los productos como respuesta
//   } catch (error) {
//     console.error('Error al obtener productos:', error);
//     res.status(500).json({ error: 'Error al obtener productos' }); // Maneja errores
//   }
// });

// router.get('/products', async (req, res) => {
//   try {
//     const products = await getProducts(req, res); // Pasa los parámetros req y res a la función getProducts
//     res.json(products); // Devuelve los productos como respuesta
//   } catch (error) {
//     console.error('Error al obtener productos:', error);
//     res.status(500).json({ error: 'Error al obtener productos' }); // Maneja errores
//   }
// });

// router.get('/category', async (req, res) => {
//   const category = req.query.category; // Obtiene la categoría de los parámetros de consulta

//   try {
//     const products = await getProductsByCategory(category); // Llama a la función para obtener productos por categoría
//     res.json(products); // Devuelve los productos como respuesta
//   } catch (error) {
//     console.error('Error al obtener productos por categoría:', error);
//     res.status(500).json({ error: 'Error al obtener productos por categoría' }); // Maneja errores
//   }
// });

// router.get('/images/:product_id', getImagesByProductId);

// router.put('/update/:id', upload.array('img_url', 6), updateProduct);

// router.post('/:id/sell-product', async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const result = await sellProduct(productId, quantity);
//     res.status(200).json({ success: true, saleId: result });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// router.delete('/delete/:id', deleteProduct);
// module.exports = router;
const { validateJwtAdmin } = require('../middlewares/validate-jwt');
const { Router } = require("express");
const {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getSoldProducts,
} = require("../controllers/products");

const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-form-data");
const { getImagesByProductId } = require("../controllers/images");

const multer = require("multer");
const path = require("path");

const router = Router();

// ==========================
// MULTER
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// ==========================
// RUTAS
// ==========================

// ➕ CREAR PRODUCTO
router.post( '/new-product',
  [
    // Middleware de autenticación PRIMERO (imprescindible)
    validateJwtAdmin,  // ← Esto asigna req.user si el token es válido

    // Validaciones de campos
    check('name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('price', 'El precio es obligatorio y debe ser numérico').not().isEmpty().isNumeric(),
    check('previousPrice', 'El precio anterior debe ser numérico').optional().isNumeric(),
    check('category', 'La categoría es obligatoria').not().isEmpty().trim(),
    check('quantity', 'La cantidad/stock es obligatoria').not().isEmpty().isInt({ min: 0 }),
    check('description', 'La descripción es obligatoria').not().isEmpty().trim(),

    // Middleware de validación de campos (errores de express-validator)
    validateFields,
  ],
  async (req, res) => {
    try {
      // Aquí req.user YA debería estar definido gracias al middleware
      console.log('Usuario autenticado en ruta:', req.user);

      const result = await createProduct(req);

      // Notificación SSE (si usas eventos en tiempo real)
      await res.notifyProductsUpdate?.(); // opcional, con ? para evitar error si no existe

      res.status(201).json(result);
    } catch (err) {
      console.error('❌ Error en ruta /new-product:', err.message);
      
      const status = err.message.includes('permisos') ? 403 : 500;
      const message = err.message || 'Error al crear el producto';

      res.status(status).json({ ok: false, msg: message });
    }
  }
);

// 📦 PRODUCTOS VENDIDOS
router.get("/sold-products", async (req, res) => {
  try {
    const products = await getSoldProducts(req, res);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error getting sold products" });
  }
});

// 📦 TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  try {
    const products = await getProducts(req, res);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error getting products" });
  }
});

// 📦 POR CATEGORÍA
router.get("/category", async (req, res) => {
  try {
    const products = await getProductsByCategory(req.query.category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error getting products by category" });
  }
});

// 🖼 IMÁGENES DE PRODUCTO
router.get("/images/:product_id", getImagesByProductId);

// ✏️ ACTUALIZAR PRODUCTO
router.put("/update/:id",
  upload.array("img_url", 6),
  async (req, res) => {
    try {
      const product = await updateProduct(req, res);
      await res.notifyProductsUpdate(); // 🔥 SSE
      res.json(product);
    } catch (err) {
      console.error("❌ updateProduct:", err.message);
      res.status(500).json({ error: "Error updating product" });
    }
  }
);

// 🛒 VENDER PRODUCTO
router.post("/:id/sell-product", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const result = await sellProduct(productId, quantity);

    await res.notifyProductsUpdate(); // 🔥 SSE

    res.json({ success: true, saleId: result });
  } catch (err) {
    console.error("❌ sellProduct:", err.message);
    res.status(500).json({ error: "Error selling product" });
  }
});

// ❌ ELIMINAR PRODUCTO
router.delete("/delete/:id", async (req, res) => {
  try {
    await deleteProduct(req, res);
    await res.notifyProductsUpdate(); // 🔥 SSE
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ deleteProduct:", err.message);
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
