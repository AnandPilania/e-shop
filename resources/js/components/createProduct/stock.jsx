import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectMeasureUnit from './selectMeasureUnit';
import Tooltip from '../elements/tooltip';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';


const Stock = () => {

    const [placeholder, setPlaceholder] = useState('Illimité');
    const [toggleSelect, setToggleSelect] = useState(false);

    const { productStock, setProductStock, unlimited, setUnlimited, productCode, setProductCode, productParcelWeight, setProductParcelWeight, productParcelWeightMeasureUnit, setProductParcelWeightMeasureUnit } = useContext(AppContext);

    useEffect(() => {
        let inputStock = document.getElementById('inputStock');
        inputStock.style.backgroundColor = '#f9fafb';
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
            inputStock.style.backgroundColor = '#f9fafb';
            setUnlimited(!unlimited);
            setProductStock('');
            setPlaceholder('Illimité');
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

    const handleProductParcelWeight = (e) => {
        setProductParcelWeight(e.target.value);
    }

    return (
        <Flex_col_s_s>
            <div className='w-full h-auto grid gap-x-4 grid-cols-2 justify-start items-center'
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
                            className='flex flex-rox justify-center items-center w-14 h-10 border-y border-r  border-gray-300 rounded-r-md px-2.5 cursor-pointer caret-transparent'
                            onClick={handleUnlimitedStock}
                        >
                            <input
                                className='w-4 h-4 caret-transparent cursor-pointer'
                                id='unlimitedStockCheckbox'
                                type="checkbox"
                                checked={unlimited}
                                onChange={handleUnlimitedStock} />
                        </span>
                    </div>
                </div>

                {/* sku */}
                <div className='flex flex-col justify-start items-start mb-[10px]'>
                    <div
                        id='SKUProduct3922'
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="SKU" />
                        <Tooltip id='SKUProduct3922' widthTip={300}>
                            Une SKU, (unité de gestion des stocks), est un code permettant d'identifier un article de manière unique. Si vous ne l'indiquez pas, un code sera généré automatiquement.
                            <br></br>
                            <a href="http://127.0.0.1:8000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <InputNumeric
                        id='inputSku17822'
                        value={productCode}
                        handleChange={handleCodeProduct}
                        placeholder=""
                        step="1"
                        min="0"
                        css="rounded-md"
                    />
                </div>

                {/* weight */}
                <div className='w-full col-span-2 flex flex-col justify-start items-start my-2.5'>
                    <div
                        id='parcelWeightProduct3922'
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Poids" />
                        <Tooltip id='parcelWeightProduct3922' widthTip={300}>
                            Poids de l'article avec son emballage
                        </Tooltip>
                    </div>
                    <div
                        className='w-full flex flex-row justify-start items-center'
                    >
                        <InputNumeric
                            value={productParcelWeight}
                            handleChange={handleProductParcelWeight}
                            placeholder="Poids du colis"
                            step={productParcelWeightMeasureUnit == 'kg' ? "1" : "0.01"}
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />
                        <span
                            className='w-16 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-white text-gray-500 text-sm font-semibold rounded-r-md'
                        >
                            <SelectMeasureUnit
                                list={['gr', 'kg']}
                                itemSelected={productParcelWeightMeasureUnit}
                                setItemSelected={setProductParcelWeightMeasureUnit}
                                toggleSelect={toggleSelect}
                                setToggleSelect={setToggleSelect}
                                ulUnikId="stockIdUl25822"
                                buttonUnikId="stockIdButton25822"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </Flex_col_s_s>
    )
}

export default Stock;

