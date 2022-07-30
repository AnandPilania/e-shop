import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import SelectWithCheckbox from '../elements/selectWithCheckbox';


const SimpleMode = ({ shippingList, setShippingList, countryList, shipping, setShipping }) => {

    const [shippingSimple, setShippingSimple] = useState({
        name: '',
        criteria: 'simple',
        min_weight: '',
        max_weight: '',
        min_price: '',
        max_price: '',
        destination: [],
        shipping_price: ''
    });


    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [isDirtySimpleShipping, setIsDirtySimpleShipping] = useState(false);
    const [idEditShipping, setIdEditShipping] = useState(false);
    const [isAddNewShipping, setIsAddNewShipping] = useState(false);
    const [isShowSaveButton, setIsShowSaveButton] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destinationSimple, setDestinationSimple] = useState([]);
    const [localisation, setLocalisation] = useState([]);


    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();

    useEffect(() => {
        Axios.get(`http://127.0.0.1:8000/getUserLocalisation`)
            .then(res => {
                setLocalisation(res.data);
                console.log('res data  ', res.data)
                // navigate('/collections-list');
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case shippingSimple.name.length > 0: setIsDirtySimpleShipping(true); break;
            case shippingSimple.destination.length > 0: setIsDirtySimpleShipping(true); break;
            case shippingSimple.shipping_price.length > 0: setIsDirtySimpleShipping(true); break;
            default: setIsDirtySimpleShipping(false);
        }
    }, [shippingSimple]);

    const checkIfIsDirty = () => {
        if (
            shippingSimple.name != '' ||
            shippingSimple.destination != '' ||
            shippingSimple.shipping_price != ''
        ) {
            return true;
        } else {
            return false;
        }
    }

    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);


    const handleNameShipping = (e) => {
        setShippingSimple({ ...shippingSimple, name: e.target.value });
    };

    useEffect(() => {
        setShippingSimple({ ...shippingSimple, destination: destinationSimple });
    }, [destinationSimple]);

    const handleShipping_price = (e) => {
        setShippingSimple({ ...shippingSimple, shipping_price: e.target.value });
    };

    const removeDestination = (item) => {
        let index = destinationSimple.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destinationSimple];
            tmp_arr.splice(index, 1);
            setDestinationSimple([...tmp_arr]);
        }
    }


    const handleEditShipping = (itemShipping) => {
        setIdEditShipping(itemShipping.id);
    }

    const cancelEditShipping = () => {
        setIdEditShipping(null);
        setIsShowSaveButton(false);
        initShippingForm();
    }

    // reset supplier form 
    const initShippingForm = () => {
        setShippingSimple({
            name: '',
            criteria: 'simple',
            destination: [],
            shipping_price: ''
        });
        setDestinationSimple([]);
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
        setMessageModal('Êtes-vous sûr de vouloir supprimer tout le contenu du formulaire ?');
        setShowModalConfirmation(true);
    }

    const handleModalSimpleMessageCancel = () => {
        setShowSimpleMessageModal(false);
    }

    const validation = () => {
        // check if neme of supplier already exist
        let shipping_List_name = shippingList.map(item => item.name);
        if (shipping_List_name.includes(shippingSimple.name)) {
            setMessageModal('Le nom du transporteur que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shippingSimple.name.length === 0) {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom du transporteur est obligatoire');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shippingSimple.name.length > 255) {
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
    function saveSimpleShipping() {

        let valid = validation();

        if (valid) {

            let formDataShipping = new FormData;
            formDataShipping.append('name', shippingSimple.name);
            formDataShipping.append('criteria', shippingSimple.criteria);
            formDataShipping.append('min_weight', '');
            formDataShipping.append('max_weight', '');
            formDataShipping.append('min_price', '');
            formDataShipping.append('max_price', '');
            formDataShipping.append('destination', shippingSimple.destination);
            formDataShipping.append('shipping_price', shippingSimple.shipping_price);


            Axios.post(`http://127.0.0.1:8000/save-shipping`, formDataShipping)
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        initShippingForm();
                        // chargement des trabsporteurs
                        // refresh data after save new shippingSimple
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
            {shippingList?.length > 0 && shippingList.map(itemShipping =>
                <div
                    key={itemShipping.id}
                    className='w-full'
                >
                    {idEditShipping != itemShipping.id &&
                        <div className='grid grid-cols-[80px_70%_100px_40px_40px] justify-start items-center w-full'>
                            <span
                                className='flex justify-center items-center w-full h-full'>
                                <input
                                    id={`idInputDefaultTvaRate${itemShipping.id}`}
                                    type='radio'
                                    className='w-4 h-4 cursor-pointer checked:bg-indigo-600'
                                    name='btnRadioDefaultTvaRate'
                                    onClick={() => handleDefaultTvaRate(itemShipping.id)}
                                />
                            </span>

                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2 truncate'
                            >
                                {itemShipping.name}
                            </span>
                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2'
                            >
                                {itemShipping.shipping_price} %
                            </span>


                            {/* icons ->  edit - delete */}
                            <div
                                className="text-sm w-full border-b border-gray-200 py-3 pl-2"
                            >
                                <span
                                    className="w-6 h-6 flex flex-row justify-center items-center bg-white cursor-pointer"
                                    onClick={() => {
                                        setIsAddNewShipping(false);
                                        setIsShowSaveButton(false);
                                        handleEditShipping(itemShipping);
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
                                    onClick={() => showModalConfirmDeleteShippingList(itemShipping)}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/x-white.svg'}
                                        className="h-5 w-5" />
                                </span>
                            </div>
                        </div>
                    }

                    {/* edit */}
                    {idEditShipping == itemShipping.id &&
                        <div className='grid grid-cols-[70%_70px_30px_8px_80px] gap-x-[1px] justify-start items-center w-full pb-2'
                        >
                            {/* name */}
                            <div>
                                <InputText
                                    id="nameShipping"
                                    value={shippingSimple.name}
                                    handleChange={handleNameShipping}
                                    // handleClick={}
                                    placeholder=""
                                    label="Nom"
                                />
                                <span className={`text-sm text-red-700 ${shippingSimple.name.length > 255 ? "block" : "none"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                            </div>
                            {/* shipping_price */}
                            <div>
                                <InputNumeric
                                    // id={}
                                    value={shippingSimple.shipping_price}
                                    handleChange={handleShipping_price}
                                    // handleClick={}
                                    placeholder=""
                                    label="Tarif"
                                    step="0.01"
                                    min="0"
                                    max=""
                                />
                                <span className={`text-sm text-red-700 ${shippingSimple.shipping_price.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                            </div>
                            <span></span>
                            <span
                                className='text-base w-20 text-red-400 underline underline-offset-1
                                    hover:text-red-600 py-3 pl-2 cursor-pointer'
                                onClick={() => {
                                    cancelEditShipping();
                                }}
                            >
                                Annuler
                            </span>

                            <button
                                className='flex justify-center w-24 py-1 px-2 mt-1  bg-green-500 text-white font-medium text-sm rounded-md'
                                onClick={() => {
                                    updateShipping(itemShipping.id);
                                    cancelEditShipping();
                                }}
                            >
                                Enregistrer
                            </button>
                        </div>
                    }
                </div>
            )}

            {/* destinationSimple */}
            <div className='w-full'>
                <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                    Destination
                </h3>
                <div className='w-48'>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_destination_simple"
                        unikId="SelectWithCheckbox_destination_simple"
                        list={countryList}
                        selected={destinationSimple}
                        setSelected={setDestinationSimple}
                        toggleSelectWithCheckbox={toggleSelectDestination}
                        setToggleSelectWithCheckbox={setToggleSelectDestination}
                    />
                </div>
                <div className={`flex flex-wrap ${destinationSimple.length > 0 && "pt-4"} w-full`}>
                    {destinationSimple.map(item =>
                        <div key={item.id}
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                            <span
                                className="h-full text-gray-500 mr-2 rounded-md">
                                {item.name}
                            </span>
                            <span
                                className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
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
                    onClick={saveSimpleShipping}>
                    Enregistrer
                </button>

                {/* réinitialisation */}
                {isDirtySimpleShipping && (
                    <button
                        className='w-auto ml-5 px-3 h-10  flex flex-row justify-center items-center border border-red-700 rounded-md text-gray-700'
                        onClick={() => {
                            confirmInitShippingForm();
                        }}>
                        Réinitialiser
                    </button>)}
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


export default SimpleMode;


