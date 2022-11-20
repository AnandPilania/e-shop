import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Toggle from '../elements/toggle/toggle';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';
import Flex_col_s_s from '../elements/container/flex_col_s_s';

const Price = () => {

    const [productProfit, setProductProfit] = useState('');
    const [productMargin, setProductMargin] = useState('');
    const { productForm, setProductForm } = useContext(AppContext);


    const handleProductPrice = (e) => {
        setProductForm({ ...productForm, productPrice: e.target.value });
    }

    // calcul le prix réduit si on change productForm.productPrice ou promoType
    useEffect(() => {
        // if already productForm.promoApplied exist then re-calcul productForm.reducedProductPrice
        if (productForm.promoApplied != '' && productForm.productPrice != '') {
            reCalculPromoApplied();
        }
    }, [productForm.productPrice, productForm.promoType]);

    // calcul le bénéfice en €/$ et la marge en %
    useEffect(() => {
        let profit = productForm.reducedProductPrice == '' ? productForm.productPrice - productForm.productCost : productForm.reducedProductPrice - productForm.productCost;
        productForm.productPrice != '' && setProductProfit(profit.toFixed(2));
        productForm.productCost != '' && setProductMargin(((profit / productForm.productCost) * 100).toFixed(2));
        if (productForm.productPrice == '') {
            setProductProfit('');
            setProductMargin('');
        }
    }, [productForm.productPrice, productForm.reducedProductPrice, productForm.productCost]);


    const handlePromoProductPrice = (e) => {
        setProductForm({ ...productForm, promoApplied: e.target.value });
        let reducedPrice;
        if (productForm.promoType == "%") {
            reducedPrice = (productForm.productPrice / 100) * (100 - e.target.value);
        } else {
            reducedPrice = productForm.productPrice - e.target.value;
        }
        setProductForm({ ...productForm, reducedProductPrice: reducedPrice.toFixed(2) });
    }

    const handleReducedProductPrice = (e) => {
        let priceReduced = e.target.value;
        if (productForm.promoType == "%") {
            setProductForm({ ...productForm, promoApplied: (priceReduced / productForm.productPrice) * 100 });
        } else {
            setProductForm({ ...productForm, promoApplied: productForm.productPrice - priceReduced });
        }
        setProductForm({ ...productForm, reducedProductPrice: priceReduced });
    }

    // toggle between % and € to calcul reduction
    const handlePromoType = (typePromo) => {
        setProductForm({ ...productForm, promoType: typePromo });
        setProductForm({ ...productForm, promoApplied: '' });
        setProductForm({ ...productForm, reducedProductPrice: '' });
    }

    const reCalculPromoApplied = () => {
        let reducedPrice;
        if (productForm.promoType == "%") {
            reducedPrice = (productForm.productPrice / 100) * (100 - productForm.promoApplied);
        } else {
            reducedPrice = productForm.productPrice - productForm.promoApplied;
        }
        setProductForm({ ...productForm, reducedProductPrice: reducedPrice.toFixed(2) });
    }

    const handleProductCost = (e) => {
        setProductForm({ ...productForm, productCost: e.target.value });
    }


    const handleIsShowPromoProduct = () => {
        setProductForm({
            ...productForm,
            promoApplied: '',
            promoType: '%',
            isShowPromoProduct: !productForm.isShowPromoProduct,
        });
    }
    useEffect(() => {
        if (!productForm.isShowPromoProduct) {
            setProductForm({ ...productForm, reducedProductPrice: productForm.productPrice });
        } else {
            setProductForm({ ...productForm, reducedProductPrice: '' });
        }
    }, [productForm.isShowPromoProduct]);



    return (
        <Flex_col_s_s>
            <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>
                {/* price */}
                <div className='col-span-2 flex flex-col justify-start items-start mb-2.5'>
                    <div className='w-full flex'>
                        <Label label="Prix" />
                        <span className='text-red-600'>*</span>
                    </div>
                    <div className={`w-full rounded-md ${productForm.isShowPromoProduct && productForm.productPrice == '' && "border-2 border-red-600"}`}>
                        <InputNumeric
                            id="inputPriceProduct19822"
                            value={!!productForm.productPrice ? productForm.productPrice : ''}
                            handleChange={handleProductPrice}
                            placeholder=""
                            step=".01"
                            min="0"
                            max="9999999999"
                            css="rounded-md"
                        />
                    </div>
                    {productForm.isShowPromoProduct && productForm.productPrice == '' &&
                        <span
                            className='text-sm font-semiblod text-red-600 mt-1'>
                            Ce champ est requis
                        </span>}
                </div>

                {/* toggle */}
                <div className='col-span-2 flex flex-col justify-start items-start my-2'>
                    <Toggle
                        id="promo_product_19822"
                        isChecked={productForm.isShowPromoProduct}
                        change={handleIsShowPromoProduct}
                        label="Faire une promotion"
                    />
                </div>

                {productForm.isShowPromoProduct &&
                    <div className='w-full col-span-2 mb-6'>
                        {/* réduction */}
                        <div className='w-full flex flex-col justify-start items-start mb-4'>
                            <Label label="Réduction" />
                            <div className='w-full flex flex-row justify-start items-center'>
                                <div className='w-6/12 flex justify-start items-center'>
                                    <InputNumeric
                                        id="inputReduction19822"
                                        value={!!productForm.promoApplied ? productForm.promoApplied : ''}
                                        handleChange={handlePromoProductPrice}
                                        placeholder=""
                                        step=".01"
                                        min="0"
                                        max="9999999999"
                                        css="rounded-l-md"
                                    />
                                    <div className='h-10 flex flex-row justify-center items-center border-y border-r border-gray-300 rounded-r-md bg-gray-50'>
                                        <span
                                            className="w-10 h-10 flex flex-row justify-center items-center rounded-r-md text-gray-700 font-semibold"
                                        >
                                            {productForm.promoType == "€" ? "€" : "%"}
                                        </span>
                                    </div>
                                </div>
                                <div className='h-8 px-1 ml-2 flex flex-row justify-center items-center border border-gray-300 rounded-r-md bg-white'>
                                    {/* % button */}
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${productForm.promoType != "%" && "hover:bg-indigo-300"} hover:text-white text-base font-semibold cursor-pointer mr-1 ${productForm.promoType == "%" ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}
                                        onClick={() => handlePromoType("%")}
                                    >%</span>
                                    {/* € button */}
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${productForm.promoType != "€" && "hover:bg-indigo-300"} hover:text-white text-base font-semibold cursor-pointer ${productForm.promoType == "€" ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}
                                        onClick={() => handlePromoType("€")}
                                    >€</span>
                                </div>
                            </div>
                        </div>
                        {/* Prix réduit */}
                        <div className='w-full flex flex-col justify-start items-start'>
                            <Label label="Prix après réduction" />
                            <InputNumeric
                                id="inputReducedPrice19822"
                                value={!!productForm.reducedProductPrice ? productForm.reducedProductPrice : ''}
                                handleChange={handleReducedProductPrice}
                                placeholder=""
                                step=".01"
                                min="0"
                                max="9999999999"
                                css="rounded-md"
                            />
                        </div>
                    </div>
                }

                {/* cost */}
                <div className='w-full col-span-2'>
                    <Label label="Prix d'achat pour un article" />
                    <div className='w-full'>
                        <InputNumeric
                            id="inputCost19822"
                            value={!!productForm.productCost ? productForm.productCost : ''}
                            handleChange={handleProductCost}
                            placeholder=""
                            step=".01"
                            min="0"
                            max="9999999999"
                            css="rounded-md"
                        />
                    </div>
                </div>
                <span className='col-span-2 text-[13px] leading-4 mt-[-5px] mb-1 p-0'>Cette information ne sera pas visible par les clients</span>

                {/* benefit */}
                <div className='w-full'>
                    <Label label="Bénéfice" />
                    <div className='w-full flex flex-row justify-start items-center'>
                        <span className="flex flex-row justify-start items-center bg-gray-50 w-full h-10 pl-2 border border-gray-300 text-gray-500 text-sm rounded-l-md caret-transparent font-semibold">
                            {productProfit}
                        </span>
                        <span className='min-w-[40px] h-10 flex flex-row justify-center items-center border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700 caret-transparent font-semibold'>
                            €
                        </span>
                    </div>
                </div>
                {/* margin */}
                <div className='w-full'>
                    <Label label="Marge" />
                    <div className='w-full flex flex-row justify-start items-center'>
                        <span className="flex flex-row justify-start items-center bg-gray-50 w-full h-10 pl-2 border border-gray-300 text-gray-500 text-sm rounded-l-md caret-transparent font-semibold">
                            {productForm.productCost != '' && productMargin}
                        </span>
                        <span className='min-w-[40px] h-10 flex flex-row justify-center items-center border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-gray-700  caret-transparent font-semibold'>
                            %
                        </span>
                    </div>
                </div>
            </div>
        </Flex_col_s_s>
    )
}

export default Price;

