import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import InputText from '../form/inputText';
import Label from '../form/label';

const NameAndRibbon = () => {

    const { productForm, setProductForm } = useContext(AppContext);

    const handleName = (e) => {
        setProductForm({...productForm, nameProduct: e.target.value});
    }

    const handleRibbon = (e) => {
        setProductForm({...productForm, ribbonProduct: e.target.value});
    }

    return (
        <div className='w-full grid grid-cols-2 gap-4'>
            {/* name */}
            <div className='w-full mb-5 flex flex-col justify-start items-start'>
                <div className='w-full flex caret-transparent'>
                    <Label label="Nom" /><span className='text-red-700'>*</span>
                </div>
                <InputText
                    id="productName22822"
                    value={productForm.nameProduct}
                    handleChange={handleName}
                    css="rounded-md"
                    maxLength={255}
                />
            </div>
            {/* ribbon */}
            <div className='w-full mb-5 flex flex-col justify-start items-start'>
                <div className='w-full flex caret-transparent'>
                    <Label label="Ruban" />
                </div>
                <InputText
                    id="productRibbon22822"
                    value={productForm.ribbonProduct}
                    handleChange={handleRibbon}
                    css="rounded-md"
                    maxLength={255}
                />
            </div>
        </div>
    );
}

export default NameAndRibbon;
