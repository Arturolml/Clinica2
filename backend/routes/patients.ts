// FIX: Alias Response to avoid type conflicts
import { Router, Response as ExpressResponse } from 'express';
import pool from '../db';
import { verifyToken, restrictTo, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

// All patient routes are protected and for doctors only
// FIX: The middleware signature error was a symptom of a type conflict, which is now resolved.
router.use(verifyToken, restrictTo('doctor'));

// GET /api/patients - Get all patients
router.get('/', async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients ORDER BY apellidos, nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/patients/:id - Get a single patient
router.get('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM patients WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /api/patients - Create a new patient
router.post('/', async (req: AuthRequest, res: ExpressResponse) => {
    const { nombre, apellidos, fechaNacimiento, sexo, estadoCivil, direccion, telefono, numeroRecord, registroGeriatria } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO patients (nombre, apellidos, fechaNacimiento, sexo, estadoCivil, direccion, telefono, numeroRecord, registroGeriatria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellidos, fechaNacimiento, sexo, estadoCivil, direccion, telefono, numeroRecord, registroGeriatria]
        );
        res.status(201).json({ message: 'Patient created', id: (result as any).insertId });
    } catch (error: any) {
         if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El número de record ya existe.' });
        }
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/patients/:id - Update a patient
router.put('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    const { nombre, apellidos, fechaNacimiento, sexo, estadoCivil, direccion, telefono, numeroRecord, registroGeriatria } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE patients SET nombre = ?, apellidos = ?, fechaNacimiento = ?, sexo = ?, estadoCivil = ?, direccion = ?, telefono = ?, numeroRecord = ?, registroGeriatria = ? WHERE id = ?',
            [nombre, apellidos, fechaNacimiento, sexo, estadoCivil, direccion, telefono, numeroRecord, registroGeriatria, req.params.id]
        );
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json({ message: 'Patient updated' });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const [result] = await pool.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;