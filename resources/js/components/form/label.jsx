import React from 'react';

const Label = ({ label }) => {
    return (
        <label
            className='w-auto text-[15px] font-medium text-gray-700 mb-2 caret-transparent'
        >
            {label}
        </label>
    );
}

export default Label;
