## 2025-11-01: Chose PostgreSQL over MongoDB
**Context**: Need to store structured expense data
**Decision**: PostgreSQL
**Reasoning**:
- Relational data (users -> expenses)
- ACID transactions important for financial data
- Better for aggregations/summaries
**Alternatives considered**: MongoDB, SQLite

