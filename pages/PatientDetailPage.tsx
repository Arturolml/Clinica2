import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { ClinicalHistory } from '../types';

interface PatientDemographics {
    ID_Paciente: number;
    Nombre: string;
    Apellidos: string;
    Edad: number;
    Sexo_ID: number;
    EstadoCivil_ID: number;
    Direccion: string;
    Telefono: string;
    Numero_Record: string;
}

const PatientDetailPage: React.FC = () => {
    const { recordNumber } = useParams<{ recordNumber: string }>();
    const [patient, setPatient] = useState<PatientDemographics | null>(null);
    const [histories, setHistories] = useState<ClinicalHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!recordNumber) return;
            try {
                // Fetch latest patient demographics
                const patientData = await apiService.get<PatientDemographics>(`patients/record/${recordNumber}`);
                setPatient(patientData);
                // Fetch all histories for this patient record
                const historyData = await apiService.get<ClinicalHistory[]>(`histories/patient/record/${recordNumber}`);
                setHistories(historyData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [recordNumber]);
    
    // Deletion would be complex as it might involve deleting a PACIENTE record and all its dependencies.
    // This is left out for simplicity under the new schema.

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!patient) return <div>Paciente no encontrado.</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-primary-200 pb-2">
                        Datos del Paciente (Último Registro)
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div><strong>Nombre:</strong> {patient.Nombre} {patient.Apellidos}</div>
                    <div><strong>Nº Record:</strong> {patient.Numero_Record}</div>
                    <div><strong>Edad:</strong> {patient.Edad}</div>
                    <div><strong>Teléfono:</strong> {patient.Telefono}</div>
                    <div className="col-span-2"><strong>Dirección:</strong> {patient.Direccion}</div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-primary-200 pb-2">Historiales Clínicos</h2>
                    <Link to={`/history/new/${recordNumber}`} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200">
                        + Nuevo Historial para este Paciente
                    </Link>
                </div>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha de Creación</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {histories.map(history => (
                                <tr key={history.id}>
                                    <td className="px-4 py-3">{new Date(history.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3">{history.doctor_nombre} {history.doctor_apellidos}</td>
                                    <td className="px-4 py-3 space-x-3 text-sm">
                                        <Link to={`/history/edit/${history.id}`} className="text-indigo-600 hover:text-indigo-900">Editar/Ver</Link>
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