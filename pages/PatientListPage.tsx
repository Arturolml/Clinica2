import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Patient } from '../types';
import { SectionTitle } from '../components/common/SectionTitle';

const PatientListPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await apiService.get<Patient[]>('patients');
                setPatients(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch patients');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleDelete = async (patientId: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este paciente y todos sus historiales?')) {
            try {
                await apiService.delete(`patients/${patientId}`);
                setPatients(patients.filter(p => p.id !== patientId));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete patient');
            }
        }
    };

    const filteredPatients = useMemo(() => 
        patients.filter(p => 
            `${p.nombre} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.numeroRecord?.toLowerCase().includes(searchTerm.toLowerCase())
        ), [patients, searchTerm]);

    if (isLoading) return <div className="text-center">Cargando pacientes...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <SectionTitle>Lista de Pacientes</SectionTitle>
                <Link to="/patient/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200">
                    + Nuevo Paciente
                </Link>
            </div>
            
            <div className="mb-4">
                <input 
                    type="text"
                    placeholder="Buscar por nombre o número de record..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº Record</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map(patient => (
                            <tr key={patient.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{patient.nombre} {patient.apellidos}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{patient.numeroRecord}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{patient.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Link to={`/patient/${patient.id}`} className="text-primary-600 hover:text-primary-900">Ver</Link>
                                    <Link to={`/patient/edit/${patient.id}`} className="text-indigo-600 hover:text-indigo-900">Editar</Link>
                                    <button onClick={() => handleDelete(patient.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                         {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4">No se encontraron pacientes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientListPage;
