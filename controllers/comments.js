const { pool } = require("../database/config");

const createComment = async (req, res) => {
  const { user_id, product_id, comment } = req.body;

  if (!user_id || !product_id || !comment) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO comments (user_id, product_id, coment)
       VALUES (?, ?, ?)`,
      [user_id, product_id, comment]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      product_id,
      comment,
      message: "Comentario publicado correctamente",
    });
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(500).json({
      message: "Error al publicar el comentario",
    });
  }
};

module.exports = { createComment };