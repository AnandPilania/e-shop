import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';


const Stock = () => {

    const [unlimited, setUnlimited] = useState(true);
    const [placeholder, setPlaceholder] = useState("&infin;");

    const { productStock, setProductStock } = useContext(AppContext);


    const handleProductStock = (e) => {
        setProductStock(e.target.value);
    }

    const handleUnlimitedStock = () => {
        if (!unlimited) {
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder("&infin;");
        } else {
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder('0');
        }
    }


    return (
        <div className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Stock</h3>

            <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>
                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <label>Stock</label>
                    <div>
                        <input type="number" onChange={handleProductStock} value={productStock} placeholder={placeholder} className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1" />
                        <input type="checkbox" checked={unlimited} onChange={handleUnlimitedStock} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Stock;

