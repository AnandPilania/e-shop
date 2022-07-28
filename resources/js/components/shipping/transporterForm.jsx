import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import InputNumeric from '../form/inputNumeric';
import SelectSimple from '../form/selectSimple';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectWithCheckbox from '../elements/selectWithCheckbox';


const TransporterForm = () => {

    const [shipping, setShipping] = useState({
        name: '',
        criteria: '',
        min_weight: '',
        max_weight: '',
        min_price: '',
        max_price: '',
        destination: [],
        shipping_price: ''
    });
    const [shippingList, setShippingList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destination, setDestination] = useState([]);


    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();

    useEffect(() => {
        // charge la liste des fournisseurs
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setShippingList(res.data[0]);
                setCountryList(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case shipping.name.length > 0: setIsDirty(true); break;
            case shipping.criteria.length > 0: setIsDirty(true); break;
            case shipping.min_weight.length > 0: setIsDirty(true); break;
            case shipping.max_weight.length > 0: setIsDirty(true); break;
            case shipping.min_price.length > 0: setIsDirty(true); break;
            case shipping.max_price.length > 0: setIsDirty(true); break;
            case shipping.destination.length > 0: setIsDirty(true); break;
            case shipping.shipping_price.length > 0: setIsDirty(true); break;
            default: setIsDirty(false);
        }
    }, [shipping]);

    const checkIfIsDirty = () => {
        if (
            shipping.name != '' ||
            shipping.criteria != '' ||
            shipping.min_weight != '' ||
            shipping.max_weight != '' ||
            shipping.min_price != '' ||
            shipping.max_price != '' ||
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
    const handleCriteriaShipping = (e) => {
        // let val = e.target.value == 'Poids' ? 'weight' :
        //     'min_price';
        setShipping({ ...shipping, criteria: e.target.value });
    };
    const handleMin_weightShipping = (e) => {
        setShipping({ ...shipping, min_weight: e.target.value });
    };
    const handleMax_weightShipping = (e) => {
        setShipping({ ...shipping, max_weight: e.target.value });
    };
    const handleMin_priceShipping = (e) => {
        setShipping({ ...shipping, min_price: e.target.value });
    };
    const handleMax_priceShipping = (e) => {
        setShipping({ ...shipping, max_price: e.target.value });
    };
    useEffect(() => {
        setShipping({ ...shipping, destination: destination });
    }, [destination]);
    const handleShipping_price = (e) => {
        setShipping({ ...shipping, shipping_price: e.target.value });
    };



    // reset supplier form 
    const initShippingForm = () => {
        setShipping({
            name: '',
            criteria: '',
            min_weight: '',
            max_weight: '',
            min_price: '',
            max_price: '',
            destination: [],
            shipping_price: ''
        });
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
    function handleSubmit() {

        let valid = validation();

        if (valid) {

            let formDataShipping = new FormData;
            formDataShipping.append('name', shipping.name);
            formDataShipping.append('email', shipping.email);
            formDataShipping.append('phone', shipping.phone);
            formDataShipping.append('website', shipping.website);
            formDataShipping.append('adress', shipping.adress);
            formDataShipping.append('city', shipping.city);
            formDataShipping.append('country', shipping.country);
            formDataShipping.append('info', shipping.info);

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


    const removeDestination = (item) => {
        let index = destination.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destination];
            tmp_arr.splice(index, 1);
            setDestination([...tmp_arr]);
        }
    }


    return (
        <div className="w-full mx-auto mt-10 flex flex-col justify-center items-start text-4">
            <Flex_col_s_s>
                <h2 className='w-full text-xl font-semibold my-4'>Ajouter un transporteur</h2>
                <div className="w-full h-10 mb-10 flex flex-row justify-start items-center">
                    {/* réinitialisation */}
                    {isDirty && (
                        <button
                            className='w-auto ml-5 px-3 h-10  flex flex-row justify-center items-center border border-gray-300 rounded-md'
                            onClick={() => {
                                confirmInitShippingForm();
                            }}>
                            Réinitialiser
                        </button>)}
                </div>

                {/* criteria */}
                <div>
                    <SelectSimple
                        // id={}
                        value={shipping.criteria}
                        handleChange={handleCriteriaShipping}
                        // handleClick={}
                        placeholder=""
                        label="Critère"
                        list={['Poids', 'Prix Minimum']}
                    />
                </div>




                {/* destination */}
                <Flex_col_s_s>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                        Collections
                    </h3>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_destinabbtion"
                        unikId="SelectWithCheckbox_destibbnation"
                        list={countryList}
                        selected={destination}
                        setSelected={setDestination}
                        toggleSelectWithCheckbox={toggleSelectDestination}
                        setToggleSelectWithCheckbox={setToggleSelectDestination}
                    />
                    <div className={`flex flex-wrap ${destination.length > 0 && "pt-4"} w-full`}>
                        {destination.map(item =>
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
                </Flex_col_s_s>



                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
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
                        <span className={`fs14 red ${shipping.name.length > 255 ? "block" : "none"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                    </div>


                    {/* min_weight */}
                    <div>
                        <InputNumeric
                            // id={}
                            value={shipping.min_weight}
                            handleChange={handleMin_weightShipping}
                            // handleClick={}
                            placeholder=""
                            label="Poids minimum"
                            step="1"
                            min="0"
                            max=""
                        />
                        <span className={`fs14 red ${shipping.min_weight.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                    </div>

                    {/* max_weight */}
                    <div>
                        <InputNumeric
                            // id={}
                            value={shipping.max_weight}
                            handleChange={handleMax_weightShipping}
                            // handleClick={}
                            placeholder=""
                            label="Poids maximum"
                            step="1"
                            min="0"
                            max=""
                        />
                        <span className={`fs14 red ${shipping.max_weight.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                    </div>

                </div>



                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
                    {/* min_price */}
                    <div>
                        <InputNumeric
                            // id={}
                            value={shipping.min_price}
                            handleChange={handleMin_priceShipping}
                            // handleClick={}
                            placeholder=""
                            label="Prix minimum"
                            step="0.01"
                            min="0"
                            max=""
                        />
                        <span className={`fs14 red ${shipping.min_price.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                    </div>

                    {/* max_price */}
                    <div>
                        <InputNumeric
                            // id={}
                            value={shipping.max_price}
                            handleChange={handleMax_priceShipping}
                            // handleClick={}
                            placeholder=""
                            label="Prix maximum"
                            step="0.01"
                            min="0"
                            max=""
                        />
                        <span className={`fs14 red ${shipping.max_price.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
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
                        <span className={`fs14 red ${shipping.shipping_price.length > 10 ? "block" : "none"}`}>Maximum 10 caractères</span>
                    </div>

                </div>

                {/* submit */}
                <div className="div-label-inputTxt">
                    <button className="btn-submit" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </Flex_col_s_s>

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


export default TransporterForm;