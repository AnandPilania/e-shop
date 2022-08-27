import React from 'react';

const InputText = ({ id, value, handleChange, handleClick, placeholder, maxLength, css }) => {

    return (
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                placeholder={placeholder}
                maxLength={maxLength}
                autoComplete="off"
                className={`focus:border-gray-400 w-full h-10 pl-2 border border-gray-300 bg-white text-gray-500 text-sm ${css}`}
            />
    );
}

export default InputText;
