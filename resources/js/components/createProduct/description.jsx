import React from 'react';
import Label from '../form/label';
import TinyeditorProduct from './tinyEditorProduct';

const Description = () => {
    return (
        <div className='w-full'>
            <Label label="Déscription" />
            <TinyeditorProduct />
        </div>
    );
}

export default Description;
