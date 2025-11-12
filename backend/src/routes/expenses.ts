import express from 'express';
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getSummary,
} from '../controllers/expenseController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getExpenses);
router.post('/', createExpense);
router.get('/summary', getSummary);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;