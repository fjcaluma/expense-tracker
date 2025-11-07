import dotenv from 'dotenv';

// Load environment variables before tests run
dotenv.config();

// Increase timeouts for database operations
jest.setTimeout(10000);