import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Toggle from '../elements/toggle/toggle';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';
import Flex_col_s_s from '../elements/container/flex_col_s_s';

const Price = () => {

    const [productProfit, setProductProfit] = useState('');
    const [productMargin, setProductMargin] = useState('');

    const { productPrice, setProductPrice, promoApplied, setPromoApplied, productCost, setProductCost, reducedProductPrice, setReducedProductPrice, promoType, setPromoType, isEditProduct, isShowPromoProduct, setIsShowPromoProduct } = useContext(AppContext);


    // useEffect(() => {
    //     if (isEditProduct) {
    //         setPromoType(promoType);
    //         setPromoApplied(promoApplied);
    //         setReducedProductPrice(reducedProductPrice);
    //         setIsShowPromoProduct(true);
    //     }
    // }, [isEditProduct, promoApplied, reducedProductPrice]);
    console.log('isEditProduct--------', isEditProduct)
    console.log('promoApplied--------', promoApplied)
    console.log('reducedProductPrice--------', reducedProductPrice)

    const handleProductPrice = (e) => {
        setProductPrice(e.target.value);
    }

    // calcul le prix réduit si on change productPrice ou promoType
    useEffect(() => {
        // if already promoApplied exist then re-calcul reducedProductPrice
        if (promoApplied != '' && productPrice != '') {
            reCalculPromoApplied();
        }
    }, [productPrice, promoType]);

    // calcul le bénéfice en €/$ et la marge en %
    useEffect(() => {
        let profit = reducedProductPrice == '' ? productPrice - productCost : reducedProductPrice - productCost;
        productPrice != '' && setProductProfit(profit.toFixed(2));
        productCost != '' && setProductMargin(((profit / productCost) * 100).toFixed(2));
        if (productPrice == '') {
            setProductProfit('');
            setProductMargin('');
        }
    }, [productPrice, reducedProductPrice, productCost]);


    const handlePromoProductPrice = (e) => {
        setPromoApplied(e.target.value);
        let reducedPrice;
        if (promoType == "%") {
            reducedPrice = (productPrice / 100) * (100 - e.target.value);
        } else {
            reducedPrice = productPrice - e.target.value;
        }
        setReducedProductPrice(reducedPrice.toFixed(2));
    }

    const handleReducedProductPrice = (e) => {
        let priceReduced = e.target.value;
        if (promoType == "%") {
            setPromoApplied((priceReduced / productPrice) * 100)
        } else {
            setPromoApplied(productPrice - priceReduced);
        }
        setReducedProductPrice(priceReduced);
    }

    // toggle between % and € to calcul reduction
    const handlePromoType = (typePromo) => {
        setPromoType(typePromo);
        setPromoApplied('');
        setReducedProductPrice('');
    }

    const reCalculPromoApplied = () => {
        let reducedPrice;
        if (promoType == "%") {
            reducedPrice = (productPrice / 100) * (100 - promoApplied);
        } else {
            reducedPrice = productPrice - promoApplied;
        }
        setReducedProductPrice(reducedPrice.toFixed(2));
    }

    const handleProductCost = (e) => {
        setProductCost(e.target.value);
    }

    const handleIsShowPromoProduct = () => {
        setIsShowPromoProduct(!isShowPromoProduct);
        setPromoType("%");
        setPromoApplied('');
        setReducedProductPrice(productPrice);
    }





    return (
        <Flex_col_s_s>
            <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>
                {/* price */}
                <div className='col-span-2 flex flex-col justify-start items-start mb-2.5'>
                    <div className='w-full flex'>
                        <Label label="Prix" />
                        <span className='text-red-600'>*</span>
                    </div>
                    <div className={`w-full rounded-md ${isShowPromoProduct && productPrice == '' && "border-2 border-red-600"}`}>
                        <InputNumeric
                            id="inputPriceProduct19822"
                            value={!!productPrice ? productPrice : ''}
                            handleChange={handleProductPrice}
                            placeholder=""
                            step=".01"
                            min="0"
                            max="9999999999"
                            css="rounded-md"
                        />
                    </div>
                    {isShowPromoProduct && productPrice == '' &&
                        <span
                            className='text-sm font-semiblod text-red-600 mt-1'>
                            Ce champ est requis
                        </span>}
                </div>

                {/* toggle */}
                <div className='col-span-2 flex flex-col justify-start items-start my-2'>
                    <Toggle
                        id="promo_product_19822"
                        isChecked={isShowPromoProduct}
                        change={handleIsShowPromoProduct}
                        label="Faire une promotion"
                    />
                </div>

                {isShowPromoProduct &&
                    <div className='w-full col-span-2 mb-6'>
                        {/* réduction */}
                        <div className='w-full flex flex-col justify-start items-start mb-4'>
                            <Label label="Réduction" />
                            <div className='w-full flex flex-row justify-start items-center'>
                                <div className='w-6/12 flex justify-start items-center'>
                                    <InputNumeric
                                        id="inputReduction19822"
                                        value={!!promoApplied ? promoApplied : ''}
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
                                            {promoType == "€" ? "€" : "%"}
                                        </span>
                                    </div>
                                </div>
                                <div className='h-8 px-1 ml-2 flex flex-row justify-center items-center border border-gray-300 rounded-r-md bg-white'>
                                    {/* % button */}
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${promoType != "%" && "hover:bg-indigo-300"} hover:text-white text-base font-semibold cursor-pointer mr-1 ${promoType == "%" ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}
                                        onClick={() => handlePromoType("%")}
                                    >%</span>
                                    {/* € button */}
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${promoType != "€" && "hover:bg-indigo-300"} hover:text-white text-base font-semibold cursor-pointer ${promoType == "€" ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}
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
                                value={!!reducedProductPrice ? reducedProductPrice : ''}
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
                            value={!!productCost ? productCost : ''}
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
                            {productCost != '' && productMargin}
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

