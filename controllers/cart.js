const pool = require("../database/config");
const { getRandomRef } = require("../controllers/ref");
const { v4: uuidv4 } = require('uuid');
const util = require('util');

// Configuración de la conexión a la base de datos MySQL

// Función para agregar un producto al carrito
const addToCart = async (req, res) => {
  const { user_id, guest_id, product_id, variant_id, quantity } = req.body;

  const connection = await pool.getConnection();

  try {
    const qty = Number(quantity);

    // ✅ Validaciones básicas - variant_id ahora es opcional
    if (!product_id || !qty || qty <= 0) {
      return res.status(400).json({ error: "Datos inválidos: product_id y quantity son requeridos" });
    }

    // ✅ XOR: solo uno
    const hasUserId = user_id !== undefined && user_id !== null && user_id !== '';
    const hasGuestId = guest_id !== undefined && guest_id !== null && guest_id !== '';

    if ((hasUserId && hasGuestId) || (!hasUserId && !hasGuestId)) {
      return res.status(400).json({
        error: "Debe proporcionar SOLO user_id O SOLO guest_id"
      });
    }

    await connection.beginTransaction();

    // ✅ 1. Verificar producto
    const [product] = await connection.execute(
      "SELECT id, price FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );

    if (!product.length) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // ✅ 2. Verificar variante (SOLO si se proporcionó)
    let variantExists = true;
    if (variant_id) {
      const [variant] = await connection.execute(
        "SELECT id, product_id FROM product_variants WHERE id = ? AND product_id = ? FOR UPDATE",
        [variant_id, product_id]
      );
      
      if (!variant.length) {
        await connection.rollback();
        return res.status(400).json({ error: "Variante no válida para este producto" });
      }
      variantExists = true;
    }

    // ✅ 3. Verificar stock
    const [inventory] = await connection.execute(
      "SELECT stock FROM inventory WHERE product_id = ? FOR UPDATE",
      [product_id]
    );

    if (!inventory.length || inventory[0].stock < qty) {
      await connection.rollback();
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // ✅ 4. Obtener o crear carrito
    let cartId;

    const cartQuery = hasUserId
      ? "SELECT id FROM carts WHERE user_id = ? LIMIT 1"
      : "SELECT id FROM carts WHERE guest_id = ? LIMIT 1";

    const cartValues = hasUserId ? [user_id] : [guest_id];

    const [cart] = await connection.execute(cartQuery, cartValues);

    if (cart.length > 0) {
      cartId = cart[0].id;
    } else {
      const [newCart] = await connection.execute(
        `INSERT INTO carts (user_id, guest_id, created_at) VALUES (?, ?, NOW())`,
        [hasUserId ? user_id : null, hasUserId ? null : guest_id]
      );

      cartId = newCart.insertId;
    }

    // ✅ 5. Verificar si ya existe el producto en el carrito
    let existing;
    if (variant_id) {
      [existing] = await connection.execute(
        "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND variant_id = ?",
        [cartId, product_id, variant_id]
      );
    } else {
      [existing] = await connection.execute(
        "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND variant_id IS NULL",
        [cartId, product_id]
      );
    }

    if (existing.length > 0) {
      // 🔄 Actualizar cantidad
      await connection.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [qty, existing[0].id]
      );
    } else {
      // ➕ Insertar nuevo item
      await connection.execute(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [cartId, product_id, variant_id || null, qty]
      );
    }

    // ✅ 6. Reservar stock
    await connection.execute(
      "UPDATE inventory SET stock = stock - ?, reserved = reserved + ? WHERE product_id = ?",
      [qty, qty, product_id]
    );

    await connection.commit();

    // ✅ 7. Obtener carrito actualizado
    const [updatedCart] = await connection.execute(`
      SELECT 
        ci.id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        p.name,
        p.price,
        p.description,
        pi.img_url
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN products_img pi ON ci.product_id = pi.product_id
      WHERE ${hasUserId ? 'c.user_id = ?' : 'c.guest_id = ?'}
    `, [hasUserId ? user_id : guest_id]);

    res.status(201).json({
      success: true,
      message: "Producto agregado al carrito",
      cart: updatedCart
    });

  } catch (error) {
    await connection.rollback();
    console.error("ADD TO CART ERROR:", error);

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Función para obtener todos los productos del carrito
const getCartProducts = async (req, res) => { 
  const { user_id, guest_id } = req.params;
  const connection = await pool.getConnection();

  try {
    // Validar que tenga user_id O guest_id
    const hasUserId = user_id && user_id !== 'undefined' && user_id !== 'null';
    const hasGuestId = guest_id && guest_id !== 'undefined' && guest_id !== 'null';

    if (!hasUserId && !hasGuestId) {
      return res.status(400).json({ error: "Se requiere user_id o guest_id" });
    }

    // Construir query según el tipo de usuario
    let query = '';
    let values = [];

    if (hasUserId) {
  query = `
    SELECT 
      ci.id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.description,
      pi.img_url
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN products_img pi ON ci.product_id = pi.product_id
    WHERE c.user_id = ?
  `;
  values = [user_id];
} else {
  query = `
    SELECT 
      ci.id,
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.description,
      pi.img_url
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN products_img pi ON ci.product_id = pi.product_id
    WHERE c.guest_id = ?
  `;
  values = [guest_id];
}

    const [cartItems] = await connection.execute(query, values);

    // Consolidar imágenes por producto (si hay múltiples imágenes)
    const cartProducts = cartItems.reduce((acc, item) => {
      const existingItem = acc.find(i => i.product_id === item.product_id);
      
      if (existingItem) {
        // Si ya existe, agregar imagen si no está
        if (item.img_url && !existingItem.img_urls.includes(item.img_url)) {
          existingItem.img_urls.push(item.img_url);
        }
      } else {
        // Si no existe, crear nuevo item
        acc.push({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: parseFloat(item.price),
          description: item.description,
          img_urls: item.img_url ? [item.img_url] : [],
          subtotal: parseFloat(item.price) * item.quantity
        });
      }
      
      return acc;
    }, []);

    // Calcular total
    const total = cartProducts.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      success: true,
      items: cartProducts,
      total: total,
      itemCount: cartProducts.length
    });

  } catch (error) {
    console.error("GET CART PRODUCTS ERROR:", error);
    res.status(500).json({ 
      success: false,
      error: "Error interno del servidor" 
    });
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
  const { product_id, variant_id } = req.body;
  const user_id = req.id; // ✅ Esto viene del middleware validateJwt

  console.log("📝 removeFromCart - Datos:", { user_id, product_id, variant_id });

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (!user_id || !product_id) {
      await connection.rollback();
      return res.status(400).json({ error: "Datos incompletos: user_id y product_id son requeridos" });
    }

    // 🔍 Obtener carrito del usuario
    const [cart] = await connection.execute(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [user_id]
    );

    if (cart.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const cartId = cart[0].id;

    // 🔍 Buscar el item en el carrito
    let query = `
      SELECT id, quantity, product_id 
      FROM cart_items 
      WHERE cart_id = ? AND product_id = ?
    `;
    const params = [cartId, product_id];

    if (variant_id) {
      query += " AND variant_id = ?";
      params.push(variant_id);
    }

    const [cartItem] = await connection.execute(query, params);

    console.log("📝 Item encontrado:", cartItem);

    if (cartItem.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    const item = cartItem[0];
    const cartQty = item.quantity;

    // ❌ Eliminar del carrito
    await connection.execute(
      "DELETE FROM cart_items WHERE id = ?",
      [item.id]
    );

    // ➕ Devolver stock al inventario
    await connection.execute(
      "UPDATE inventory SET stock = stock + ?, reserved = reserved - ? WHERE product_id = ?",
      [cartQty, cartQty, product_id]
    );

    await connection.commit();

    console.log("✅ Producto eliminado correctamente");

    res.json({
      ok: true,
      message: "Producto eliminado correctamente"
    });

  } catch (error) {
    await connection.rollback();
    console.error("❌ REMOVE FROM CART ERROR:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};


const payCart = async (req, res) => {
  const connection = await pool.getConnection();
  const safe = (v) => (v === undefined ? null : v);

  try {
    await connection.beginTransaction();

    const {
      user_id,
      products = [],
      guest_info = {},
      paymentMethod,
      payment_data = {}
    } = req.body;

    console.log("Products recibidos:", products);

    if (!products.length) {
      throw new Error("Carrito vacío");
    }

    /* =========================
       1. USUARIO
    ==========================*/
    let finalUserId = user_id || null;
    const isGuest = !finalUserId;

    if (isGuest) {
      if (!guest_info.name || !guest_info.lastname || !guest_info.email) {
        throw new Error("Datos de invitado incompletos");
      }

      const guestId = guest_info.id || uuidv4();

      await connection.execute(
        `INSERT INTO users
        (id, name, lastname, email, phone, role, is_verified)
        VALUES (?, ?, ?, ?, ?, 'guest', 'unverified')`,
        [
          guestId,
          safe(guest_info.name),
          safe(guest_info.lastname),
          safe(guest_info.email),
          safe(guest_info.phone)
        ]
      );

      finalUserId = guestId;
      console.log("✅ Guest creado:", finalUserId);
    } else {
      const [user] = await connection.execute(
        "SELECT id FROM users WHERE id = ?",
        [finalUserId]
      );

      if (!user.length) {
        throw new Error("Usuario no encontrado");
      }
    }

    if (!finalUserId) {
      throw new Error("ID de usuario inválido");
    }

    /* =========================
       2. OBTENER CART_ID
    ==========================*/
    let cartId = null;
    
    if (isGuest) {
      const [cart] = await connection.execute(
        `SELECT id FROM carts WHERE guest_id = ?`,
        [finalUserId]
      );
      if (cart.length) cartId = cart[0].id;
    } else {
      const [cart] = await connection.execute(
        `SELECT id FROM carts WHERE user_id = ?`,
        [finalUserId]
      );
      if (cart.length) cartId = cart[0].id;
    }

    /* =========================
       3. DIRECCIÓN
    ==========================*/
    let { address, city, state, zipCode } = guest_info;

    if (!isGuest) {
      const [userAddress] = await connection.execute(
        `SELECT address, city, state, zip_code
         FROM addresses
         WHERE user_id = ? AND is_default = 1`,
        [finalUserId]
      );

      if (userAddress.length) {
        address = userAddress[0].address;
        city = userAddress[0].city;
        state = userAddress[0].state;
        zipCode = userAddress[0].zip_code;
      }
    }

    if (!address || !city || !state || !zipCode) {
      throw new Error("Datos de dirección incompletos");
    }

    const [addressResult] = await connection.execute(
      `INSERT INTO addresses
      (user_id, address, city, state, zip_code, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        finalUserId,
        address,
        city,
        state,
        zipCode,
        "Colombia",
        isGuest ? 1 : 0
      ]
    );

    const addressId = addressResult.insertId;

    /* =========================
       4. SHIPPING
    ==========================*/
    await connection.execute(
      `INSERT INTO shipping_addresses
      (user_id, address, city, state, zip_code, country)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [finalUserId, address, city, state, zipCode, "Colombia"]
    );

    /* =========================
       5. PAGO
    ==========================*/
    let paymentType = "unknown";

    if (paymentMethod === "card") paymentType = "credit card";
    if (paymentMethod === "bank") paymentType = "bank account";
    if (paymentMethod === "wallet") paymentType = "wallet";

    const [paymentResult] = await connection.execute(
      `INSERT INTO payment_methods (user_id, type, holder_name)
       VALUES (?, ?, ?)`,
      [
        finalUserId,
        paymentType,
        isGuest
          ? `${guest_info.name} ${guest_info.lastname}`
          : "Cliente registrado"
      ]
    );

    const paymentMethodId = paymentResult.insertId;

    /* =========================
       6. DETALLE PAGO
    ==========================*/
    if (paymentMethod === "card") {
      await connection.execute(
        `INSERT INTO credit_cards
        (payment_method_id, brand, last4, exp_month, exp_year)
        VALUES (?, ?, ?, ?, ?)`,
        [
          paymentMethodId,
          safe(payment_data.creditCard),
          (payment_data.cardNumber || "").slice(-4) || "0000",
          1,
          2030
        ]
      );
    }

    if (paymentMethod === "bank") {
      await connection.execute(
        `INSERT INTO bank_accounts
        (payment_method_id, bank_name, account_last4)
        VALUES (?, ?, ?)`,
        [
          paymentMethodId,
          safe(payment_data.bank),
          (payment_data.accountNumber || "").slice(-4) || "0000"
        ]
      );
    }

    if (paymentMethod === "wallet") {
      await connection.execute(
        `INSERT INTO wallets
        (payment_method_id, provider, account_number)
        VALUES (?, ?, ?)`,
        [
          paymentMethodId,
          safe(payment_data.wallet),
          safe(payment_data.moneybrokerAccount)
        ]
      );
    }

    /* =========================
       7. INVENTARIO
    ==========================*/
    const productIds = products.map(p => p.product_id || p.id);
    
    console.log("Product IDs:", productIds);

    if (productIds.some(id => !id)) {
      throw new Error("IDs de productos inválidos");
    }

    const [dbProducts] = await connection.query(
      `SELECT i.product_id, i.stock, p.price
       FROM inventory i
       INNER JOIN products p ON i.product_id = p.id
       WHERE i.product_id IN (?)
       FOR UPDATE`,
      [productIds]
    );

    if (!dbProducts.length) {
      throw new Error("Productos no encontrados en inventario");
    }

    const productMap = {};
    dbProducts.forEach(p => {
      productMap[p.product_id] = p;
    });

    let totalAmount = 0;
    const orderItems = [];

    for (const product of products) {
      const productId = product.product_id || product.id;
      const quantity = product.quantity || 1;

      const dbProduct = productMap[productId];

      if (!dbProduct) {
        throw new Error(`Producto inválido: ${productId}`);
      }

      if (dbProduct.stock < quantity) {
        throw new Error(
          `Stock insuficiente para producto ${productId}. Disponible: ${dbProduct.stock}`
        );
      }

      totalAmount += dbProduct.price * quantity;

      orderItems.push({
        productId,
        quantity,
        price: dbProduct.price
      });
    }

    /* =========================
       8. ORDEN
    ==========================*/
    const orderId = getRandomRef();

    await connection.execute(
      `INSERT INTO orders
      (id, user_id, guest_id, address_id, total, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderId,
        !isGuest ? finalUserId : null,
        isGuest ? finalUserId : null,
        addressId,
        totalAmount,
        "pending approval"
      ]
    );

    /* =========================
       9. ITEMS DE ORDEN
    ==========================*/
    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items
        (order_id, product_id, price, quantity, created_at)
        VALUES (?, ?, ?, ?, NOW())`,
        [orderId, item.productId, item.price, item.quantity]
      );
    }

    /* =========================
       10. STOCK
    ==========================*/
    for (const item of orderItems) {
      const [result] = await connection.execute(
        `UPDATE inventory
         SET stock = stock - ?
         WHERE product_id = ? AND stock >= ?`,
        [item.quantity, item.productId, item.quantity]
      );

      if (result.affectedRows === 0) {
        throw new Error(
          `Error actualizando stock del producto ${item.productId}`
        );
      }
    }

    /* =========================
       11. LIMPIAR CARRITO - CORREGIDO
    ==========================*/
if (cartId) {
  try {
    // ✅ 1. Eliminar todos los items del carrito
    const [deleteItems] = await connection.execute(
      `DELETE FROM cart_items WHERE cart_id = ?`,
      [cartId]
    );
    console.log(`🗑️ Eliminados ${deleteItems.affectedRows} items del carrito ID: ${cartId}`);

    // ✅ 2. Eliminar el carrito
    let deleteCartResult;
    if (isGuest) {
      [deleteCartResult] = await connection.execute(
        `DELETE FROM carts WHERE guest_id = ?`,
        [finalUserId]
      );
      console.log(`🗑️ Eliminado carrito de guest: ${finalUserId}`);
    } else {
      [deleteCartResult] = await connection.execute(
        `DELETE FROM carts WHERE user_id = ?`,
        [finalUserId]
      );
      console.log(`🗑️ Eliminado carrito de usuario: ${finalUserId}`);
    }

    if (deleteCartResult.affectedRows === 0) {
      console.warn(`⚠️ No se encontró carrito para eliminar`);
    }

  } catch (deleteError) {
    console.error("❌ Error eliminando carrito:", deleteError);
    throw deleteError;
  }
}

    await connection.commit();

    res.json({
      success: true,
      order_id: orderId,
      total: totalAmount,
      message: "Orden creada correctamente"
    });

  } catch (error) {
    await connection.rollback();
    console.error("PAY CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    connection.release();
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
    const connection = await pool.getConnection();

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
  moveToWishlist,
  payCart
};
