import React from 'react';
import './toggle.css';

const Toggle = ({ isChecked, change }) => {
    return (
        <div>
            <input type='checkbox'
                className="cm-toggleComponent"
                checked={isChecked}
                onChange={change} />
        </div>
    );
}

export default Toggle;
