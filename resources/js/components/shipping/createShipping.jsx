import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import SelectSimple from '../form/selectSimple';
import MainBlock from '../elements/blocks/flex_col_s_s_nowrap';


const CreateShipping = () => {

    const [shipping, setShipping] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        adress: '',
        city: '',
        country: '',
        info: ''
    });
    const [shippingList, setShippingList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showSimpleMessageModal, setShowSimpleMessageModal] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [messageModal, setMessageModal] = useState('');


    var navigate = useNavigate();


    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();

    useEffect(() => {
        // charge la liste des fournisseurs
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                console.log('shipping-list  ', res.data[0]),
                    setShippingList(res.data[0]);
                let tmp_list = res.data[1].map(x => x.name);
                setCountryList(tmp_list);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    // show or hide reset button
    useEffect(() => {
        switch (true) {
            case shipping.name.length > 0: setIsDirty(true); break;
            case shipping.email.length > 0: setIsDirty(true); break;
            case shipping.phone.length > 0: setIsDirty(true); break;
            case shipping.website.length > 0: setIsDirty(true); break;
            case shipping.adress.length > 0: setIsDirty(true); break;
            case shipping.city.length > 0: setIsDirty(true); break;
            case shipping.country.length > 0: setIsDirty(true); break;
            case shipping.info.length > 0: setIsDirty(true); break;
            default: setIsDirty(false);
        }
    }, [shipping]);

    const checkIfIsDirty = () => {
        if (
            shipping.name != '' ||
            shipping.email != '' ||
            shipping.phone != '' ||
            shipping.website != '' ||
            shipping.adress != '' ||
            shipping.city != '' ||
            shipping.country != '' ||
            shipping.info != ''
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
    const handleEmailShipping = (e) => {
        setShipping({ ...shipping, email: e.target.value });
    };
    const handlePhoneShipping = (e) => {
        setShipping({ ...shipping, phone: e.target.value });
    };
    const handleAdressShipping = (e) => {
        setShipping({ ...shipping, adress: e.target.value });
    };
    const handleCityShipping = (e) => {
        setShipping({ ...shipping, city: e.target.value });
    };
    const handleCountryShipping = (e) => {
        setShipping({ ...shipping, country: e.target.value });
    };
    const handleWebSiteShipping = (e) => {
        setShipping({ ...shipping, website: e.target.value });
    };
    const handleInfoShipping = (e) => {
        setShipping({ ...shipping, info: e.target.value });
    };


    // reset supplier form 
    const initShippingForm = () => {
        setShipping({
            name: '',
            email: '',
            phone: '',
            website: '',
            adress: '',
            city: '',
            country: '',
            info: ''
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


    return (
        <div className="w-[950px] min-h-[100vh] mx-auto flex flex-col justify-center items-start text-4">
            <h2 className='w-full text-xl font-semibold my-4'>Ajouter un transporteur</h2>
            <MainBlock>
                <div className="w-full h-10 mb-10 flex flex-row justify-start items-center">
                    <button className="w-auto px-3 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md">
                        <Link to="/collections-list">
                            <img src='../images/icons/arrow-left.svg' className="w-4 h-4 inline" />
                            <span className="ml-1">Retour</span>
                        </Link>
                    </button>
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


                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
                    {/* nom */}
                    <div>
                        <InputText
                            id="nameShipping"
                            value={shipping.name}
                            handleChange={handleNameShipping}
                            // handleClick={}
                            placeholder="Nom"
                            label="Nom du transporteur*"
                        />
                        <span className={`fs14 red ${shipping.name.length > 255 ? "block" : "none"}`}>Le nom du transporteur ne peut pas dépasser 255 caractères</span>
                    </div>
                    {/* email */}
                    <div>
                        <InputText
                            // id={}
                            value={shipping.email}
                            handleChange={handleEmailShipping}
                            // handleClick={}
                            placeholder="Email"
                            label="Email"
                        />
                        <span className={`fs14 red ${shipping.email.length > 255 ? "block" : "none"}`}>L'adresse email ne peut pas dépasser 255 caractères</span>
                    </div>
                    {/* phone */}
                    <div>
                        <InputText
                            // id={}
                            value={shipping.phone}
                            handleChange={handlePhoneShipping}
                            // handleClick={}
                            placeholder="Téléphone"
                            label="Téléphone"
                        />
                        <span className={`fs14 red ${shipping.phone.length > 50 ? "block" : "none"}`}>Maximum 50 caractères</span>
                    </div>

                </div>

                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
                    {/* adresse */}
                    <div className='col-span-3'>
                        <InputText
                            // id={}
                            value={shipping.adress}
                            handleChange={handleAdressShipping}
                            // handleClick={}
                            placeholder="Adresse"
                            label="Adresse"
                        />
                        <span className={`fs14 red ${shipping.adress.length > 500 ? "block" : "none"} col-span-3`}>Maximum 500 caractères</span>
                    </div>
                </div>

                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
                    {/* city */}
                    <div>
                        <InputText
                            // id={}
                            value={shipping.city}
                            handleChange={handleCityShipping}
                            // handleClick={}
                            placeholder="Ville"
                            label="Ville"
                        />
                        <span className={`fs14 red ${shipping.city.length > 100 ? "block" : "none"}`}>Maximum 100 caractères</span>
                    </div>
                    {/* country */}
                    <div>
                        <SelectSimple
                            // id={}
                            value={shipping.country}
                            handleChange={handleCountryShipping}
                            // handleClick={}
                            placeholder="Pays"
                            label="Pays"
                            list={countryList}
                        />
                        <span className={`fs14 red ${shipping.country.length > 100 ? "block" : "none"}`}>Maximum 100 caractères</span>
                    </div>
                </div>

                <div className='w-full grid grid-cols-3 gap-5 justify-start items-center'>
                    {/* web site */}
                    <div>
                        <InputText
                            // id={}
                            value={shipping.website}
                            handleChange={handleWebSiteShipping}
                            // handleClick={}
                            placeholder="Site web"
                            label="Site web"
                        />
                        <span className={`fs14 red ${shipping.website.length > 500 ? "block" : "none"}`}>Maximum 500 caractères</span>
                    </div>
                    {/* info */}
                    <div className='col-span-2'>
                        <InputText
                            // id={}
                            value={shipping.info}
                            handleChange={handleInfoShipping}
                            // handleClick={}
                            placeholder="Commentaire"
                            label="Commentaire"
                        />
                        <span className={`fs14 red ${shipping.info.length > 500 ? "block" : "none"} col-span-2`}>Maximum 500 caractères</span>
                    </div>
                </div>

                {/* submit */}
                <div className="div-label-inputTxt">
                    <button className="btn-submit" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </MainBlock>

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


export default CreateShipping;