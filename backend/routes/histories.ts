// FIX: Alias Response to avoid type conflicts
import { Router, Response as ExpressResponse } from 'express';
import pool from '../db';
import { verifyToken, restrictTo, AuthRequest } from '../middleware/auth';
import { RowDataPacket } from 'mysql2';

const router = Router();

// All history routes are protected and for doctors only
// FIX: The middleware signature error was a symptom of a type conflict, which is now resolved.
router.use(verifyToken, restrictTo('doctor'));

// GET /api/histories/patient/:patientId - Get all histories for a patient
router.get('/patient/:patientId', async (req: AuthRequest, res: ExpressResponse) => {
    const { patientId } = req.params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT h.id, h.created_at, h.doctor_id, u.username as doctor_username 
             FROM histories h
             JOIN users u ON h.doctor_id = u.id
             WHERE h.patient_id = ? 
             ORDER BY h.created_at DESC`,
            [patientId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching histories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/histories/:id - Get a single history record
router.get('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM histories WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'History not found' });
        }
        const history = rows[0];
        // The content is stored as a JSON string, so we parse it.
        history.content = JSON.parse(history.content);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /api/histories - Create a new history
router.post('/', async (req: AuthRequest, res: ExpressResponse) => {
    const { patientId, content } = req.body;
    const doctorId = req.user?.id;

    if (!patientId || !content || !doctorId) {
        return res.status(400).json({ error: 'Patient ID, content, and doctor ID are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO histories (patient_id, doctor_id, content) VALUES (?, ?, ?)',
            [patientId, doctorId, JSON.stringify(content)]
        );
        res.status(201).json({ message: 'History created', id: (result as any).insertId });
    } catch (error) {
        console.error('Error creating history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// PUT /api/histories/:id - Update a history
router.put('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE histories SET content = ? WHERE id = ?',
            [JSON.stringify(content), id]
        );
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'History not found' });
        }
        res.json({ message: 'History updated successfully' });
    } catch (error) {
        console.error('Error updating history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/histories/:id - Delete a history
router.delete('/:id', async (req: AuthRequest, res: ExpressResponse) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM histories WHERE id = ?', [id]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: 'History not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;