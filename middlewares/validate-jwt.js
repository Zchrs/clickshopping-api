const express = require("express");
const jwt = require("jsonwebtoken");


const validateJwt = ( req, res, next )=>{
    const token = req.header('x-token');
   
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token de usuario'
        });
    }

    try {
        const { id, email, name, lastname, role = 'user' } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        )
        req.id = id;
        req.email = email;
        req.name = name;
        req.lastname = lastname;
        req.role = role;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token de usuario no válido'
        });
    }

    next();
}


const validateJwtAdmin = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición (x-token)",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED_ADM);

    console.log(">>> [JWT ADMIN] Token decodificado correctamente:", {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      full: decoded,
    });

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      lastname: decoded.lastname,
      role: decoded.role || "admin", // fallback si no viene role
    };

    console.log(">>> [JWT ADMIN] req.user asignado:", req.user);

    next();
  } catch (error) {
    console.error(">>> [JWT ADMIN] Error al verificar token:", error.message);

    return res.status(401).json({
      ok: false,
      msg: "Token de administrador no válido o expirado",
      error: error.message, // solo en desarrollo
    });
  }
};


const validateJwtAdvisor = ( req, res, next )=>{
  const token = req.header('x-token');
 
  if ( !token ) {
      return res.status(401).json({
          ok: false,
          msg: 'No hay token de asesor'
      });
  }

  try {
      const { id, email, name, lastname, role = 'advisor' } = jwt.verify(
          token,
          process.env.SECRET_JWT_SEED_ADV,
      )
      req.id = id;
      req.name = name;
      req.lastname = lastname;
      req.email = email;
      req.role = role;
  } catch (error) {
      return res.status(401).json({
          ok: false,
          msg: 'Token de asesor no válido'
      });
  }

  next();
}


const validateJwtSeller = ( req, res, next )=>{
  const token = req.header('x-token');
 
  if ( !token ) {
      return res.status(401).json({
          ok: false,
          msg: 'No hay token de vendedor'
      });
  }

  try {
      const { id, email, name, lastname, role = 'seller' } = jwt.verify(
          token,
          process.env.SECRET_JWT_SEED_SELLER,
      )
      req.id = id;
      req.email = email;
      req.name = name;
      req.lastname = lastname;
      req.role = role;
  } catch (error) {
      return res.status(401).json({
          ok: false,
          msg: 'Token de seller no válido'
      });
  }

  next();
}


module.exports = {
    validateJwt,
    validateJwtAdmin,
    validateJwtAdvisor,
    validateJwtSeller
};
