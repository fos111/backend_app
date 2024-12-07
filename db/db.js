const sql = require('mssql');
require('dotenv').config();

// Azure SQL Database configuration
const config = {
  user: process.env.DB_USER, // Azure SQL username
  password: process.env.DB_PASSWORD, // Azure SQL password
  server: process.env.DB_HOST, // Azure SQL server
  database: process.env.DB_NAME, // Azure SQL database name
  options: {
    port: 1433, // Default port for Azure SQL
    encrypt: true, // Encrypt connection
  },
};

// Establish a database connection
const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('Database connected.');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

// Export the connection pool for reuse
module.exports = {
  connectToDatabase,
  sql, // Export the `sql` module for running queries
};
