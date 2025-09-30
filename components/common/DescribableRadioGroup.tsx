
import React from 'react';
import { YesNoDetail } from '../../types';

interface DescribableRadioGroupProps {
    label: string;
    id: string;
    value: YesNoDetail;
    onChange: (id: string, value: YesNoDetail) => void;
}

export const DescribableRadioGroup: React.FC<DescribableRadioGroupProps> = ({ label, id, value, onChange }) => {
    
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, { ...value, value: e.target.value as 'Sí' | 'No' });
    };

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, { ...value, details: e.target.value });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">{label}</span>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name={id} value="Sí" checked={value.value === 'Sí'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"/>
                        <span className="ml-2 text-sm text-gray-600">Sí</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name={id} value="No" checked={value.value === 'No'} onChange={handleRadioChange} className="form-radio h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"/>
                        <span className="ml-2 text-sm text-gray-600">No</span>
                    </label>
                </div>
                {value.value === 'Sí' && (
                    <input
                        type="text"
                        placeholder="Describir"
                        value={value.details}
                        onChange={handleDetailsChange}
                        className="flex-grow min-w-[200px] px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                )}
            </div>
        </div>
    );
};
