import { ListItem } from 'material-ui';
import React from 'react';

const SelectSimple = ({ id, value, handleChange, handleClick, placeholder, label, customStyle, list }) => {

    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            <select
                id={id}
                type="text"
                value={value}
                onChange={handleChange}
                onClick={handleClick}
                autoComplete="off"
                className="focus:border-gray-400 w-full min-w-[150px] h-10 mb-6 rounded-md border border-gray-300 bg-white"
                style={customStyle}
            >
                {placeholder.length > 0 &&
                    <option value="" disabled defaultValue
                        className="truncate text-gray-700 text-base hover:cursor-pointer hover:text-white cursor-pointer hover:bg-indigo-600 p-2 w-full h-10"
                    >
                        {placeholder}
                    </option>
                }
                {list.length > 0 &&
                    list.map((item, index) =>
                        <option key={index}
                            value={item}
                            className="truncate text-gray-700 text-base hover:cursor-pointer hover:text-white cursor-pointer hover:bg-indigo-600 p-2 w-full h-10"
                        >
                            {item}
                        </option>
                    )}
            </select>
        </div>
    );
}

export default SelectSimple;
