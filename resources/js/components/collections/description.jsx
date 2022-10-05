import React from 'react';
import Label from '../form/label';
import TinyEditor from './tinyEditor';

const DescriptionCollection = () => {
    return (
        <div className="w-full flex flex-col justify-start items-start">
            <Label label="Description" />
            <TinyEditor />
        </div>
    );
}

export default DescriptionCollection;
