import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';


const AdvancedMode = ({ deliveryZoneList, setDeliveryZoneList, IdDeliveryZones }) => {

    const [modeCondition, setModeCondition] = useState({
        criteria: 'weight',
        min_weight: '',
        max_weight: '',
        min_price: '',
        max_price: '',
        shipping_price: 0
    });
    const [arrOfModeConditions, setArrOfModeConditions] = useState([{
        criteria: 'weight',
        min_weight: 0,
        max_weight: '',
        min_price: 0,
        max_price: '',
        shipping_price: 0
    }]);
    const [modeName, setModeName] = useState('');
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [toggleSelectCriteria, setToggleSelectCriteria] = useState(false);
    const [destinationAdvanced, setDestinationAdvanced] = useState([]);
    const [isDirtyAdvancedShippingForm, setIsDirtyAdvancedShippingForm] = useState(false);
    const [criteria, setCriteria] = useState('weight');
    const [showDeliveryPriceConditions, setShowDeliveryPeiceConditions] = useState(false);

    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();


    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case modeName.length > 0: setIsDirtyAdvancedShippingForm(true);
                break;
            case modeCondition.min_weight.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case modeCondition.max_weight.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case modeCondition.min_price.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case modeCondition.max_price.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case modeCondition.shipping_price.length > 0: setIsDirtyAdvancedShippingForm(true);
                break;
            default: setIsDirtyAdvancedShippingForm(false);
        }
    }, [modeCondition]);

    const checkIfIsDirty = () => {
        if (
            modeName != '' ||
            modeCondition.min_weight != '' ||
            modeCondition.max_weight != '' ||
            modeCondition.min_price != '' ||
            modeCondition.max_price != '' ||
            modeCondition.shipping_price != 0
        ) {
            return true;
        } else {
            return false;
        }
    }


    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);

    const handleShowDeliveryPriceConditions = () => {
        setShowDeliveryPeiceConditions(!showDeliveryPriceConditions);
    }

    const handleModeName = (e) => {
        setModeName(e.target.value);
    };
    const handleCriteria = (criteriaSelected) => {
        setCriteria(criteriaSelected);
        setModeCondition({ ...modeCondition, criteria: criteriaSelected });
    };
    const handleMin_weightShipping = (e) => { alert('ok')
        console.log('e.target.value  ', e.target.value)
        setModeCondition({ ...modeCondition, min_weight: e.target.value });
    };
    const handleMax_weightShipping = (e) => {
        setModeCondition({ ...modeCondition, max_weight: e.target.value });
    };
    const handleMin_priceShipping = (e) => {
        setModeCondition({ ...modeCondition, min_price: e.target.value });
    };
    const handleMax_priceShipping = (e) => {
        setModeCondition({ ...modeCondition, max_price: e.target.value });
    };
    const handleShipping_price = (e) => {
        setModeCondition({ ...modeCondition, shipping_price: e.target.value });
    };



    // reset supplier form 
    const initShippingForm = () => {
        setModeCondition({
            name: '',
            criteria: 'weight',
            min_weight: '',
            max_weight: '',
            min_price: '',
            max_price: '',
            shipping_price: 0
        });
        setDestinationAdvanced([]);
        setCriteria('weight')
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        initShippingForm();
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
    }


    // Reset Form---------------------------------------------------------------
    // confirm reinitialisatio form
    const confirmInitShippingForm = () => {
        setMessageModal('Effacer tous les champs ?');
        setShowModalConfirmation(true);
    }


    const handleModalSimpleMessageCancel = () => {
        setShowSimpleMessageModal(false);
    }


    const validation = () => {
        // check if neme of supplier already exist
        let shipping_List_name = deliveryZoneList.map(item => item.name);
        if (shipping_List_name.includes(modeName)) {
            setMessageModal('Le nom du transporteur que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (modeName.length === 0) {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom du transporteur est obligatoire');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (modeName.length > 255) {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le nom du transporteur ne doit pas dépasser 255 caractères');
            setShowSimpleMessageModal(true);
            return false;
        } else {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(220, 220, 220)";
            return true;
        }
    }

    // submit
    function saveAdvancedShipping() {

        let valid = validation();

        if (valid) {

            let formDataShipping = new FormData;
            formDataShipping.append('name', modeName);
            formDataShipping.append('criteria', modeCondition.criteria);
            formDataShipping.append('min_weight', modeCondition.min_weight);
            formDataShipping.append('max_weight', modeCondition.max_weight);
            formDataShipping.append('min_price', modeCondition.min_price);
            formDataShipping.append('max_price', modeCondition.max_price);
            formDataShipping.append('destination', modeCondition.destination);
            formDataShipping.append('shipping_price', modeCondition.shipping_price);

            Axios.post(`http://127.0.0.1:8000/save-shipping`, formDataShipping)
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        initShippingForm();
                        // chargement des trabsporteurs
                        // refresh data after save new shipping
                        Axios.get(`http://127.0.0.1:8000/shippings-list`)
                            .then(res => {
                                setDeliveryZoneList(res.data[0]);
                                // navigate('/collections-list');
                            }).catch(function (error) {
                                console.log('error:   ' + error);
                            });
                    }
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }
    }

    console.log('IdDeliveryZones   ', IdDeliveryZones);
    console.log('criteria   ', criteria);

    return (
        <div className='w-full flex flex-col justify-start items-start px-4'>

            {/* add new tarif */}
            {/* <span
                className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                onClick={() => { }}>
                <img src='../images/icons/add-square-dotted.svg' className="w-5 h-5 hover:scale-125" />
            </span> */}

            {/* name */}
            <div className='w-full grid grid-cols-[60%_120px_1fr] gap-3 justify-start items-start mb-4'>
                <div>
                    <InputText
                        id="nameShipping"
                        value={modeName}
                        handleChange={handleModeName}
                        label="Nom"
                    />
                    <span className={`text-sm text-red-700 ${modeName.length > 255 ? "block" : "hidden"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                </div>

                {/* shipping_price simple */}
                {!showDeliveryPriceConditions &&
                    <div
                        className='flex justify-start items-end'
                    >
                        <InputNumeric
                            value={modeCondition.shipping_price}
                            handleChange={handleShipping_price}
                            label="Tarif"
                            step="0.01"
                            min="0"
                            max=""
                            css="rounded-l-md"
                        />
                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-r-md'>
                            €
                        </span>
                        <span className={`text-sm text-red-700 ${modeCondition.shipping_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                    </div>
                }
            </div>

            <span
                className='w-auto mt-6 text-base text-blue-500 underline underline-offset-1 cursor-pointer'
                onClick={handleShowDeliveryPriceConditions}
            >
                {!showDeliveryPriceConditions ?
                    <span>Ajouter des conditions</span>
                    :
                    <span>Annuler les conditions</span>
                }
            </span>


            {showDeliveryPriceConditions &&
                <div className='w-full'>
                    {/* radio btn */}
                    <div className='w-full flex flex-col justify-start items-start my-4'>
                        {/* <span
                            className='text-base text-gray-700 font-medium mb-3'>
                            Définir un tarif en fonction du poids
                        </span> */}
                        <div className='flex justify-start items-center'>
                            <input
                                type="radio"
                                id="radioBtnShippingWeight"
                                name="radioBtnShippingCriteria"
                                onChange={() => handleCriteria("weight")}
                                checked={criteria == "weight"}
                                className='cursor-pointer mr-3'
                            />
                            <label
                                htmlFor='radioBtnShippingWeight'
                                className='cursor-pointer'
                            >
                                Définir le<span className='text-sm font-semibold'>(s)</span> tarif<span className='text-xs font-bold'>(s)</span> en fonction du poids
                            </label>
                        </div>
                        <div className='flex justify-start items-center'>
                            <input
                                type="radio"
                                id="radioBtnShippingMin_amount"
                                name="radioBtnShippingCriteria"
                                onChange={() => handleCriteria("amount")}
                                className='cursor-pointer mr-3'
                                checked={criteria == "amount"}
                            />
                            <label
                                htmlFor='radioBtnShippingMin_amount'
                                className='cursor-pointer'
                            >
                                Définir le<span className='text-sm font-semibold'>(s)</span> tarif<span className='text-xs font-bold'>(s)</span> en fonction du montant de la commande
                            </label>
                        </div>
                    </div>


                    {arrOfModeConditions.map((itemModeCondition, index) =>
                        <div
                            key={index}
                            className='w-full grid grid-cols-[360px_120px_40px] gap-4 justify-start items-center'
                        >
                            {criteria == "weight" &&
                                <div
                                    className='w-full grid grid-cols-2 gap-4 justify-start items-center'
                                >
                                    {/* min_weight */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            // id={}
                                            value={modeCondition.min_weight}
                                            handleChange={handleMin_weightShipping}
                                            // handleClick={}
                                            placeholder=""
                                            label="Poids min"
                                            step="1"
                                            min="0"
                                            max=""
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold  rounded-r-md'>
                                            g
                                        </span>
                                        <span className={`text-sm text-red-700 ${modeCondition.min_weight.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>

                                    {/* max_weight */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            // id={}
                                            value={modeCondition.max_weight}
                                            handleChange={handleMax_weightShipping}
                                            // handleClick={}
                                            placeholder=""
                                            label="Poids max"
                                            step="1"
                                            min="0"
                                            max=""
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            g
                                        </span>
                                        <span className={`text-sm text-red-700 ${modeCondition.max_weight.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>
                                </div>
                            }

                            {criteria == "amount" &&
                                <div className='w-full grid grid-cols-2 gap-4 justify-start items-center'>
                                    {/* min_price */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            // id={}
                                            value={modeCondition.min_price}
                                            handleChange={handleMin_priceShipping}
                                            // handleClick={}
                                            placeholder=""
                                            label="Montant min"
                                            step="0.01"
                                            min="0"
                                            max=""
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            €
                                        </span>
                                        <span className={`text-sm text-red-700 ${modeCondition.min_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>

                                    {/* max_price */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            // id={}
                                            value={modeCondition.max_price}
                                            handleChange={handleMax_priceShipping}
                                            // handleClick={}
                                            placeholder=""
                                            label="Montant max"
                                            step="0.01"
                                            min="0"
                                            max=""
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            €
                                        </span>
                                        <span className={`text-sm text-red-700 ${modeCondition.max_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>
                                </div>
                            }

                            {/* shipping_price */}
                            <div
                                className='flex justify-start items-end'
                            >
                                <InputNumeric
                                    // id={}
                                    value={modeCondition.shipping_price}
                                    handleChange={handleShipping_price}
                                    // handleClick={}
                                    placeholder=""
                                    label="Tarif"
                                    step="0.01"
                                    min="0"
                                    max=""
                                    css="rounded-l-md"
                                />
                                <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                    €
                                </span>
                                <span className={`text-sm text-red-700 ${modeCondition.shipping_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                            </div>

                            {/* icons delete */}
                            <div
                                // onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                className='flex justify-center items-center  h-10 w-10 mt-6 rounded-md border border-gray-300'
                            >
                                <span
                                    // onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                    className='flex justify-center items-center w-6 h-6 cursor-pointer hover:bg-red-500 rounded-md group'
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/trash.svg'}
                                        className="h-5 w-5 group-hover:hidden"
                                    />
                                    <img
                                        src={window.location.origin + '/images/icons/x-white.svg'}
                                        className="h-6 w-6 hidden group-hover:block"
                                    />
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            }


            {/* save */}
            <div className="w-full flex flex-row justify-start items-start mt-7">
                <button
                    className='w-auto px-3 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-green-600 text-white'
                    onClick={saveAdvancedShipping}>
                    Enregistrer
                </button>

                {/* réinitialisation */}
                {isDirtyAdvancedShippingForm && (
                    <button
                        className='w-auto ml-5 px-3 h-10  flex flex-row justify-center items-center border-2 border-blue-500 rounded-md text-gray-700'
                        onClick={() => {
                            confirmInitShippingForm();
                        }}
                    >
                        Reset
                    </button>
                )}
            </div>


            {/* modal for confirmation */}
            <ModalConfirmation
                show={showModalConfirmation}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>

            {/* modal for simple message */}
            <ModalSimpleMessage ModalSimpleMessage
                show={showSimpleMessageModal}
                handleModalCancel={handleModalSimpleMessageCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage>
        </div>
    );
}


export default AdvancedMode;