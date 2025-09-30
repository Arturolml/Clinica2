import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db';
import { verifyToken, restrictTo, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/users/register-doctor - Admin only
// FIX: Use explicit express.Response type to resolve type conflicts. The role case for 'restrictTo' was fixed in the auth middleware.
router.post('/register-doctor', verifyToken, restrictTo('ADMIN'), async (req: AuthRequest, res: express.Response) => {
    const { nombre, apellidos, email, password } = req.body;

    if (!nombre || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: nombre, apellidos, email, password.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const role = 'MEDICO';

        const [result] = await pool.query(
            'INSERT INTO USUARIO (Nombre, Apellidos, Email, Password_Hash, Rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellidos, email, password_hash, role]
        );
        
        res.status(201).json({ message: 'Doctor registered successfully.', userId: (result as any).insertId });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya existe.' });
        }
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;