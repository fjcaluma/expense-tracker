# Technical Design Document

## Architecture

                    HTTPS
|   React       |   <------>    |   Express   |
|   Frontend    |   REST API    |   Backend   |

|   PostgreSQL  |

## Database Schema

**users** table:
- id (UUID, primary key)
- email (VARCHAR, unique)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)

**expenses** table:
- id (UUID, primary key)
- user_id (UUID, foreign key -> users.id)
- amount (DECIMAL)
- category (VARCHAR)
- description (TEXT)
- date (DATE)
- created_at (TIMESTAMP)

## API Endpoints

**Auth**:
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout

**Expenses**:
- GET /api/expenses (list all, with filters)
- POST /api/expenses (create)
- PUT /api/expenses/:id (update)
- DELETE /api/expenses/:id (delete)
- GET /api/expenses/summary (totals by category)

## Security
- Passwords hashed with bcrypt
- JWT tokens for authentication
- Environment variables for secrets
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)