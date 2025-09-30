
import React from 'react';
import { Valuations as ValuationsType } from '../../types';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: ValuationsType;
    onChange: (field: keyof ValuationsType, value: any, subField?: string, subSubField?: string) => void;
}

const geriatricSyndromes = [
    { id: 'caidas', label: 'Historia de caídas' }, { id: 'nutricion', label: 'Nutrición' },
    { id: 'incontinencia', label: 'Incontinencia fecal' }, { id: 'estrenimiento', label: 'Estreñimiento' },
    { id: 'vision', label: 'Visión' }, { id: 'audicion', label: 'Audición' },
    { id: 'depresion', label: 'Depresión' }, { id: 'demencia', label: 'Demencia' },
    { id: 'confusional', label: 'SD. Confusional agudo' }, { id: 'funcionales', label: 'Problemas funcionales' },
    { id: 'socioFamiliares', label: 'Problemas socio-familiares' }, { id: 'inmovilismo', label: 'Inmovilismo' },
    { id: 'urinaria', label: 'Incontinencia urinaria' }, { id: 'ulceras', label: 'Ulceras por presión' },
    { id: 'iatrogenia', label: 'Iatrogenia/Polifarmacia' },
];


const RatingScale: React.FC<{label: string, value: number, onChange: (val:number)=>void}> = ({label, value, onChange}) => (
    <div className="py-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-4 mt-2">
            {[0, 1, 2, 3, 4, 5].map(v => (
                 <label key={v} className="flex flex-col items-center cursor-pointer">
                    <span className="text-xs text-gray-600 mb-1">{v}</span>
                    <input type="radio" name={label} value={v} checked={value === v} onChange={() => onChange(v)} className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500" />
                </label>
            ))}
        </div>
    </div>
);


export const Valuations: React.FC<Props> = ({ data, onChange }) => {
    return (
        <div>
            <SectionTitle>Valoraciones y Escalas</SectionTitle>

            <h3 className="text-md font-semibold text-gray-700 mb-2">Escala Cruz Roja</h3>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <RatingScale label="Valoración funcional (1 mes antes del ingreso)" value={data.funcionalMesAntes} onChange={v => onChange('funcionalMesAntes', v)} />
                <RatingScale label="Valoración funcional (Al ingreso)" value={data.funcionalIngreso} onChange={v => onChange('funcionalIngreso', v)} />
                <RatingScale label="Valoración psíquica (1 mes antes del ingreso)" value={data.psiquicaMesAntes} onChange={v => onChange('psiquicaMesAntes', v)} />
                <RatingScale label="Valoración psíquica (Al ingreso)" value={data.psiquicaIngreso} onChange={v => onChange('psiquicaIngreso', v)} />
            </div>

            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Valoración Nutricional Rápida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Peso actual" id="pesoActual" value={data.pesoActual} onChange={e => onChange('pesoActual', e.target.value)} />
                <InputField label="Peso ideal" id="pesoIdeal" value={data.pesoIdeal} onChange={e => onChange('pesoIdeal', e.target.value)} />
                <InputField label="% Diferencia" id="diferenciaPeso" value={data.diferenciaPeso} onChange={e => onChange('diferenciaPeso', e.target.value)} />
            </div>
            
            <InputField label="Valoración social resumida" id="valoracionSocialResumida" value={data.valoracionSocialResumida} onChange={e => onChange('valoracionSocialResumida', e.target.value)} className="mt-4" />

            <div className="mt-6">
                 <SelectField 
                    label="Con quien vive" 
                    id="conQuienVive" 
                    value={data.conQuienVive} 
                    onChange={e => onChange('conQuienVive', e.target.value)}
                    options={[
                        {value: 'Solo', label: 'Solo'},
                        {value: 'Hijos', label: 'Con hijos'},
                        {value: 'Conyuge', label: 'Con su cónyuge'},
                        {value: 'Cuidadores', label: 'Con cuidadores'},
                    ]}
                />
            </div>
            
            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Soporte en domicilio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Para medicamentos" id="soporteMedicamentos" value={data.soporteMedicamentos} onChange={e => onChange('soporteMedicamentos', e.target.value)} />
                <InputField label="Para cuidados" id="soporteCuidados" value={data.soporteCuidados} onChange={e => onChange('soporteCuidados', e.target.value)} />
                <InputField label="Para alimentos" id="soporteAlimentos" value={data.soporteAlimentos} onChange={e => onChange('soporteAlimentos', e.target.value)} />
            </div>

            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Revisión de SD. Geriátricos</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Síndrome</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presente</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervención</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {geriatricSyndromes.map(({id, label}) => (
                            <tr key={id}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{label}</td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-4">
                                        <label className="flex items-center"><input type="radio" name={id} value="Sí" checked={data.geriatrico[id]?.presente === 'Sí'} onChange={e => onChange('geriatrico', e.target.value, id, 'presente')} className="form-radio" /> <span className="ml-2">Sí</span></label>
                                        <label className="flex items-center"><input type="radio" name={id} value="No" checked={data.geriatrico[id]?.presente === 'No'} onChange={e => onChange('geriatrico', e.target.value, id, 'presente')} className="form-radio" /> <span className="ml-2">No</span></label>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <InputField label="" id={`${id}-intervencion`} value={data.geriatrico[id]?.intervencion || ''} onChange={e => onChange('geriatrico', e.target.value, id, 'intervencion')} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <InputField label="Dr./a. Que ha realizado la Historia Clínica" id="realizadoPor" value={data.realizadoPor} onChange={e => onChange('realizadoPor', e.target.value)} className="mt-6" />

        </div>
    );
};
