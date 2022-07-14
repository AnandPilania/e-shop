import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';


const Stock = () => {

    const [placeholder, setPlaceholder] = useState(String.fromCharCode(0x221E));

    const { productStock, setProductStock, unlimited, setUnlimited, productCode, setProductCode } = useContext(AppContext);

    const handleProductStock = (e) => {
        setProductStock(e.target.value);
    }

    const handleProductStockOnFocus = () => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox');
        unlimitedStockCheckbox.checked = false;

        if (unlimited) {
            setUnlimited(!unlimited);
            setPlaceholder('0');
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = 'white';
        }
    }

    const handleUnlimitedStock = () => {
        if (!unlimited) {
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = '#f1f5f9';
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder(String.fromCharCode(0x221E));
        } else {
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = 'white';
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder('0');
        }
    }


    const handleCodeProduct = (e) => {
        setProductCode(e.target.value)
    }

    return (
        <div className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Stock</h3>

            <div className='w-full h-auto grid gap-x-4 grid-cols-2 justify-start items-start'>
                <div className='flex flex-col justify-start items-start mb-2.5'>
                    <label>Stock</label>
                    <div
                        className='flex flex-rox justify-start items-center w-full'>
                        <input
                            type="number"
                            onChange={handleProductStock}
                            value={productStock}
                            placeholder={placeholder}
                            className="w-full h-10 border border-gray-300 rounded-l-md pl-2.5 mb-7 mt-1 bg-gray-50 text-base"
                            id='inputStock'
                            min="0" max="9999999999"
                            onClick={handleProductStockOnFocus} />
                        <span
                            className='flex flex-rox justify-start items-center h-10 border-y border-r  border-gray-300 rounded-r-md px-2.5 mb-7 mt-1 cursor-pointer caret-transparent'
                            onClick={handleUnlimitedStock}>
                            <input
                                className='mr-2 caret-transparent cursor-pointer'
                                id='unlimitedStockCheckbox'
                                type="checkbox"
                                checked={unlimited}
                                onChange={handleUnlimitedStock} />
                            <label
                                className='cursor-pointer caret-transparent'>
                                Illimité
                            </label>
                        </span>
                    </div>
                </div>


                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <label>Code</label>
                    <div
                        className='flex flex-rox justify-start items-center w-full'>
                        <input
                            type="number"
                            onChange={handleCodeProduct}
                            value={productCode}
                            className="w-full h-10 border border-gray-300 rounded-md pl-2.5 mb-7 mt-1 bg-white text-base"
                            id='inputStock'
                            min="0" max="9999999999"
                          />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stock;

