
const { pool } = require("../database/config");

const approveOrder = async (req, res) => {
  const { orderId } = req.params;
  const connection = await pool.getConnection();

  try {
    if (!orderId)
      return res.status(400).json({ error: "orderId requerido" });

    await connection.beginTransaction();

    // 🔒 1. Bloquear orden
    const [[order]] = await connection.execute(
      `SELECT id, status, user_id, total 
       FROM orders 
       WHERE id = ? 
       FOR UPDATE`,
      [orderId]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if (order.status !== "pending aproval") {
      await connection.rollback();
      return res.status(400).json({
        error: "La orden ya fue procesada",
      });
    }

    // 🔒 2. Verificar que no exista ya en pending_send_orders
    const [[existingSend]] = await connection.execute(
      `SELECT id FROM pending_send_orders 
       WHERE order_id = ? 
       LIMIT 1`,
      [orderId]
    );

    if (existingSend) {
      await connection.rollback();
      return res.status(400).json({
        error: "La orden ya fue enviada a despacho",
      });
    }

    // 🔒 3. Obtener items
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

    // 🔒 4. Validar y descontar stock
    for (const item of items) {
      const [[product]] = await connection.execute(
        `SELECT quantity 
         FROM products 
         WHERE id = ? 
         FOR UPDATE`,
        [item.product_id]
      );

      if (!product) {
        await connection.rollback();
        return res.status(400).json({
          error: `Producto ${item.product_id} no existe`,
        });
      }

      if (product.quantity < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para producto ${item.product_id}`,
        });
      }

      await connection.execute(
        `UPDATE products 
         SET quantity = quantity - ? 
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // ✅ 5. Actualizar estado orden
    await connection.execute(
  `UPDATE orders 
   SET status = ?, 
       status_send = ?, 
       updated_at = NOW() 
   WHERE id = ?`,
  ['pending send', 'pending send', orderId]
);

    // ✅ 6. Insertar en pendientes de envío
 await connection.execute(
  `INSERT INTO pending_send_orders 
   (order_id, user_id, total, status, created_at, updated_at)
   VALUES (?, ?, ?, ?, NOW(), NOW())`,
  [order.id, order.user_id, order.total, 'pending send']
);

    await connection.commit();

    return res.json({
      ok: true,
      message: "Orden aprobada correctamente",
    });

  } catch (error) {
    await connection.rollback();

    // 🔥 Si es error de duplicado por UNIQUE constraint
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "La orden ya fue procesada anteriormente",
      });
    }

    console.error("APPROVE ORDER ERROR:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });

  } finally {
    connection.release();
  }
};

const authorizeOrderSend = async (req, res) => {
  const { orderId } = req.params;
  const connection = await pool.getConnection();

  try {
    if (!orderId) {
      return res.status(400).json({ error: "orderId requerido" });
    }

    await connection.beginTransaction();

    // 🔒 1. Bloquear orden
    const [[order]] = await connection.execute(
      `SELECT id, status 
       FROM orders 
       WHERE id = ? 
       FOR UPDATE`,
      [orderId]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // 🔥 Solo permitir si está lista para envío
    if (order.status !== "pending send") {
      await connection.rollback();
      return res.status(400).json({
        error: `La orden no puede enviarse en estado ${order.status}`,
      });
    }

    // ✅ 2. Actualizar estado a "order sent"
    const [updateResult] = await connection.execute(
      `UPDATE orders
       SET status = ?, 
           status_send = ?, 
           updated_at = NOW()
       WHERE id = ? 
       AND status = 'pending send'`,
      ["order sent", "order sent", orderId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(400).json({
        error: "La orden ya fue enviada anteriormente",
      });
    }

    await connection.commit();

    return res.json({
      ok: true,
      message: "Orden enviada correctamente",
    });

  } catch (error) {
    await connection.rollback();
    console.error("AUTHORIZE ORDER SEND ERROR:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
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
  try {
    const [orders] = await pool.execute(
      `SELECT 
        o.id,
        o.total,
        o.status,
        o.status_send,
        o.img_url,
        o.created_at,

        u.id AS user_id,
        u.name,
        u.lastname,
        u.email

       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    );

    res.json({ ok: true, orders });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        o.id AS order_id,
        o.total,
        o.status,
        o.created_at,
        o.img_url AS proof_img, -- ✅ comprobante

        u.id AS user_id,
        u.name,
        u.lastname,
        u.email,

        oi.product_id,
        oi.price,
        oi.quantity,

        p.name AS product_name,
        pi.img_url AS product_img_url -- ✅ imagen del producto

      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      LEFT JOIN products_img pi ON pi.product_id = p.id
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
          img_url: row.proof_img || null, // ✅ comprobante aquí
          user: {
            id: row.user_id,
            name: row.name,
            lastname: row.lastname,
            email: row.email,
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

        // ✅ agregar imágenes del producto correctamente
        if (row.product_img_url) {
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
  }
};

const sendPaymentProof = async (req, res) => {
  const { orderId } = req.params;
  const user_id = req.id;
  const { img_url, image_public_id } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 🔒 Validar que la orden pertenezca al usuario
    const [order] = await connection.execute(
      `SELECT id FROM orders WHERE id = ? AND user_id = ? FOR UPDATE`,
      [orderId, user_id]
    );

    if (!order.length) {
      await connection.rollback();
      return res.status(403).json({ error: "Pedido no autorizado" });
    }

    // ✅ Insertar comprobante
    await connection.execute(
      `INSERT INTO payment_proof_order 
       (user_id, order_id, img_url, image_public_id, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user_id,
        orderId,
        img_url,
        image_public_id || "",
        "pending approval"
      ]
    );

    // ✅ Actualizar img_url en orders
    await connection.execute(
      `UPDATE orders 
       SET img_url = ?, 
           status = ?, 
           updated_at = NOW()
       WHERE id = ?`,
      [img_url, "pending aproval", orderId]
    );

    await connection.commit();
// 🔥 Notificar en tiempo real
res.notifyOrderUpdate({
  orderId,
  img_url,
  status: "proof_sent",
});

res.json({
  ok: true,
  message: "Comprobante enviado correctamente",
});

  } catch (error) {
    await connection.rollback();
    console.error("SEND PAYMENT PROOF ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
  cancelOrder,
};