import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Historia Clínica</h1>
                <div className="flex items-center">
                    {user && (
                        <div className="text-right mr-4">
                            <p className="font-semibold text-gray-700">{user.nombre} {user.apellidos}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
};


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
            <Header />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;