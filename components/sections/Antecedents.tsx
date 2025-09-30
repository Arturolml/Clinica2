import React from 'react';
import { Antecedents as AntecedentsType, Medication } from '../../types';
import { InputField } from '../common/InputField';
import { DescribableRadioGroup } from '../common/DescribableRadioGroup';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: AntecedentsType;
    onChange: (field: keyof AntecedentsType, value: any, subField?: keyof Medication, index?: number) => void;
}

// FIX: Use `as const` to provide literal types for `id`s, allowing TypeScript to correctly infer value types.
const antecedentItems = [
    { id: 'hipertension', label: 'Hipertensión Arterial' },
    { id: 'diabetesMellitus', label: 'Diabetes Mellitus Tipo II' },
    { id: 'alergias', label: 'Alergias' },
    { id: 'epoc', label: 'EPOC' },
    { id: 'transfusiones', label: 'Transfusiones' },
    { id: 'cirugias', label: 'Cirugías' },
] as const;

// FIX: Use `as const` to provide literal types for `id`s, allowing TypeScript to correctly infer value types.
const toxicHabitItems = [
    { id: 'tabaco', label: 'Tabaco' },
    { id: 'alcohol', label: 'Alcohol' },
    { id: 'tisanas', label: 'Tisanas' },
] as const;

export const Antecedents: React.FC<Props> = ({ data, onChange }) => {
    return (
        <div>
            <SectionTitle>Antecedentes</SectionTitle>
            
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Personales Patológicos</h3>
            {antecedentItems.map(item => (
                <DescribableRadioGroup
                    key={item.id}
                    label={item.label}
                    id={item.id}
                    value={data[item.id]}
                    onChange={(id, value) => onChange(id as keyof AntecedentsType, value)}
                />
            ))}
            <InputField label="Otros" id="otrosPatologicos" value={data.otrosPatologicos} onChange={e => onChange('otrosPatologicos', e.target.value)} className="mt-4" />

            <h3 className="text-md font-semibold text-gray-700 mt-8 mb-3">Hábitos Tóxicos</h3>
            {toxicHabitItems.map(item => (
                <DescribableRadioGroup
                    key={item.id}
                    label={item.label}
                    id={item.id}
                    value={data[item.id]}
                    onChange={(id, value) => onChange(id as keyof AntecedentsType, value)}
                />
            ))}
            <InputField label="Otros" id="otrosToxicos" value={data.otrosToxicos} onChange={e => onChange('otrosToxicos', e.target.value)} className="mt-4" />

            <h3 className="text-md font-semibold text-gray-700 mt-8 mb-3">Medicamentos que está usando o ha usado en las últimas semanas</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de uso</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescrito</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Prescrito</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.medicamentos.map((med, index) => (
                            <tr key={index}>
                                <td className="px-2 py-1"><InputField label="" id={`med-${index}`} value={med.medicamento} onChange={e => onChange('medicamentos', e.target.value, 'medicamento', index)} /></td>
                                <td className="px-2 py-1"><InputField label="" id={`dosis-${index}`} value={med.dosis} onChange={e => onChange('medicamentos', e.target.value, 'dosis', index)} /></td>
                                <td className="px-2 py-1"><InputField label="" id={`tiempo-${index}`} value={med.tiempoUso} onChange={e => onChange('medicamentos', e.target.value, 'tiempoUso', index)} /></td>
                                <td className="px-2 py-1"><InputField label="" id={`prescrito-${index}`} value={med.prescrito} onChange={e => onChange('medicamentos', e.target.value, 'prescrito', index)} /></td>
                                <td className="px-2 py-1"><InputField label="" id={`no-prescrito-${index}`} value={med.noPrescrito} onChange={e => onChange('medicamentos', e.target.value, 'noPrescrito', index)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-md font-semibold text-gray-700 mt-8 mb-3">Familiares</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputField label="Hipertensión" id="hipertensionFam" value={data.hipertensionFam} onChange={e => onChange('hipertensionFam', e.target.value)} />
                <InputField label="Diabetes" id="diabetesFam" value={data.diabetesFam} onChange={e => onChange('diabetesFam', e.target.value)} />
                <InputField label="TBP" id="tbpFam" value={data.tbpFam} onChange={e => onChange('tbpFam', e.target.value)} />
                <InputField label="Cáncer" id="cancerFam" value={data.cancerFam} onChange={e => onChange('cancerFam', e.target.value)} />
                <InputField label="Enfermedad cardiaca" id="enfermedadCardiacaFam" value={data.enfermedadCardiacaFam} onChange={e => onChange('enfermedadCardiacaFam', e.target.value)} />
                <InputField label="Demencias" id="demenciasFam" value={data.demenciasFam} onChange={e => onChange('demenciasFam', e.target.value)} />
                <InputField label="Otros" id="otrosFam" value={data.otrosFam} onChange={e => onChange('otrosFam', e.target.value)} className="md:col-span-2"/>
            </div>
        </div>
    );
};