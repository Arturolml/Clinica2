import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    // FIX: Changed JSX.Element to React.ReactElement to avoid global JSX namespace issues.
    children: React.ReactElement;
    roles: Array<'ADMIN' | 'MEDICO'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!roles.includes(user.role)) {
        // Redirect to a default page if role doesn't match
        // Or show an "Access Denied" page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;