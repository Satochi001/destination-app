import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Connection error:', err);
  }
};

connectDB();

export default pool;
