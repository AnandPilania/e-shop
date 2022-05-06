import { React, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';


const CreateSupplier = () => {

    const {
        nameSupplier, setNameSupplier,
        emailSupplier, setEmailSupplier,
        phoneSupplier, setPhoneSupplier,
        webSiteSupplier, setWebSiteSupplier,
        adressSupplier, setAdressSupplier,
        citySupplier, setCitySupplier,
        countrySupplier, setCountrySupplier,
        listSuppliers, setListSuppliers, 
        initSupplierForm,
        image, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage,
        messageModal, setMessageModal, setSender, textButtonConfirm, setTextButtonConfirm, imageModal, setImageModal, setIs_Edit, listCollections, setListCollections, setListCollectionsFiltered, setListCategories, isDirty, setIsDirty, nameCollection, setNameCollection, descriptionCollection, setDescriptionCollection, descriptionCollectionForMeta, setDescriptionCollectionForMeta, conditions, setConditions, isAutoConditions, setIsAutoConditions, allConditionsNeeded, setAllConditionsNeeded, notIncludePrevProduct, setNotIncludePrevProduct, setWarningIdCondition, normalizUrl, metaTitle, setMetaTitle, metaDescription, setMetaDescription, metaUrl, setMetaUrl, imageName, setImageName, imagePath, alt, setAlt, categoryName, setCategoryName, categoryId, setCategoryId, dateField, setDateField, setTinyLanguage, idCollection, setIdCollection, setTmp_parameter, handleModalConfirm, handleModalCancel, initCollectionForm, is, setIs, collectionForm, setCollectionForm, hasBeenChanged, isNot_isEdit
    } = useContext(AppContext);

    var navigate = useNavigate();
    var formData = new FormData;

    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();

    useEffect(() => {
        // charge la liste des fournisseurs
        Axios.get(`http://127.0.0.1:8000/suppliers-list`)
            .then(res => {
                console.log('suppliers-list  ', res.data),
                    setListSuppliers(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    const checkIfIsDirty = () => {
        if (
            nameSupplier != '' ||
            emailSupplier != '' ||
            phoneSupplier != '' ||
            webSiteSupplier != '' ||
            adressSupplier != '' ||
            citySupplier != '' ||
            countrySupplier != ''
        ) {
            return true;
        } else {
            return false;
        }
    }

 
    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);


    const handleNameSupplier = (e) => {
        setNameSupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handleEmailSupplier = (e) => {
        setEmailSupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handlePhoneSupplier = (e) => {
        setPhoneSupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handleAdressSupplier = (e) => {
        setAdressSupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handleCitySupplier = (e) => {
        setCitySupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handleCountrySupplier = (e) => {
        setCountrySupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };
    const handleWebSiteSupplier = (e) => {
        setWebSiteSupplier(e.target.value);
        setIsDirty(checkIfIsDirty());
    };




    // Reset Form---------------------------------------------------------------
    // confirm reinitialisatio form
    const confirmInitSupplierForm = () => {
        setMessageModal('Êtes-vous sûr de vouloir supprimer tout le contenu du formulaire ?');
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('initSupplierForm');
        setTmp_parameter('');
        setShowModalConfirm(true);
    }


    const validation = () => {

        // check if neme of supplier already exist
        let listSuppliersName = listSuppliers.map(item => item.name);
        if (listSuppliersName.includes(nameSupplier)) {
            setMessageModal('Le nom du fournnisseur que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        if (nameSupplier.length === 0) {
            document.getElementById('nameSupplier').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom est obligatoire');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        if (nameSupplier.length > 255) {
            document.getElementById('nameSupplier').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le nom du fournisseur ne doit pas dépasser 255 caractères');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        } else {
            document.getElementById('nameSupplier').style.border = "solid 1px rgb(220, 220, 220)";
            return true;
        }
    }



    // submit
    function handleSubmit() {
        let valid = validation();

        if (valid) {

            formData.append("nameSupplier", nameSupplier);
            formData.append("emailSupplier", emailSupplier);
            formData.append("phoneSupplier", phoneSupplier);
            formData.append("webSiteSupplier", webSiteSupplier);
            formData.append("adressSupplier", adressSupplier);
            formData.append("citySupplier", citySupplier);
            formData.append("countrySupplier", countrySupplier);

            Axios.post(`http://127.0.0.1:8000/save-supplier`, formData)
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        initSupplierForm();
                        // chargement des fournisseurs
                        // refresh data after save new supplier
                        Axios.get(`http://127.0.0.1:8000/suppliers-list`)
                            .then(res => {
                                setListSuppliers(res.data);
                                navigate('/collections-list');
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
        <div className="form-main-container">
            <div className="form-block-container">
                <div className="div-vert-align">
                    <div className="w100pct h40 flex justify-s align-c">
                        <button className="w100 h40 flex-row-c-c brd-gray-light-1 radius5"
                            onClick={() => {
                                setConditions([{
                                    id: 0,
                                    parameter: '1',
                                    operator: '1',
                                    value: ''
                                }])
                            }}>
                            <Link to="/collections-list">
                                <img src='../images/icons/arrow-left.svg' className="w15 h15 inline" />
                                <span className="m-l-5">Retour</span>
                            </Link>
                        </button>
                        {/* réinitialisation */}
                        {isDirty && (<button className='w100 h40 flex-row-c-c brd-gray-light-1 m-l-auto radius5'
                            onClick={() => {
                                confirmInitSupplierForm();
                            }}>
                            Réinitialiser
                        </button>)}
                    </div>



                    {/* nom */}
                    <div className="div-label-inputTxt">
                        <h2>Nom du fournisseur</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1 red-corner" type='text'
                            id='nameSupplier'
                            value={nameSupplier}
                            onChange={handleNameSupplier}
                        />
                        <span className={`fs14 red ${nameSupplier.length > 255 ? "block" : "none"}`}>Le nom du fournisseur ne peut pas dépasser 255 caractères</span>
                    </div>
                    {/* email */}
                    <div className="div-label-inputTxt">
                        <h2>Email</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={emailSupplier}
                            onChange={handleEmailSupplier}
                        />
                        <span className={`fs14 red ${emailSupplier.length > 255 ? "block" : "none"}`}>L'adresse email ne peut pas dépasser 255 caractères</span>
                    </div>
                    {/* phone */}
                    <div className="div-label-inputTxt">
                        <h2>Téléphone</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={phoneSupplier}
                            onChange={handlePhoneSupplier}
                        />
                        <span className={`fs14 red ${phoneSupplier.length > 50 ? "block" : "none"}`}>Maximum 50 caractères</span>
                    </div>
                    {/* web site */}
                    <div className="div-label-inputTxt">
                        <h2>Site web</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={webSiteSupplier}
                            onChange={handleWebSiteSupplier}
                        />
                        <span className={`fs14 red ${webSiteSupplier.length > 500 ? "block" : "none"}`}>Maximum 500 caractères</span>
                    </div>
                    {/* adresse */}
                    <div className="div-label-inputTxt">
                        <h2>Adresse</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={adressSupplier}
                            onChange={handleAdressSupplier}
                        />
                        <span className={`fs14 red ${adressSupplier.length > 500 ? "block" : "none"}`}>Maximum 500 caractères</span>
                    </div>
                    {/* city */}
                    <div className="div-label-inputTxt">
                        <h2>Ville</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={citySupplier}
                            onChange={handleCitySupplier}
                        />
                        <span className={`fs14 red ${citySupplier.length > 100 ? "block" : "none"}`}>Maximum 100 caractères</span>
                    </div>
                    {/* country */}
                    <div className="div-label-inputTxt">
                        <h2>Pays</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text'
                            value={countrySupplier}
                            onChange={handleCountrySupplier}
                        />
                        <span className={`fs14 red ${countrySupplier.length > 100 ? "block" : "none"}`}>Maximum 100 caractères</span>
                    </div>



                    {/* submit */}
                    <div className="div-label-inputTxt">
                        <button className="btn-submit" onClick={handleSubmit}>
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
            {/* modal for confirmation */}
            <ModalConfirm
                show={showModalConfirm} // true/false show modal
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
                textButtonConfirm={textButtonConfirm}
                image={imageModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirm>
            {/* modal for simple message */}
            <ModalSimpleMessage
                show={showModalSimpleMessage} // true/false show modal
                handleModalCancel={handleModalCancel}
                image={imageModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage>
        </div>
    );
}


export default CreateSupplier;