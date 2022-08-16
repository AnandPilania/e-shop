import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';


const Weight = () => {

    const { productWeight, setProductWeight, productParcelWeight, setProductParcelWeight } = useContext(AppContext);


    const handleProductWeight = (e) => {
        setProductWeight(e.target.value);
    }

    const handleProductParcelWeight = (e) => {
        setProductParcelWeight(e.target.value);
    }

    return (
        <div className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Poids<span className='text-sm ml-2'>(en Gramme)</span></h3>

            <div className='w-full h-auto grid gap-x-4 grid-cols-2 justify-start items-start'>

                {/* weight */}
                <div className='w-full flex flex-col justify-start items-start mb-2.5'>
                    <Label label="Poids" />
                    <div
                        className='w-full flex flex-row justify-start items-center'
                    >
                        <InputNumeric
                            value={productWeight}
                            handleChange={handleProductWeight}
                            placeholder="Poids du produit"
                            step="1"
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />
                        <span
                            className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'
                        >
                            g
                        </span>
                    </div>
                </div>

                {/* parcel weight */}
                <div className='w-full flex flex-col justify-start items-start mb-2.5'>
                    <Label label="Poids du colis" />
                    <div
                        className='w-full flex flex-row justify-start items-center'
                    >
                        <InputNumeric
                            value={productParcelWeight}
                            handleChange={handleProductParcelWeight}
                            placeholder="Poids avec emballage"
                            step="1"
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />
                        <span
                            className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'
                        >
                            g
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weight;

