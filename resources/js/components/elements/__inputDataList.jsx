import React from 'react';

const InputDataList = ({ list }) => {

    const handleChange = (e) => {

    };

    return (
        <div>
            <input type="text" list="data" onChange={handleChange} />

            <datalist id="data">
                {list.map((item, key) =>
                    <option key={key} value={item.displayValue} />
                )}
            </datalist>
        </div>
    );
}

export default InputDataList;
