import React from 'react';

const Label = ({ label, id, css }) => {
    return (

        <label
            className={`w-auto text-base font-medium text-gray-700 mb-1 caret-transparent ${css}`}
            htmlFor={id}
        >
            {label}
        </label>
    );
}

export default Label;
