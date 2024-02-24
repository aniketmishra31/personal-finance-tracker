import dotenv from "dotenv";
dotenv.config();
import mysql, { PoolOptions } from "mysql2/promise";

const poolConfig: PoolOptions = {
    host: 'localhost',
    user: 'root',
    password: process.env.MY_SQL_PASSWORD as string,
    database: 'personalFinance',
    waitForConnections: true,
    connectionLimit: 10
}

const pool = mysql.createPool(poolConfig);
if (pool)
    console.log("Connected to database");
else
    console.log("Could not connect to database");
export default pool;