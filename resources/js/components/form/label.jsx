import React from 'react';

const Label = ({ label, css }) => {
    return (
        <label
            className={`w-auto text-[15px] font-medium text-gray-700 mb-1 caret-transparent ${css}`}
        >
            {label}
        </label>
    );
}

export default Label;
