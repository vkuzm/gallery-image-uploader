import { Dialect } from "sequelize/dist";

require('dotenv').config();

export default {
  serverPort: process.env.SERVER_PORT as string,
  dbName: process.env.DATABASE_NAME as string,
  dbHost: process.env.DATABASE_HOST as string,
  dbUser: process.env.DATABASE_USER as string,
  dbPassword: process.env.DATABASE_PASSWORD as string,
  dbDriver: 'mysql' as Dialect
};
