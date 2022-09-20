import React from 'react';

const InputNumeric = ({ id, value, handleChange, handleClick, placeholder, step, min, max, css }) => {

    return (
        <input
            id={id}
            type="number"
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            step={step}
            min={min}
            max={max}
            placeholder={placeholder}
            autoComplete="off"
            className={`focus:border-gray-400 w-full h-10 pl-2 border border-gray-300 bg-white text-gray-500 text-sm ${css}`}
        />
    );
}

export default InputNumeric;
