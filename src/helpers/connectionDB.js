import { Sequelize } from "sequelize";

 export const connectionDB = new Sequelize( 
  import.meta.env.VITE_APP_DB_NAME,
  import.meta.env.VITE_APP_DB_USER,
  import.meta.env.VITE_APP_DB_PASS,
   {
    host: import.meta.env.VITE_APP_DB_HOST,
    dialect: 'mysql'
  });

  // const connectionDB = () => {
  //   return createConnection({
  //     host: import.meta.env.VITE_APP_DB_HOST,
  //     user: import.meta.env.VITE_APP_DB_USER,
  //     password: import.meta.env.VITE_APP_DB_PASS,
  //     database: import.meta.env.VITE_APP_DB_NAME,
  //   });
  // };

