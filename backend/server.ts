// FIX: Alias Request and Response to avoid type conflicts
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
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
// FIX: The error on this line was a symptom of the type conflict, resolved by aliasing.
app.use(express.json({ limit: '10mb' })); 

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/histories', historyRoutes);

// Health check endpoint
// FIX: Use aliased types for request and response objects.
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
    res.send('Clinical History Backend is running.');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
    console.log('Waiting for database connection...');
});