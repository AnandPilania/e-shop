import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Toggle from '../elements/toggle/toggle';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';


const Price = () => {

    const [isShowPromoProduct, setIsShowPromoProduct] = useState(false);
    const [promoType, setPromoType] = useState('%');
    const [productProfit, setProductProfit] = useState('');
    const [productMargin, setProductMargin] = useState('');

    const { productPrice, setProductPrice, promoApplied, setPromoApplied, productCost, setProductCost, reducedProductPrice, setReducedProductPrice } = useContext(AppContext);


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
        setProductProfit(profit.toFixed(2));
        setProductMargin(((profit / productCost) * 100).toFixed(2));
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
        setReducedProductPrice(productPrice);
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
        <div className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            <h3 className='w-full text-left mb-[15px] font-semibold text-[16px]'>Prix</h3>



            <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>
                {/* price */}
                <div className='col-span-2 flex flex-col justify-start items-start mb-2.5'>
                    <div className='w-full flex'>
                        <Label label="Prix" />
                        <span className='text-red-600'>*</span>
                    </div>
                    <div className={`w-full rounded-md ${isShowPromoProduct && productPrice == '' && "border-2 border-red-700"}`}>
                        <InputNumeric
                            id="inputPriceProduct19822"
                            value={productPrice}
                            handleChange={handleProductPrice}
                            placeholder="0.00"
                            step=".01"
                            min="0"
                            max="9999999999"
                            css="rounded-md"
                        />
                    </div>
                    {isShowPromoProduct && productPrice == '' &&
                        <span
                            className='text-sm font-semiblod text-red-700 mt-1'>
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
                    <div className='w-full col-span-2'>
                        {/* réduction */}
                        <div className='w-full flex flex-col justify-start items-start mb-[10px]'>
                            <Label label="Réduction" />
                            <div className='w-full flex flex-row justify-start items-center'>
                                <InputNumeric
                                    id="inputReduction19822"
                                    value={promoApplied}
                                    handleChange={handlePromoProductPrice}
                                    placeholder="0.00"
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
                                <div className='h-8 px-1 ml-2 flex flex-row justify-center items-center border border-gray-300 rounded-r-md bg-white'>
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${promoType != "%" && "hover:bg-indigo-400"} hover:text-white text-base font-semibold cursor-pointer mr-1 ${promoType == "%" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-700"}`}
                                        onClick={() => handlePromoType("%")}
                                    >%</span>
                                    <span
                                        className={`w-6 h-6 flex flex-row justify-center items-center rounded-md ${promoType != "€" && "hover:bg-indigo-400"} hover:text-white text-base font-semibold cursor-pointer ${promoType == "€" ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-700"}`}
                                        onClick={() => handlePromoType("€")}
                                    >€</span>
                                </div>
                            </div>
                        </div>
                        {/* Prix réduit */}
                        <div className='w-full flex flex-col justify-start items-start mb-[10px]'>
                            <Label label="Prix après réduction" />
                            <InputNumeric
                                id="inputReducedPrice19822"
                                value={reducedProductPrice}
                                handleChange={handleReducedProductPrice}
                                placeholder="0.00"
                                step=".01"
                                min="0"
                                max="9999999999"
                                css="rounded-md"
                            />
                        </div>
                    </div>
                }

                {/* cost */}
                <div className='w-full col-span-2 mt-2'>
                    <Label label="Prix d'achat pour un article" />
                    <div className='w-6/12'>
                        <InputNumeric
                            id="inputCost19822"
                            value={productCost}
                            handleChange={handleProductCost}
                            placeholder="0.00"
                            step=".01"
                            min="0"
                            max="9999999999"
                            css="rounded-md"
                        />
                    </div>
                </div>

                {/* benefit */}
                <div className='w-full'>
                    <Label label="Bénéfice" />
                    <InputNumeric
                        id="inputProfit19822"
                        value={productProfit}
                        handleChange={() => { }}
                        placeholder="0.00"
                        step=".01"
                        min="0"
                        max="9999999999"
                        css="rounded-md"
                    />
                </div>
                {/* margin */}
                <div className='w-full'>
                    <Label label="Marge bénéficiaire" />
                    <InputNumeric
                        id="inputMargin19822"
                        value={productMargin}
                        handleChange={() => { }}
                        placeholder="0.00"
                        step=".01"
                        min="0"
                        max="9999999999"
                        css="rounded-md"
                    />
                </div>
                <span className='col-span-2 text-[14px] mt-[-3px]'>Cette information ne sera pas visible par les clients</span>


            </div>
        </div>
    )
}

export default Price;

