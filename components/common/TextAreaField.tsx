
import React from 'react';

interface TextAreaFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    placeholder?: string;
    className?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label,
    id,
    value,
    onChange,
    rows = 3,
    placeholder = '',
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
    );
};
