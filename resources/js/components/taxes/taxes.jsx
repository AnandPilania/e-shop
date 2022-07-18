import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Flexbox_row_s_c_wrap from '../elements/container/flexbox_row_s_c_wrap';
import Toggle from '../elements/toggle/toggle';
import Axios from 'axios';


const Taxes = () => {

    const [taxeName, setTaxeName] = useState('');
    const [typeTaxe, setTypeTaxe] = useState('%');
    const [taxeValue, setTaxeValue] = useState();
    const [application, setApplication] = useState('localisation');
    const [activeTab, setActiveTab] = useState(1);
    const [tvaRateList, setTvaRateList] = useState([]);
    const [idEditTva, setIdEditTva] = useState(null);

    const { activeCalculTva, setActiveCalculTva } = useContext(AppContext);


    useEffect(() => {
        Axios.get("http://127.0.0.1:8000/getTaxes")
            .then(res => {
                setTvaRateList(res.data);
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }, [])
    console.log('tvaRateList   ', tvaRateList)

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


    // active ou désactive le calcul de la tva
    const handleActiveCalculTva = () => {
        let config_formData = new FormData;
        config_formData.append('param', "activation_calcul_tva");
        config_formData.append('value', activeCalculTva == true ? "0" : "1");

        Axios.post(`http://127.0.0.1:8000/updateConfig`, config_formData)
            .catch(error => {
                console.log('Error : ' + error.status);
            });
        setActiveCalculTva(!activeCalculTva);
    }

    const handleEditTva = (id) => {
        setIdEditTva(id);
    }

    const handleDeleteTva = (id) => {
    
    }

    return (
        <div
            className="w-full my-10 flex flex-col justify-start items-start"
        >
            <Flex_col_s_s>
                <span className='text-xl font-semibold text=gray-600 my-4'>Taxes</span>
                <div className='w-full border-b border-gray-300 mb-10 pb-2.5'>
                    <span
                        className={`text-base font-normal hover:font-medium text=gray-600 pb-3 mr-6 pr-1 cursor-pointer ${activeTab == 1 && "border-b-2 border-indigo-600"}`}
                        onClick={() => handleTaxesTabs(1)}
                    >
                        TVA
                    </span>
                    <span
                        className={`text-base font-normal hover:font-medium text=gray-600 pb-3 px-1 cursor-pointer ${activeTab == 2 && "border-b-2 border-indigo-600"}`}
                        onClick={() => handleTaxesTabs(2)}
                    >
                        Autres frais
                    </span>
                </div>

                {/* tva */}
                {activeTab == 1 &&
                    <Flexbox_row_s_c_wrap>
                        <div className='w-full h-auto flex flex-row flex-wrap justify-start items-center mb-5'>
                            <Toggle
                                isChecked={activeCalculTva}
                                change={() => handleActiveCalculTva()}
                            />
                            <label className='m-0 ml-2 p-0'>
                                Activer le calcul de la TVA
                            </label>
                        </div>



                        {/* tva Rate List */}
                        <div
                            className='grid grid-cols-[70%_100px_40px_40px] justify-start items-start w-full'
                        >
                            <span
                                className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 rounded-tl-md'
                            >
                                Nom
                            </span>
                            <span
                                className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2'
                            >
                                Taux
                            </span>
                            <span
                                className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch'></span>
                            <span
                                className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch rounded-tr-md'></span>
                        </div>

                        {tvaRateList?.length > 0 &&
                            tvaRateList.map(itemTva =>
                                <div
                                    key={itemTva.id}
                                    className='grid grid-cols-[70%_100px_40px_40px] justify-start items-center w-full'
                                >
                                    {idEditTva != itemTva.id &&
                                        <div className='w-full'>
                                            <span
                                                className='text.sm w-full border-b border-gray-200 py-3 pl-2'
                                            >
                                                {itemTva.name}
                                            </span>
                                            <span
                                                className='text.sm w-full border-b border-gray-200 py-3 pl-2'
                                            >
                                                {itemTva.tva_rate}
                                            </span>
                                        </div>
                                    }
                                    {/* inputs */}
                                    {idEditTva == itemTva.id &&
                                        <div className='w-full'>
                                            <div className='flex flex-col justify-start items-start w-full'>
                                                <input className="w-full h-10 border border-gray-300 rounded-md pl-2.5 bg-white text-base"
                                                    type="text"
                                                    onChange={handleName}
                                                    value={taxeName}
                                                    placeholder="Exemple. TVA à taux réduit -> 6%"
                                                />
                                            </div>

                                            <div className='flex flex-col justify-start items-start w-full'>
                                                <div
                                                    className='flex flex-rox justify-start items-center w-full'>
                                                    <input
                                                        type="number"
                                                        step={0.01}
                                                        onChange={handleTaxeValue}
                                                        value={taxeValue}
                                                        className="w-full h-10 border border-gray-300 rounded-l-md pl-2.5 bg-white text-base"
                                                        min="0" max="9999999999"
                                                        placeholder="-"
                                                    />
                                                    <span
                                                        className="w-auto h-10 px-3 border-y border-r border-gray-300 rounded-r-md bg-gray-50 text-base flex justify-center items-center"
                                                    >
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {/* icons ->  edit - delete */}
                                    <div
                                        className="text.sm w-full border-b border-gray-200 py-3 pl-2"
                                    >
                                        <span 
                                        className="w-6 h-6 flex flex-row justify-center items-center bg-gray-100"
                                        onClick={() => handleEditTva(itemTva.id)}
                                        >
                                            <img
                                                src={window.location.origin + '/images/icons/pencil.svg'}
                                                className="h-4 w-4" />
                                        </span>
                                    </div>
                                    <div
                                        className="text.sm w-full border-b border-gray-200 py-3 pl-2"
                                    >
                                        <span 
                                        className="w-6 h-6 flex flex-row justify-center items-center bg-red-600"
                                        onClick={() => handleDeleteTva(itemTva.id)}
                                        >
                                            <img
                                                src={window.location.origin + '/images/icons/x-white.svg'}
                                                className="h-5 w-5" />
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    </Flexbox_row_s_c_wrap>}


                {/* autres frais */}
                {activeTab == 2 &&
                    <Flexbox_row_s_c_wrap>
                        <div className="py-4">
                            <span className="mb-5 font-semibold text-5">
                                Ajouter une taxe
                            </span>
                        </div>

                        <div className='grid grid-cols-[200px_200px_200px] gap-6 justify-start items-start w-full'>

                            <div className='flex flex-col justify-start items-start w-full'>
                                <label>Nom</label>
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
                    </Flexbox_row_s_c_wrap>}
            </Flex_col_s_s>
        </div>
    );
}

export default Taxes;
