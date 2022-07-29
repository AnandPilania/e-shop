import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Flexbox_row_s_c_wrap from '../elements/container/flexbox_row_s_c_wrap';
import Toggle from '../elements/toggle/toggle';
import TvaList from './tvaList';
import AddNewTva from './addNewTva';
import Axios from 'axios';
import ModalSimpleMessage from '../modal/modalSimpleMessage';


const Taxes = () => {

    const [taxeName, setTaxeName] = useState('');
    const [typeTaxe, setTypeTaxe] = useState('%');
    const [taxeValue, setTaxeValue] = useState('');
    const [application, setApplication] = useState('localisation');
    const [activeTab, setActiveTab] = useState(1);
    const [idEditTva, setIdEditTva] = useState(null);
    const [isAddNewTva, setIsAddNewTva] = useState(false);
    const [isShowSaveButton, setIsShowSaveButton] = useState(false);
    const [showModalSimpleMessage, setShowModalSimpleMessage] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [defaultTvaRateId, setDefaultTvaRateId] = useState('');

    const { activeCalculTva, setActiveCalculTva, tvaRateList, setTvaRateList } = useContext(AppContext);

    useEffect(() => {
        getTaxes();
    }, []);


    const getTaxes = () => {
        Axios.get("http://127.0.0.1:8000/getTaxes")
            .then(res => {
                setTvaRateList(res.data);
                let ndx = res.data.findIndex(x => x.is_default == 1);
                if (ndx > -1) {
                    setDefaultTvaRateId(res.data[ndx].id);
                }
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }

    const handleTaxesTabs = (indexTab) => {
        setActiveTab(indexTab);
    }

    const handleName = (e) => {
        setTaxeName(e.target.value);
    }

    const handleTaxeValue = (e) => {
        setTaxeValue(e.target.value);
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

        // charge la liste des tva
        if (activeCalculTva == false) {
            getTaxes();
        }
    }

    const cancelEdit = () => {
        setIdEditTva(null);
        setTaxeName('');
        setTaxeValue('');
        setIsShowSaveButton(false);
    }

    const saveTva = () => {
        if (taxeName.length > 0 && taxeValue.length > 0) {
            let newTva = new FormData;
            newTva.append('taxeName', taxeName);
            newTva.append('taxeValue', taxeValue);

            Axios.post(`http://127.0.0.1:8000/addTaxes`, newTva)
                .then(getTaxes())
                .catch(error => {
                    console.log('Error : ' + error.status);
                });

            setIsAddNewTva(false);
            setIsShowSaveButton(false);
        } else {
            if (taxeName.length == 0) {
                setMessageModal('Le champ nom ne peut pas être vide')
            }
            if (taxeValue.length == 0) {
                setMessageModal('Le champ taux ne peut pas être vide')
            }
            if (taxeName.length == 0 && taxeValue.length == 0) {
                setMessageModal('Les champs nom et taux ne peuvent pas être vides')
            }
            setShowModalSimpleMessage(true)
        }
    }

    const cancelModalSimpleMessage = () => {
        setShowModalSimpleMessage(false);
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


    return (
        <Flex_col_s_s css="my-10">
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

            {/* tva ---------------------------------------------------- */}
            {activeTab == 1 &&
                <Flexbox_row_s_c_wrap>
                    <Toggle
                        id={`toggleTaxes${() => date()}`}
                        isChecked={activeCalculTva}
                        change={() => handleActiveCalculTva()}
                        label="Activer le calcul de la TVA"
                    />

                    {activeCalculTva &&
                        <div className='w-full'>
                            {/* tva Rate List */}
                            <div
                                className='grid grid-cols-[80px_70%_100px_40px_40px] justify-start items-start w-full'
                            >
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-3 rounded-tl-md'
                                >
                                    Défaut
                                </span>
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
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch'>
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch rounded-tr-md'>
                                </span>
                            </div>

                            <TvaList
                                tvaRateList={tvaRateList}
                                cancelEdit={cancelEdit}
                                handleName={handleName}
                                handleTaxeValue={handleTaxeValue}
                                taxeName={taxeName}
                                setTaxeName={setTaxeName}
                                taxeValue={taxeValue}
                                setTaxeValue={setTaxeValue}
                                idEditTva={idEditTva}
                                setIdEditTva={setIdEditTva}
                                setIsAddNewTva={setIsAddNewTva}
                                getTaxes={getTaxes}
                                setIsShowSaveButton={setIsShowSaveButton}
                                defaultTvaRateId={defaultTvaRateId}
                            />

                            <AddNewTva
                                cancelEdit={cancelEdit}
                                handleName={handleName}
                                handleTaxeValue={handleTaxeValue}
                                taxeName={taxeName}
                                taxeValue={taxeValue}
                                isAddNewTva={isAddNewTva}
                                setIsAddNewTva={setIsAddNewTva}
                                isShowSaveButton={isShowSaveButton}
                                setIsShowSaveButton={setIsShowSaveButton}
                                getTaxes={getTaxes}
                            />

                            {/* save */}
                            {isShowSaveButton &&
                                <div className='flex flex-row justify-start items-center w-full pb-10'
                                >
                                    <button
                                        className='flex justify-center py-2 px-6  bg-green-500 text-white font-medium rounded-md'
                                        onClick={() => saveTva()}
                                    >
                                        Enregistrer
                                    </button>
                                </div>}
                        </div>
                    }
                </Flexbox_row_s_c_wrap>}









            {/* autres frais -------------------------------------------*/}
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

            <ModalSimpleMessage
                handleModalCancel={cancelModalSimpleMessage}
                show={showModalSimpleMessage}
            >
                {messageModal}
            </ModalSimpleMessage>
        </Flex_col_s_s>
    );
}

export default Taxes;
