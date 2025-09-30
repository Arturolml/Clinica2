
import React from 'react';
import { ConsultationReason as ConsultationReasonType } from '../../types';
import { TextAreaField } from '../common/TextAreaField';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: ConsultationReasonType;
    onChange: (field: keyof ConsultationReasonType, value: string) => void;
}

export const ConsultationReason: React.FC<Props> = ({ data, onChange }) => {
    return (
        <div>
            <SectionTitle>Motivo de Consulta</SectionTitle>
            <div className="space-y-6">
                <TextAreaField 
                    label="Motivo de Consulta"
                    id="motivo"
                    value={data.motivo}
                    onChange={(e) => onChange('motivo', e.target.value)}
                    rows={3}
                />
                <TextAreaField 
                    label="Desarrollo del motivo de consulta"
                    id="desarrollo"
                    value={data.desarrollo}
                    onChange={(e) => onChange('desarrollo', e.target.value)}
                    rows={8}
                />
            </div>
        </div>
    );
};
