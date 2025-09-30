// FIX: Use explicit express types to avoid global type conflicts.
import express, { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// FIX: Extend express.Request and use uppercase roles to match DB/frontend.
export interface AuthRequest extends express.Request {
    user?: {
        id: number;
        role: 'ADMIN' | 'MEDICO';
    };
}

// FIX: Use explicit express.Response type.
export const verifyToken = (req: AuthRequest, res: express.Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // FIX: Use uppercase roles to match DB/frontend.
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: 'ADMIN' | 'MEDICO' };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// FIX: Use uppercase roles to match DB/frontend and use explicit express.Response type.
export const restrictTo = (...roles: Array<'ADMIN' | 'MEDICO'>) => {
    return (req: AuthRequest, res: express.Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action.' });
        }
        next();
    };
};