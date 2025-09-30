import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HistoriaClinicaContent, initialHistoriaClinicaContent, Patient, ClinicalHistory } from '../types';
import { apiService } from '../services/apiService';
import { generateSummary } from '../services/geminiService';

import { PatientData } from '../components/sections/PatientData';
import { Antecedents } from '../components/sections/Antecedents';
import { ConsultationReason } from '../components/sections/ConsultationReason';
import { SystemReview } from '../components/sections/SystemReview';
import { PhysicalExam } from '../components/sections/PhysicalExam';
import { Valuations } from '../components/sections/Valuations';
import { IconAI, IconSave, IconSpinner, IconDocument } from '../components/IconComponents';

type SectionKey = 'patientData' | 'antecedents' | 'consultationReason' | 'systemReview' | 'physicalExam' | 'valuations';

const sectionComponents: Record<SectionKey, React.FC<any>> = {
    patientData: PatientData,
    antecedents: Antecedents,
    consultationReason: ConsultationReason,
    systemReview: SystemReview,
    physicalExam: PhysicalExam,
    valuations: Valuations,
};

const sectionNames: Record<SectionKey, string> = {
    patientData: 'Datos del Paciente',
    antecedents: 'Antecedentes',
    consultationReason: 'Motivo de Consulta',
    systemReview: 'Revisión por Sistemas',
    physicalExam: 'Examen Físico',
    valuations: 'Valoraciones',
};

const HistoryFormPage: React.FC = () => {
    const { patientId, historyId } = useParams<{ patientId?: string, historyId?: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(historyId);

    const [formData, setFormData] = useState<HistoriaClinicaContent>(initialHistoriaClinicaContent);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [activeSection, setActiveSection] = useState<SectionKey>('patientData');
    const [summary, setSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
    
    // FIX: Refactored data loading and added pre-population for new history entries.
    useEffect(() => {
        const loadData = async () => {
            try {
                if (isEditing && historyId) {
                    const historyData = await apiService.get<ClinicalHistory>(`histories/${historyId}`);
                    setFormData(historyData.content);
                    const patientData = await apiService.get<Patient>(`patients/${historyData.patient_id}`);
                    setPatient(patientData);
                } else if (patientId) {
                    const patientData = await apiService.get<Patient>(`patients/${patientId}`);
                    setPatient(patientData);
                    // Pre-fill form for a new history entry with the patient's current data as a snapshot
                    setFormData(prev => ({
                        ...prev,
                        patientData: {
                            ...prev.patientData, // Keep history-specific initial values like 'fecha'
                            ...patientData,     // Spread patient details
                            id: undefined,      // Remove patient id from snapshot
                            fechaNacimiento: patientData.fechaNacimiento.split('T')[0], // Format date
                        } as any,
                    }));
                }
            } catch (err) {
                 setError(err instanceof Error ? err.message : 'Failed to load data');
            }
        }
        loadData();
    }, [patientId, historyId, isEditing]);

    const handleInputChange = useCallback((section: keyof HistoriaClinicaContent, field: string, value: any, subField?: string, index?: number) => {
        setFormData(prevData => {
            const newSectionData = { ...prevData[section] };
            if (index !== undefined && subField) {
                const newArray = [...(newSectionData[field as keyof typeof newSectionData] as any[])];
                newArray[index] = { ...newArray[index], [subField]: value };
                (newSectionData as any)[field] = newArray;
            } else if (subField) {
                (newSectionData as any)[field] = { ...(newSectionData as any)[field], [subField]: value };
            } else {
                (newSectionData as any)[field] = value;
            }
            return { ...prevData, [section]: newSectionData };
        });
    }, []);

    const handleGenerateSummary = async () => {
        if (!patient) {
            setError('Datos del paciente no cargados.');
            return;
        }
        setIsLoadingSummary(true);
        setError(null);
        setSummary('');
        try {
            const result = await generateSummary(patient, formData);
            setSummary(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setSaveStatus(null);
        } finally {
            setIsLoadingSummary(false);
        }
    };
    
    const handleSubmit = async () => {
        setIsSaving(true);
        setSaveStatus(null);
        setError(null);
        const finalPatientId = patient?.id;
        if(!finalPatientId) {
            setError("No se ha podido identificar al paciente.");
            setIsSaving(false);
            return;
        }

        try {
            if (isEditing) {
                await apiService.put(`histories/${historyId}`, { content: formData });
            } else {
                await apiService.post('histories', { patientId: finalPatientId, content: formData });
            }
            setSaveStatus('success');
            setTimeout(() => navigate(`/patient/${finalPatientId}`), 2000);
        } catch (err) {
            setSaveStatus('error');
            setError(err instanceof Error ? err.message : 'Ocurrió un error de red o de servidor.');
        } finally {
            setIsSaving(false);
        }
    };

    const ActiveComponent = sectionComponents[activeSection];
    
    if(!patient) return <div>Cargando...</div>

    return (
        <div className="font-sans text-gray-800">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 sticky top-24 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <IconDocument className="h-8 w-8 text-primary-600" />
                        <div>
                           <h1 className="text-xl font-bold text-gray-800">{isEditing ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}</h1>
                           <p className="text-sm text-gray-600">Paciente: {patient.nombre} {patient.apellidos}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGenerateSummary}
                            disabled={isLoadingSummary || isSaving}
                            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:bg-primary-300 disabled:cursor-not-allowed"
                        >
                            {isLoadingSummary ? <IconSpinner className="h-5 w-5 animate-spin" /> : <IconAI className="h-5 w-5" />}
                            <span className="ml-2 hidden sm:inline">{isLoadingSummary ? 'Generando...' : 'Resumen AI'}</span>
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving || isLoadingSummary}
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:bg-green-300 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <IconSpinner className="h-5 w-5 animate-spin" /> : <IconSave className="h-5 w-5" />}
                            <span className="ml-2 hidden sm:inline">{isSaving ? 'Guardando...' : 'Guardar'}</span>
                        </button>
                    </div>
                </div>
            </div>
            
             {saveStatus === 'success' && (
                <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p className="font-bold">Éxito</p>
                    <p>La historia clínica se ha guardado correctamente. Redirigiendo...</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                    <nav className="bg-white rounded-lg shadow-lg p-4 sticky top-48">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Secciones</h2>
                        <ul>
                            {(Object.keys(sectionNames) as SectionKey[]).map(key => (
                                <li key={key}>
                                    <button
                                        onClick={() => setActiveSection(key)}
                                        className={`w-full text-left px-4 py-3 rounded-md transition duration-200 ease-in-out text-sm font-medium ${
                                            activeSection === key 
                                            ? 'bg-primary-100 text-primary-700' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        {sectionNames[key]}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <div className="lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[60vh]">
                        <ActiveComponent data={formData[activeSection]} onChange={(field: string, value: any, subField?: string, index?: number) => handleInputChange(activeSection, field, value, subField, index)} />
                    </div>
                </div>
            </div>

            {(summary || error) && (
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">{error && !summary ? 'Error' : 'Resumen Generado por IA'}</h2>
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
                    {summary && (
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: summary }} />
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoryFormPage;