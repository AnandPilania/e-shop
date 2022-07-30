import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import SelectWithCheckbox from '../elements/selectWithCheckbox';
import SelectBasic from '../elements/selectBasic';


const AdvancedMode = ({ shippingList, setShippingList, countryList, shipping, setShipping }) => {

    const [shippingAdvanced, setShippingAdvanced] = useState({
        name: '',
        criteria: 'Poids',
        min_weight: '',
        max_weight: '',
        min_price: '',
        max_price: '',
        destination: [],
        shipping_price: ''
    });
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [toggleSelectCriteria, setToggleSelectCriteria] = useState(false);
    const [destinationAdvanced, setDestinationAdvanced] = useState([]);
    const [isDirtyAdvancedShippingForm, setIsDirtyAdvancedShippingForm] = useState(false);
    const [criteria, setCriteria] = useState('Poids');

    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();


    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case shippingAdvanced.name.length > 0: setIsDirtyAdvancedShippingForm(true);
                break;
            case shippingAdvanced.min_weight.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case shippingAdvanced.max_weight.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case shippingAdvanced.min_price.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case shippingAdvanced.max_price.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case shippingAdvanced.destination.length > 0: setIsDirtyAdvancedShippingForm(true); break;
            case shippingAdvanced.shipping_price.length > 0: setIsDirtyAdvancedShippingForm(true);
                break;
            default: setIsDirtyAdvancedShippingForm(false);
        }
    }, [shippingAdvanced]);

    const checkIfIsDirty = () => {
        if (
            shippingAdvanced.name != '' ||
            shippingAdvanced.min_weight != '' ||
            shippingAdvanced.max_weight != '' ||
            shippingAdvanced.min_price != '' ||
            shippingAdvanced.max_price != '' ||
            shippingAdvanced.destination != '' ||
            shippingAdvanced.shipping_price != ''
        ) {
            return true;
        } else {
            return false;
        }
    }

    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);


    const handleNameShipping = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, name: e.target.value });
    };
    useEffect(() => {
        setShippingAdvanced({ ...shippingAdvanced, criteria: criteria });
    }, [criteria]);
    const handleMin_weightShipping = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, min_weight: e.target.value });
    };
    const handleMax_weightShipping = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, max_weight: e.target.value });
    };
    const handleMin_priceShipping = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, min_price: e.target.value });
    };
    const handleMax_priceShipping = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, max_price: e.target.value });
    };
    useEffect(() => {
        setShippingAdvanced({ ...shippingAdvanced, destination: destinationAdvanced });
    }, [destinationAdvanced]);
    const handleShipping_price = (e) => {
        setShippingAdvanced({ ...shippingAdvanced, shipping_price: e.target.value });
    };

    const removeDestination = (item) => {
        let index = destinationAdvanced.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destinationAdvanced];
            tmp_arr.splice(index, 1);
            setDestinationAdvanced([...tmp_arr]);
        }
    }



    // reset supplier form 
    const initShippingForm = () => {
        setShippingAdvanced({
            name: '',
            criteria: 'Poids',
            min_weight: '',
            max_weight: '',
            min_price: '',
            max_price: '',
            destination: [],
            shipping_price: ''
        });
        setDestinationAdvanced([]);
        setCriteria('Poids')
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
        let shipping_List_name = shippingList.map(item => item.name);
        if (shipping_List_name.includes(shippingAdvanced.name)) {
            setMessageModal('Le nom du transporteur que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shippingAdvanced.name.length === 0) {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom du transporteur est obligatoire');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shippingAdvanced.name.length > 255) {
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
            formDataShipping.append('name', shippingAdvanced.name);
            formDataShipping.append('criteria', shippingAdvanced.criteria);
            formDataShipping.append('min_weight', shippingAdvanced.min_weight);
            formDataShipping.append('max_weight', shippingAdvanced.max_weight);
            formDataShipping.append('min_price', shippingAdvanced.min_price);
            formDataShipping.append('max_price', shippingAdvanced.max_price);
            formDataShipping.append('destination', shippingAdvanced.destination);
            formDataShipping.append('shipping_price', shippingAdvanced.shipping_price);

            Axios.post(`http://127.0.0.1:8000/save-shipping`, formDataShipping)
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        initShippingForm();
                        // chargement des trabsporteurs
                        // refresh data after save new shipping
                        Axios.get(`http://127.0.0.1:8000/shippings-list`)
                            .then(res => {
                                setShippingList(res.data[0]);
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

            {/* criteria */}
            <div className='w-full mb-7'>
                <SelectBasic
                    list={['Poids', 'Prix Minimum']}
                    itemSelected={criteria}
                    setItemSelected={setCriteria}
                    toggleSelect={toggleSelectCriteria}
                    setToggleSelect={setToggleSelectCriteria}
                    ulUnikId="ulShippingSelectUniqueId"
                    buttonUnikId="buttonShippingSelectUniqueId"
                />
            </div>

            <div className='w-full grid grid-cols-[2fr_1fr_100px_40px_40px] gap-2 justify-start items-center'>
                {/* name */}
                <div>
                    <InputText
                        id="nameShipping"
                        value={shippingAdvanced.name}
                        handleChange={handleNameShipping}
                        // handleClick={}
                        placeholder=""
                        label="Nom"
                    />
                    <span className={`text-sm text-red-700 ${shippingAdvanced.name.length > 255 ? "block" : "hidden"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                </div>

                {shippingAdvanced.criteria == "Poids" ?
                    <div className='w-full grid grid-cols-2 gap-2 justify-start items-center'>
                        {/* min_weight */}
                        <div>
                            <InputNumeric
                                // id={}
                                value={shippingAdvanced.min_weight}
                                handleChange={handleMin_weightShipping}
                                // handleClick={}
                                placeholder=""
                                label="Poids min"
                                step="1"
                                min="0"
                                max=""
                            />
                            <span className={`text-sm text-red-700 ${shippingAdvanced.min_weight.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                        </div>

                        {/* max_weight */}
                        <div>
                            <InputNumeric
                                // id={}
                                value={shippingAdvanced.max_weight}
                                handleChange={handleMax_weightShipping}
                                // handleClick={}
                                placeholder=""
                                label="Poids max"
                                step="1"
                                min="0"
                                max=""
                            />
                            <span className={`text-sm text-red-700 ${shippingAdvanced.max_weight.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                        </div>
                    </div>
                    :
                    <div className='w-full grid grid-cols-2 gap-5 justify-start items-center'>
                        {/* min_price */}
                        <div>
                            <InputNumeric
                                // id={}
                                value={shippingAdvanced.min_price}
                                handleChange={handleMin_priceShipping}
                                // handleClick={}
                                placeholder=""
                                label="Prix min"
                                step="0.01"
                                min="0"
                                max=""
                            />
                            <span className={`text-sm text-red-700 ${shippingAdvanced.min_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                        </div>

                        {/* max_price */}
                        <div>
                            <InputNumeric
                                // id={}
                                value={shippingAdvanced.max_price}
                                handleChange={handleMax_priceShipping}
                                // handleClick={}
                                placeholder=""
                                label="Prix max"
                                step="0.01"
                                min="0"
                                max=""
                            />
                            <span className={`text-sm text-red-700 ${shippingAdvanced.max_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                        </div>
                    </div>}

                {/* shipping_price */}
                <div>
                    <InputNumeric
                        // id={}
                        value={shippingAdvanced.shipping_price}
                        handleChange={handleShipping_price}
                        // handleClick={}
                        placeholder=""
                        label="Tarif"
                        step="0.01"
                        min="0"
                        max=""
                    />
                    <span className={`text-sm text-red-700 ${shippingAdvanced.shipping_price.length > 10 ? "block" : "hidden"}`}>Maximum 10 caractères</span>
                </div>

                {/* icons ->  edit - delete */}
                <div
                    className="text-sm w-full border-b border-gray-200 py-3 pl-2"
                >
                    <span
                        className="w-6 h-6 flex flex-row justify-center items-center bg-white cursor-pointer"
                        onClick={() => {
                            // setIsAddNewShipping(false);
                            // setIsShowSaveButton(false);
                            // handleEditShipping(itemShipping);
                        }}
                    >
                        <img
                            src={window.location.origin + '/images/icons/pencil.svg'}
                            className="h-4 w-4" />
                    </span>
                </div>
                <div
                    className="text-sm w-full border-b border-gray-200 py-3 pl-1"
                >
                    <span
                        className="w-6 h-6 flex flex-row justify-center items-center bg-red-600 cursor-pointer"
                    // onClick={() => showModalConfirmDeleteShippingList(itemShipping)}
                    >
                        <img
                            src={window.location.origin + '/images/icons/x-white.svg'}
                            className="h-5 w-5" />
                    </span>
                </div>

            </div>

            {/* destination */}
            <div className='w-full'>
                <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                    Destination
                </h3>
                <div className='w-48'>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_destination_advanced"
                        unikId="SelectWithCheckbox_destination_advanced"
                        list={countryList}
                        selected={destinationAdvanced}
                        setSelected={setDestinationAdvanced}
                        toggleSelectWithCheckbox={toggleSelectDestination}
                        setToggleSelectWithCheckbox={setToggleSelectDestination}
                    />
                </div>
                <div className={`flex flex-wrap ${destinationAdvanced.length > 0 && "pt-4"} w-full`}>
                    {destinationAdvanced.map(item =>
                        <div key={item.id}
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-2 mr-2">
                            <span
                                className="h-full text-gray-500 mr-2 rounded-md">
                                {item.name}
                            </span>
                            <span
                                className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-700 rounded-md"
                                onClick={() => removeDestination(item)}>
                                <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                            </span>
                        </div>
                    )}
                </div>
            </div>

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