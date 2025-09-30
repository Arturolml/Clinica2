// FIX: Alias Response to avoid type conflicts
import { Router, Response as ExpressResponse } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { verifyToken, restrictTo, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/users/register-doctor - Admin only
// FIX: The middleware signature mismatch was caused by a type conflict, which is now resolved.
router.post('/register-doctor', verifyToken, restrictTo('admin'), async (req: AuthRequest, res: ExpressResponse) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const role = 'doctor';

        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, password_hash, role]
        );
        
        res.status(201).json({ message: 'Doctor registered successfully.', userId: (result as any).insertId });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username already exists.' });
        }
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;