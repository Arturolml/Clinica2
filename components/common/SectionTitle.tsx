
import React from 'react';

interface SectionTitleProps {
    children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
    return (
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b-2 border-primary-200 pb-2">
            {children}
        </h2>
    );
};
