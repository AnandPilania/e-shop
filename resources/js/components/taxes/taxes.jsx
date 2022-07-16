import React, { useState } from 'react';
import Flex_col_s_s from '../elements/container/flex_col_s_s';

const Taxes = () => {

    const [taxeName, setTaxeName] = useState('');
    const [typeTaxe, setTypeTaxe] = useState('%');
    const [taxeValue, setTaxeValue] = useState();
    const [application, setApplication] = useState('localisation');
    const [activeTab, setActiveTab] = useState(1);

    const handleName = (e) => {
        setTaxeName(e.target.value);
    }

    const handleTaxeValue = (e) => {
        setTaxeValue(e.target.value);
    }

    const handleApplication = (e) => {
        if (e.target.value == 'product') {
            setApplication('product');
        } else if (e.target.value == 'localisation') {
            setApplication('localisation');
        }
    }

    const handleTypeTaxe = (e) => {
        if (e.target.value == '€') {
            setTypeTaxe('money');
        } else {
            setTypeTaxe('percent');
        }
    }

    const handleTaxesTabs = (indexTab) => {
        setActiveTab(indexTab);
    }


    return (
        <div
            className="w-full my-10 flex flex-col justify-start items-start"
        >
            <Flex_col_s_s>
                <span className='text-xl font-semibold text=gray-600 my-4'>Taxes</span>
                <div className='w-full border-b border-gray-300 mb-10 pb-2.5'>
                    <span
                        className={`text-base font-normal text=gray-600 pb-3 mr-6 pr-1 cursor-pointer ${activeTab == 1 && "border-b-2 border-indigo-600"}`}
                        onClick={() => handleTaxesTabs(1)}
                    >
                        TVA
                    </span>
                    <span
                        className={`text-base font-normal text=gray-600 pb-3 px-1 cursor-pointer ${activeTab == 2 && "border-b-2 border-indigo-600"}`}
                        onClick={() => handleTaxesTabs(2)}
                    >
                        Autres frais
                    </span>
                </div>
                <div className="py-4">
                    <span className="mb-5 font-semibold text-5">
                        TVA
                    </span>
                </div>

                <div className='grid grid-cols-[200px_200px_200px] gap-6 justify-start items-start w-full'>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Nom*</label>
                        <input className="w-full h-10 border border-gray-300 rounded-md pl-2.5 bg-white text-base"
                            type="text"
                            onChange={handleName}
                            value={taxeName}
                            placeholder="Ex. Frais de douane, Recyclage, ..."
                        />
                    </div>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Taux</label>
                        <div
                            className='flex flex-rox justify-start items-center w-full'>
                            <input
                                type="number"
                                step={0.01}
                                onChange={handleTaxeValue}
                                value={taxeValue}
                                className="w-full h-10 border border-gray-300 rounded-l-md pl-2.5 bg-white text-base"
                                min="0" max="9999999999"
                                placeholder="Indiquer un taux"
                            />
                            <select
                                onChange={handleTypeTaxe}
                                className="w-16 h-10 pl-2 border-y border-r  border-gray-300 rounded-r-md bg-white text-base">
                                <option value="%" title="Le taux de la taxe représente un pourcentage du prix">%</option>
                                <option value="€" title="Le taux de la taxe représente un montant fixe">€</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Appliquable sur</label>
                        <select
                            onChange={handleApplication}
                            className="w-full h-10 pl-2.5 border  border-gray-300 rounded-md bg-white text-base">
                            <option value="localisation">La localisation</option>
                            <option value="product">Le produit</option>
                        </select>
                    </div>

                </div>
            </Flex_col_s_s>



            <Flex_col_s_s>
                <div className="py-4">
                    <span className="mb-5 font-semibold text-5">
                        Ajouter une taxe
                    </span>
                </div>

                <div className='grid grid-cols-[200px_200px_200px] gap-6 justify-start items-start w-full'>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Nom*</label>
                        <input className="w-full h-10 border border-gray-300 rounded-md pl-2.5 bg-white text-base"
                            type="text"
                            onChange={handleName}
                            value={taxeName}
                            placeholder="Ex. Frais de douane, Recyclage, ..."
                        />
                    </div>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Taux</label>
                        <div
                            className='flex flex-rox justify-start items-center w-full'>
                            <input
                                type="number"
                                step={0.01}
                                onChange={handleTaxeValue}
                                value={taxeValue}
                                className="w-full h-10 border border-gray-300 rounded-l-md pl-2.5 bg-white text-base"
                                min="0" max="9999999999"
                                placeholder="Indiquer un taux"
                            />
                            <select
                                onChange={handleTypeTaxe}
                                className="w-16 h-10 pl-2 border-y border-r  border-gray-300 rounded-r-md bg-white text-base">
                                <option value="%" title="Le taux de la taxe représente un pourcentage du prix">%</option>
                                <option value="€" title="Le taux de la taxe représente un montant fixe">€</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col justify-start items-start w-full'>
                        <label>Appliquable sur</label>
                        <select
                            onChange={handleApplication}
                            className="w-full h-10 pl-2.5 border  border-gray-300 rounded-md bg-white text-base">
                            <option value="localisation">La localisation</option>
                            <option value="product">Le produit</option>
                        </select>
                    </div>

                </div>
            </Flex_col_s_s>
        </div>
    );
}

export default Taxes;
