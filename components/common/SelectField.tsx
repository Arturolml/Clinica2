
import React from 'react';

interface SelectFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    id,
    value,
    onChange,
    options,
    required = false,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
                <option value="">Seleccione...</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};
