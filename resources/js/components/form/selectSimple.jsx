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
                // placeholder={placeholder}
                autoComplete="off"
                className="focus:border-gray-400 w-full h-[45px] pl-2 mb-6 rounded-md border border-gray-300 bg-white text-gray-500 text-sm"
                style={customStyle}
            >
                <option value="">Choisir un pays</option>
                {list.length > 0 &&
                    list.map((item, index) =>
                        <option key={index}
                            value={item}
                        >
                            {item}
                        </option>
                    )}
            </select>
        </div>
    );
}

export default SelectSimple;
