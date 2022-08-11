import React from 'react';
import './toggle.css';

const Toggle = ({ isChecked, change, id, label, labelCss }) => {
    return (
        <div className='w-full h-auto flex flex-row flex-wrap justify-start items-center'
        >
            <input
                type='checkbox'
                id={id}
                className="cm-toggleComponent"
                checked={isChecked}
                onChange={change}
            />
            <label
                className={`m-0 ml-2 p-0 cursor-pointer text-gray-500  hover:text-gray-700 ${labelCss}`}
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    );
}

export default Toggle;
