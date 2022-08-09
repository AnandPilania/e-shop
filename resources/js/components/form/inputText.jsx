import React from 'react';

const InputText = ({ id, value, handleChange, handleClick, placeholder, css }) => {

    return (
        <div>
            <input
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                placeholder={placeholder}
                autoComplete="off"
                className={`focus:border-gray-400 justify-self-stretch  h-10 pl-2 rounded-md border border-gray-300 bg-white text-gray-500 text-sm ${css}`}
            />
        </div>
    );
}

export default InputText;
