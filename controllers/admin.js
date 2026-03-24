const jwt = require('jsonwebtoken');
const pool = require("../database/config");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');


const createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const { id = uuidv4(), fullname, email, pass = hashedPassword, codeAccess } = req.body;

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 1. Verificar si el email ya está registrado
    const [emailResults] = await connection.execute(
      "SELECT COUNT(*) AS count FROM admins WHERE email = ?",
      [email]
    );

    if (emailResults[0].count > 0) {
      await connection.end();
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // 2. Verificar si el código de acceso es válido
    const [codeResults] = await connection.execute(
      "SELECT COUNT(*) AS count FROM registration_codes_admins WHERE code = ?",
      [codeAccess]
    );

    if (codeResults[0].count === 0) {
      await connection.end();
      return res.status(400).json({ error: 'Código de acceso inválido' });
    }

    // 3. Insertar nuevo admin
    const [insertResult] = await connection.execute(
      "INSERT INTO admins (id, fullname, email, pass, codeAccess) VALUES (?, ?, ?, ?, ?)",
      [id, fullname, email, pass, codeAccess]
    );

    // 4. Generar JWT
    const role = 'admin';
    const generateJwtAdm = (id, fullname, email, role) => {
      const payload = { id, fullname, email, role };
      const secretKey = process.env.SECRET_JWT_SEED_ADM;
      const options = { expiresIn: '2h' };
      return jwt.sign(payload, secretKey, options);
    };

    const token = generateJwtAdm(id, fullname, email, role);

    await connection.end();

    // 5. Respuesta exitosa
    res.status(201).json({
      id,
      fullname,
      email,
      token,
      role,
    });

    console.log(`Admin registrado correctamente:
      ID: ${id}
      Email: ${email}
      Nombre: ${fullname}
      Token: ${token}
      Rol: ${role}`);
  } catch (error) {
    console.error('Error en createAdmin:', error);
    res.status(500).json({ error: 'Error al crear el admin' });
  }
};

const loginUserAdmin = async (req, res) => {

  const { email, password } = req.body;

  try {

    const [results] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
      [email]
    );

    if (results.length === 0) {
      return res.status(400).json({
        ok:false,
        error:"Usuario o contraseña incorrecta"
      });
    }

    const admin = results[0];

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(400).json({
        ok:false,
        error:"Usuario o contraseña incorrecta"
      });
    }

    const payload = {
      id: admin.id,
      name: admin.name,
      lastname: admin.lastname,
      email: admin.email,
      role: admin.role
    };

    const token = jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED_ADM,
      { expiresIn: "2h" }
    );

    res.json({
      ok:true,
      admin:{
        id: admin.id,
        name: admin.name,
        lastname: admin.lastname,
        email: admin.email,
        role: admin.role,
        token
      }
    });

    console.log(`Inicio de sesión exitoso: ${admin.name} ${admin.lastname}`);

  } catch (error) {

    console.error("Error en loginUserAdmin:", error);

    res.status(500).json({
      ok:false,
      msg:"Error en el servidor"
    });

  }

};

const renewTokenAdmin = async (req, res) => {

  const { id, name, lastname, email, role } = req.user;

  const payload = {
    id,
    name,
    lastname,
    email,
    role
  };

  const token = jwt.sign(
    payload,
    process.env.SECRET_JWT_SEED_ADM,
    { expiresIn: "2h" }
  );

  res.json({
    ok:true,
    id,
    name,
    lastname,
    email,
    role,
    token
  });

};
  
  
module.exports = {
    createAdmin,
    loginUserAdmin,
    renewTokenAdmin,
  };