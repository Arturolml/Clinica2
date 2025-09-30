// FIX: Alias Request and Response to avoid potential global type conflicts.
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// FIX: Extend the aliased ExpressRequest.
export interface AuthRequest extends ExpressRequest {
    user?: {
        id: number;
        role: 'admin' | 'doctor';
    };
}

// FIX: Use the aliased types in function signatures.
export const verifyToken = (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: 'admin' | 'doctor' };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// FIX: Use the aliased types in function signatures.
export const restrictTo = (...roles: Array<'admin' | 'doctor'>) => {
    return (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action.' });
        }
        next();
    };
};