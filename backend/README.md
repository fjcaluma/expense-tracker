## Live API
Backend API: `https://expense-tracker-api-ar8s.onrender.com/`

## API Documentation
### Authentication
**POST /api/auth/signup**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**POST /api/auth/login**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Expenses (Requires Authentication)
**GET /api/expenses**
- Returns all expenses for authenticated user

**POST /api/expenses**
```json
{
    "amount": 25.50,
    "category": "Food",
    "description": "Lunch at Chipotle",
    "date": "2025-11-10"
}
```

**PUT /api/expenses/:id**
- Update an expense

**DELETE /api/expenses/:id**
- Delete an expense

**GET /api/expenses/summary**
- Get spending totals by category

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create PostgreSQL database
```bash
createdb expense_tracker_dev
psql -d expense_tracker_dev -f migrations/001_initial_schema.sql
```

4. Create `.env` file
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Run tests
```bash
npm test
```

6. Start development server
```bash
npm run dev
```

API will be available at `http://localhost:3001`

## Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm test -- --coverage
```

## Deployment
The application automatically deploys to Render when changes are pushed to the `main` branch.

**Deployment checklist**
- All tests passing
- Code coverage >70%
- Environment variables configured on Render
- Database migrations run

