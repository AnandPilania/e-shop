import React from 'react';

const TextArea = ({ id, value, handleChange, handleClick, placeholder, maxLength, css }) => {

    return (
        <textarea
            id={id}
            type="text"
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            placeholder={placeholder}
            autoComplete="off"
            maxLength={maxLength}
            className={`focus:border-gray-400 w-full h-auto min-h-[80px] pl-2 rounded-md border border-gray-300 bg-white text-gray-500 text-sm ${css}`}
        />
    );
}

export default TextArea;
