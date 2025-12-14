const mysql = require("mysql");
const mysqls = require("mysql2/promise");

const connectionDB = async () => {
    try {
        const connection = await mysqls.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('DB connected successfully');
        return connection; // ¡Este return faltaba!
    } catch (error) {
        console.error('Error al conectar a la DB:', error);
        throw new Error('Error al inicializar la DB');
    }
};

const connection = async () =>{
 
    try {
        mysqls.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
          });
          console.log('DB connected successfully');
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la DB');
    }
};

const pool = mysqls.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,       // Puedes ajustar este número según tu necesidad
  queueLimit: 0
});

module.exports = { pool, connection };