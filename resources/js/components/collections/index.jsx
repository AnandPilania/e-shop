import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import ModalConfirm from '../modal/modalConfirm';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import Conditions from './conditions';
import Optimisation from './optimisation';
import Categories from './categories';
import Activation from './activation';
import Image from './image';
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import { getNow, getDateTime } from '../functions/dateTools';
import NameCollection from './name';
import DescriptionCollection from './description';
import HeaderIndex from './headerIndex';
import { usePageVisibility } from '../hooks/usePageVisibility';


const CreateCollection = () => {

    const {
        image, setImagePath, showModalConfirm, setShowModalConfirm, showModalSimpleMessage, setShowModalSimpleMessage,
        messageModal, setMessageModal, textButtonConfirm, imageModal, setImageModal, setIs_Edit, listCollections, setListCollections, setListCollectionsFiltered, setListCategories, nameCollection, setNameCollection, descriptionCollection, setDescriptionCollection, descriptionCollectionForMeta, setDescriptionCollectionForMeta, conditions, setConditions, isAutoConditions, setIsAutoConditions, allConditionsNeeded, setAllConditionsNeeded, notIncludePrevProduct, setNotIncludePrevProduct, setWarningIdCondition, normalizUrl, metaTitle, setMetaTitle, metaDescription, setMetaDescription, metaUrl, setMetaUrl, imageName, setImageName, imagePath, alt, setAlt, categoryName, setCategoryName, categoryId, setCategoryId, dateField, setDateField, setTinyLanguage, idCollection, setIdCollection, handleModalConfirm, handleModalCancel, initCollectionForm, collectionForm, setCollectionForm, wrapIndexcroppe, setShowInitButton, imageHasBeenChanged, setImageHasBeenChanged, setHasLeaveThisPage, handleLocalStorageCollection, setIsVisible, setLocalStorageImage } = useContext(AppContext);

    var navigate = useNavigate();
    var formData = new FormData;
    const isVisiblePage = usePageVisibility()

    // collectionId from collection list
    const { state } = useLocation();
    const { collectionId, isEdit } = state !== null ? state : { collectionId: null, isEdit: false };

    // If the page is hidden, save in localStorage;
    useEffect(() => {
        if (!isVisiblePage) {
            if (checkIfIsDirty()) {
                handleLocalStorageCollection();
                setIsVisible(true);
            }
        }
    }, [isVisiblePage]);

    useEffect(() => {
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
            initCollectionForm();
            setShowInitButton(true);
            Axios.get(`http://127.0.0.1:8000/getCollectionById/${collectionId}`)
                .then(res => {
                    setCollectionData(res.data);

                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        } else {
            if (localStorage.getItem('collectionForm') != null) {
                initCollectionForm();
                let data = JSON.parse(localStorage.getItem('collectionForm'));
                setCollectionData(data);
                // loadImagesVariantes(data);
            } else {
                initCollectionForm();
            }
        }

        setHasLeaveThisPage('createCollectionForm')

        return setConditions([{
            id: 0,
            parameter: '1',
            operator: '1',
            value: '',
            disableOperator: '',
        }]);
    }, []);


    const setCollectionData = (data) => {
        data.objConditions?.length > 0 ? setConditions(JSON.parse(data.objConditions)) : setConditions([{ id: 0, parameter: '1', operator: '1', value: '' }]);
        setIsAutoConditions(data.automatise != undefined ? data.automatise : 1);
        setAllConditionsNeeded(data.allConditionsNeeded != undefined ? data.allConditionsNeeded : 1);
        setNotIncludePrevProduct(data.notIncludePrevProduct != undefined ? data.notIncludePrevProduct : 1);
        setIdCollection(data.id);
        setNameCollection(data.name);
        setDescriptionCollection(data.description);
        setMetaTitle(data.meta_title);
        setMetaDescription(data.meta_description);
        setMetaUrl(data.meta_url);
        // localStorageImage est utilisé pour afficher l'image qui vient du localStorage dans dropZone
        if (data.image != undefined && data.image != null && data.image != '' && !isEdit) {
            fetch(data.image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], imageName, { type: "image/png" })
                    console.log('file   ', file)
                    setLocalStorageImage(file);
                });
        }
        // on enlève le uuid du nom
        setImageName(data.image?.replace(/(-\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.[a-zA-Z]{2,4})$/, '').replace('images/', ''));
        setAlt(data.alt);
        setCategoryName(data.category !== null && data.category !== undefined ? data.category.name : 'Sans catégorie');
        setDateField(getDateTime(new Date(data.dateActivation)));
        setDescriptionCollectionForMeta('');
        setCategoryId(data.category_id !== null ? data.category_id : 1);
        // check if leave edit without save change --> in usePromptCollection 
        setCollectionForm({
            conditions: data.objConditions?.length > 0 ? JSON.parse(data.objConditions) : [{ id: 0, parameter: '1', operator: '1', value: '' }],
            nameCollection: data.name,
            descriptionCollection: data.description,
            metaTitle: data.meta_title,
            metaDescription: data.meta_description,
            metaUrl: data.meta_url,
            imageName: data.image?.replace(/(-\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\.[a-zA-Z]{2,4})$/, '').replace('images/', ''),
            alt: data.alt,
            categoryName: data.category !== null && data.category !== undefined ? data.category.name : 'Sans catégorie',
            categoryId: data.category_id !== null && data.category_id !== undefined ? data.category_id : 1,
            dateField: getDateTime(new Date(data.dateActivation)),
            image: data.image,
            isAutoConditions: data.automatise != undefined ? data.automatise : 1,
            notIncludePrevProduct: data.notIncludePrevProduct != undefined ? data.notIncludePrevProduct : 1,
            allConditionsNeeded: data.allConditionsNeeded != undefined ? data.allConditionsNeeded : 1,
            idCollection: data.id,
        })

        setIs_Edit(true);
    }



    // show or hide reset button
    useEffect(() => {
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        });
        switch (true) {
            case nameCollection?.length > 0: setShowInitButton(true); break;
            case descriptionCollection?.length > 0: setShowInitButton(true); break;
            case alt?.length > 0: setShowInitButton(true); break;
            case imageName?.length > 0: setShowInitButton(true); break;
            case metaTitle?.length > 0: setShowInitButton(true); break;
            case metaDescription?.length > 0: setShowInitButton(true); break;
            case metaUrl != '/': setShowInitButton(true); break;
            case image?.length > 0: setShowInitButton(true); break;
            case imagePath?.length > 0: setShowInitButton(true); break;
            case categoryName != 'Sans catégorie': setShowInitButton(true); break;
            case categoryId != 1: setShowInitButton(true); break;
            case dateField != getNow(): setShowInitButton(true); break;
            case conditonDirty == true: setShowInitButton(true); break;
            default: setShowInitButton(false);
        }
    }, [nameCollection, descriptionCollection, alt, imageName, metaTitle, metaDescription, metaUrl, image, imagePath, categoryName, categoryId, dateField, conditions]);


    const checkIfIsDirty = () => {

        if (isEdit) {
            if (wrapIndexcroppe.blob !== null) return true;

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
                case imageHasBeenChanged === true:
                    return true;
                default:
                    setIs_Edit(false);
                    setIdCollection(null);
                    return false;
            }
        }

        if (!isEdit) {
            var conditonDirty = false;
            conditions.forEach(condition => {
                if (condition.value != '') {
                    conditonDirty = true;
                }
            });
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
                // dateField != getNow() ||
                conditonDirty == true ||
                imagePath !== ''
            ) {
                return true;
            } else {
                setIdCollection(null);
                return false;
            }
        }
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

        if (nameCollection?.length === 0) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le champ Nom de la collection est obligatoire');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        if (nameCollection?.length < 3) {
            document.getElementById('titreCollection').style.border = "solid 1px rgb(212, 0, 0)";
            setMessageModal('Le nom de la collection doit contenir au moins trois caractères');
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        } else if (nameCollection?.length > 191) {
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
                    if (res.data === 'ok') {
                        initCollectionForm();
                        setIdCollection(null);
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_33.3333%] gap-4 justify-center items-start lg:w-[95%] xl:w-[90%] 2xl:w-[80%] 3xl:w-[70%] min-h-[100vh] mt-[50px] mx-auto pb-48 text-base">
            <div className="w-full">
                <div className="w-full h-auto flex flex-col justify-start items-start bg-white p-5 mb-2.5 rounded-md shadow-sm">
                    <HeaderIndex />
                    <NameCollection />
                    <DescriptionCollection />
                </div>
                <Conditions />
                <Optimisation />
                {/* submit */}
                <div className="w-full mt-5 flex justify-start">
                    <button className="w-auto px-3 py-2 flex justify-center items-center text-base text-white bg-violet-900 rounded-md" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* ----------  side  ---------- */}
            <div>
                <Image
                    state={state}
                />
                <Categories />
                <Activation />
                <ModalConfirm
                    show={showModalConfirm}
                    handleModalConfirm={handleModalConfirm}
                    handleModalCancel={handleModalCancel}
                    textButtonConfirm={textButtonConfirm}
                >
                    <h2 className="childrenModal">{messageModal}</h2>
                </ModalConfirm>
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