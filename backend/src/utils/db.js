import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
// Database connection pool
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'bridgeuser',
    password: process.env.DB_PASS || 'bridgepass',
    database: process.env.DB_NAME || 'bridgelearn',
    port: parseInt(process.env.DB_PORT || '5432'),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Test connection
pool.on('connect', () => {
    console.log('✅ Database connected');
});
pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});
// Initialize database schema
export async function initializeDatabase() {
    try {
        // Create users table if it doesn't exist
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        moodle_user_id INTEGER,
        moodle_username VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create index on email and username for faster lookups
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_moodle_id ON users(moodle_user_id);
    `);
        console.log('✅ Database schema initialized');
    }
    catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}
