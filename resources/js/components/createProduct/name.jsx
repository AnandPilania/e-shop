import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import InputText from '../form/inputText';
import Label from '../form/label';

const Name = () => {

    const { nameProduct, setNameProduct } = useContext(AppContext);
    
    const handleName = (e) => {
        setNameProduct(e.target.value);
    }

    return (
        <div className='w-full mb-5 flex flex-col justify-start items-start'>
            <div className='w-full flex justify-start items-center'>
                <Label label="Nom" /><span className='text-red-700 caret-transparent'>*</span>
            </div>

            <InputText
                id="productName22822"
                value={nameProduct}
                handleChange={handleName}
            />
        </div>
    );
}

export default Name;
