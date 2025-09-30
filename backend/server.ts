// FIX: Removed aliased Request and Response to avoid type conflicts.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import patientRoutes from './routes/patients';
import historyRoutes from './routes/histories';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
// FIX: The error on this line was a symptom of the type conflict, resolved by using explicit types throughout the backend.
app.use(express.json({ limit: '10mb' })); 

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/histories', historyRoutes);

// Health check endpoint
// FIX: Use explicit express.Request and express.Response types to avoid global type conflicts.
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Clinical History Backend is running.');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
    console.log('Waiting for database connection...');
});