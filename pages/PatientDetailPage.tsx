import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Patient, ClinicalHistory } from '../types';
import { SectionTitle } from '../components/common/SectionTitle';

const PatientDetailPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [histories, setHistories] = useState<ClinicalHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!patientId) return;
            try {
                const patientData = await apiService.get<Patient>(`patients/${patientId}`);
                setPatient(patientData);
                const historyData = await apiService.get<ClinicalHistory[]>(`histories/patient/${patientId}`);
                setHistories(historyData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [patientId]);
    
    const handleDeleteHistory = async (historyId: number) => {
         if (window.confirm('¿Está seguro de que desea eliminar este historial clínico?')) {
            try {
                await apiService.delete(`histories/${historyId}`);
                setHistories(histories.filter(h => h.id !== historyId));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete history');
            }
        }
    }


    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!patient) return <div>Paciente no encontrado.</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <SectionTitle>Datos del Paciente</SectionTitle>
                    <Link to={`/patient/edit/${patient.id}`} className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200">Editar Paciente</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div><strong>Nombre:</strong> {patient.nombre} {patient.apellidos}</div>
                    <div><strong>Nº Record:</strong> {patient.numeroRecord}</div>
                    <div><strong>Fecha Nacimiento:</strong> {new Date(patient.fechaNacimiento).toLocaleDateString()}</div>
                    <div><strong>Sexo:</strong> {patient.sexo}</div>
                    <div><strong>Estado Civil:</strong> {patient.estadoCivil}</div>
                    <div><strong>Teléfono:</strong> {patient.telefono}</div>
                    <div className="col-span-2"><strong>Dirección:</strong> {patient.direccion}</div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                 <div className="flex justify-between items-center mb-6">
                    <SectionTitle>Historiales Clínicos</SectionTitle>
                    <Link to={`/patient/${patientId}/history/new`} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200">
                        + Nuevo Historial
                    </Link>
                </div>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {histories.map(history => (
                                <tr key={history.id}>
                                    <td className="px-4 py-3">{new Date(history.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3">{history.doctor_username}</td>
                                    <td className="px-4 py-3 space-x-3 text-sm">
                                        <Link to={`/history/edit/${history.id}`} className="text-indigo-600 hover:text-indigo-900">Editar/Ver</Link>
                                        <button onClick={() => handleDeleteHistory(history.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {histories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">Este paciente no tiene historiales clínicos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailPage;
