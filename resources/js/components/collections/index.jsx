import { React, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import Conditions from './conditions';
import Optimisation from './optimisation';
import Categories from './categories';
import Activation from './activation';
import Image from './image';
import Tinyeditor from './tinyEditor';
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import { getNow, getDateTime } from '../functions/dateTools';

const CreateCollection = () => {

    const {
        image, setImage, setImagePath, setFollowThisLink, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage,
        setShowModalInput, messageModal, setMessageModal, sender, setSender, textButtonConfirm, setTextButtonConfirm, imageModal, setImageModal, is_Edit, setIs_Edit, listCollections, setListCollections, setListCategories, isDirty, setIsDirty, tmp_parameter, nameCollection, setNameCollection, descriptionCollection, setDescriptionCollection,
        descriptionCollectionForMeta, setDescriptionCollectionForMeta, conditions, setConditions, isAutoConditions, setIsAutoConditions,
        allConditionsNeeded, setAllConditionsNeeded, notIncludePrevProduct, setNotIncludePrevProduct, warningIdCondition, setWarningIdCondition,
        normalizUrl, metaTitle, setMetaTitle, metaDescription, setMetaDescription, metaUrl, setMetaUrl, imageName, setImageName,
        alt, setAlt, categoryName, setCategoryName, categoryId, setCategoryId,
        dateField, setDateField, tinyLanguage, setTinyLanguage, id, setId, setTmp_parameter, handleModalConfirm, handleModalCancel, initCollectionForm, cleanTemporayStorage
    } = useContext(AppContext);

    var formData = new FormData;

    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();
    const { collectionId, isEdit } = state !== null ? state : { collectionId: null, isEdit: false };

    useEffect(() => {

        // set date field with localStorage Data
        localStorage.getItem('dateActivation') ? setDateField(localStorage.getItem('dateActivation')) : setDateField(getNow());

        // init metaUrl, "useLocalStorage déclenche des erreurs "
        localStorage.getItem('metaUrl') ? setMetaUrl(localStorage.getItem('metaUrl')) : setMetaUrl(window.location.origin + '/');

        // check if form is dirty
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        })
        if (
            nameCollection != '' ||
            descriptionCollection != '' ||
            alt != '' ||
            imageName != '' ||
            metaTitle != '' ||
            metaDescription != '' ||
            metaUrl != window.location.origin + '/' ||
            image != '' ||
            categoryName != 'Aucune catégorie' ||
            categoryId != 0 ||
            localStorage.getItem('dateActivation') != null ||
            conditonDirty == true
        ) {
            setIsDirty(true);
        }

        // set l'URL de cette page
        let path = window.location.pathname.replace('admin/', '');
        setFollowThisLink(path);


        // detection navigator language
        var userLang = navigator.language || navigator.userLanguage;
        switch (userLang) {
            case 'fr':
                setTinyLanguage('fr_FR');
                break;
            case 'en':
                setTinyLanguage('en_US');
                break;
            case 'de':
                setTinyLanguage('de');
                break;
            case 'it':
                setTinyLanguage('it_IT');
                break;
            case 'ar':
                setTinyLanguage('ar');
                break;
            case 'es':
                setTinyLanguage('es_419');
                break;
            case 'pt':
                setTinyLanguage('pt_BR');
                break;
            case 'ru':
                setTinyLanguage('ru_RU');
                break;
            case 'zh-Hans':
                setTinyLanguage('zh_CN');
                break;
            default:
                setTinyLanguage('fr_FR');
        }


        if (isEdit) {
            alert('on edit')
            console.log('collectionId  ', collectionId)
            initCollectionForm();
            Axios.get(`http://127.0.0.1:8000/getCollectionById/${collectionId}`)
                .then(res => {
                    res.data.objConditions?.length > 0 ? setConditions(JSON.parse(res.data.objConditions)) : setConditions([{ id: 0, parameter: '1', operator: '1', value: '' }]);
                    res.data.automatise === 1 ? setIsAutoConditions(true) : setIsAutoConditions(false);
                    res.data.automatise === 1 ? localStorage.setItem('isAutoConditions', true) : localStorage.setItem('isAutoConditions', false);
                    res.data.allConditionsNeeded === 1 ? setAllConditionsNeeded(true) : setAllConditionsNeeded(false);
                    res.data.notIncludePrevProduct === 1 ? setNotIncludePrevProduct(true) : setNotIncludePrevProduct(false);
                    setId(res.data.id);
                    setNameCollection(res.data.name);
                    setDescriptionCollection(res.data.description);
                    setMetaTitle(res.data.meta_title);
                    setMetaDescription(res.data.meta_description);
                    setMetaUrl(res.data.meta_url);
                    setImageName(res.data.image.replace(/(-\d+\.[a-zA-Z]{2,4})$/, '').replace('images/', ''));
                    setImagePath(res.data.image);
                    setAlt(res.data.alt);
                    res.data.category?.name !== undefined ? setCategoryName(res.data.category?.name) : 'Aucune catégorie';
                    res.data.category_id !== null ? setCategoryId(res.data.category_id) : 0;
                    setDateField(getDateTime(new Date(res.data.dateActivation)));
                    setDescriptionCollectionForMeta('');
                    // 2 x pour que dropZone recharge la bonne image
                    setIs_Edit(true);
                    setIs_Edit(true);

                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }
    }, []);


    // useEffect(() => {
    //     setIsDirty(true);
    // }, [nameCollection, descriptionCollection, conditions, allConditionsNeeded, notIncludePrevProduct, metaTitle, metaDescription, metaUrl, imageName, alt, categoryName, dateField]);


    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
        localStorage.setItem("nameCollection", e.target.value);
    };



    // Reset Form---------------------------------------------------------------
    // confirm reinitialisatio form
    const confirmInitCollectionForm = () => {
        setMessageModal('Êtes-vous sûr de vouloir supprimer tout le contenu de ce formulaire ?')
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('initCollectionForm');
        setTmp_parameter('');
        setShowModalConfirm(true);
    }


    const validation = () => {
        // !!!! CHECK AUSSI LES CONDITIONS !!!!

        // VALIDATION !!!
        if (metaTitle?.length > 0) {
            formData.append("metaTitle", metaTitle);
        } else {
            formData.append("metaTitle", nameCollection);
        }

        if (metaDescription?.length > 0) {
            formData.append("metaDescription", metaDescription);
        } else {
            formData.append("metaDescription", '');
        }

        let meta_url = (window.location.origin + '/');
        if (metaUrl?.length > 0) {
            if (metaUrl === meta_url) {
                formData.append("metaUrl", normalizUrl(nameCollection));
            } else {
                formData.append("metaUrl", normalizUrl(metaUrl.slice(meta_url.length)));
            }
        } else {
            formData.append("metaUrl", normalizUrl(nameCollection));
        }

        // check if there is at least one condition value empty
        let tmp_tab_conditions = [];
        conditions.forEach(condition => {
            if (condition.value === '') {
                tmp_tab_conditions.push(condition.id);
            }
        })
        setWarningIdCondition(tmp_tab_conditions);

        if (isAutoConditions === true && tmp_tab_conditions.length > 0) {
            setMessageModal('Veuillez entrer une ou plusieurs conditons ou sélectionner le type de collection "Manuel" ');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        // check if nema of collection already exist
        let listCollectionName = listCollections.map(item => item.name);
        if (!isEdit && listCollectionName.includes(nameCollection)) {
            setMessageModal('Le nom de collection que vous avez entré éxiste déjà. Veuillez entrer un nom différent');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        if (nameCollection.length === 0) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom de la collection est obligatoire');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        if (nameCollection.length < 3) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le nom de la collection doit contenir au moins trois caractères');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        } else if (nameCollection.length > 191) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le nom de la collection ne doit pas dépasser 191 caractères');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        } else {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(220, 220, 220)";
            return true;
        }
    }


    // submit
    function handleSubmit() {
        let valid = validation();

        // delete removed tinyMCE images in folder and db
        handleTinyMceTemporary(descriptionCollection, id);

        if (valid) {
            let imageFile = null;
            if (image instanceof FileList) {
                imageFile = image[0];
            }
            if (image instanceof Blob) {
                imageFile = image;
            }

            let objConditions = JSON.stringify(conditions);
            formData.append("name", nameCollection);
            formData.append("description", descriptionCollection);
            formData.append("descriptionForMeta", descriptionCollectionForMeta);
            formData.append("automatise", isAutoConditions);
            formData.append("notIncludePrevProduct", notIncludePrevProduct);
            formData.append("allConditionsNeeded", allConditionsNeeded);
            formData.append("objConditions", objConditions);
            formData.append("dateActivation", dateField);
            formData.append("categoryId", categoryId);
            formData.append("alt", alt);
            formData.append("imageName", imageName);
            formData.append("id", id);
            imageFile !== null && formData.append("image", imageFile);

            Axios.post(`http://127.0.0.1:8000/save-collection`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    console.log('res.data  --->  ok');
                    if (res.data === 'ok') {
                        initCollectionForm();
                        // gére le netoyage des images et vidéos dans  temporaryStorage 
                        let keys_toDelete = ['tmp_tinyMceImages', 'tmp_tinyMceVideos', 'tmp_imageCollection']
                        cleanTemporayStorage(keys_toDelete);
                        setId(null);

                        // chargement des collections
                        // refresh data after save new collection
                        Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
                            .then(res => {
                                // listCollections -> liste complète des collections pour handleSearch
                                setListCollections(res.data[0]);
                                setListCategories(res.data[1]);
                            }).catch(function (error) {
                                console.log('error:   ' + error);
                            });
                    }
                });
        }
    }


    return (
        <div className="collection-main-container">
            <div className="collection-block-container">
                <div className="div-vert-align">
                    {/* réinitialisation */}
                    {isDirty && (<button className='btn-effacer-tout'
                        onClick={confirmInitCollectionForm}>
                        Réinitialiser
                    </button>)}
                    {/* nom */}
                    <div className="div-label-inputTxt">
                        <h2>Nom de la collection</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type='text' id='titreCollection'
                            value={nameCollection}
                            onChange={handleNameCollection}
                        />
                        <span className={`fs14 red ${nameCollection.length > 191 ? "block" : "none"}`}>Le nom de la collection ne peut pas dépasser 191 caractères</span>
                    </div>
                    {/* description */}
                    <div className="div-label-inputTxt">
                        <h2>Description (optionnel)</h2>
                    </div>
                    <Tinyeditor />
                </div>
                <Conditions />
                <Optimisation />
                {/* submit */}
                <div className="div-label-inputTxt">
                    <button className="btn-submit" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </div>
            {/* ----------  side  ---------- */}
            <div className='side-create-collection'>
                <Image />
                <Categories />
                <Activation />
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
        </div>
    );
}


export default CreateCollection;