# Expense Tracker

A full-stack web application for tracking personal expenses.

## Features
- User authentication (JWT-based)
- Expense CRUD operations
- Categorized expenses
- Spending summaries by category
- RESTful API
- PostgreSQL database
- Comprehensive test coverage (>70%)
- CI/CD pipeline with GitHub Actions
- Deployed to production

## Tech Stack
**Frontend:**
- React
- TypeScript

**Backend:**
- Node.js, Express, TypeScript
- PostgreSQL database
- JWT authentication
- Bcrypt for password hashing
- Jest, Supertest

**DevOps:**
- GitHub Actions for CI/CD
- Render for hosting

## Setup Instructions
See `/backend/README.md` and `/frontend/README.md`

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

## Documentation
- [Product Requirements](docs/PRD.md)
- [Technical Design](docs/DESIGN.md)