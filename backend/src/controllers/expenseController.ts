import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getExpenses = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get expenses error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { amount, category, description, date } = req.body;

        // Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!category || category.trim() === '') {
            return res.status(400).json({ error: 'Category is required' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const result = await pool.query(
            "INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, amount, category, description || null, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create expense error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { amount, category, description, date } = req.body;

        // Validation
        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Check if expense exists and belongs to user
        const existingExpense = await pool.query(
            "SELECT * FROM expenses WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        if(existingExpense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const result = await pool.query(
            "UPDATE expenses SET amount = $1, category = $2, description = $3, date = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
            [amount, category, description, date, id, userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update expense error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Delete expense error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const result = await pool.query(
            `SELECT category, SUM(amount) as total
            FROM expenses
            WHERE user_id = $1
            GROUP BY category
            ORDER BY total DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get summary error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};