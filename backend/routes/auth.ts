// FIX: Use explicit express types to avoid global type conflicts.
import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { RowDataPacket } from 'mysql2';

const router = Router();

// POST /api/auth/login
// FIX: Use explicit express.Request and express.Response types.
router.post('/login', async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM USUARIO WHERE Email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password_Hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = jwt.sign(
            { id: user.ID_Usuario, role: user.Rol },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                apellidos: user.Apellidos,
                email: user.Email,
                role: user.Rol,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;