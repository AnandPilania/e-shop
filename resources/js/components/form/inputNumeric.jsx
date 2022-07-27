import React from 'react';

const InputNumeric = ({ id, value, handleChange, handleClick, placeholder, label, step, min, max, css }) => {

    return (
        <div>
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
                // placeholder={placeholder}
                autoComplete="off"
                className="focus:border-gray-400 w-full h-[45px] pl-2 mb-6 rounded-md border border-gray-300 bg-white text-gray-500 text-sm"
                style={css}
            />
        </div>
    );
}

export default InputNumeric;
