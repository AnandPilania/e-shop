import { React, useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ConditionCollection from './conditionCollection';
import Axios from 'axios';
import DropZone from '../tools/dropZone';
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import ModalInput from '../modal/modalInput';
import AppContext from '../contexts/AppContext';
import { useLocalStorage } from "../hooks/useLocalStorage";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { Editor } from '@tinymce/tinymce-react';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';




const CreateCollection = () => {

    var navigate = useNavigate();

    // form-------------------------------------------------------------------
    const [conditions, setConditions] = useLocalStorage("conditions", [{
        id: 0,
        parameter: '1',
        operator: '1',
        value: ''
    }]);
    const [nameCollection, setNameCollection] = useLocalStorage("nameCollection", "");
    const [descriptionCollection, setDescriptionCollection] = useState(localStorage.getItem('descriptionCollection') ? localStorage.getItem('descriptionCollection') : '');
    const [metaTitle, setMetaTitle] = useLocalStorage("metaTitle", "");
    const [metaDescription, setMetaDescription] = useLocalStorage("metaDescription", "");
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [imageName, setImageName] = useLocalStorage("imageName", "");
    const [alt, setAlt] = useLocalStorage("altCollection", "");
    const [categoryName, setCategoryName] = useLocalStorage('categoryName', 'Aucune catégorie');
    const [categoryId, setCategoryId] = useLocalStorage("categoryId", "");
    const [dateField, setDateField] = useState('');
    //--------------------------------------------------------------------Form

    const [isAutoConditions, setIsAutoConditions] = useState(true);
    const [isShowOptimisation, setIsShowOptimisation] = useState(false);
    const [notIncludePrevProduct, setNotIncludePrevProduct] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [linkCreateCategory, setLinkCreateCategory] = useState('Créer une nouvelle catégorie.');
    const [newCategorySucces, setNewCategorySucces] = useState(false);
    const [metaTitlebiggerThan50, setMetaTitleBiggerThan50] = useState(false);
    const [metaDescriptionbiggerThan130, setMetaDescriptionbiggerThan130] = useState(false);
    const [showCategorySelect, setShowCategorySelect] = useState(false);

    const [tmp_parameter, setTmp_parameter] = useState(); // pour stocker provisoirement une variable
    const [newCategoryNameUseInMessage, setNewCategoryNameUseInMessage] = useState(''); // pour stocker le nom de la catégorie qui doit être afficher dans le message de confirmation de la creation de la catégorie

    const [isDirty, setIsDirty] = useState(false);
    const [warningIdCondition, setWarningIdCondition] = useState([]);
    const [tinyImagesList, setTinyImagesList] = useState([]);
    const { image, setImage, followThisLink, setFollowThisLink, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage, showModalCroppeImage, setShowModalCroppeImage,
        showModalInput, setShowModalInput, messageModal, setMessageModal, sender, setSender, inputTextModify, setInputTextModify,
        textButtonConfirm, setTextButtonConfirm,
        imageModal, setImageModal, darkMode, setDarkMode } = useContext(AppContext);

    var formData = new FormData;

    useEffect(() => {
        // chargement des collections
        Axios.get(`http://127.0.0.1:8000/getCategories`)
            .then(res => {
                setCategoriesList(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });


        // init metaUrl, "useLocalStorage déclenche des erreurs "
        localStorage.getItem('metaUrl') ? setMetaUrl(localStorage.getItem('metaUrl')) : setMetaUrl(window.location.origin + '/');

        // set date field with localStorage Data
        localStorage.getItem('dateActivation') ? setDateField(localStorage.getItem('dateActivation')) : setDateField(getNow());

        // affiche en rouge un avertissement sur la longeur du méta title
        if (localStorage.getItem('metaTitle').length > 50) {
            setMetaTitleBiggerThan50(true);
        } else {
            setMetaTitleBiggerThan50(false);
        }
        // affiche en rouge un avertissement sur la longeur de la méta description
        if (localStorage.getItem('metaDescription').length > 130) {
            setMetaDescriptionbiggerThan130(true);
        } else {
            setMetaDescriptionbiggerThan130(false);
        }

        // détermine si on montre le block conditions
        if (localStorage.getItem('isAutoConditions')) {
            if (localStorage.getItem('isAutoConditions') == 'false') {
                setIsAutoConditions(false);
            } else {
                setIsAutoConditions(true);
            }
        }

        // détermine si on montre le block optimisation
        if (localStorage.getItem('isShowOptimisation')) {
            if (localStorage.getItem('isShowOptimisation') == 'false') {
                setIsShowOptimisation(false);
            } else {
                setIsShowOptimisation(true);
            }
        }

        // check if form is dirty
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;

            }
            // if (isAutoConditions === true && (condition.value === '' || condition.value === null)) {
            //     let tmp_tab_conditions = warningIdCondition;
            //     tmp_tab_conditions.push(condition.id);
            //     setWarningIdCondition(tmp_tab_conditions);
            // }
        })

        if (
            nameCollection != '' ||
            descriptionCollection != '' ||
            alt != '' ||
            imageName != '' ||
            metaTitle != '' ||
            metaDescription != '' ||
            metaUrl != 'http://127.0.0.1:8000/' ||
            image != '' ||
            categoryName != 'Aucune catégorie' ||
            categoryId != 0 ||
            localStorage.getItem('dateActivation') != null ||
            conditonDirty == true
        ) {
            setIsDirty(true);
        }

        // set le l'URL de cette page
        let path = window.location.pathname.replace('admin/', '');
        setFollowThisLink(path);

        // évite error quand on passe à un autre component
        return <>{categoriesList ? categoriesList : ''}</>

    }, []);



    // récupère et formatte la date et l'heure de maintenant
    const getNow = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        // var minute = now.getMinutes(0);
        var localDatetime =
            (day < 10 ? "0" + day.toString() : day) + "-" +
            (month < 10 ? "0" + month.toString() : month) + "-" +
            year + '  ' +
            (hour < 10 ? "0" + hour.toString() : hour) + ":" + "00";

        return localDatetime;
    }

    // CONDITIONS---------------------------------------------------------------
    const addCondition = () => {
        // get bigger id for define the next id to insert in conditions
        var arr = [...conditions];
        const BiggerId = arr.reduce((acc, current) => acc = acc > current.id ? acc : current.id, 0);
        var condition_id = BiggerId + 1;

        setConditions([
            ...conditions, {
                id: condition_id,
                parameter: '1',
                operator: '1',
                value: ''
            }
        ]);

        // dropDown
        var dropable = document.getElementById('conditions_collection');
        dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
    };

    // delete la condition dont l'id correspond à l'id transmis
    const deleteCondition = (id) => {
        var arr = [...conditions];
        var index_arr = arr.findIndex(obj => obj.id == id);
        arr.splice(index_arr, 1);

        setConditions([...arr]);
    }

    // gère le paramètre à changer dans les conditions automatiques
    const handleChangeParam = (param, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].parameter = param;
        setConditions(tmp_conditions);
    };

    // gère le type d'opérations à éffectuer dans les conditons automatiques
    const handleChangeOperator = (e, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].operator = e.target.value;
        setConditions(tmp_conditions);
    };

    // gère la valeur entrée dans les conditions automatiques
    const handleChangeValue = (e, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].value = e.target.value;
        setConditions(tmp_conditions);
    };

    // show / hide conditions
    const showHideConditions = (auto) => {
        if (auto) {
            localStorage.setItem('isAutoConditions', true);
            setIsAutoConditions(true);
        } else {
            localStorage.setItem('isAutoConditions', false);
            setIsAutoConditions(false);
            // réinitialise conditions
            setConditions([{
                id: 0,
                parameter: '1',
                operator: '1',
                value: ''
            }]);
        }

    };

    useEffect(() => {
        localStorage.setItem("conditions", JSON.stringify(conditions));
    }, [conditions]);

    useEffect(() => {
        // dropDown conditions
        var dropable = document.getElementById('conditions_collection');
        if (dropable.style.maxHeight) {
            dropable.style.maxHeight = null;
        } else {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
        }
    }, [isAutoConditions]);
    // ---------------------------------------------------------------CONDITIONS

    // show / hide optimisation title & description & url
    const showHideOptimisation = () => {
        localStorage.setItem("isShowOptimisation", !isShowOptimisation);
        setIsShowOptimisation(!isShowOptimisation);
        // clean fields
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');

        localStorage.removeItem('metaTitle');
        localStorage.removeItem('metaDescription');
        localStorage.removeItem('metaUrl');

    };

    useEffect(() => {
        // dropDown optimisation
        var dropable = document.getElementById('optimisation_collection');
        if (!isShowOptimisation) {
            dropable.style.maxHeight = null;
            dropable.style.overflow = 'hidden';
        } else {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
            setTimeout(function () {
                dropable.style.overflow = 'unset';
            }, 250);
        }
    }, [isShowOptimisation]);


    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
        localStorage.setItem("nameCollection", e.target.value);
    };

    // function strip(htmlText) {
    //     let doc = new DOMParser().parseFromString(htmlText, 'text/html');
    //     return doc.body.textContent || "";
    // };

    const handleDescriptionCollection = (description) => {
        setDescriptionCollection(description);
        localStorage.setItem("descriptionCollection", description);
    };

    const handleMetaTitle = (e) => {
        setMetaTitle(e.target.value);
        localStorage.setItem("metaTitle", e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 50) {
            setMetaTitleBiggerThan50(true);
        } else {
            setMetaTitleBiggerThan50(false);
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescription('');
        setMetaDescription(e.target.value);
        localStorage.setItem("metaDescription", e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 130) {
            setMetaDescriptionbiggerThan130(true);
        } else {
            setMetaDescriptionbiggerThan130(false);
        }
    };

    const handleMetaUrl = (e) => {
        // limit la taille de l'url à 255 caracères
        let urlLength = 2047 - window.location.origin.length;
        let urlName = normalizUrl(e.target.value.substring(window.location.origin.length, 2047));

        setMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
        localStorage.setItem("metaUrl", window.location.origin + '/' + urlName.substring(0, urlLength));
    };

    // remove caracteres unauthorized for url
    const normalizUrl = (str) => {
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };

    // détermine si on inclus les produits déjà enregistrer dans la nouvelle collection
    const handleNotIncludePrevProducts = () => {
        setNotIncludePrevProduct(!notIncludePrevProduct);
    };


    // IMAGE -------------------------------------------------------------------
    // save image from dirty page in temporary_storages db
    useEffect(() => {
        saveInTemporaryStorage('tmp_imageCollection', image);
    }, [image]);


    const handleAlt = (e) => {
        setAlt(e.target.value);
        localStorage.setItem("altCollection", e.target.value);
    };
    const handleImageName = (e) => {
        setImageName(e.target.value);
        localStorage.setItem("imageName", e.target.value);
    };

    //---------------------------------------------------------------------IMAGE

    // CATEGORY ----------------------------------------------------------------
    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

    useEffect(() => {
        // dropDown optimisation
        var dropable = document.getElementById('category_select');
        if (!showCategorySelect) {
            // cache borders sinon y a un bout qui reste visible
            setTimeout(function () {
                dropable.style.borderLeft = 'none';
                dropable.style.borderRight = 'none';
                dropable.style.borderBottom = 'none';
            }, 250);
            dropable.style.maxHeight = null;
            dropable.style.paddingTop = 0;

        } else {
            dropable.style.maxHeight = "250px";
            dropable.style.paddingTop = "5px";
            // montre les borders quand ouvert seulement
            dropable.style.borderLeft = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderRight = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderBottom = 'rgb(220, 220, 220) solid 1px';
        }
    }, [showCategorySelect]);

    // get id for back-end
    const handleCategory = (cat_id) => {
        setCategoryId(cat_id);
        setShowCategorySelect(false);
        localStorage.setItem("categoryId", cat_id);
    };

    // nom affiché dans le select
    const handleCategoryName = (cat_name) => {
        setCategoryName(cat_name);
        localStorage.setItem("categoryName", cat_name);
    };

    // show/hide input create new category
    const handleShowCreateCategory = (e) => {
        e.preventDefault();
        // test du toggle avant le setShowCreateCategory pcq il faut se baser sur le précédent état de showCreateCategory qui a un temps de retard au moment où on exécute cette fonction
        if (showCreateCategory == false) { // au lieu de true
            setLinkCreateCategory('Annuler');
        }

        if (showCreateCategory == true) { // au lieu de false
            setLinkCreateCategory('Créer une nouvelle catégorie.');
        }

        setShowCreateCategory(!showCreateCategory);
    }

    // show modalInput
    const handleShowModalInput = () => {
        setMessageModal('Entrez le nouveau nom de la catégorie')
        setShowModalInput(!showModalInput);
    }

    const handleNewCategoryName = (e) => {
        setNewCategoryName(e.target.value);
    }



    // add one category
    const saveNewCategory = () => {
        if (newCategoryName != '' && newCategoryName.length >= 3) { // au cas où le nouveau nom est vide ou < 3
            Axios.post(`http://127.0.0.1:8000/categories`, { name: newCategoryName })
                .then(res => {
                    setNewCategoryNameUseInMessage(newCategoryName + ' à été ajoutée'); // message affiché après création de la category
                    setShowCreateCategory(false) // hide input create new category
                    setLinkCreateCategory('Créer une nouvelle catégorie.'); // text link create new category
                    setNewCategoryName(''); // reset newCategoryName
                    setNewCategorySucces(true); // show succes message
                    setTimeout(hideMessageSucces, 4000); // during 4 secondes

                    console.log('res.data  --->  ok');
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/getCategories`)
                .then(res => {
                    setCategoriesList(res.data);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

        } else { // warning new category name is empty

            setMessageModal('Le nouveau nom de catégorie doit contenir au moins trois caractères');
            setShowModalConfirm(true); // show modalConfirm
        }
    }

    // hide les méssages de succes apès 4 secondes
    const hideMessageSucces = () => {
        setNewCategorySucces(false);
    }

    // confirm delete one category
    const confirmDeleteCategory = (cat_id, cat_name) => {
        setMessageModal('Supprimer la catégorie "' + cat_name + '" ?')
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('deleteCategory');
        setTmp_parameter(cat_id);
        setShowModalConfirm(true);
    }

    // delete one category
    const deleteCategory = (cat_id) => {
        Axios.delete(`http://127.0.0.1:8000/categories/${cat_id}`)
            .then(res => {
                setShowCategorySelect(false);
                setMessageModal('Suppression réussie')
                setTextButtonConfirm('Fermer');
                setImageModal('../images/icons/trash.png');
                setShowModalConfirm(true);


                // chargement des collections
                Axios.get(`http://127.0.0.1:8000/getCategories`)
                    .then(res => {
                        setCategoriesList(res.data);
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
                setCategoryName('Aucune catégorie');

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    // update one category
    const updateCategory = () => {
        if (inputTextModify != '' && inputTextModify.length >= 3) { // au cas où le nouveau nom est vide ou < 3
            Axios.put(`http://127.0.0.1:8000/categories/${categoryId}`, { name: inputTextModify })
                .then(res => {
                    setNewCategoryNameUseInMessage(inputTextModify + ' à été enregistrée'); // message affiché après modification de la category
                    setNewCategorySucces(true);
                    setTimeout(hideMessageSucces, 4000);

                    console.log('res.data  --->  ok');
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/getCategories`)
                .then(res => {
                    setCategoriesList(res.data);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            setShowModalInput(false);
            setCategoryName('Aucune catégorie');
            setInputTextModify('');

        } else { // warning new modified category name is empty

            setMessageModal('Le nouveau nom de catégorie doit contenir au moins trois caractères');
        }
    }

    // ferme le select de category quand on click en dehors du select
    document.addEventListener("click", (evt) => {
        const categorySelectElement = document.getElementById("categorySelect");
        let targetElement = evt.target; // clicked element

        do {
            if (targetElement == categorySelectElement) {
                // click inside
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside.
        setShowCategorySelect(false);
    });
    //------------------------------------------------------------------Category

    //ModalConfirm--------------------------------------------------------------
    const handleModalConfirm = () => {
        setShowModalConfirm(false);

        switch (sender) {
            case 'deleteCategory': // if confirm delete
                deleteCategory(tmp_parameter);
                break;
            case 'initCollectionForm':
                initCollectionForm();
                break;
            default:
                '';
        }
    };

    const handleModalCancel = () => {
        setShowModalConfirm(false);
        setShowModalSimpleMessage(false);
        setShowModalInput(false);
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

    // réinitialise les champs de l'optimisation seo
    const initOptimisationForm = () => {
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');

        localStorage.removeItem('metaTitle');
        localStorage.removeItem('metaDescription');
        localStorage.removeItem('metaUrl');
    }
    //----------------------------------------------------------------Reset Form



    // CE QUI SUIT DOIT ALLER DANS LA FONCTION handleSubmit !!!!!!!!!!!!!!!!!!!!


    // if (image.length > 0) {
    //     console.log('image  ' + image[0]);
    //     formData.append('image[]', image[0]);
    // } else {
    //     console.log('pas d image ???');
    // };

    // useEffect(() => {

    //         console.log('image has been changed');

    // }, [image]);



    const validation = () => {
        // !!!! CHECK AUSSI LES CONDITIONS !!!!

        // VALIDATION !!!
        if (metaTitle.length === 0) {
            formData.append("metaTitle", nameCollection);
        } else {
            formData.append("metaTitle", metaTitle);
        }

        if (metaDescription.length === 0) {
            if (descriptionCollection.length !== 0) {
                formData.append("metaDescription", descriptionCollection);
            } else {
                formData.append("metaDescription", '');
            }
        } else {
            formData.append("metaDescription", metaDescription);
        }

        let urlLength = (window.location.origin + '/').length;
        if (metaUrl.length === urlLength) {
            formData.append("metaUrl", normalizUrl(nameCollection));
        } else {
            formData.append("metaUrl", normalizUrl(metaUrl.slice(metaUrl.length)));
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

        if (nameCollection.length > 0) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(220, 220, 220)";
            return true;
        } else {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom de la collection est obligatoire');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }
    }

    // detect if tinyMCE images are changed
    function handleChangeTinyImage(str) {
        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = str;

        let imgs = descriptionDiv.getElementsByTagName('img');
        let tmp_tab = Array.from(imgs);
        setTinyImagesList(tmp_tab);
        // if images list have not same length
        // if (tinyImagesList.length !== tmp_tab.length) {
        //     setTinyImagesList(tmp_tab);
        //     getImageFromTinyMCE(str);
        //     descriptionDiv.remove();
        //     return;
        // }
        // if files are not the same
        if (tmp_tab.length > 0 && tinyImagesList.length > 0) {
            // console.log('tmp_tab   ', tmp_tab[0].src);
            // console.log('tinyImagesList   ', tinyImagesList[0].src);

            tinyImagesList.forEach(image => {
                tmp_tab.includes(image) ? true : console.log(image.src);
            })
        }

        if (tinyImagesList.length === tmp_tab.length) {
            let dataToDelete = FormData;

  
            // for (let i = 0; i < imgs.length; i++) {
            //     if (imgs[i].src !== tinyImagesList[i].src) {
            //         dataToDelete.append('dataToDelete', )
            //         Axios.post(`http://127.0.0.1:8000/deleteTinyMceTemporayStoredImages`, tmp_Data,
            //             {
            //                 headers: {
            //                     'Content-Type': 'multipart/form-data'
            //                 }
            //             })
            //             .then(res => {
            //                 console.log('image has been changed');
            //                 return res.data;
            //             })
            //             .catch(error => {
            //                 console.log('Error Image upload failed : ' + error.status);
            //             });

            //         descriptionDiv.remove();
            //         return;
            //     }
            // }
        }
    }

    // save blob file images from tinyMCE in temporaryStorage
    function getImageFromTinyMCE(str) {

        var descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = str;

        fetch(descriptionDiv.getElementsByTagName('img')[0].src)
            .then(function (response) {
                return response.blob();
            })
            .then(async (tinyImage) => {

                // need blob inside array !!!
                let tab = [];
                tab.push(tinyImage);
                return saveInTemporaryStorage('tmp_tinyMceImages', tab);
            })
            .then((response) => {
                if (descriptionDiv.getElementsByTagName('img').length > 0) {
                    descriptionDiv.getElementsByTagName('img')[0].setAttribute('src', response);
                }
            })
            .catch(function (error) {
                console.log('error:   ' + error);
            });
    }


    // save tinymce images in temporary Storage folder and db table
    function tinyMCE_image_upload_handler(blobInfo, success, failure, progress) {
        let tab = [];
        tab.push(blobInfo.blob());
        let response = async () => {
            return saveInTemporaryStorage('tmp_tinyMceImages', tab)
        }
        response().then(response => {
            success(response);
        });
    };






    function handleSubmit() {

        let valid = validation();
        if (valid) {
            var objConditions = JSON.stringify(conditions);

            formData.append("imagesFromTinyMCE", imagesFromTinyMCE);
            formData.append("name", nameCollection);
            formData.append("description", descriptionCollection);
            formData.append("automatise", isAutoConditions);
            formData.append("notIncludePrevProduct", notIncludePrevProduct);
            formData.append("allConditionsNeeded", allConditionsNeeded);
            formData.append("objConditions", objConditions);
            formData.append("dateActivation", dateField);
            formData.append("categoryId", categoryId);
            formData.append("alt", alt);
            formData.append("imageName", imageName);
            formData.append('key', 'tmp_imageCollection');

            Axios.post(`http://127.0.0.1:8000/save-collection`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    console.log('res.data  --->  ok');
                    initCollectionForm();
                });
        }
    }


    return (
        <div className="collection-main-container">
            <div className="collection-block-container">
                {/* nom */}
                <div className="div-vert-align">
                    {isDirty && (<button className='btn-effacer-tout'
                        onClick={confirmInitCollectionForm}>
                        Réinitialiser
                    </button>)}
                    <div className="div-label-inputTxt">
                        <h2>Nom de la collection</h2>
                        <input type='text' id='titreCollection'
                            value={nameCollection}
                            onChange={handleNameCollection}
                            placeholder='ex. Robes, Opération déstockage, Collection hiver' />
                    </div>

                    {/* description */}
                    <div className="div-label-inputTxt">
                        <h2>Description (optionnel)</h2>
                    </div>
                    <>
                        <Editor
                            apiKey="859uqxkoeg5bds7w4yx9ihw5exy86bhtgq56fvxwsjopxbf2"
                            // onInit={(evt, editor) => editorRef.current = editor}
                            // initialValue={descriptionCollection}
                            value={descriptionCollection}
                            onEditorChange={
                                (newText) => {
                                    handleDescriptionCollection(newText);
                                    handleChangeTinyImage(newText);
                                }
                            }
                            init={{
                                entity_encoding: "raw",
                                branding: false,
                                width: '100%',
                                height: 250,
                                autoresize_bottom_margin: 50,
                                max_height: 500,
                                menubar: true,
                                statusbar: false,
                                content_langs: [
                                    { title: 'Arab', code: 'ar' },
                                    { title: 'English', code: 'en_US' },
                                    { title: 'Spanish', code: 'es_419' },
                                    { title: 'French', code: 'fr_FR' },
                                    { title: 'German', code: 'de' },
                                    { title: 'Italian', code: 'it_IT' },
                                    { title: 'Portuguese', code: 'pt_BR' },
                                    { title: 'Russe', code: 'ru_RU' },
                                    { title: 'Chinese', code: 'zh_CN' }
                                ],
                                language: 'fr_FR',
                                // langue_url: '@tinymce/tinymce-react/langs',
                                plugins: [
                                    'advlist autolink lists link image media charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen autoresize',
                                    'insertdatetime media table paste code help wordcount fullscreen code'
                                ],
                                menubar: 'tools insert',
                                toolbar: 'wordcount | undo redo | formatselect | ' +
                                    'bold italic underline forecolor backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'image ' +
                                    'media ' +
                                    'removeformat | help | fullscreen ' +
                                    'language ',

                                //     relative_urls: true,
                                // document_base_url: 'http://127.0.0.1:8000/',
                                
                                images_upload_handler: tinyMCE_image_upload_handler,
                                // allow drop images
                                paste_data_images: true,
                                /* enable title field in the Image dialog*/
                                image_title: true,
                                file_picker_types: 'image media',
                                /* and here's our custom image picker*/
                                file_picker_callback: function (cb, value, meta) {
                                    var input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');
                                    input.onchange = function () {
                                        var file = this.files[0];

                                        var reader = new FileReader();
                                        reader.onload = function () {
                                            var id = 'blobid' + (new Date()).getTime();
                                            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                            var base64 = reader.result.split(',')[1];
                                            var blobInfo = blobCache.create(id, file, base64);
                                            blobCache.add(blobInfo);

                                            /* call the callback and populate the Title field with the file name */
                                            cb(blobInfo.blobUri(), { title: file.name });
                                        };
                                        reader.readAsDataURL(file);
                                    };

                                    input.click();
                                },
                                audio_template_callback: function (data) {
                                    return '<audio controls>' + '\n<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</audio>';
                                },
                                video_template_callback: function (data) {
                                    return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
                                },
                                // a11y_advanced_options: true,
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    </>


                </div>

                {/* type de collection */}
                <div className="div-vert-align">
                    <h2>Type de collection</h2>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio'
                                checked={isAutoConditions == false}
                                onChange={() => showHideConditions(false)} />
                            <label
                                onClick={() => showHideConditions(false)}>
                                Manuel
                            </label>
                        </div>
                        <p>Ajouter un produit à la fois dans cette collection. <a href='#'>Plus d'informations sur les collections manuelles.</a></p>
                    </div>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio'
                                checked={isAutoConditions == true}
                                onChange={() => showHideConditions(true)} />
                            <label
                                onClick={() => showHideConditions(true)}>
                                Automatisé
                            </label>
                        </div>
                        <p>Ajouter automatiquement les produits lorsqu'ils correspondent aux règles définies. <a href='#'>Plus d'informations sur les collections automatisées.</a></p>
                    </div>
                    {/* conditions */}
                    <div className="sub-div-vert-align dropable"
                        id="conditions_collection">
                        <div className="sub-div-vert-align-border-top">
                            <h2>Condition(s)</h2>
                            <h4>Définissez une ou plusieurs règles. Ex. Prix du produit est inférieur à 50 €, Nom du produit contient Robe, etc. Seuls les produits correspondants à vos règles seront intégrés dans cette collection. </h4>
                            <div className="sub-div-horiz-align">
                                <div className="div-radio-label">
                                    <input type='radio' name="condition" id='allConditions'
                                        checked={allConditionsNeeded == true}
                                        onChange={() => setAllConditionsNeeded(true)} />
                                    <label htmlFor='allConditions'>Les produits doivent répondre à toutes les conditions</label>
                                </div>
                                <div className="div-radio-label">
                                    <input type='radio' name="condition" id='leastOnConditions'
                                        checked={allConditionsNeeded == false}
                                        onChange={() => setAllConditionsNeeded(false)}
                                    />
                                    <label htmlFor='leastOnConditions'>Les produits doivent répondre à au moins une condition</label>
                                </div>
                            </div>

                            {/* inputs conditions */}
                            <div className="sub-div-vert-align">
                                {conditions && conditions.map((condition, i) => (
                                    <ConditionCollection
                                        key={i}
                                        handleChangeParam={handleChangeParam}
                                        handleChangeOperator={handleChangeOperator} handleChangeValue={handleChangeValue}
                                        condition={condition}
                                        deleteCondition={deleteCondition}
                                        warningIdCondition={warningIdCondition}
                                    />))}
                                <button className="btn-bcknd mb15" onClick={addCondition}>Ajouter une condition</button>
                            </div>
                            <div className="sub-div-horiz-align">
                                <div className="div-radio-label">
                                    <input type='checkbox'
                                        id="includOnlyNewProducts"
                                        checked={notIncludePrevProduct}
                                        onChange={handleNotIncludePrevProducts} />
                                    <label
                                        htmlFor='includOnlyNewProducts'>
                                        Ne pas inclure les produits déjà enregistrés
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* résultat sur les moteurs de recherche */}
                <div className="div-vert-align">
                    <div className="sub-div-horiz-align">
                        <div className="sub-div-horiz-align">
                            <h2>Optimisation SEO</h2>
                            <input type='checkbox'
                                className="cm-toggle"
                                checked={isShowOptimisation}
                                onChange={showHideOptimisation} />
                        </div>
                        {metaUrl.length > (window.location.origin.toString() + '/').length ?
                            (<button
                                style={{ marginBottom: "10px" }}
                                className='btn-bcknd'
                                onClick={initOptimisationForm}>
                                Annuler
                            </button>) :
                            metaTitle.length > 0 ?
                                (<button
                                    style={{ marginBottom: "10px" }}
                                    className='btn-bcknd'
                                    onClick={initOptimisationForm}>
                                    Annuler
                                </button>) :
                                metaDescription.length > 0 ?
                                    (<button
                                        style={{ marginBottom: "10px" }}
                                        className='btn-bcknd'
                                        onClick={initOptimisationForm}>
                                        Annuler
                                    </button>) : ''}
                    </div>
                    <div className="sub-div-vert-align dropable"
                        id="optimisation_collection">
                        {/* meta-url */}
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>
                                    Url de la page de cette collection
                                </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Utilisez des mots clés en rapport avec le contenu de cette collection <br></br><a href="http://127.0.0.1:8000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="linkInTooltip">Mon lien</a></span>
                                </i>
                            </div>
                            <input type='text'
                                value={metaUrl}
                                onChange={handleMetaUrl}
                                placeholder="Url de cette collection"
                                maxLength="2047"
                            />
                        </div>

                        {/* meta-titre */}
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>
                                    Méta-titre de la page de cette collection
                                </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Le méta-titre est important pour le référencement d'une page web. Sa longueur idéal se situe entre 30 et 60 caractères mais il peut être plus long pour donner plus d'informations sur le contenu de la page. Toutefois, seuls les 50 premiers caractères à peu près seront affichés dans les résultats des moteurs de recherche. C'est pourquoi il est important de commence par des mots clés pertinants pour l'internaute afin d'améliorer le taux de clics vers votre page.</span>
                                </i>
                            </div>
                            <input type='text'
                                value={metaTitle}
                                onChange={handleMetaTitle}
                            />
                            <div className='sub-div-vert-align'>
                                {metaTitlebiggerThan50 &&
                                    <span className="inRed"> Seuls les 50 à 60 premiers caractères seront affichés par les moteurs de recherche
                                    </span>}
                                Nombre de caractères: {metaTitle.length}
                            </div>
                        </div>

                        {/* meta-description */}
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>Méta-déscription de cette collection:</label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Cette déscription sera utilisée pour décrire le contenu de cette page et donner des indications sur son contenu à l'internaute. Les moteurs de recherche affichent à peu près les 130 premiers caractères.</span>
                                </i>
                            </div>
                            <textarea
                                // style={{ opacity: "0.6" }}
                                value={metaDescription}
                                onChange={handleMetaDescription}>
                            </textarea>
                            <div className='sub-div-vert-align'>
                                {metaDescriptionbiggerThan130 &&
                                    <span className="inRed"> Seuls les 120 à 130 premiers caractères seront affichés par les moteurs de recherche
                                    </span>}
                                Nombre de caractères: {metaDescription.length}
                            </div>
                        </div>
                    </div>
                </div>


                {/* submit */}
                <div className="div-label-inputTxt">
                    <button className="btn-submit" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </div>


            {/* ----------  side  ---------- */}
            <div className='side-create-collection'>

                {/* image */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Image</h2>
                        <p>Ajouter une image pour cette collection. (*optionnel)</p>
                        <DropZone multiple={false} setImage={setImage} />
                    </div>

                    {/* Référencement */}
                    <div className="sub-div-vert-align">
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>Texte alternatif (*optionnel) </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliore l'accessibilité et le référencement de votre boutique.</span>
                                </i>
                            </div>
                            <input type="text" name="alt" value={alt} onChange={handleAlt} />
                        </div>
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>Changer le nom de l'image (*optionnel) </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Donnez un nom en rapport avec le contenu de l'image. Ceci améliore le référencement de votre boutique dans les recherches par image.</span>
                                </i>
                            </div>
                            <input type="text" name="imgColection" value={imageName} onChange={handleImageName} />
                        </div>
                    </div>
                </div>

                {/* catégorie */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Catégorie</h2>
                        <p>Attribuer une catégorie à cette collection.
                            (<strong>*optionnel</strong>)
                        </p>
                        <div className="categorySelect" id="categorySelect">
                            <button
                                className='btn-select-category'
                                onClick={showHideCategorySelect}>
                                {categoryName.length > 25 ? categoryName.substring(0, 25) + '...' : categoryName}
                                <i className="fas fa-angle-down"></i>
                            </button>
                            {/* {showCategorySelect && */}
                            <ul className='ul-category dropable'
                                id='category_select'>
                                {categoryName != 'Aucune catégorie' &&
                                    <li className="li-category"
                                        onClick={() => {
                                            handleCategory(0),
                                                handleCategoryName('Aucune catégorie')
                                        }}
                                    >Aucune catégorie
                                    </li>}
                                {categoriesList.map((cat, index) => (
                                    cat.name != categoryName &&
                                    <li className="li-category"
                                        key={index}
                                        onClick={() => {
                                            handleCategory(cat.id);
                                            handleCategoryName(cat.name);
                                        }} >
                                        {cat.name.length > 25 ? <span>{cat.name.substring(0, 25) + '...'}</span> : <span>{cat.name}</span>}
                                        <div>
                                            <i className="fas fa-recycle"
                                                onClick={() => {
                                                    handleCategory(cat.id);
                                                    handleShowModalInput();
                                                }}>
                                            </i>
                                            <i className="far fa-trash-alt"
                                                onClick={() => confirmDeleteCategory(cat.id, cat.name)}></i>
                                        </div>
                                    </li>))}
                            </ul>
                            {/* } */}
                        </div>
                        <p>
                            <a href='#'>Plus d'informations sur les catégories.</a>
                        </p>
                        {newCategorySucces &&
                            <p className='succesMessage'>
                                La catégorie {newCategoryNameUseInMessage}
                            </p>}
                    </div>
                    <p className='pos-abs-bot-rig-15'
                        onClick={(e) => {
                            handleShowCreateCategory(e);
                        }
                        }>
                        <a href=''>{linkCreateCategory}</a>
                    </p>
                    {showCreateCategory && <div className='sub-div-vert-alogn'>
                        <label>Nom de la catégorie</label>
                        <input type='text'
                            value={newCategoryName}
                            onChange={handleNewCategoryName}
                            maxLength="255"
                            placeholder='Entrez un nom'
                        />
                        <button className='btn-bcknd' onClick={saveNewCategory}>
                            Sauvegarder
                        </button>
                    </div>}
                </div>

                {/* Date d'activation */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Activation</h2>
                        <div className='sub-div-horiz-align'>
                            <div className='sub-div-vert-align'>
                                <p>Date</p>
                                <Flatpickr
                                    id="activationDate"
                                    data-enable-time
                                    placeholder={dateField}
                                    position="auto center"
                                    options={{
                                        minDate: 'today',
                                        altInput: false,
                                        disableMobile: "true",
                                        locale: {
                                            weekdays: {
                                                shorthand: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
                                            },
                                            months: {
                                                shorthand: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Déc"],
                                                longhand: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
                                            },
                                            firstDayOfWeek: 0,
                                        },
                                        dateFormat: "d-m-Y H:00",
                                        time_24hr: true,
                                        minuteIncrement: 60
                                    }}
                                    value={""}
                                    onChange={(selectedDates, dateStr, instance) => {
                                        let day = selectedDates[0].getDate();
                                        let month = selectedDates[0].getMonth() + 1;
                                        let year = selectedDates[0].getFullYear();
                                        let hour = selectedDates[0].getHours();
                                        let dateActivation =
                                            (day < 10 ? "0" + day.toString() : day) + "-" +
                                            (month < 10 ? "0" + month.toString() : month) + "-" + year + "  " +
                                            (hour < 10 ? "0" + hour.toString() : hour);
                                        setDateField(dateActivation);
                                        localStorage.setItem("dateActivation", dateActivation);
                                    }}
                                />
                            </div>
                        </div>
                        <p> <a href='#'>Plus d'informations sur l'activation des collections.</a></p>
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

                {/* modal for modify category name */}
                <ModalInput
                    show={showModalInput}
                    updateCategory={updateCategory}
                    handleModalCancel={handleModalCancel}
                    setInputTextModify={setInputTextModify}
                    inputTextModify={inputTextModify}
                    image={'../images/icons/changeCategory.png'}>
                    <h2 className="childrenModal">{messageModal}</h2>
                </ModalInput>

                {/* modal for simple message */}
                <ModalSimpleMessage
                    show={showModalSimpleMessage} // true/false show modal
                    handleModalCancel={handleModalCancel}
                    image={imageModal}>
                    <h2 className="childrenModal">{messageModal}</h2>
                </ModalSimpleMessage>


                {/* crop image */}
                {/* <ModalCroppeImage
                    show={showModalCroppeImage} // true/false show modal
                    handleModalCroppeImageCancel={handleModalCroppeImageCancel}
                    textButtonModalcrop='text1'
                    textButtonModalcrop2='text2'
                    imagePath={imagePath}
                    followThisLink='myLink'>
                    <h2 className="childrenModal">{messageModal}</h2>
                </ModalCroppeImage> */}
            </div>
        </div>
    );
}


export default CreateCollection;