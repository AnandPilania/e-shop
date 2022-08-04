import React from 'react';

const InputNumeric = ({ id, value, handleChange, handleClick, placeholder, label, step, min, max, css }) => {

    return (
        <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
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
        </div>
    );
}

export default InputNumeric;
