import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Make sure to create a .env file in the 'backend' directory with the following variables:
 * DB_HOST=your_mysql_host
 * DB_USER=your_mysql_user
 * DB_PASSWORD=your_mysql_password
 * DB_NAME=your_mysql_database_name
 * JWT_SECRET=your_super_secret_key_for_jwt
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'clinical_history_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the MySQL database.');
        connection.release();
    })
    .catch(error => {
        console.error('Error connecting to the MySQL database:', error);
        console.error('Please ensure the database is running and the .env file is configured correctly.');
    });

export default pool;