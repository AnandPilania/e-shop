import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Tooltip from '../elements/tooltip';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';


const Stock = () => {

    const [placeholder, setPlaceholder] = useState(String.fromCharCode(0x221E));

    const { productStock, setProductStock, unlimited, setUnlimited, productCode, setProductCode, productWeight, setProductWeight } = useContext(AppContext);

    useEffect(() => {
        let inputStock = document.getElementById('inputStock');
        inputStock.style.backgroundColor = '#f1f5f9';
    }, []);

    const handleProductStock = (e) => {
        setProductStock(e.target.value);
    }

    const handleProductStockOnFocus = () => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox');
        unlimitedStockCheckbox.checked = false;

        if (unlimited) {
            setUnlimited(!unlimited);
            setPlaceholder('Entrer le stock');
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = 'white';
            let stock_star_alert = document.getElementById('stock_star_alert');
            stock_star_alert.style.display = productStock.length == 0 && "inline";
        }
    }

    const handleUnlimitedStock = () => {
        if (!unlimited) {
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = '#f1f5f9';
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder(String.fromCharCode(0x221E));
            let stock_star_alert = document.getElementById('stock_star_alert');
            stock_star_alert.style.display = "none";
        } else {
            let inputStock = document.getElementById('inputStock');
            inputStock.style.backgroundColor = 'white';
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder('0');
            let stock_star_alert = document.getElementById('stock_star_alert');
            stock_star_alert.style.display = productStock.length == 0 && "inline";
        }
    }

    const handleCodeProduct = (e) => {
        setProductCode(e.target.value)
    }

    const handleProductWeight = (e) => {
        setProductWeight(e.target.value);
    }

    return (
        <Flex_col_s_s>
            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Stock</h3>

            <div className='w-full h-auto grid gap-x-6 grid-cols-2 justify-start items-center'
            >
                <div className='flex flex-col justify-start items-start mb-2.5'
                >
                    {/* stock */}
                    <div className='flex'>
                        <Label label="Stock" />
                        <span id="stock_star_alert" className='text-red-600 hidden'>*</span>
                    </div>
                    <div
                        className='flex flex-rox justify-start items-center w-full'>
                        <InputNumeric
                            id='inputStock'
                            value={productStock}
                            handleChange={handleProductStock}
                            handleClick={handleProductStockOnFocus}
                            placeholder={placeholder}
                            step="1"
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />

                        <span
                            className='flex flex-rox justify-center items-center w-14 h-10 border-y border-r  border-gray-300 rounded-r-md px-2.5 cursor-pointer caret-transparent relative group'
                            onClick={handleUnlimitedStock}
                        >
                            <input
                                className='caret-transparent cursor-pointer'
                                id='unlimitedStockCheckbox'
                                type="checkbox"
                                checked={unlimited}
                                onChange={handleUnlimitedStock} />
                                <Tooltip top={-40} left={-30}>
                                    Illimité
                                </Tooltip>
                        </span>
                    </div>
                </div>

                {/* sku */}
                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <div className='w-full flex'>
                        <Label label="SKU" />
                        <div className='w-full relative group'>
                            <img src='../images/icons/info-circle.svg'
                                className="w-4 h-4 ml-2 cursor-help" />
                            <Tooltip top={-140} left={-50}>
                                Une SKU, « unité de gestion des stocks »,  est un code servant à identifier un article ou une variante de manière unique. Elle permet une gestion plus efficace de vos stocks.
                            </Tooltip>
                        </div>
                    </div>
                    <InputNumeric
                        id='inputSku17822'
                        value={productCode}
                        handleChange={handleCodeProduct}
                        placeholder=""
                        step="1"
                        min="0"
                        max="9999999999"
                        css="rounded-md"
                    />
                </div>

                {/* weight */}
                <div className='w-full col-span-2 flex flex-col justify-start items-start my-2.5'>
                    <div className='w-full flex'>
                        <Label label="Poids" />
                        <div className='relative group'>
                            <img src='../images/icons/info-circle.svg'
                                className="w-4 h-4 ml-2 cursor-help" />
                            <Tooltip top={-60} left={-50}>
                                Poids du produit avec son emballage
                            </Tooltip>
                        </div>
                    </div>
                    <div
                        className='w-full flex flex-row justify-start items-center'
                    >
                        <InputNumeric
                            value={productWeight}
                            handleChange={handleProductWeight}
                            placeholder="Poids du colis"
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
        </Flex_col_s_s>
    )
}

export default Stock;

