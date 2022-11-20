import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectMeasureUnit from './selectMeasureUnit';
import Tooltip from '../elements/tooltip';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const Stock = () => {

    const [placeholder, setPlaceholder] = useState('0');
    const [toggleSelect, setToggleSelect] = useState(false);

    const { productForm, setProductForm } = useContext(AppContext);

    useEffect(() => {
        let inputStock = document.getElementById('inputStock');
        if (inputStock != null) inputStock.style.backgroundColor = '#ffffff';
    }, []);

    const handleProductStock = (e) => {
        setProductForm({ ...productForm, productStock: e.target.value });
    }

    const handleProductStockOnFocus = () => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox11922');
        unlimitedStockCheckbox.checked = false;

        if (productForm.unlimited) {
            setProductForm({
                ...productForm,
                unlimited: false
            });
            setPlaceholder('0');
            let inputStock = document.getElementById('inputStock');
            if (inputStock != null) inputStock.style.backgroundColor = '#ffffff';
        }
    }

    const handleUnlimitedStock = () => {
        if (!productForm.unlimited) {
            let inputStock = document.getElementById('inputStock');
            if (inputStock != null) inputStock.style.backgroundColor = '#f9fafb';
            setPlaceholder('Illimité');
        } else {
            let inputStock = document.getElementById('inputStock');
            if (inputStock != null) inputStock.style.backgroundColor = '#ffffff';
            setPlaceholder('0');
        }
        setProductForm({
            ...productForm,
            productStock: '',
            unlimited: !productForm.unlimited
        });
    }

    const handleCodeProduct = (e) => {
        setProductForm({
            ...productForm,
            productCode: e.target.value,
        });
    }

    const handleProductParcelWeight = (e) => {
        setProductForm({ ...productForm, productParcelWeight: e.target.value });
    }

    return (
        <Flex_col_s_s>
            <div className='w-full h-auto grid gap-x-4 grid-cols-2 justify-start items-center'
            >
                <div className='flex flex-col justify-start items-start mb-2.5'
                >
                    {/* stock */}
                    <Label label="Stock" />
                    <div
                        className='flex flex-rox justify-start items-center w-full'>
                        <InputNumeric
                            id='inputStock'
                            value={!!productForm.productStock ? productForm.productStock : ''}
                            handleChange={handleProductStock}
                            handleClick={handleProductStockOnFocus}
                            placeholder={placeholder}
                            step="1"
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />

                        <span
                            id="checkboxStockUnlimited11922"
                            className='flex flex-rox justify-center items-center w-14 h-10 border-y border-r  border-gray-300 rounded-r-md px-2.5 cursor-pointer caret-transparent'
                            onClick={handleUnlimitedStock}
                        >
                            <input
                                className='w-4 h-4 caret-transparent cursor-pointer'
                                id='unlimitedStockCheckbox11922'
                                type="checkbox"
                                checked={productForm.unlimited}
                                onChange={handleUnlimitedStock} />
                            <TooltipWithoutIcon id="checkboxStockUnlimited11922" idimg="unlimitedStockCheckbox11922" widthTip={184}>
                                Mettre le stock à illimité
                            </TooltipWithoutIcon>
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
                        value={!!productForm.productCode ? productForm.productCode : ''}
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
                            value={!!productForm.productParcelWeight ? productForm.productParcelWeight : ''}
                            handleChange={handleProductParcelWeight}
                            placeholder="Poids du colis"
                            step={productForm.productParcelWeightMeasureUnit == 'kg' ? "1" : "0.01"}
                            min="0"
                            max="9999999999"
                            css="rounded-l-md"
                        />
                        <span
                            className='w-16 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-white text-gray-500 text-sm font-semibold rounded-r-md'
                        >
                            <SelectMeasureUnit
                                list={['gr', 'kg']}
                                itemSelected={!!productForm.productParcelWeightMeasureUnit ? productForm.productParcelWeightMeasureUnit : 'gr'}
                                setItemSelected={setProductForm}
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

