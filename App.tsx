import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PatientListPage from './pages/PatientListPage';
import HistoryFormPage from './pages/HistoryFormPage';
import PatientDetailPage from './pages/PatientDetailPage';


const App: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute roles={['ADMIN']}>
                        <Layout>
                            <AdminPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path="/patients" 
                element={
                    <ProtectedRoute roles={['MEDICO']}>
                        <Layout>
                            <PatientListPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/patient/record/:recordNumber" 
                element={
                    <ProtectedRoute roles={['MEDICO']}>
                        <Layout>
                            <PatientDetailPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
             <Route 
                path="/history/new" 
                element={
                    <ProtectedRoute roles={['MEDICO']}>
                        <Layout>
                            <HistoryFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/history/new/:recordNumber" 
                element={
                    <ProtectedRoute roles={['MEDICO']}>
                        <Layout>
                            <HistoryFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/history/edit/:historyId" 
                element={
                    <ProtectedRoute roles={['MEDICO']}>
                        <Layout>
                            <HistoryFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            
            <Route 
                path="/" 
                element={
                    user 
                        ? (user.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/patients" />)
                        : <Navigate to="/login" />
                }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;