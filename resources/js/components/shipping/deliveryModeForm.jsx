import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';



const DeliveryModeForm = ({ deliveryZoneList, setDeliveryZoneList, IdDeliveryZones, setActivePanelShipping }) => {

    const [modeCondition, setModeCondition] = useState([{
        id: 0,
        criteria: 'weight',
        min_weight: 0,
        max_weight: '',
        min_amount: 0,
        max_amount: '',
        modeTarif: ''
    }]);
    const [modeName, setModeName] = useState('');
    const [modeSimplePrice, setModeSimplePrice] = useState('');
    const [objOfModeConditions, setObjOfModeConditions] = useState({ "name": modeName, "price": modeSimplePrice, "conditions": modeCondition });

    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [criteria, setCriteria] = useState('weight');
    const [showDeliveryPriceConditions, setShowDeliveryPeiceConditions] = useState(false);


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();

    const checkIfIsDirty = () => {
        const isDirtyCondition =
            objOfModeConditions.conditions[0].max_weight > 0 ||
            objOfModeConditions.conditions[0].max_amount > 0 ||
            objOfModeConditions.conditions[0].modeTarif != '';

        if (
            modeName != '' ||
            modeSimplePrice != null ||
            isDirtyCondition == true
        ) {
            return true;
        } else {
            return false;
        }
    }
    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Quitter sans sauvegarder vos changements ?', checkIfIsDirty, setShowModalConfirmation, setMessageModal);


    const handleShowDeliveryPriceConditions = () => {
        setShowDeliveryPeiceConditions(!showDeliveryPriceConditions);
    }

    const handleModeName = (e) => {
        setModeName(e.target.value);
    };

    const handleModeSimplePrice = (e) => {
        setModeSimplePrice(e.target.value);
    };

    const handleCriteria = (criteriaSelected) => {
        setCriteria(criteriaSelected);
        setModeCondition({ ...modeCondition, criteria: criteriaSelected });
    };

    const handleMax_weight = (e, id) => {
        let ndx = objOfModeConditions.conditions.findIndex(x => x.id == id);
        let tmp_conditions = objOfModeConditions.conditions;

        if (ndx > -1) {
            tmp_conditions[ndx].max_weight = e.target.value;
        }
        setObjOfModeConditions({
            ...objOfModeConditions,
            conditions: [...tmp_conditions]
        });
    };

    const handleMax_amount = (e, id) => {
        let ndx = objOfModeConditions.conditions.findIndex(x => x.id == id);
        let tmp_conditions = objOfModeConditions.conditions;

        if (ndx > -1) {
            tmp_conditions[ndx].max_amount = e.target.value;
        }
        setObjOfModeConditions({
            ...objOfModeConditions,
            conditions: [...tmp_conditions]
        });
    };

    const handleModeTarif = (e, id) => {
        let ndx = objOfModeConditions.conditions.findIndex(x => x.id == id);
        let tmp_conditions = objOfModeConditions.conditions;

        if (ndx > -1) {
            tmp_conditions[ndx].modeTarif = e.target.value;
        }
        setObjOfModeConditions({
            ...objOfModeConditions,
            conditions: [...tmp_conditions]
        });
    };

    const removeCondition = (id) => {
        if (objOfModeConditions.conditions.length > 1) {
            let ndx = objOfModeConditions.conditions.findIndex(x => x.id == id);
            let tmp_conditions = objOfModeConditions.conditions;

            if (ndx > -1) {
                tmp_conditions.splice(ndx, 1)
            }
            setObjOfModeConditions({
                ...objOfModeConditions,
                conditions: [...tmp_conditions]
            });
        }
    }

    const addTarif = () => {
        let ndx = objOfModeConditions.conditions.findIndex(x => x.max_weight == '' || x.max_amount == '' || x.modeTarif == '');

        let condition = objOfModeConditions.conditions.reduce((prev, next) => { return prev.id > next.id ? prev.id : next });

        setObjOfModeConditions({
            ...objOfModeConditions,
            conditions: [...objOfModeConditions.conditions, {
                id: condition.id + 1,
                criteria: criteria,
                min_weight: 0,
                max_weight: '',
                min_amount: 0,
                max_amount: '',
                modeTarif: ''
            }]
        });
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        setActivePanelShipping(1);
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
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
            formDataShipping.append('min_amount', modeCondition.min_amount);
            formDataShipping.append('max_amount', modeCondition.max_amount);
            formDataShipping.append('destination', modeCondition.destination);
            formDataShipping.append('modeTarif', modeCondition.modeTarif);

            Axios.post(`http://127.0.0.1:8000/save-shipping`, formDataShipping)
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        // chargement des trabsporteurs
                        // refresh data after save new shipping
                        Axios.get(`http://127.0.0.1:8000/shippings-list`)
                            .then(res => {
                                setDeliveryZoneList(res.data[0]);
                                setActivePanelShipping(1);
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


    return (
        <div className='w-full flex flex-col justify-start items-start px-4'>

            {/* name */}
            <div className='w-full grid grid-cols-[300px_120px_1fr] gap-3 justify-start items-start'>
                <div>
                    <InputText
                        id="nameShipping"
                        value={modeName}
                        handleChange={handleModeName}
                        label="Nom"
                    />
                    <span
                        className={`text-sm text-red-700 ${modeName?.length > 255 ? "block" : "hidden"}`}>
                        Le nom du transporteur ne peut pas dépasser 255 caractères
                    </span>
                </div>

                {/* modeTarif simple */}
                {!showDeliveryPriceConditions &&
                    <div
                        className='flex flex-col justify-start items-start'
                    >
                        <Label label="Tarif" />
                        <div
                            className='w-full flex justify-start items-center'
                        >
                            <InputNumeric
                                value={modeSimplePrice}
                                handleChange={handleModeSimplePrice}
                                step="0.01"
                                min="0"
                                max=""
                                css="rounded-l-md"
                            />
                            <span
                                className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-r-md'>
                                €
                            </span>
                        </div>
                        <span
                            className={`text-sm text-red-700 ${modeCondition?.modeTarif?.length > 10 ? "block" : "hidden"}`}>
                            Maximum 10 caractères
                        </span>
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
                <div className='w-full mt-4'>
                    {/* radio btn */}
                    <div className='w-full flex flex-col justify-start items-start'>
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
                                Définir un ou plusieurs tarifs en fonction du poids
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
                                Définir un ou plusieurs tarifs en fonction du montant de la commande
                            </label>
                        </div>
                    </div>


                    <div
                        className='w-full grid grid-cols-[360px_120px_40px] gap-4 justify-start items-center mt-8 mb-1'>
                        <div
                            className='w-full grid grid-cols-2 gap-4 justify-start items-center'>
                            <span
                                className='w-full text-sm font-medium text-gray-700'>
                                {criteria == "weight" ? "Poids min" : "Montant min"}
                            </span>
                            <span
                                className='w-full text-sm font-medium text-gray-700'>
                                {criteria == "weight" ? "Poids max" : "Montant max"}
                            </span>
                        </div>
                        <span
                            className='w-full text-sm font-medium text-gray-700'>
                            Tarif
                        </span>
                    </div>

                    {objOfModeConditions.conditions.map((itemModeCondition, index) =>
                        <div
                            key={index}
                            className='w-full grid grid-cols-[360px_120px_40px] gap-4 justify-start items-center mb-3'
                        >
                            {criteria == "weight" &&
                                <div
                                    className='w-full grid grid-cols-2 gap-4 justify-start items-center'
                                >
                                    {/* min_weight */}
                                    <div
                                        className='w-full flex flex-col justify-start items-start'
                                    >
                                        <div
                                            className='w-full flex justify-start items-center'
                                        >
                                            <span
                                                className="w-full flex items-center h-10 pl-2 border border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l-md"
                                            >
                                                0
                                            </span>
                                            <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold  rounded-r-md'>
                                                g
                                            </span>
                                        </div>
                                        <span className={`text-sm text-red-700 ${itemModeCondition.min_weight?.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>

                                    {/* max_weight */}
                                    <div
                                        className='flex flex-col justify-start items-start'
                                    >
                                        <div
                                            className='flex justify-start items-center'
                                        >
                                            <InputNumeric
                                                value={itemModeCondition.max_weight}
                                                handleChange={(e) => handleMax_weight(e, itemModeCondition.id)}
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
                                        </div>
                                        <span className={`text-sm text-red-700 ${itemModeCondition.max_weight?.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>
                                </div>
                            }

                            {criteria == "amount" &&
                                <div className='w-full grid grid-cols-2 gap-4 justify-start items-center'>
                                    {/* min_amount */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            // id={}
                                            value={itemModeCondition.min_amount}
                                            // handleChange={handleMin_priceShipping}
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
                                        <span className={`text-sm text-red-700 ${itemModeCondition.min_amount?.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>

                                    {/* max_amount */}
                                    <div
                                        className='flex justify-start items-end'
                                    >
                                        <InputNumeric
                                            value={itemModeCondition.max_amount}
                                            handleChange={(e) => handleMax_amount(e, itemModeCondition.id)}
                                            placeholder=""
                                            step="0.01"
                                            min="0"
                                            max=""
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            €
                                        </span>
                                        <span className={`text-sm text-red-700 ${itemModeCondition.max_amount?.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                                    </div>
                                </div>
                            }

                            {/* modeTarif */}
                            <div
                                className='flex justify-start items-center'
                            >
                                <InputNumeric
                                    value={itemModeCondition.modeTarif}
                                    handleChange={(e) => handleModeTarif(e, itemModeCondition.id)}
                                    placeholder=""
                                    step="0.01"
                                    min="0"
                                    max=""
                                    css="rounded-l-md"
                                />
                                <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                    €
                                </span>
                                <span className={`text-sm text-red-700 ${itemModeCondition.modeTarif?.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                            </div>

                            {/* icons delete */}
                            {objOfModeConditions.conditions.length > 1 &&
                                <div
                                    className='flex justify-center items-center  h-10 w-10 rounded-md border border-gray-300'
                                >
                                    <span
                                        onClick={() => removeCondition(itemModeCondition.id)}
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
                                </div>}
                        </div>
                    )}
                </div>
            }

            {/* add new tarif */}
            {showDeliveryPriceConditions &&
                <div className="w-full flex flex-row justify-start items-start mt-2">
                    <button
                        className='w-auto px-3 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-white text-gray-700'
                        onClick={addTarif}>
                        Ajouter un tarif
                    </button>
                </div>}



            <div className="w-full flex flex-row justify-start items-center mt-12 mb-5">
                {/* save */}
                <button
                    className='w-auto px-3 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-green-600 text-white'
                    onClick={saveAdvancedShipping}>
                    Enregistrer
                </button>

                {/* cancel */}
                <button
                    className='w-auto px-4 ml-4 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-red-600 text-white'
                    onClick={() => setActivePanelShipping(1)}
                >
                    Annuler
                </button>
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


export default DeliveryModeForm;