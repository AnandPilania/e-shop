import { React, useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ConditionCollection from './conditionCollection';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios';
import DropZone from '../tools/dropZone';
import ModalConfirm from '../modal/modalConfirm';
import ModalInput from '../modal/modalInput';
import AppContext from '../contexts/AppContext';
import { useLocalStorage } from "../hooks/useLocalStorage";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";




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
    const [descriptionCollection, setDescriptionCollection] = useLocalStorage("descriptionCollection", "");
    const [metaTitle, setMetaTitle] = useLocalStorage("metaTitle", "");
    const [metaDescription, setMetaDescription] = useLocalStorage("metaDescription", "");
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [alt, setAlt] = useLocalStorage("altCollection", "");
    const [categoryName, setCategoryName] = useLocalStorage('categoryName', 'Aucune catégorie');
    const [categoryId, setCategoryId] = useLocalStorage("categoryId", "");
    const [dateField, setDateField] = useState('');
    //--------------------------------------------------------------------Form

    const [isAutoConditions, setIsAutoConditions] = useState(true);
    const [isShowOptimisation, setIsShowOptimisation] = useState(true);
    const [includePrevProduct, setIncludePrevProduct] = useState(true);
    const [categoriesList, setCategoriesList] = useState([]);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [linkCreateCategory, setLinkCreateCategory] = useState('Créer une nouvelle catégorie.');
    const [newCategorySucces, setNewCategorySucces] = useState(false);
    const [metaTitlebiggerThan50, setMetaTitleBiggerThan50] = useState(false);
    const [metaDescriptionbiggerThan130, setMetaDescriptionbiggerThan130] = useState(false);
    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalCroppeImage, setShowModalCroppeImage] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [sender, setSender] = useState(''); // for modal
    const [tmp_parameter, setTmp_parameter] = useState(); // pour stocker provisoirement une variable
    const [newCategoryNameUseInMessage, setNewCategoryNameUseInMessage] = useState(''); // pour stocker le nom de la catégorie qui doit être afficher dans le message de confirmation de la creation de la catégorie
    const [inputTextModify, setInputTextModify] = useState('');
    const [textButtonConfirm, setTextButtonConfirm] = useState('Confirmer');
    const [imageConfirm, setImageConfirm] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    const { image, setImage, followThisLink, setFollowThisLink, darkMode, setDarkMode } = useContext(AppContext);

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

        // détermine si on montre le block optimisation
        if (localStorage.getItem('isShowOptimisation')) {
            if (localStorage.getItem('isShowOptimisation') == 'false') {
                setIsShowOptimisation(false);
            } else {
                setIsShowOptimisation(true);
            }
        }

        // affiche en rouge un avertissement sur la longeur du méta title
        if (localStorage.getItem('metaTitle').length > 50) {
            setMetaTitleBiggerThan50(true);
        } else {
            setMetaTitleBiggerThan50(false);
        }
        // affiche en rouge un avertissement sur la longeur du méta title
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

    // détermine si on inclus les produits déjà enregistrer dans la nouvelle collection
    const includePrevProducts = (includ) => {
        setIncludePrevProduct(includ);
    };

    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
        localStorage.setItem("nameCollection", e.target.value);
    };

    // function strip(htmlText) {
    //     let doc = new DOMParser().parseFromString(htmlText, 'text/html');
    //     return doc.body.textContent || "";
    // };

    const handleDescriptionCollection = (description) => {
        localStorage.setItem("descriptionCollection", description);
        // descriptionCollection est set dans le component ckeditor donc pas besoin ici
    };

    const handleMetaTitle = (e) => {
        setMetaTitle(e.target.value.trim());
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

        // on remplace les balises de la description dans ckeditor par un espace pour que les mots ne soient pas collés dans l'apérçu de MetaDescription lorsqu'il n'y a pas de méta déscription
        // let htmlDescriptionText = descriptionCollection.replaceAll(/<[\/a-zA-Z0-9]*>/gi, " ");

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

    // IMAGE -------------------------------------------------------------------
    // save image from dirty page in temporary_storages db
    useEffect(() => {
        var tmp_Data = new FormData;
        if (image.length > 0) {
            tmp_Data.append('key', 'tmp_imageCollection');
            tmp_Data.append('value[]', image[0]);
        };
        Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, tmp_Data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('image has been changed');
            });
    }, [image]);


    const handleAlt = (e) => {
        setAlt(e.target.value);
        localStorage.setItem("altCollection", e.target.value);
    };

    //---------------------------------------------------------------------IMAGE

    // CATEGORY ----------------------------------------------------------------
    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

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
        setImageConfirm('../images/icons/trash_dirty.png');
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
                setImageConfirm('../images/icons/trash.png');
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
            // case 'warningEmptyNewCategoryName':
            //     setShowModalInput(false);
            //     break;
            default:
                '';
        }
    };

    const handleModalCancel = () => {
        setShowModalConfirm(false);
        setShowModalInput(false);
    };
    //--------------------------------------------------------------ModalConfirm

    // Reset Form---------------------------------------------------------------
    // réinitialisation des states du form 
    const initCollectionForm = () => {

        setNameCollection('');
        setDescriptionCollection('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');
        setAlt('');
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

        // vide le localStorage
        localStorage.removeItem('nameCollection');
        localStorage.removeItem('descriptionCollection');
        localStorage.removeItem('metaTitle');
        localStorage.removeItem('metaDescription');
        localStorage.removeItem('image');
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
    var formData = new FormData;
    var objConditions = JSON.stringify(conditions);

    // if (image.length > 0) {
    //     console.log('image  ' + image[0]);
    //     formData.append('image[]', image[0]);
    // } else {
    //     console.log('pas d image ???');
    // };

    // useEffect(() => {

    //         console.log('image has been changed');

    // }, [image]);



    // if (metaTitle.length === 0) {
    //    // traitement
    // }     
    // if (metaDescription.length === 0) {
    //    // traitement
    // } 
    // if (metaUrl.length > 0) {
    // window.location.origin + '/'
    //     // traitement
    // } 

    formData.append("name", nameCollection);
    formData.append("description", descriptionCollection);
    formData.append("automatise", isAutoConditions);
    formData.append("includePrevProduct", includePrevProduct);
    formData.append("allConditionsNeeded", allConditionsNeeded);
    formData.append("objConditions", objConditions);
    formData.append("dateActivation", dateField);
    formData.append("categoryId", categoryId);
    formData.append("alt", alt);



    const handleSubmit = () => {

        // VALIDATION !!!

        Axios.post(`http://127.0.0.1:8000/save-collection`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('res.data  --->  ok');

            });
    }


    return (
        <div className="collection-main-container">
            <div className="collection-block-container">
                {/* nom */}
                <div className="div-vert-align">
                    {isDirty && (<button className='btn-bcknd btn-effacer-tout'
                        onClick={initCollectionForm}>
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
                    <CKEditor
                        editor={ClassicEditor}
                        data={descriptionCollection}
                        onReady={editor => {
                            editor.ui.view.element.style.marginBottom = "20px";
                            editor.ui.view.element.style.width = "100%";
                            editor.ui.view.editable.element.style.minHeight = "150px";
                            editor.ui.view.editable.element.style.borderRadius = "0 0 5px 5px";
                        }}
                        onChange={(event, editor) => {
                            setDescriptionCollection(editor.getData());
                            handleDescriptionCollection(editor.getData());
                        }}
                        onBlur={(event, editor) => {
                            editor.ui.view.editable.element.style.minHeight = "150px";
                        }}
                        onFocus={(event, editor) => {
                            editor.ui.view.editable.element.style.minHeight = "150px";
                        }}
                    />
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
                        {isAutoConditions && <div className="sub-div-horiz-align">
                            <div className="div-radio-label">
                                <input type='radio'
                                    checked={includePrevProduct == true}
                                    onChange={() => includePrevProducts(true)} />
                                <label onClick={() => includePrevProducts(true)}>Inclure les produits déjà enregistrés</label>
                            </div>
                            <div className="div-radio-label">
                                <input type='radio'
                                    checked={includePrevProduct == false}
                                    onChange={() => includePrevProducts(false)} />
                                <label onClick={() => includePrevProducts(false)}>Ne pas inclure les produits déjà enregistrés</label>
                            </div>
                        </div>}
                    </div>
                    {/* conditions */}
                    {isAutoConditions &&
                        <div className="sub-div-vert-align-border-top" id="conditions_collection">
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
                                    />))}
                                <button className="btn-bcknd" onClick={addCondition}>Ajouter une condition</button>
                            </div>
                        </div>
                    }
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
                    {isShowOptimisation &&
                        <div className="sub-div-vert-align-border-top">
                            <h3>Coup d'oeil sur le résultat affiché par les moteurs de recherche</h3>
                            {/* meta-url */}
                            <div className="div-label-inputTxt">
                                <div className="sub-div-horiz-align">
                                    <label>
                                        Url de la page de cette collection
                                    </label>
                                    <i className="fas fa-question-circle tooltip">
                                        <span className="tooltiptext">Utilisez des mots clés en rapport avec le contenu de cette collection</span>
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
                    }
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
                        {/* <p><a href="#" onClick={() => navigate('/cropImage')}><i className="fas fa-crop"></i></a></p> */}
                    </div>

                    {/* Référencement */}
                    <div className="sub-div-vert-align">
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>Texte alternatif (*optionnel) </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliorera l'accessibilité et le référencement de votre boutique.</span>
                                </i>
                            </div>
                            <input type="text" name="alt" value={alt} onChange={handleAlt} />
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
                            {showCategorySelect &&
                                <ul className='ul-category'>
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
                                </ul>}
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
                    image={imageConfirm}>
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
