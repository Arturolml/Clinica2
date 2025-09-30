import React from 'react';
import { SystemReview as SystemReviewType } from '../../types';
import { DescribableRadioGroup } from '../common/DescribableRadioGroup';
import { TextAreaField } from '../common/TextAreaField';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: SystemReviewType;
    onChange: (field: keyof SystemReviewType, value: any) => void;
}

// FIX: Use `as const` to provide literal types for `id`s, allowing TypeScript to correctly infer value types.
const reviewItems = [
    { id: 'fiebre', label: 'Fiebre' },
    { id: 'altVision', label: 'Alt. de la visión' },
    { id: 'altAudicion', label: 'Alt. de la audición' },
    { id: 'altMasticacion', label: 'Alt. de la masticación' },
    { id: 'altDeglucion', label: 'Alt. de la deglución' },
    { id: 'mareos', label: 'Mareos' },
    { id: 'cefalea', label: 'Cefalea' },
    { id: 'altCognicion', label: 'Alt. de la cognición' },
    { id: 'dolorToracico', label: 'Dolor torácico' },
    { id: 'disnea', label: 'Disnea' },
    { id: 'nauseas', label: 'Nauseas' },
    { id: 'vomito', label: 'Vómito' },
    { id: 'pirosis', label: 'Pirosis' },
    { id: 'diarrea', label: 'Diarrea' },
    { id: 'estrenimiento', label: 'Estreñimiento' },
    { id: 'altOsteoarticulares', label: 'Alt. Osteoarticulares' },
    { id: 'altPiel', label: 'Alt. de la piel' },
    { id: 'altGenitourinarias', label: 'Alt. Genitourinarias' },
    { id: 'alteracionSueno', label: 'Alteración del sueño' },
] as const;

export const SystemReview: React.FC<Props> = ({ data, onChange }) => {
    return (
        <div>
            <SectionTitle>Revisión por Sistemas</SectionTitle>
            <div className="space-y-2">
                {reviewItems.map(item => (
                    <DescribableRadioGroup
                        key={item.id}
                        label={item.label}
                        id={item.id}
                        value={data[item.id]}
                        onChange={(id, value) => onChange(id as keyof SystemReviewType, value)}
                    />
                ))}
            </div>
            <TextAreaField 
                label="Otros" 
                id="otros" 
                value={data.otros} 
                onChange={e => onChange('otros', e.target.value)}
                className="mt-6"
                rows={2}
            />
        </div>
    );
};