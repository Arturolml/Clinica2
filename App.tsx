import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PatientListPage from './pages/PatientListPage';
import HistoryFormPage from './pages/HistoryFormPage';
import PatientFormPage from './pages/PatientFormPage';
import PatientDetailPage from './pages/PatientDetailPage';


const App: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute roles={['admin']}>
                        <Layout>
                            <AdminPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />

            <Route 
                path="/patients" 
                element={
                    <ProtectedRoute roles={['doctor']}>
                        <Layout>
                            <PatientListPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
             <Route 
                path="/patient/new" 
                element={
                    <ProtectedRoute roles={['doctor']}>
                        <Layout>
                            <PatientFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/patient/edit/:patientId" 
                element={
                    <ProtectedRoute roles={['doctor']}>
                        <Layout>
                             <PatientFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/patient/:patientId" 
                element={
                    <ProtectedRoute roles={['doctor']}>
                        <Layout>
                            <PatientDetailPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
             <Route 
                path="/patient/:patientId/history/new" 
                element={
                    <ProtectedRoute roles={['doctor']}>
                        <Layout>
                            <HistoryFormPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/history/edit/:historyId" 
                element={
                    <ProtectedRoute roles={['doctor']}>
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
                        ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/patients" />)
                        : <Navigate to="/login" />
                }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;