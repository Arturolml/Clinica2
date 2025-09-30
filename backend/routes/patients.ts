import express, { Router } from 'express';
import pool from '../db';
import { verifyToken, restrictTo, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

// All patient routes are protected and for doctors only
// FIX: The role case for 'restrictTo' was fixed in the auth middleware.
router.use(verifyToken, restrictTo('MEDICO'));

// GET /api/patients - Get a list of unique patients from the PACIENTE table
// FIX: Use explicit express.Response type to resolve type conflicts.
router.get('/', async (req: AuthRequest, res: express.Response) => {
    try {
        // This query groups by patient fields to get unique patients and counts their histories
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                p.ID_Paciente, p.Nombre, p.Apellidos, p.Numero_Record, p.Telefono,
                COUNT(p.ID_Paciente) as Total_Historias
            FROM PACIENTE p
            GROUP BY p.Numero_Record, p.Nombre, p.Apellidos, p.Telefono
            ORDER BY p.Apellidos, p.Nombre
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching unique patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/patients/record/:recordNumber - Get the latest patient data for a given record number
// Used to pre-fill a new history form for an existing patient.
// FIX: Use explicit express.Response type to resolve type conflicts.
router.get('/record/:recordNumber', async (req: AuthRequest, res: express.Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM PACIENTE WHERE Numero_Record = ? ORDER BY Fecha DESC LIMIT 1', 
            [req.params.recordNumber]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient with this record number not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching patient by record number:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;