import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import CollectionContext from '../contexts/CollectionContext';
import Axios from 'axios';
import { useLocalStorage } from "../hooks/useLocalStorage";
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import Conditions from './conditions';
import Optimisation from './optimisation';
import Categories from './categories';
import Activation from './activation';
import Image from './image';
import Tinyeditor from './tinyEditor';



const CreateCollection = () => {

    // form-------------------------------------------------------------------
    const [conditions, setConditions] = useLocalStorage("conditions", [{
        id: 0,
        parameter: '1',
        operator: '1',
        value: ''
    }]);
    const [nameCollection, setNameCollection] = useLocalStorage("nameCollection", "");
    const [descriptionCollection, setDescriptionCollection] = useState(localStorage.getItem('descriptionCollection') ? localStorage.getItem('descriptionCollection') : '');
    // const [descriptionCollection, setDescriptionCollection] = useState('');
    const [metaTitle, setMetaTitle] = useLocalStorage("metaTitle", "");
    const [metaDescription, setMetaDescription] = useLocalStorage("metaDescription", "");
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [imageName, setImageName] = useLocalStorage("imageName", "");
    const [alt, setAlt] = useLocalStorage("altCollection", "");
    const [categoryName, setCategoryName] = useLocalStorage('categoryName', 'Aucune catégorie');
    const [categoryId, setCategoryId] = useLocalStorage("categoryId", "");
    const [dateField, setDateField] = useState('');
    const [descriptionCollectionForMeta, setDescriptionCollectionForMeta] = useState('');
    //--------------------------------------------------------------------Form

    const [deleteThisCategory, setDeleteThisCategory] = useState(null);
    const [isAutoConditions, setIsAutoConditions] = useState(true);
    const [notIncludePrevProduct, setNotIncludePrevProduct] = useState(false);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [tmp_parameter, setTmp_parameter] = useState(); // pour stocker provisoirement une variable
    const [isDirty, setIsDirty] = useState(false);
    const [warningIdCondition, setWarningIdCondition] = useState([]);
    const [tinyLanguage, setTinyLanguage] = useState('fr_FR');

    // remove caracteres unauthorized for url
    const normalizUrl = (str) => {
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };

    const handleModalCancel = () => {
        setShowModalConfirm(false);
        setShowModalSimpleMessage(false);
        setShowModalInput(false);
    };

    // récupère et formatte la date et l'heure de maintenant
    const getNow = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        let minute = '00';
        let seconde = '00';
        var localDatetime =
            (day < 10 ? "0" + day.toString() : day) + "-" +
            (month < 10 ? "0" + month.toString() : month) + "-" +
            year + ' ' +
            (hour < 10 ? "0" + hour.toString() : hour) + ":" +
            (minute.toString())  + ":" +
            (seconde.toString());
        return localDatetime;
    }

    const {
        image, setImage, setFollowThisLink, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage,
        setShowModalInput, messageModal, setMessageModal, sender, setSender, textButtonConfirm, setTextButtonConfirm,
        imageModal, setImageModal, darkMode, setDarkMode
    } = useContext(AppContext);

    // context de create collection
    const collectionContextValue = {
        descriptionCollection, setDescriptionCollection,
        descriptionCollectionForMeta, setDescriptionCollectionForMeta,
        conditions, setConditions,
        isAutoConditions, setIsAutoConditions,
        allConditionsNeeded, setAllConditionsNeeded,
        notIncludePrevProduct, setNotIncludePrevProduct,
        warningIdCondition, setWarningIdCondition,
        normalizUrl,
        metaTitle, setMetaTitle,
        metaDescription, setMetaDescription,
        metaUrl, setMetaUrl,
        imageName, setImageName,
        alt, setAlt,
        categoryName, setCategoryName,
        categoryId, setCategoryId,
        tmp_parameter, setTmp_parameter,
        handleModalCancel,
        deleteThisCategory, setDeleteThisCategory,
        dateField, setDateField,
        tinyLanguage
    }



    var formData = new FormData;

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
        // check if form is dirty
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


    }, []);

    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
        localStorage.setItem("nameCollection", e.target.value);
    };


    //ModalConfirm--------------------------------------------------------------
    const handleModalConfirm = () => {
        setShowModalConfirm(false);

        switch (sender) {
            case 'deleteCategory': // if confirm delete
                setDeleteThisCategory(tmp_parameter);
                break;
            case 'initCollectionForm':
                initCollectionForm();
                break;
            default:
                '';
        }
    };
    //--------------------------------------------------------------ModalConfirm

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

    // réinitialisation des states du form 
    const initCollectionForm = () => {

        setNameCollection('');
        setDescriptionCollection('');
        setDescriptionCollectionForMeta('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');
        setAlt('');
        setImageName('');
        setImage([]);
        setCategoryName('Aucune catégorie');
        setCategoryId('');
        setIsDirty(false);
        setConditions([{
            id: 0,
            parameter: '1',
            operator: '1',
            value: ''
        }]);
        setDateField(getNow());

        // supprime l'image temporaire dans la db et dans le dossier temporaire
        var imageData = new FormData;
        imageData.append('key', 'tmp_imageCollection');
        Axios.post(`http://127.0.0.1:8000/deleteTemporayStoredImages`, imageData)
            .then(res => {
                console.log('res.data  --->  ok');
            });

        // éfface l'image de la dropZone
        var imagesToRemove = document.getElementsByClassName('image-view-dropZone') && document.getElementsByClassName('image-view-dropZone');
        if (imagesToRemove.length > 0) {
            for (let i = 0; i < imagesToRemove.length; i++) {
                imagesToRemove[i].remove();
            }
        }
        // remet l'image de fond
        document.getElementById('drop-region-dropZone').style.backgroundColor = 'none';
        document.getElementById('drop-region-dropZone').style.background = 'no-repeat url("../images/icons/backgroundDropZone.png")';
        document.getElementById('drop-region-dropZone').style.backgroundPosition = 'center 90%';
        document.getElementById("drop-message-dropZone").style.display = 'block';

        // vide le localStorage
        localStorage.removeItem('nameCollection');
        localStorage.removeItem('descriptionCollection');
        localStorage.removeItem('metaTitle');
        localStorage.removeItem('metaDescription');
        localStorage.removeItem('image');
        localStorage.removeItem('imageName');
        localStorage.removeItem('altCollection');
        localStorage.removeItem('metaUrl');
        localStorage.removeItem('categoryName');
        localStorage.removeItem('categoryId');
        localStorage.removeItem('conditions');
        localStorage.removeItem('dateActivation');

    }
    //----------------------------------------------------------------Reset Form

    const validation = () => {
        // !!!! CHECK AUSSI LES CONDITIONS !!!!

        // VALIDATION !!!
        if (metaTitle.length === 0) {
            formData.append("metaTitle", nameCollection);
        } else {
            formData.append("metaTitle", metaTitle);
        }

        if (metaDescription.length === 0) {
            formData.append("metaDescription", '');
        } else {
            formData.append("metaDescription", metaDescription);
        }

        let urlLength = (window.location.origin + '/').length;
        if (metaUrl.length === urlLength) {
            formData.append("metaUrl", normalizUrl(nameCollection));
        } else {
            formData.append("metaUrl", normalizUrl(metaUrl.slice(urlLength)));
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
        } else {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(220, 220, 220)";
            return true;
        }
    }


    // remove records and images files from folders and temporaryStorage db when unused 
    function cleanTemporayStorage(key) {
        let toDelete = new FormData;
        toDelete.append('key', key);

        Axios.post(`http://127.0.0.1:8000/cleanTemporayStorage`, toDelete,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('images handled');
                return res.data;
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });

    }

    function handleSubmit() {
        let valid = validation();
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
            image.length > 0 && formData.append("image", imageFile);
            formData.append('key', 'tmp_imageCollection');

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
                        // gére le netoyage des tinyImages dans table temporayStorage 
                        cleanTemporayStorage('tmp_tinyMceImages');
                        cleanTemporayStorage('tmp_tinyMceVideos');
                        cleanTemporayStorage('tmp_imageCollection');
                    }
                });
        }
    }


    return (
        <div className="collection-main-container">
            <CollectionContext.Provider value={collectionContextValue}>
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
                            <input type='text' id='titreCollection'
                                value={nameCollection}
                                onChange={handleNameCollection}
                            />
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
            </CollectionContext.Provider>
        </div>
    );
}


export default CreateCollection;