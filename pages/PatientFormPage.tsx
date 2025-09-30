import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Patient } from '../types';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { SectionTitle } from '../components/common/SectionTitle';

const initialPatientState: Omit<Patient, 'id'> = {
    nombre: '', apellidos: '', fechaNacimiento: '', sexo: '', estadoCivil: '',
    direccion: '', telefono: '', numeroRecord: '', registroGeriatria: '',
};

const PatientFormPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(patientId);

    const [patient, setPatient] = useState(initialPatientState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            apiService.get<Patient>(`patients/${patientId}`)
                .then(data => {
                    setPatient({ ...data, fechaNacimiento: data.fechaNacimiento.split('T')[0] });
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, [patientId, isEditing]);

    const handleChange = (field: keyof typeof initialPatientState, value: any) => {
        setPatient(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            if (isEditing) {
                await apiService.put(`patients/${patientId}`, patient);
            } else {
                await apiService.post('patients', patient);
            }
            navigate('/patients');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save patient');
            setIsLoading(false);
        }
    };
    
    if (isLoading && isEditing) return <div>Cargando datos del paciente...</div>

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <SectionTitle>{isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}</SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre" id="nombre" value={patient.nombre} onChange={e => handleChange('nombre', e.target.value)} required />
                <InputField label="Apellidos" id="apellidos" value={patient.apellidos} onChange={e => handleChange('apellidos', e.target.value)} required />
                <InputField label="Fecha de Nacimiento" id="fechaNacimiento" type="date" value={patient.fechaNacimiento} onChange={e => handleChange('fechaNacimiento', e.target.value)} required />
                 <SelectField 
                    label="Sexo" 
                    id="sexo" 
                    value={patient.sexo} 
                    onChange={e => handleChange('sexo', e.target.value)} 
                    options={[{value: 'Masculino', label: 'Masculino'}, {value: 'Femenino', label: 'Femenino'}]}
                />
                <InputField label="Estado Civil" id="estadoCivil" value={patient.estadoCivil} onChange={e => handleChange('estadoCivil', e.target.value)} />
                <InputField label="Dirección" id="direccion" value={patient.direccion} onChange={e => handleChange('direccion', e.target.value)} className="md:col-span-2" />
                <InputField label="Teléfono" id="telefono" value={patient.telefono} onChange={e => handleChange('telefono', e.target.value)} />
                <InputField label="Número de Record" id="numeroRecord" value={patient.numeroRecord} onChange={e => handleChange('numeroRecord', e.target.value)} />
                <InputField label="Registro de Geriatría" id="registroGeriatria" value={patient.registroGeriatria} onChange={e => handleChange('registroGeriatria', e.target.value)} />
            </div>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            
            <div className="mt-8 flex justify-end space-x-4">
                <button type="button" onClick={() => navigate('/patients')} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                    Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300">
                    {isLoading ? 'Guardando...' : 'Guardar Paciente'}
                </button>
            </div>
        </form>
    );
};

export default PatientFormPage;
