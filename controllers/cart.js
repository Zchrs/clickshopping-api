const { pool } = require("../database/config");
const { v4: uuidv4 } = require("uuid");
const util = require('util');

// Configuración de la conexión a la base de datos MySQL

// Función para agregar un producto al carrito
const addToCart = async (req, res) => {
  let { id, user_id, product_id, price, quantity } = req.body;
  const connection = await pool.getConnection();

  try {
    // 🛡️ Normalizar valores
    id = id || uuidv4();
    quantity = Number(quantity);
    price = Number(price);

    if (!user_id || !product_id || !price || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    await connection.beginTransaction();

    // 🔍 Usuario
    const [user] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [user_id]
    );
    if (user.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 🔍 Producto + stock
    const [product] = await connection.execute(
      "SELECT id, quantity FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );
    if (product.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product[0].quantity < quantity) {
      await connection.rollback();
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // 🔍 Carrito
    const [exists] = await connection.execute(
      "SELECT id, quantity FROM user_cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (exists.length > 0) {
      await connection.execute(
        "UPDATE user_cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, user_id, product_id]
      );
    } else {
      await connection.execute(
        `INSERT INTO user_cart (id, user_id, product_id, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [id, user_id, product_id, price, quantity]
      );
    }

    // ➖ Restar stock
    await connection.execute(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?",
      [quantity, product_id]
    );

    await connection.commit();
    res.status(201).json({ ok: true, message: "Producto agregado al carrito" });

  } catch (error) {
    await connection.rollback();
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    connection.release();
  }
};


// Función para obtener todos los productos del carrito
const getCartProducts = async (req, res) => {
  const { user_id } = req.params;
  const connection = await pool.getConnection();

  try {
    if (!user_id) {
      return res.status(400).json({ error: "user_id requerido" });
    }

    // 🔍 Verificar usuario
    const [user] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [user_id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 🛒 Obtener productos del carrito
    const [cartProductsRaw] = await connection.execute(`
      SELECT 
        uc.id,
        uc.user_id,
        uc.product_id,
        uc.price,
        uc.quantity,
        p.name,
        p.description,
        pi.img_url
      FROM user_cart uc
      JOIN products p ON uc.product_id = p.id
      LEFT JOIN products_img pi ON uc.product_id = pi.product_id
      WHERE uc.user_id = ?
    `, [user_id]);

    // 📦 Consolidar imágenes por producto
    const cartProducts = cartProductsRaw.reduce((acc, item) => {
      const product = acc.find(p => p.id === item.id);

      if (product) {
        if (item.img_url && !product.img_urls.includes(item.img_url)) {
          product.img_urls.push(item.img_url);
        }
      } else {
        acc.push({
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
          description: item.description,
          img_urls: item.img_url ? [item.img_url] : [],
        });
      }

      return acc;
    }, []);

    res.status(200).json(cartProducts);

  } catch (error) {
    console.error("GET CART PRODUCTS ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    connection.release();
  }
};
// Función para actualizar un producto del carrito
  const updateCartProduct = async (req, res) => {
    try {
        const { product_Id } = req.params;
        const { quantity } = req.body;

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        connection.connect();

        // Verificar si el producto está en el carrito
        const queryFindProduct = 'SELECT * FROM cart WHERE product_Id = ?';
        connection.query(queryFindProduct, [product_Id], (error, results) => {
            if (error) {
                console.error('Error al buscar el producto en el carrito:', error);
                return res.status(500).json({ error: 'Error al buscar el producto en el carrito.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "El producto no está en el carrito." });
            }

            // Actualizar la cantidad del producto en el carrito
            const queryUpdateQuantity = 'UPDATE cart SET quantity = ? WHERE product_Id = ?';
            connection.query(queryUpdateQuantity, [quantity, product_Id], (error, results) => {
                if (error) {
                    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
                    return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
                }
                
                return res.status(200).json({ message: "Cantidad del producto actualizada en el carrito." });
            });
        });

        connection.end();
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
};

// Función para quitar un producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    console.log('Received userId:', user_id);
    console.log('Received productId:', product_id);

    // Validar que user_id y product_id sean cadenas no vacías
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      throw new Error('Invalid user id');
    }
    if (typeof product_id !== 'string' || product_id.trim() === '') {
      throw new Error('Invalid product id');
    }

    // Crear conexión a la base de datos
    const connection = mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Establecer la conexión
    connection.connect();

    // Promisify la función de consulta para poder usar async/await
    const query = util.promisify(connection.query).bind(connection);

    // Verificar si el usuario existe en la base de datos
    const userCheckSql = 'SELECT id FROM users WHERE id = ?';
    const userExists = await query(userCheckSql, [user_id]);

    if (userExists.length === 0) {
      // Si el usuario no existe, lanzar un error
      throw new Error('User not found');
    }

    // Eliminar el producto del carrito
    const deleteSql = 'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?';
    await query(deleteSql, [user_id, product_id]);

    // Cerrar la conexión
    connection.end();

    // Devolver una respuesta de éxito
    res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para quitar un producto del carrito y agregarki a lista de deseos
const moveToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Validar que user_id y product_id sean cadenas no vacías
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      throw new Error('Invalid user id');
    }
    if (typeof product_id !== 'string' || product_id.trim() === '') {
      throw new Error('Invalid product id');
    }

    // Crear conexión a la base de datos
    const connection = mysqls.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Establecer la conexión
    connection.connect();

    // Promisify la función de consulta para poder usar async/await
    const query = util.promisify(connection.query).bind(connection);

    // Iniciar una transacción
    await query('START TRANSACTION');

    // Verificar si el usuario existe en la base de datos
    const userCheckSql = 'SELECT id FROM users WHERE id = ?';
    const userExists = await query(userCheckSql, [user_id]);

    if (userExists.length === 0) {
      // Si el usuario no existe, lanzar un error
      throw new Error('User not found');
    }

    // Verificar si el producto ya está en la lista de deseos
    const wishlistCheckSql = 'SELECT * FROM wish_list WHERE user_id = ? AND product_id = ?';
    const wishlistExists = await query(wishlistCheckSql, [user_id, product_id]);

    if (wishlistExists.length > 0) {
      throw new Error('Product already in wishlist');
    }

    // Obtener detalles del producto desde el carrito
    const productDetailsSql = 'SELECT price, quantity FROM user_cart WHERE user_id = ? AND product_id = ?';
    const productDetails = await query(productDetailsSql, [user_id, product_id]);

    if (productDetails.length === 0) {
      throw new Error('Product not found in cart');
    }

    const { price, quantity } = productDetails[0];

    // Mover el producto del carrito a la lista de deseos
    const insertWishlistSql = 'INSERT INTO wish_list (user_id, product_id, price, quantity) VALUES (?, ?, ?, ?)';
    await query(insertWishlistSql, [user_id, product_id, price, quantity]);

    const deleteCartSql = 'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?';
    await query(deleteCartSql, [user_id, product_id]);

    // Confirmar la transacción
    await query('COMMIT');

    // Cerrar la conexión
    connection.end();

    // Devolver una respuesta de éxito
    res.status(200).json({ message: 'Producto movido a la lista de deseos exitosamente' });
  } catch (error) {
    console.error('Error al mover el producto a la lista de deseos:', error);

    // Revertir la transacción en caso de error
    try {
      const connection = mysqls.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      connection.connect();
      const query = util.promisify(connection.query).bind(connection);
      await query('ROLLBACK');
      connection.end();
    } catch (rollbackError) {
      console.error('Error al revertir la transacción:', rollbackError);
    }

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCartProducts,
  updateCartProduct,
  removeFromCart,
  moveToWishlist
};
