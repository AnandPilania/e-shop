import React from 'react';

const Label = ({ label }) => {
    return (
        <label
            className='w-auto text-sm font-medium text-gray-700 mb-2'
        >
            {label}
        </label>
    );
}

export default Label;
