import React from 'react';

const InputText = ({ id, value, handleChange, handleClick, placeholder, label }) => {
    return (
        <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
        </label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                // placeholder={placeholder}
                autoComplete="off"
                className="focus:border-gray-400 w-full h-[50px] mb-4 rounded-md sm:text-sm  border-gray-300"
            />
        </div>
    );
}

export default InputText;
