import pool from '../src/config/database';

export default async () => {
    await pool.end();
};