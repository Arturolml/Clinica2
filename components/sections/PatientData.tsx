
import React from 'react';
import { PatientData as PatientDataType } from '../../types';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: PatientDataType;
    onChange: (field: keyof PatientDataType, value: any) => void;
}

export const PatientData: React.FC<Props> = ({ data, onChange }) => {
    return (
        <div>
            <SectionTitle>Datos del Paciente</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField label="Fecha" id="fecha" type="date" value={data.fecha} onChange={e => onChange('fecha', e.target.value)} />
                <InputField label="Nombre" id="nombre" value={data.nombre} onChange={e => onChange('nombre', e.target.value)} />
                <InputField label="Apellidos" id="apellidos" value={data.apellidos} onChange={e => onChange('apellidos', e.target.value)} />
                {/* FIX: Replaced 'edad' field with 'fechaNacimiento' to align with data model and fix type errors. */}
                <InputField label="Fecha de Nacimiento" id="fechaNacimiento" type="date" value={data.fechaNacimiento} onChange={e => onChange('fechaNacimiento', e.target.value)} />
                <SelectField 
                    label="Sexo" 
                    id="sexo" 
                    value={data.sexo} 
                    onChange={e => onChange('sexo', e.target.value)} 
                    options={[{value: 'Masculino', label: 'Masculino'}, {value: 'Femenino', label: 'Femenino'}]}
                />
                <InputField label="Estado Civil" id="estadoCivil" value={data.estadoCivil} onChange={e => onChange('estadoCivil', e.target.value)} />
                <InputField label="Dirección" id="direccion" value={data.direccion} onChange={e => onChange('direccion', e.target.value)} className="md:col-span-2" />
                <InputField label="Teléfono" id="telefono" value={data.telefono} onChange={e => onChange('telefono', e.target.value)} />
                <InputField label="Número de Record" id="numeroRecord" value={data.numeroRecord} onChange={e => onChange('numeroRecord', e.target.value)} />
                <InputField label="Registro de Geriatría" id="registroGeriatria" value={data.registroGeriatria} onChange={e => onChange('registroGeriatria', e.target.value)} />
                <SelectField
                    label="Informado por"
                    id="informadoPor"
                    value={data.informadoPor}
                    onChange={e => onChange('informadoPor', e.target.value)}
                    options={[
                        {value: 'Paciente', label: 'Paciente'},
                        {value: 'Familiar', label: 'Familiar'},
                        {value: 'Ambos', label: 'Ambos'},
                        {value: 'Otro', label: 'Otro'},
                    ]}
                />
                {data.informadoPor === 'Otro' && (
                    <InputField label="Especificar Otro" id="informadoPorOtro" value={data.informadoPorOtro} onChange={e => onChange('informadoPorOtro', e.target.value)} />
                )}
            </div>
        </div>
    );
};