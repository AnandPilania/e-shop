import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Flexbox_row_s_c_wrap from '../elements/container/flexbox_row_s_c_wrap';
import TransporteurForm from './transporterForm';
import Axios from 'axios';
import ModalSimpleMessage from '../modal/modalSimpleMessage';


const Shipping = () => {

    const [transporterName, setTransporterName] = useState('');
    const [typeTransporter, setTypeTransporter] = useState('%');
    const [transporterValue, setTransporterValue] = useState('');
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
        setTransporterName(e.target.value);
    }

    const handleTaxeValue = (e) => {
        setTransporterValue(e.target.value);
    }



    const cancelEdit = () => {
        setIdEditTva(null);
        setTransporterName('');
        setTransporterValue('');
        setIsShowSaveButton(false);
    }

    const saveTva = () => {
        if (transporterName.length > 0 && transporterValue.length > 0) {
            let newTva = new FormData;
            newTva.append('transporterName', transporterName);
            newTva.append('transporterValue', transporterValue);

            Axios.post(`http://127.0.0.1:8000/addTaxes`, newTva)
                .then(getTaxes())
                .catch(error => {
                    console.log('Error : ' + error.status);
                });

            setIsAddNewTva(false);
            setIsShowSaveButton(false);
        } else {
            if (transporterName.length == 0) {
                setMessageModal('Le champ nom ne peut pas être vide')
            }
            if (transporterValue.length == 0) {
                setMessageModal('Le champ taux ne peut pas être vide')
            }
            if (transporterName.length == 0 && transporterValue.length == 0) {
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
            setTypeTransporter('money');
        } else {
            setTypeTransporter('percent');
        }
    }


    return (
        <Flex_col_s_s css="my-10">
            <span className='text-xl font-semibold text=gray-600 my-4'>Shipping</span>
            <div className='w-full border-b border-gray-300 mb-10 pb-2.5'>
                <span
                    className={`text-base font-normal hover:font-medium text=gray-600 pb-3 mr-6 pr-1 cursor-pointer ${activeTab == 1 && "border-b-2 border-indigo-600"}`}
                    onClick={() => handleTaxesTabs(1)}
                >
                    Gérer les transporteurs
                </span>
                <span
                    className={`text-base font-normal hover:font-medium text=gray-600 pb-3 px-1 cursor-pointer ${activeTab == 2 && "border-b-2 border-indigo-600"}`}
                    onClick={() => handleTaxesTabs(2)}
                >
                    Ajouter un transporteur
                </span>
            </div>

            {/* gérer les transporteurs---------------------------------- */}
            {activeTab == 1 &&
                <Flexbox_row_s_c_wrap>
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

                        {/* <TvaList
                            tvaRateList={tvaRateList}
                            cancelEdit={cancelEdit}
                            handleName={handleName}
                            handleTaxeValue={handleTaxeValue}
                            transporterName={transporterName}
                            setTransporterName={setTransporterName}
                            transporterValue={transporterValue}
                            setTransporterValue={setTransporterValue}
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
                            transporterName={transporterName}
                            transporterValue={transporterValue}
                            isAddNewTva={isAddNewTva}
                            setIsAddNewTva={setIsAddNewTva}
                            isShowSaveButton={isShowSaveButton}
                            setIsShowSaveButton={setIsShowSaveButton}
                            getTaxes={getTaxes}
                        /> */}

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
                </Flexbox_row_s_c_wrap>
            }

            {/* ajouter un transporteur---------------------------------*/}
            {activeTab == 2 &&
                <Flexbox_row_s_c_wrap>
                    <div className="py-4">
                        <span className="mb-5 font-semibold text-5">
                            Ajouter un transporteur
                        </span>
                    </div>
                    <TransporteurForm />

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

export default Shipping;
