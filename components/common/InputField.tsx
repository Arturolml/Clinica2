
import React from 'react';

interface InputFieldProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    id,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    required = false,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
    );
};
