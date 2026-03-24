
const pool = require("../database/config");

const approveOrder = async (req, res) => {
  const { orderId } = req.params;
  const connection = await pool.getConnection();

  try {
    if (!orderId) {
      return res.status(400).json({ error: "orderId requerido" });
    }

    await connection.beginTransaction();

    // 🔒 1. Bloquear orden
    const [orderRows] = await connection.execute(
      `SELECT id, status, user_id, total 
       FROM orders 
       WHERE id = ? 
       FOR UPDATE`,
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const order = orderRows[0];

    // ✅ 2. Validar estado
    if (order.status !== "pending approval") {
      await connection.rollback();
      return res.status(400).json({
        error: `La orden ya fue procesada. Estado actual: ${order.status}`,
      });
    }

    // 🔥 3. VALIDAR COMPROBANTE
    const [proofRows] = await connection.execute(
      `SELECT status 
       FROM order_payment_proof 
       WHERE order_id = ? 
       LIMIT 1`,
      [orderId]
    );

    if (proofRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "No se ha enviado comprobante de pago",
      });
    }

    if (proofRows[0].status !== "sent") {
      await connection.rollback();
      return res.status(400).json({
        error: `El comprobante no está listo. Estado actual: ${proofRows[0].status}`,
      });
    }

    // 🔒 4. Obtener items
    const [items] = await connection.execute(
      `SELECT product_id, quantity 
       FROM order_items 
       WHERE order_id = ?`,
      [orderId]
    );

    if (!items.length) {
      await connection.rollback();
      return res.status(400).json({
        error: "La orden no tiene productos",
      });
    }

    // 🔒 5. Validar y descontar stock
    for (const item of items) {
      const [inventoryRows] = await connection.execute(
        `SELECT stock 
         FROM inventory 
         WHERE product_id = ? 
         FOR UPDATE`,
        [item.product_id]
      );

      if (inventoryRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          error: `Producto ${item.product_id} no encontrado en inventario`,
        });
      }

      if (inventoryRows[0].stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para producto ${item.product_id}`,
        });
      }

      await connection.execute(
        `UPDATE inventory 
         SET stock = stock - ? 
         WHERE product_id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // ✅ 6. Actualizar estado de la orden
    await connection.execute(
      `UPDATE orders 
       SET status = 'pending shipment' 
       WHERE id = ?`,
      [orderId]
    );

    // 🔥 7. Marcar comprobante como recibido
    await connection.execute(
      `UPDATE order_payment_proof 
       SET status = 'received', updated_at = NOW()
       WHERE order_id = ?`,
      [orderId]
    );

    await connection.commit();

    console.log(`✅ Orden ${orderId} aprobada`);

    return res.json({
      ok: true,
      message: "Orden aprobada correctamente",
      order: {
        id: order.id,
        status: "pending send",
      },
    });

  } catch (error) {
    await connection.rollback();

    console.error("❌ APPROVE ORDER ERROR:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

  } finally {
    connection.release();
  }
};

const authorizeOrderSend = async (req, res) => {
  const { orderId } = req.params;
  const decodedOrderId = decodeURIComponent(orderId);
  const connection = await pool.getConnection();

  try {
    if (!decodedOrderId) {
      return res.status(400).json({ error: "orderId requerido" });
    }

    console.log("📝 Autorizando envío para orden:", decodedOrderId);

    await connection.beginTransaction();

    // 🔒 1. Bloquear orden
    const [orderRows] = await connection.execute(
      `SELECT id, status, user_id, total 
       FROM orders 
       WHERE id = ? 
       FOR UPDATE`,
      [decodedOrderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const order = orderRows[0];
    console.log("📊 Estado actual de la orden:", order.status);

    // 🔥 Verificar estados permitidos
    const allowedStatuses = ["pending shipment", "pending shipment"];
    
    if (!allowedStatuses.includes(order.status)) {
      await connection.rollback();
      return res.status(400).json({
        error: `La orden no puede enviarse en estado "${order.status}". Estados permitidos: ${allowedStatuses.join(", ")}`,
      });
    }

    // ✅ 2. Actualizar estado a "shipped"
    const [updateResult] = await connection.execute(
      `UPDATE orders
       SET status = ?, 
           created_at = NOW()
       WHERE id = ? 
       AND status IN ('pending shipment', 'pending shipment')`,
      ["shipped", decodedOrderId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "La orden ya fue enviada anteriormente",
      });
    }

    // ✅ 3. Opcional: Registrar en tabla de envíos
    await connection.execute(
      `INSERT INTO shipments
       (order_id, shipped_at, status)
       VALUES (?, NOW(), 'shipped')
       ON DUPLICATE KEY UPDATE 
       shipped_at = NOW(),
       status = 'shipped'`,
      [decodedOrderId]
    );

    await connection.commit();

    console.log(`✅ Orden ${decodedOrderId} marcada como enviada`);

    return res.json({
      ok: true,
      message: "Orden enviada correctamente",
      order: {
        id: decodedOrderId,
        previous_status: order.status,
        new_status: "shipped"
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error("❌ AUTHORIZE ORDER SEND ERROR:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });

  } finally {
    connection.release();
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const connection = await pool.getConnection();

  try {
    if (!orderId) return res.status(400).json({ error: "orderId requerido" });

    await connection.beginTransaction();

    // 🔒 Bloquear orden
    const [[order]] = await connection.execute(
      "SELECT id, status FROM orders WHERE id = ? FOR UPDATE",
      [orderId]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if (order.status !== "pending") {
      await connection.rollback();
      return res.status(400).json({
        error: "Solo se pueden cancelar órdenes pendientes",
      });
    }

    // ❌ Cancelar orden
    await connection.execute(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [orderId]
    );

    await connection.commit();
    res.json({ ok: true, message: "Orden cancelada correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error("CANCEL ORDER ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    connection.release();
  }
};

const getOrders = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    /* =========================
       1. ÓRDENES CON JOIN CORREGIDO Y COMPROBANTES
    ==========================*/
    const [orders] = await connection.execute(
      `SELECT 
        o.id,
        o.user_id AS order_user_id,
        o.guest_id,
        o.total,
        o.status,
        o.created_at,

        -- Datos del usuario (para usuarios registrados)
        u.id AS user_id,
        u.name AS user_name,
        u.lastname AS user_lastname,
        u.email AS user_email,
        u.role AS user_role,

        -- Datos del guest (si existe)
        g.id AS guest_id,
        g.name AS guest_name,
        g.lastname AS guest_lastname,
        g.email AS guest_email,
        g.role AS guest_role,

        -- 🔥 DATOS DEL COMPROBANTE (order_payment_proof)
        opp.id AS proof_id,
        opp.img_url AS proof_img,
        opp.status AS proof_status,
        opp.updated_at AS proof_updated_at,
        opp.image_public_id AS proof_public_id

      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN users g ON g.id = o.guest_id
      LEFT JOIN order_payment_proof opp ON opp.order_id = o.id
      ORDER BY o.created_at DESC`
    );

    if (!orders.length) {
      return res.json({ ok: true, orders: [] });
    }

    const orderIds = orders.map(o => o.id);

    /* =========================
       2. ITEMS
    ==========================*/
    const [items] = await connection.query(
      `SELECT 
        oi.order_id,
        oi.product_id,
        oi.price,
        oi.quantity,

        p.name AS product_name,
        p.price AS product_price,

        (
          SELECT pi.img_url 
          FROM products_img pi 
          WHERE pi.product_id = p.id 
          LIMIT 1
        ) AS img

      FROM order_items oi
      INNER JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    /* =========================
       3. MAP - CORREGIDO CON DATOS DE COMPROBANTE
    ==========================*/
    const orderMap = {};

    orders.forEach(order => {
      // Determinar si es guest o usuario registrado
      const isGuest = !!order.guest_id;
      
      // Construir objeto de usuario
      const user = {
        id: isGuest ? order.guest_id : order.user_id,
        name: isGuest ? (order.guest_name || "Invitado") : (order.user_name || ""),
        lastname: isGuest ? (order.guest_lastname || "") : (order.user_lastname || ""),
        email: isGuest ? (order.guest_email || "") : (order.user_email || ""),
        role: isGuest ? "guest" : (order.user_role || "user")
      };

      // 🔥 Construir objeto de comprobante (solo si existe)
      let paymentProof = null;
      if (order.proof_id) {
        paymentProof = {
          id: order.proof_id,
          img_url: order.proof_img,
          status: order.proof_status,
          updated_at: order.proof_updated_at,
          public_id: order.proof_public_id
        };
      }

      orderMap[order.id] = {
        id: order.id,
        user_id: order.order_user_id,
        guest_id: order.guest_id,
        status: order.status,
        created_at: order.created_at,
        total: Number(order.total) || 0,
        user: user,
        payment_proof: paymentProof, // 🔥 Puede ser null si no hay comprobante
        products: []
      };
    });

    // Agrupar items por orden
    items.forEach(item => {
      const order = orderMap[item.order_id];
      if (!order) return;

      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const subtotal = price * qty;

      order.products.push({
        product_id: item.product_id,
        name: item.product_name,
        price: price,
        quantity: qty,
        subtotal: subtotal,
        img: item.img || ""
      });
    });

    // Recalcular total si es necesario
    Object.values(orderMap).forEach(order => {
      if (order.products.length > 0) {
        const calculatedTotal = order.products.reduce((sum, p) => sum + p.subtotal, 0);
        if (order.total === 0) {
          order.total = calculatedTotal;
        }
      }
    });

    res.json({
      ok: true,
      orders: Object.values(orderMap)
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      ok: false,
      message: "Error obteniendo órdenes"
    });
  } finally {
    connection.release();
  }
};

const getUserOrders = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        o.id AS order_id,
        o.total,
        o.status,
        o.created_at,
        opp.img_url AS proof_img, -- ✅ comprobante desde order_payment_proof

        u.id AS user_id,
        u.name,
        u.lastname,
        u.email,

        oi.product_id,
        oi.price,
        oi.quantity,

        p.name AS product_name,
        pi.img_url AS product_img_url

      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN products_img pi ON pi.product_id = p.id
      LEFT JOIN order_payment_proof opp ON opp.order_id = o.id -- ✅ JOIN con comprobantes
      ORDER BY o.created_at DESC
    `);

    const ordersMap = {};

    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          total: row.total,
          status: row.status,
          created_at: row.created_at,
          proof_img: row.proof_img || null, // ✅ comprobante
          user: {
            id: row.user_id,
            name: row.name || "Invitado",
            lastname: row.lastname || "",
            email: row.email || "",
          },
          items: [],
        };
      }

      if (row.product_id) {
        let product = ordersMap[row.order_id].items.find(
          (p) => p.product_id === row.product_id
        );

        if (!product) {
          product = {
            product_id: row.product_id,
            name: row.product_name,
            price: row.price,
            quantity: row.quantity,
            images: [],
          };
          ordersMap[row.order_id].items.push(product);
        }

        if (row.product_img_url && !product.images.includes(row.product_img_url)) {
          product.images.push(row.product_img_url);
        }
      }
    }

    res.json({
      ok: true,
      orders: Object.values(ordersMap),
    });

  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
};

const getUserOrdersById = async (req, res) => {
  let connection;

  try {
    const userId = req.id;

    console.log("🔍 Usuario autenticado:", userId);

    if (!userId) {
      return res.status(401).json({
        ok: false,
        error: "Usuario no autenticado",
      });
    }

    connection = await pool.getConnection();

    const [userCheck] = await connection.execute(
      "SELECT id, name, lastname, email FROM users WHERE id = ?",
      [userId]
    );

    if (userCheck.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Usuario no encontrado",
      });
    }

    const userInfo = userCheck[0];

    // ✅ CORREGIDO: Traer el estado real del comprobante
    const [rows] = await connection.execute(
      `
      SELECT 
        o.id AS order_id,
        o.total,
        o.status,
        o.created_at,

        opp.img_url AS proof_img,
        opp.status AS proof_status,  -- 🔥 Traer el estado real (received, unprooff, etc.)
        opp.updated_at AS proof_updated_at,

        o.user_id,
        o.guest_id,

        oi.product_id,
        oi.price,
        oi.quantity,

        p.name AS product_name,
        pi.img_url AS product_img_url

      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN products_img pi ON pi.product_id = p.id
      LEFT JOIN order_payment_proof opp ON opp.order_id = o.id
      WHERE o.user_id = ? AND o.user_id IS NOT NULL
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    console.log("📊 Órdenes encontradas:", rows.length);
    console.log("📊 Datos de comprobantes:", rows.map(r => ({ 
      order_id: r.order_id, 
      proof_status: r.proof_status,
      proof_img: r.proof_img ? "Sí" : "No"
    })));

    if (!rows || rows.length === 0) {
      return res.json({
        ok: true,
        orders: [],
        totalOrders: 0,
      });
    }

    const ordersMap = {};

    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          total: Number(row.total) || 0,
          status: row.status,
          created_at: row.created_at,
          proof_img: row.proof_img || null,
          proof_status: row.proof_status || null, // 🔥 Estado real del comprobante
          user: {
            id: userInfo.id,
            name: userInfo.name || "Usuario",
            lastname: userInfo.lastname || "",
            email: userInfo.email || "",
          },
          items: [],
        };
      }

      if (row.product_id) {
        let product = ordersMap[row.order_id].items.find(
          (p) => p.product_id === row.product_id
        );

        if (!product) {
          product = {
            product_id: row.product_id,
            name: row.product_name,
            price: Number(row.price) || 0,
            quantity: Number(row.quantity) || 1,
            images: [],
          };
          ordersMap[row.order_id].items.push(product);
        }

        if (row.product_img_url && !product.images.includes(row.product_img_url)) {
          product.images.push(row.product_img_url);
        }
      }
    }

    Object.values(ordersMap).forEach((order) => {
      order.items.forEach((item) => {
        item.images = [...new Set(item.images)];
      });
    });

    const orders = Object.values(ordersMap);

    console.log(`✅ Enviando ${orders.length} órdenes para usuario ${userId}`);

    res.json({
      ok: true,
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error("❌ GET USER ORDERS ERROR:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
    });
  } finally {
    if (connection) connection.release();
  }
};

const sendPaymentProof = async (req, res) => {
  // 🔥 Decodificar el orderId
  const { orderId } = req.params;
  const decodedOrderId = decodeURIComponent(orderId);
  
  const { img_url, image_public_id } = req.body;
  const user_id = req.user?.id || req.id;
  
  console.log("📝 sendPaymentProof - Datos recibidos:", { 
    orderIdRaw: orderId,
    orderIdDecoded: decodedOrderId,
    user_id, 
    img_url 
  });

  const connection = await pool.getConnection();

  try {
    if (!user_id) {
      console.log("❌ Error: Usuario no autenticado");
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!decodedOrderId) {
      console.log("❌ Error: ID de pedido no proporcionado");
      return res.status(400).json({ error: "ID de pedido requerido" });
    }

    if (!img_url) {
      console.log("❌ Error: URL de imagen no proporcionada");
      return res.status(400).json({ error: "URL de imagen requerida" });
    }

    await connection.beginTransaction();

    // 🔒 Validar que la orden exista y pertenezca al usuario
    const [order] = await connection.execute(
      `SELECT id, status, user_id, guest_id FROM orders 
       WHERE id = ? AND (user_id = ? OR guest_id = ?) 
       FOR UPDATE`,
      [decodedOrderId, user_id, user_id]
    );

    console.log("📝 Orden encontrada:", order);

    if (!order.length) {
      await connection.rollback();
      console.log("❌ Error: Pedido no encontrado o no autorizado");
      return res.status(404).json({ error: "Pedido no encontrado o no autorizado" });
    }

    const currentOrder = order[0];

    // ✅ Verificar estados permitidos para enviar comprobante
    const allowedStatuses = ['pending paid', 'pending approval', 'pending', 'received'];
    
    if (!allowedStatuses.includes(currentOrder.status)) {
      await connection.rollback();
      console.log(`❌ Error: Estado no permitido - ${currentOrder.status}`);
      return res.status(400).json({ 
        error: `No se puede enviar comprobante para un pedido en estado: ${currentOrder.status}` 
      });
    }

    // ✅ Verificar si ya existe un comprobante para esta orden
    const [existingProof] = await connection.execute(
      `SELECT id, status FROM order_payment_proof WHERE order_id = ?`,
      [decodedOrderId]
    );

    if (existingProof.length > 0) {
      await connection.rollback();
      console.log(`❌ Error: Ya existe comprobante para orden ${decodedOrderId}`);
      return res.status(400).json({ 
        error: `Ya se envió un comprobante para este pedido. Estado: ${existingProof[0].status}` 
      });
    }

    // ✅ Insertar comprobante en order_payment_proof
    console.log("📝 Insertando comprobante...");
    const [insertResult] = await connection.execute(
      `INSERT INTO order_payment_proof
       (user_id, order_id, img_url, image_public_id, status, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        String(user_id),
        decodedOrderId,
        img_url,
        image_public_id || null,
        "sent"
      ]
    );

    console.log("✅ Comprobante insertado:", insertResult);

    // ✅ Actualizar estado de la orden
    console.log("📝 Actualizando estado de la orden...");
    const [updateResult] = await connection.execute(
      `UPDATE orders 
       SET status = ? 
       WHERE id = ?`,
      ["pending approval", decodedOrderId]
    );

    console.log("✅ Orden actualizada:", updateResult);

    await connection.commit();

    res.json({
      ok: true,
      message: "Comprobante enviado correctamente. Será validado por nuestro equipo en las próximas 24-48 horas."
    });

  } catch (error) {
    await connection.rollback();
    console.error("❌ SEND PAYMENT PROOF ERROR:", error);
    console.error("Stack:", error.stack);
    
    let errorMessage = "Error interno del servidor";
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = "Error de configuración: tabla no encontrada";
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = "Error de estructura: campo no existe en la base de datos";
    } else if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = "Ya existe un comprobante para este pedido";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  approveOrder,
  getOrders,
  getUserOrders,
  sendPaymentProof,
  authorizeOrderSend,
  getUserOrdersById,
  cancelOrder,
};