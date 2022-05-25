import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';


const Price = () => {

    const { productPrice, setProductPrice, previousProductPrice, setPreviousProductPrice, productCost, setProductCost, } = useContext(AppContext);


    const handleProductPrice = (e) => {
        setProductPrice(e.target.value);
    }

    const handlePreviousProductPrice = (e) => {
        setPreviousProductPrice(e.target.value);
    }

    const handleProductCost = (e) => {
        setProductCost(e.target.value);
    }



    return (
        <div className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Prix</h3>

            <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>
                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <label>Prix*</label>
                    <input type="number" step=".01" onChange={handleProductPrice} value={productPrice} placeholder="0.00" className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1" />
                </div>


                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <label>Prix avant diminution</label>
                    <input type="number" step=".01" onChange={handlePreviousProductPrice} value={previousProductPrice} placeholder="0.00" className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1" />
                </div>


                <div className='w-full'>
                    <label>Prix d'achat par article</label>
                    <input type="number" step=".01" onChange={handleProductCost} value={productCost} placeholder="0.00" className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mt-1" />
                </div>
                <span className='col-span-2 text-[13px] mt-[-3px]'>Cette information ne sera pas visible par les clients</span>
            </div>
        </div>
    )
}

export default Price;

