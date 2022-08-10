import React, { useState, useEffect } from 'react';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import Label from '../form/label';
import Toggle from '../elements/toggle/toggle';


const DeliveryModeForm = ({ deliveryZoneList, setDeliveryZoneList, IdDeliveryZones, setActivePanelShipping, idMode, setIdMode }) => {

    const [modeName, setModeName] = useState('');
    const [tmp_modeName_for_edit, setTmp_modeName_for_edit] = useState('');
    const [priceWithoutCondition, setPriceWithoutCondition] = useState('');
    const [criteria, setCriteria] = useState('simple');
    const [objOfModeConditions, setObjOfModeConditions] = useState([{
        id: 0,
        min_value: 0,
        max_value: '',
        modeTarif: ''
    }]);

    const [showErrorMessageMode, setShowErrorMessageMode] = useState(false);
    const [showValidationMessageMode, setShowValidationMessageMode] = useState(false);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [warningModeFieldMessages, setWarningModeFieldMessages] = useState([]);
    const [showDeliveryPriceConditions, setShowDeliveryPeiceConditions] = useState(false);
    const [senderShippingMode, setSenderShippingMode] = useState(false);

    console.log('idMode   ', idMode)

    // si idMode contient un id alors DeliveryModeForm est en mode édition. 
    // On veut éditer le deliveryMode qui correspond à la zone IdDeliveryZones et au mode idMode
    useEffect(() => {
        if (idMode != null) {
            let ndxZone = deliveryZoneList.findIndex(x => x.id == IdDeliveryZones);
            if (ndxZone > -1) {
                let shipping_mode = deliveryZoneList[ndxZone].shipping_modes;
                let ndxMode = shipping_mode.findIndex(x => x.id == idMode);
                if (ndxMode > -1) {
                    setObjOfModeConditions([...shipping_mode[ndxMode].conditions]);
                    setModeName(shipping_mode[ndxMode].mode_name);
                    setTmp_modeName_for_edit(shipping_mode[ndxMode].mode_name);
                    setPriceWithoutCondition(shipping_mode[ndxMode].price_without_condition != null ? shipping_mode[ndxMode].price_without_condition : '');
                    setCriteria(shipping_mode[ndxMode].criteria);
                    setShowDeliveryPeiceConditions(true);
                }
            }
        }
    }, []);

    console.log('objOfModeConditions   ', objOfModeConditions)

    const checkIfIsDirty = () => {
        const isDirtyCondition =
            objOfModeConditions[0].max_value > 0 ||
            objOfModeConditions[0].modeTarif != '';

        if (
            modeName != '' ||
            priceWithoutCondition != null ||
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
        if (showDeliveryPriceConditions && (objOfModeConditions[0].max_value != '' || objOfModeConditions[0].modeTarif != '')) {
            setMessageModal("Supprimer les conditions ?")
            setSenderShippingMode('handleShowDeliveryPriceConditions');
            setShowModalConfirmation(true);
            setCriteria('simple');
        } else if (!showDeliveryPriceConditions && priceWithoutCondition != '') {
            setMessageModal("Supprimer le tarif ?")
            setSenderShippingMode('handleShowDeliveryPriceConditions');
            setShowModalConfirmation(true);
            setCriteria('weight');
        } else {
            setSenderShippingMode('');
            setShowDeliveryPeiceConditions(!showDeliveryPriceConditions);
            setShowValidationMessageMode(false);
            setShowErrorMessageMode(false);
            setCriteria(showDeliveryPriceConditions ? 'simple' : 'weight');
        }
    }

    const handleModeName = (e) => {
        setModeName(e.target.value);
    };

    const handleModeSimplePrice = (e) => {
        setPriceWithoutCondition(e.target.value);
    };

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    const handleCriteria = (criteriaSelected) => {
        setCriteria(criteriaSelected);

        // handle rounded number precision when change criteria
        let tmp_conditions = [...objOfModeConditions];
        if (criteriaSelected == "weight") {
            tmp_conditions.forEach(x => x.min_value = Math.floor(x.min_value));
        }
        if (criteriaSelected == "amount") {
            tmp_conditions.forEach(x => x.min_value = roundToTwo(x.min_value));
        }
        setObjOfModeConditions([...tmp_conditions]);
    };

    const handleMax_value = (e, id) => {
        let ndx = objOfModeConditions.findIndex(x => x.id == id);
        let tmp_conditions = [...objOfModeConditions];

        if (ndx > -1) {
            tmp_conditions[ndx].max_value = e.target.value;
        }
        setObjOfModeConditions([...tmp_conditions]);
    };


    const handleModeTarif = (e, id) => {
        let ndx = objOfModeConditions.findIndex(x => x.id == id);
        let tmp_conditions = [...objOfModeConditions];

        if (ndx > -1) {
            tmp_conditions[ndx].modeTarif = e.target.value;
        }
        setObjOfModeConditions([...tmp_conditions]);
    };

    const removeCondition = (id) => {
        if (objOfModeConditions.length > 1) {
            let ndx = objOfModeConditions.findIndex(x => x.id == id);
            let tmp_conditions = [...objOfModeConditions];

            if (ndx > -1) {
                tmp_conditions.splice(ndx, 1)
            }

            // met le premier min à 0 quand on supprime un tarif pcq le premier doit être à 0
            tmp_conditions[0].min_value = 0;
            setObjOfModeConditions([...tmp_conditions]);
        }
    }

    // validation before add new tarif
    const addTarifValidation = () => {
        let ndx = null;
        let tmp_arr = [];
        let showErrorMessage = false;

        // check if empty
        ndx = objOfModeConditions.findIndex(x => x.max_value == '' || x.modeTarif == '');

        if (ndx > -1) {
            showErrorMessage = true;
            tmp_arr.push('Tous les champs doivent être complétés');
        } else {
            let index = tmp_arr.indexOf('Tous les champs doivent être complétés');
            index > -1 && tmp_arr.splice(index, 1);
        }

        // check if max > min
        ndx = objOfModeConditions.findIndex(x => x.max_value <= x.min_value);

        let fieldName = criteria == "weight" ? "Poids" : "Montant";

        if (ndx > -1 && tmp_arr.length == 0) {
            showErrorMessage = true;
            tmp_arr.push('Le champ ' + fieldName + ' max doit être supérieur au champ ' + fieldName + ' min');

        } else {
            let index = tmp_arr.indexOf('Le champ ' + fieldName + ' max doit être supérieur au champ ' + fieldName + ' min');
            index > -1 && tmp_arr.splice(index, 1);
        }

        let tmp = [...objOfModeConditions];
        // check si le champ min est suppérieur au champ max
        if (tmp.length > 1) {
            for (let i = 1; i < tmp.length; i++) {
                if (tmp[i - 1].max_value > tmp[i].min_value) {
                    tmp[i].min_value = criteria == "weight" ? Number(tmp[i - 1].max_value) + 1 : Number(tmp[i - 1].max_value) + 0.01;
                    setObjOfModeConditions([...tmp]);
                    addTarifValidation();
                }
            }
        }

        setWarningModeFieldMessages([...tmp_arr]);
        setShowErrorMessageMode(showErrorMessage);

        // if there is error to show return false
        return showErrorMessage ? false : true;
    }

    useEffect(() => {
        // check si le champ min est suppérieur au champ max
        if (objOfModeConditions.length > 1) {
            let showErrorMessage = false;
            let fieldName = criteria == "weight" ? "Poids" : "Montant";
            let tmp_arr = [];
            for (let i = 1; i < objOfModeConditions.length; i++) {
                if (objOfModeConditions[i - 1].max_value > objOfModeConditions[i].min_value) {
                    showErrorMessage = true;
                    tmp_arr.push('Le champ ' + fieldName + ' min doit être supérieur au champ ' + fieldName + ' max précédent');
                } else {
                    let index = tmp_arr.indexOf('Le champ ' + fieldName + ' min doit être supérieur au champ ' + fieldName + ' max précédent');
                    index > -1 && tmp_arr.splice(index, 1);
                }
            }
            setWarningModeFieldMessages([...tmp_arr]);
            setShowErrorMessageMode(showErrorMessage);
        }
    }, [objOfModeConditions])


    const addTarif = () => {
        if (addTarifValidation()) {
            // get bigger Id
            let condition = objOfModeConditions.reduce((prev, next) => { return prev.id > next.id ? prev.id : next });

            let min = criteria == "weight" ? Number(condition.max_value) + 1 : Number(condition.max_value) + 0.01;

            // add new condition
            setObjOfModeConditions([...objOfModeConditions, {
                id: condition.id + 1,
                min_value: min,
                max_value: '',
                modeTarif: ''
            }]
            );
        }
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);

        // called from handleShowDeliveryPriceConditions
        if (senderShippingMode == 'handleShowDeliveryPriceConditions') {
            if (showDeliveryPriceConditions) {
                setObjOfModeConditions([{
                    id: 0,
                    min_value: 0,
                    max_value: '',
                    modeTarif: ''
                }]);
                setCriteria('simple');
            } if (!showDeliveryPriceConditions) {
                setPriceWithoutCondition('');
                setCriteria('weight');
            }
            setSenderShippingMode('');
            setShowDeliveryPeiceConditions(!showDeliveryPriceConditions);
            setShowValidationMessageMode(false);
            setShowErrorMessageMode(false);

        } else {
            // called from usePromptCollection
            setActivePanelShipping(1);
        }
    }


    const handleModalCancel = () => {
        setShowModalConfirmation(false);
    }


    const validation = () => {
        if (modeName.length === 0) {
            setMessageModal('Le champ Nom est obligatoire');
            setShowValidationMessageMode(true);
            return false;
        }

        if (modeName.length > 255) {
            setMessageModal('Le nom ne doit pas dépasser 255 caractères');
            setShowValidationMessageMode(true);
            return false;
        }

        if (modeName.length > 0 && modeName.length < 256) {
            setMessageModal('');
            setShowValidationMessageMode(false);
        }

        // check if name of mode already exist
        let ndx = deliveryZoneList.findIndex(x => x.id == IdDeliveryZones);
        let modeNameList = [];
        if (ndx > -1) {
            modeNameList = deliveryZoneList[ndx].shipping_modes.map(item => item.mode_name);
        }
        if (idMode == null) {
            if (modeNameList.includes(modeName)) {
                setMessageModal('Ce nom éxiste déjà. Veuillez entrer un nom différent');
                setShowValidationMessageMode(true);
                return false;
            }
        }
        // si on edit alors le modeName sera déjà dans modeNameList sauf si on le change     
        if (idMode != null) {
            if (modeNameList.includes(modeName) && modeName != tmp_modeName_for_edit) {
                setMessageModal('Ce nom éxiste déjà. Veuillez entrer un nom différent');
                setShowValidationMessageMode(true);
                return false;
            }
        }

        if (criteria == "simple") {
            if (priceWithoutCondition.length === 0) {
                setMessageModal('Le champ Tarif est obligatoire');
                setShowValidationMessageMode(true);
                return false;
            } else {
                setShowValidationMessageMode(false);
                return true;
            }
        }

        return true;
    }


    // submit
    function saveDeliveryMode() {

        let validationIsOk = false;

        if (criteria == "weight" || criteria == "amount") {
            validationIsOk = validation() && addTarifValidation();
        }
        if (criteria == "simple") {
            validationIsOk = validation();
        }

        if (validationIsOk) {
            let modeShippingData = new FormData;
            modeShippingData.append('mode_name', modeName);
            modeShippingData.append('IdDeliveryZones', IdDeliveryZones);
            modeShippingData.append('criteria', criteria);
            modeShippingData.append('priceWithoutCondition', priceWithoutCondition);
            modeShippingData.append('conditions', JSON.stringify(objOfModeConditions));
            if (idMode != null) {
                modeShippingData.append('idMode', idMode);
            }

            // save
            if (idMode == null) {
                Axios.post(`http://127.0.0.1:8000/save-Shipping_mode`, modeShippingData)
                    .then(res => {
                        console.log('res.data  --->  ok');
                        if (res.data === 'ok') {
                            setIdMode(null);
                            // refresh data after save new mode shipping
                            Axios.get(`http://127.0.0.1:8000/shipping-list`)
                                .then(res => {
                                    setDeliveryZoneList(res.data[0]);
                                    setActivePanelShipping(1);
                                }).catch(function (error) {
                                    console.log('error:   ' + error);
                                });
                        }
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
            }

            // update
            if (idMode != null) {
                Axios.post(`http://127.0.0.1:8000/update-Shipping_mode`, modeShippingData)
                    .then(res => {
                        console.log('res.data  --->  ok');
                        if (res.data === 'ok') {
                            setIdMode(null);
                            // refresh data after save new mode shipping
                            Axios.get(`http://127.0.0.1:8000/shipping-list`)
                                .then(res => {
                                    setDeliveryZoneList(res.data[0]);
                                    setActivePanelShipping(1);
                                }).catch(function (error) {
                                    console.log('error:   ' + error);
                                });
                        }
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
            }

        }
    }


    return (
        <div className='w-full flex flex-col justify-start items-start px-4'>

            {/* error message validation name && price without conditions */}
            {showValidationMessageMode &&
                <div
                    className="w-full p-4 my-4 flex justify-start items-start rounded-md bg-red-50 text-sm text-gray-700 font-semibold"
                >
                    <img
                        src={window.location.origin + '/images/icons/exclamation-triangle.svg'}
                        className="h-4 w-4 mr-3"
                    />
                    {messageModal}
                </div>
            }

            {/* container name + priceWithoutConditions */}
            <div
                className='w-full grid grid-cols-[300px_120px_1fr] gap-3 justify-start items-start'
            >
                {/* name */}
                <div
                    className="w-full flex flex-col justify-start items-start rounded-md"
                >
                    <Label label="Nom" />
                    <div
                        className={`w-full rounded-md ${modeName?.length == 0 && showValidationMessageMode && "border-2 border-red-700"}`}>
                        <InputText
                            id="nameShipping"
                            value={modeName}
                            handleChange={handleModeName}
                            css="w-full"
                        />
                    </div>
                </div>

                {/* price without conditions */}
                {!showDeliveryPriceConditions &&
                    <div
                        className='flex flex-col justify-start items-start'
                    >
                        <Label label="Tarif" />
                        <div
                            className={`flex justify-start items-center rounded-md ${priceWithoutCondition?.length == 0 && showValidationMessageMode && "border-2 border-red-700"}`}
                        >
                            <InputNumeric
                                value={priceWithoutCondition}
                                handleChange={handleModeSimplePrice}
                                step="0.01"
                                min="0"
                                max="9999999999"
                                css="rounded-l-md"
                            />
                            <span
                                className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-r-md'>
                                €
                            </span>
                        </div>
                    </div>
                }
            </div>

            <div
                className='w-auto mt-16'
            >
                <Toggle
                    isChecked={showDeliveryPriceConditions}
                    change={handleShowDeliveryPriceConditions}
                    id="idDeliveryModeForm"
                    label="Ajouter des conditions"
                    labelCss="text-base font-semibold text-gray-500"
                />
            </div>


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

                    {showErrorMessageMode &&
                        warningModeFieldMessages.map((itemError, index) =>
                            <div
                                key={index}
                                className="w-full p-4 mt-4 flex justify-start items-start rounded-md bg-red-50 text-sm text-gray-700 font-semibold"
                            >
                                <img
                                    src={window.location.origin + '/images/icons/exclamation-triangle.svg'}
                                    className="h-4 w-4 mr-3"
                                />
                                {itemError}
                            </div>
                        )
                    }


                    <div
                        className='w-full grid grid-cols-[360px_140px_40px] gap-4 justify-start items-center mt-8 mb-1'>
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

                    {objOfModeConditions.map((itemModeCondition, index, arr) =>
                        <div
                            key={index}
                            className='w-full grid grid-cols-[360px_140px_40px] gap-4 justify-start items-center mb-3'
                        >
                            {criteria == "weight" &&
                                <div
                                    className='w-full grid grid-cols-2 gap-4 justify-start items-center'
                                >
                                    {/* min_value */}
                                    <div
                                        className='w-full flex justify-start items-center'
                                    >
                                        <span
                                            className="w-full flex items-center h-10 pl-2 border border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l-md cursor-not-allowed"
                                        >
                                            {itemModeCondition.min_value}
                                        </span>
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold  rounded-r-md cursor-not-allowed'>
                                            g
                                        </span>
                                    </div>

                                    {/* max_value */}
                                    <div
                                        className={`flex justify-start items-center rounded-md ${itemModeCondition.max_value?.length == 0 && showErrorMessageMode && "border-2 border-red-700"} ${itemModeCondition.max_value <= itemModeCondition.min_value && showErrorMessageMode && "border-2 border-red-700"} ${index > 0 && itemModeCondition.min_value < arr[index - 1].max_value && showErrorMessageMode && "border-2 border-red-700"}`}
                                    >
                                        <InputNumeric
                                            value={itemModeCondition.max_value}
                                            handleChange={(e) => handleMax_value(e, itemModeCondition.id)}
                                            placeholder=""
                                            label="Poids max"
                                            step="1"
                                            min="0"
                                            max="9999999999"
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            g
                                        </span>
                                    </div>
                                </div>
                            }

                            {criteria == "amount" &&
                                <div className='w-full grid grid-cols-2 gap-4 justify-start items-center'
                                >
                                    {/* min_value */}
                                    <div
                                        className='w-full flex justify-start items-center'
                                    >
                                        <span
                                            className="w-full flex items-center h-10 pl-2 border border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-l-md cursor-not-allowed"
                                        >
                                            {itemModeCondition.min_value > 0 ? itemModeCondition.min_value.toFixed(2) : 0}
                                        </span>
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold  rounded-r-md cursor-not-allowed'>
                                            €
                                        </span>
                                    </div>

                                    {/* max_amount */}
                                    <div
                                        className={`flex justify-start items-center rounded-md ${itemModeCondition.max_value?.length == 0 && showErrorMessageMode && "border-2 border-red-700"} ${itemModeCondition.max_value <= itemModeCondition.min_value && showErrorMessageMode && "border-2 border-red-700"} ${index > 0 && itemModeCondition.min_value < arr[index - 1].max_value && showErrorMessageMode && "border-2 border-red-700"}`}
                                    >
                                        <InputNumeric
                                            value={itemModeCondition.max_value}
                                            handleChange={(e) => handleMax_value(e, itemModeCondition.id)}
                                            placeholder=""
                                            step="0.01"
                                            min="0"
                                            max="9999999999"
                                            css="rounded-l-md"
                                        />
                                        <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                            €
                                        </span>
                                    </div>
                                </div>
                            }

                            {/* modeTarif */}
                            <div
                                className={`flex justify-start items-center rounded-md ${itemModeCondition.modeTarif?.length == 0 && showErrorMessageMode && "border-2 border-red-700"}`}
                            >
                                <InputNumeric
                                    value={itemModeCondition.modeTarif}
                                    handleChange={(e) => handleModeTarif(e, itemModeCondition.id)}
                                    placeholder=""
                                    step="0.01"
                                    min="0"
                                    max="9999999999"
                                    css="rounded-l-md"
                                />
                                <span className='w-10 h-10 flex justify-center items-center border-y border-r border-gray-300 bg-gray-100 text-gray-500 text-sm font-semibold rounded-r-md'>
                                    €
                                </span>
                            </div>

                            {/* icons delete */}
                            {objOfModeConditions.length > 1 &&
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
                    onClick={saveDeliveryMode}>
                    Enregistrer
                </button>

                {/* cancel */}
                <button
                    className='w-auto px-4 ml-4 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-red-600 text-white'
                    onClick={() => {
                        setIdMode(null);
                        setActivePanelShipping(1);
                    }}
                >
                    Annuler+++
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
        </div>
    );
}


export default DeliveryModeForm;