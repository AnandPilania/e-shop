import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import SelectWithCheckbox from '../elements/selectWithCheckbox';


const SimpleMode = ({ shippingList, setShippingList, countryList }) => {

    const [shipping, setShipping] = useState({
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
    const [messageModal, setMessageModal] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destinationSimple, setDestinationSimple] = useState([]);


    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();



    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case shipping.name.length > 0: setIsDirtySimpleShipping(true); break;
            case shipping.destination.length > 0: setIsDirtySimpleShipping(true); break;
            case shipping.shipping_price.length > 0: setIsDirtySimpleShipping(true); break;
            default: setIsDirtySimpleShipping(false);
        }
    }, [shipping]);

    const checkIfIsDirty = () => {
        if (
            shipping.name != '' ||
            shipping.destination != '' ||
            shipping.shipping_price != ''
        ) {
            return true;
        } else {
            return false;
        }
    }

    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);


    const handleNameShipping = (e) => {
        setShipping({ ...shipping, name: e.target.value });
    };
    useEffect(() => {
        setShipping({ ...shipping, destination: destinationSimple });
    }, [destinationSimple]);
    const handleShipping_price = (e) => {
        setShipping({ ...shipping, shipping_price: e.target.value });
    };

    const removeDestination = (item) => {
        let index = destinationSimple.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destinationSimple];
            tmp_arr.splice(index, 1);
            setDestinationSimple([...tmp_arr]);
        }
    }



    // reset supplier form 
    const initShippingForm = () => {
        setShipping({
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
        if (shipping_List_name.includes(shipping.name)) {
            setMessageModal('Le nom du transporteur que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shipping.name.length === 0) {
            document.getElementById('nameShipping').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom du transporteur est obligatoire');
            setShowSimpleMessageModal(true);
            return false;
        }

        if (shipping.name.length > 255) {
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
            formDataShipping.append('name', shipping.name);
            formDataShipping.append('criteria', shipping.criteria);
            formDataShipping.append('min_weight', '');
            formDataShipping.append('max_weight', '');
            formDataShipping.append('min_price', '');
            formDataShipping.append('max_price', '');
            formDataShipping.append('destination', shipping.destination);
            formDataShipping.append('shipping_price', shipping.shipping_price);


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
            <div className='w-full grid grid-cols-[1fr_1fr_100px] gap-5 justify-start items-center'>
                {/* name */}
                <div>
                    <InputText
                        id="nameShipping"
                        value={shipping.name}
                        handleChange={handleNameShipping}
                        // handleClick={}
                        placeholder=""
                        label="Nom"
                    />
                    <span className={`text-sm text-red-700 ${shipping.name.length > 255 ? "block" : "none"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                </div>


                {/* shipping_price */}
                <div>
                    <InputNumeric
                        // id={}
                        value={shipping.shipping_price}
                        handleChange={handleShipping_price}
                        // handleClick={}
                        placeholder=""
                        label="Tarif"
                        step="0.01"
                        min="0"
                        max=""
                    />
                    <span className={`text-sm text-red-700 ${shipping.shipping_price.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                </div>

            </div>

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


