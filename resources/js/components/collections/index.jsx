import { React, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import { usePromptCollection } from '../hooks/usePromptCollection';
import Axios from 'axios';
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import Conditions from './conditions';
import Optimisation from './optimisation';
import Categories from './categories';
import Activation from './activation';
import Image from './image';
import TinyEditor from './tinyEditor';
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import { getNow, getDateTime } from '../functions/dateTools';

const CreateCollection = () => {

    const {
        image, setImagePath, setFollowThisLink, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage,
        messageModal, setMessageModal, setSender, textButtonConfirm, setTextButtonConfirm, imageModal, setImageModal, setIs_Edit, listCollections, setListCollections, setListCollectionsFiltered, setListCategories, isDirty, setIsDirty, nameCollection, setNameCollection, descriptionCollection, setDescriptionCollection, descriptionCollectionForMeta, setDescriptionCollectionForMeta, conditions, setConditions, isAutoConditions, setIsAutoConditions, allConditionsNeeded, setAllConditionsNeeded, notIncludePrevProduct, setNotIncludePrevProduct, setWarningIdCondition, normalizUrl, metaTitle, setMetaTitle, metaDescription, setMetaDescription, metaUrl, setMetaUrl, imageName, setImageName, imagePath, alt, setAlt, categoryName, setCategoryName, categoryId, setCategoryId, dateField, setDateField, setTinyLanguage, idCollection, setIdCollection, setTmp_parameter, handleModalConfirm, handleModalCancel, initCollectionForm, is, setIs, collectionForm, setCollectionForm, hasBeenChanged, isNot_isEdit
    } = useContext(AppContext);

    var navigate = useNavigate();
    var formData = new FormData;

    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();
    const { collectionId, isEdit } = state !== null ? state : { collectionId: null, isEdit: false };

    useEffect(() => {

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


        if (isEdit && !isNot_isEdit) {
            initCollectionForm();
            setIs({ ...is, newCollection: false });
            // pour afficher le bouton initialisation quand on edit
            setIsDirty(true);
            Axios.get(`http://127.0.0.1:8000/getCollectionById/${collectionId}`)
                .then(res => {
                    res.data.objConditions?.length > 0 ? setConditions(JSON.parse(res.data.objConditions)) : setConditions([{ id: 0, parameter: '1', operator: '1', value: '' }]);

                    setIsAutoConditions(res.data.automatise);
                    localStorage.setItem('isAutoConditions', res.data.automatise);

                    setAllConditionsNeeded(res.data.allConditionsNeeded);
                    localStorage.setItem('allConditionsNeeded', res.data.allConditionsNeeded);

                    setNotIncludePrevProduct(res.data.notIncludePrevProduct);
                    localStorage.setItem('notIncludePrevProduct', res.data.notIncludePrevProduct);

                    setIdCollection(res.data.id);
                    setNameCollection(res.data.name);
                    setDescriptionCollection(res.data.description);
                    setMetaTitle(res.data.meta_title);
                    setMetaDescription(res.data.meta_description);

                    setMetaUrl(res.data.meta_url);

                    if (res.data.image !== null && res.data.image !== '') {
                        setImageName(res.data.image.replace(/(-\d+\.[a-zA-Z]{2,4})$/, '').replace('images/', ''));
                        setImagePath(res.data.image);
                    } else {
                        setImageName('');
                        setImagePath('');
                    }

                    setAlt(res.data.alt);
                    setCategoryName(res.data.category !== null ? res.data.category.name : 'Sans catégorie');
                    setCategoryId(res.data.category_id !== null ? res.data.category_id : 1);
                    setDateField(getDateTime(new Date(res.data.dateActivation)));
                    setDescriptionCollectionForMeta('');
                    setCategoryId(res.data.category_id !== null ? res.data.category_id : 1);
                    // check if leave edit without save change --> in usePromptCollection 
                    setCollectionForm({
                        conditions: res.data.objConditions?.length > 0 ? JSON.parse(res.data.objConditions) : [{ id: 0, parameter: '1', operator: '1', value: '' }],
                        nameCollection: res.data.name,
                        descriptionCollection: res.data.description,
                        metaTitle: res.data.meta_title,
                        metaDescription: res.data.meta_description,
                        metaUrl: res.data.meta_url,
                        imageName: res.data.image?.replace(/(-\d+\.[a-zA-Z]{2,4})$/, '').replace('images/', ''),
                        alt: res.data.alt,
                        categoryName: res.data.category?.name !== undefined ? res.data.category.name : 'Sans catégorie',
                        categoryId: res.data.category_id !== null ? res.data.category_id : 1,
                        dateField: getDateTime(new Date(res.data.dateActivation)),
                        imagePath: res.data.image,
                        isAutoConditions: res.data.automatise,
                        notIncludePrevProduct: res.data.notIncludePrevProduct,
                        allConditionsNeeded: res.data.allConditionsNeeded,
                        hasBeenChanged: collectionForm.hasBeenChanged,
                    })

                    setIs_Edit(true);

                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }
    }, []);


    // show or hide reset button
    useEffect(() => {
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        })
        switch (true) {
            case nameCollection.length > 0: setIsDirty(true); break;
            case descriptionCollection.length > 0: setIsDirty(true); break;
            case alt.length > 0: setIsDirty(true); break;
            case imageName.length > 0: setIsDirty(true); break;
            case metaTitle.length > 0: setIsDirty(true); break;
            case metaDescription.length > 0: setIsDirty(true); break;
            case metaUrl != window.location.origin + '/': setIsDirty(true); break;
            case image.length > 0: setIsDirty(true); break;
            case categoryName != 'Sans catégorie': setIsDirty(true); break;
            case categoryId != 1: setIsDirty(true); break;
            case dateField != getNow(): setIsDirty(true); break;
            case conditonDirty == true: setIsDirty(true); break;
            default: setIsDirty(false);
        }
    }, [nameCollection, descriptionCollection, alt, imageName, metaTitle, metaDescription, metaUrl, image, categoryName, categoryId, dateField, conditions]);



    const checkIfIsDirty = () => {

        if (!is.newCollection) {

            if (collectionForm.hasBeenChanged !== hasBeenChanged) {
                return true;
            }

            // tinyMCE ajoute des caractères undefined qui ne permettent pas de faire une comparaison alors on compte chaque caractères dans les deux texte et on compare leur nombre pour avoir plus de chances de repérer les textes différents 
            let maxLength = Math.max(collectionForm.descriptionCollection.length, descriptionCollection.length);
            var a = descriptionCollection;
            var b = collectionForm.descriptionCollection;
            var tab = [];
            for (let i = 0; i < maxLength; i++) {
                if (!tab.includes(a[i]) && a[i] !== null && a[i] !== undefined) {
                    tab.push(a[i]);
                }
            }
            var occurenceA = 0;
            var occurenceB = 0;
            for (let i = 0; i < tab.length; i++) {
                if (tab[i] !== undefined && tab[i].charCodeAt(0) !== 13) {
                    occurenceA = [...a].filter(item => item === tab[i]).length;
                    occurenceB = [...b].filter(item => item === tab[i]).length;
                    if (occurenceA !== occurenceB) {
                        return true;
                    }
                }
            }

            switch (true) {
                case JSON.stringify(collectionForm.conditions) !== JSON.stringify(conditions):
                    return true;
                case collectionForm.nameCollection !== nameCollection:
                    return true;
                case collectionForm.metaTitle !== metaTitle:
                    return true;
                case collectionForm.metaDescription !== metaDescription:
                    return true;
                case collectionForm.metaUrl !== metaUrl:
                    return true;
                case collectionForm.imageName !== imageName:
                    return true;
                case collectionForm.alt !== alt:
                    return true;
                case collectionForm.categoryName !== categoryName:
                    return true;
                case collectionForm.categoryId !== categoryId:
                    return true;
                case collectionForm.dateField !== dateField:
                    return true;
                case collectionForm.isAutoConditions != isAutoConditions:
                    return true;
                case collectionForm.notIncludePrevProduct != notIncludePrevProduct:
                    return true;
                case collectionForm.allConditionsNeeded != allConditionsNeeded:
                    return true;
                default:
                    setIs_Edit(false);
                    setIdCollection(null);
                    return false;
            }
        }

        if (is.newCollection) {
            setIs({ ...is, newCollection: false });
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
                categoryName != 'Sans catégorie' ||
                categoryId != 1 ||
                dateField != getNow() ||
                conditonDirty == true
            ) {
                return true;
            } else {
                setIdCollection(null);
                return false;
            }
        }
    }


    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?', checkIfIsDirty);


    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
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
            if (condition.value == '' || condition.value == null || condition.value == undefined) {
                tmp_tab_conditions.push(condition.id);
            }
        })
        setWarningIdCondition(tmp_tab_conditions);

        if (isAutoConditions == 1 && tmp_tab_conditions.length > 0) {
            setMessageModal('Veuillez entrer une ou plusieurs conditons ou sélectionner le type de collection "Manuel" ');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        // check if neme of collection already exist
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
        handleTinyMceTemporary(descriptionCollection, idCollection, 'collection');

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
            formData.append("id", idCollection);
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
                        setIdCollection(null);
                        // chargement des collections
                        // refresh data after save new collection
                        Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
                            .then(res => {
                                // listCollections -> liste complète des collections pour handleSearch
                                setListCollections(res.data[0]);
                                setListCollectionsFiltered(res.data[0]);
                                setListCategories(res.data[1]);
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
                                setIdCollection(null);
                                confirmInitCollectionForm();
                            }}>
                            Réinitialiser
                        </button>)}
                    </div>
                    {/* nom */}
                    <div className="div-label-inputTxt">
                        <h2>Nom de la collection*</h2>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1 red-corner" type='text' id='titreCollection'
                            value={nameCollection}
                            onChange={handleNameCollection}
                        />
                        <span className={`fs14 red ${nameCollection.length > 191 ? "block" : "none"}`}>Le nom de la collection ne peut pas dépasser 191 caractères</span>
                    </div>
                    {/* description */}
                    <div className="div-label-inputTxt">
                        <h2>Description (optionnel)</h2>
                    </div>
                    <TinyEditor />
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
            <div className='form-side-container'>
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