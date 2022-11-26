import React, { useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import { getNow, getDateTime } from '../functions/dateTools';
import { Routes, Route } from 'react-router-dom';
import MainNav from './mainNav';
import Navbar from '../navBar/navBar';
// import AliProductImport from '../aliProductImport/aliProductImport';
import CreateProduct from '../createProduct/createProduct';
import List from '../createProduct/list/list';
import ListCollections from '../collections/list/list';
import CreateCollection from '../collections/index';
import WrapperCreateCollectionCroppeImage from '../collections/wrapperCreateCollectionCroppeImage';
import Settings from '../settings/settings';
import { getIsDocumentHidden } from '../functions/visibilityChange.js';
import { v4 as uuidv4 } from 'uuid';


const Appcontainer = () => {

    //COLLECTION------------------------------------------------------------
    const [conditions, setConditions] = useState([{
        id: 0,
        parameter: '1',
        operator: '1',
        value: '',
        disableOperator: '',
    }]);
    const [nameCollection, setNameCollection] = useState('');
    const [descriptionCollection, setDescriptionCollection] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [metaUrl, setMetaUrl] = useState('');
    const [imageName, setImageName] = useState('');
    const [alt, setAlt] = useState('');
    const [categoryName, setCategoryName] = useState('Sans catégorie');
    const [categoryId, setCategoryId] = useState(1);
    const [dateField, setDateField] = useState(getNow());
    const [descriptionCollectionForMeta, setDescriptionCollectionForMeta] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [image, setImage] = useState([]);
    const [isAutoConditions, setIsAutoConditions] = useState(localStorage.getItem('isAutoConditions') != null ? localStorage.getItem('isAutoConditions') : 1);
    const [notIncludePrevProduct, setNotIncludePrevProduct] = useState(localStorage.getItem('notIncludePrevProduct') != null ? localStorage.getItem('notIncludePrevProduct') : 1);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(localStorage.getItem('allConditionsNeeded') != null ? localStorage.getItem('allConditionsNeeded') : 1);
    const [collectionForm, setCollectionForm] = useState({
        conditions: [{
            id: 0,
            parameter: '1',
            operator: '1',
            value: '',
            disableOperator: '',
        }],
        nameCollection: '',
        descriptionCollection: '',
        metaTitle: '',
        metaDescription: '',
        metaUrl: window.location.origin + '/',
        imageName: '',
        imagePath: '',
        alt: '',
        categoryName: 'Sans catégorie',
        categoryId: 1,
        dateField: getNow(),
        descriptionCollectionForMeta: '',
        image: [],
        isAutoConditions: localStorage.getItem('isAutoConditions') != null ? localStorage.getItem('isAutoConditions') : 1,
        notIncludePrevProduct: localStorage.getItem('notIncludePrevProduct') != null ? localStorage.getItem('notIncludePrevProduct') : 1,
        allConditionsNeeded: localStorage.getItem('allConditionsNeeded') != null ? localStorage.getItem('allConditionsNeeded') : 1,
    })
    const [wrapIndexcroppe, setWrapIndexcroppe] = useState({ component: 'CreateCollection', blob: null });
    const [showInitButton, setShowInitButton] = useState(false);
    const [localStorageImage, setLocalStorageImage] = useState(null);
    //---------------------------------------------------------- collection Form

    const [warningIdCondition, setWarningIdCondition] = useState([]);
    const [tinyLanguage, setTinyLanguage] = useState('fr_FR');
    const [idCollection, setIdCollection] = useState(null);
    // ------------------------------------------------------------- collection 

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalSimpleMessage, setShowModalSimpleMessage] = useState(false);
    const [showModalCroppeImage, setShowModalCroppeImage] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [showModalListOperations, setShowModalListOperations] = useState(false);
    const [showModalConfirmOperations, setShowModalConfirmOperations] = useState('');
    const [messageModal, setMessageModal] = useState('');
    const [messageArray, setMessageArray] = useState([]);
    const [sender, setSender] = useState(''); // for modal
    const [senderCancel, setSenderCancel] = useState('');
    const [inputTextModify, setInputTextModify] = useState('');
    const [textButtonConfirm, setTextButtonConfirm] = useState('Confirmer');
    const [imageModal, setImageModal] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4A90E2');
    const [listCollections, setListCollections] = useState([]);
    const [listCollectionsFiltered, setListCollectionsFiltered] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [is_Edit, setIs_Edit] = useState(false); // -->  dropZone
    const [categoriesChecked, setCategoriesChecked] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [tmp_parameter, setTmp_parameter] = useState(); // pour stocker provisoirement une variable
    const [deleteThisCategory, setDeleteThisCategory] = useState(null);
    const [deleteThisCollection, setDeleteThisCollection] = useState(0);
    const [is, setIs] = useState({
        leaveEditCollectionWithoutSaveChange: false,
        collectionDeleted: false,
    });
    const [listCollectionsChecked, setListCollectionsChecked] = useState([]);
    const [typeOperationListCollections, setTypeOperationListCollections] = useState(0);
    const [notThisId, setNotThisId] = useState([]);
    const [refresh, setRefresh] = useState('');
    const [imageHasBeenChanged, setImageHasBeenChanged] = useState(false);
    const [imagesVariantesToDelete, setImagesVariantesToDelete] = useState([]);

    //Handle options in coonditionsCollections---------------------------
    const [dsablNamProd, setDsablNamProd] = useState(false);
    const [dsablType, setDsablType] = useState(false);
    const [dsablSuppl, setDsablSuppl] = useState(false);
    const [dsablPrice, setDsablPrice] = useState(false);
    const [dsablTag, setDsablTag] = useState(false);
    const [dsablBeforePromo, setDsablBeforePromo] = useState(false);
    const [dsablWeight, setDsablWeight] = useState(false);
    const [dsablStock, setDsablStock] = useState(false);
    const [dsablDate, setDsablDate] = useState(false);
    //----------------------------Handle options in coonditionsCollections

    //------------------------------------------------------------COLLECTION

    //PRODUCT---------------------------------------------------------------
    const [IdProduct, setIdProduct] = useState(0);
    const [showOptions, setShowOptions] = useState(false);
    const [checkedVariantesList, setCheckedVariantesList] = useState([]);
    const [selectedVariantesList, setSelectedVariantesList] = useState([]);
    const [allOptionsVariantesNeeded, setAllOptionsVariantesNeeded] = useState(0);
    const [isHideDeletedVariantes, setIsHideDeletedVariantes] = useState(false);
    const [variante, setVariante] = useState({});
    const [imageVariantes, setImageVariantes] = useState([[]]);
    const [listType, setListType] = useState([]);
    const [optionsData, setOptionsData] = useState([]);
    // const [products, setProducts] = useState([1, 2, 3]);
    const [products, setProducts] = useState([]);
    const [listProductsFiltered, setListProductsFiltered] = useState([]);
    const [listProductsChecked, setListProductsChecked] = useState([]);
    const [listCollectionNames, setListCollectionNames] = useState([]);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [tvaComparation, setTvaComparation] = useState('');
    const [isDirtyCreateProduct, setIsDirtyCreateProduct] = useState(false);
    const [hooksComparation, setHooksComparation] = useState({});
    const [productForm, setProductForm] = useState({
        nameProduct: '',
        isInAutoCollection: true,
        ribbonProduct: '',
        descriptionProduct: '',
        productStatus: 1,
        collections: [],
        productPrice: '',
        reducedProductPrice: '',
        promoApplied: '',
        promoType: '%',
        productCost: '',
        productStock: '',
        unlimited: false,
        productParcelWeight: '',
        productParcelWeightMeasureUnit: 'gr',
        productCode: '',
        transporter: [],
        metaUrlProduct: '',
        metaTitleProduct: '',
        metaDescriptionProduct: '',
        dateFieldProduct: getNow(),
        tva: '',
        supplier: '',
        variantes: [],
        optionsObj: [],
        showOptions: false,
        imageVariantes: [[]],
        isShowPromoProduct: false,
        isDirtyCreateProduct: false,
        isEditProduct: false,
        idProduct: 0,
        changedVariantes: [],
    });

    //---------------------------------------------------------------PRODUCT


    // supplier-------------------------------------------------------------
    const [nameSupplier, setNameSupplier] = useState('');
    const [emailSupplier, setEmailSupplier] = useState('');
    const [phoneSupplier, setPhoneSupplier] = useState('');
    const [webSiteSupplier, setWebSiteSupplier] = useState('');
    const [adressSupplier, setAdressSupplier] = useState('');
    const [citySupplier, setCitySupplier] = useState('');
    const [countrySupplier, setCountrySupplier] = useState('');
    const [listSuppliers, setListSuppliers] = useState([]);

    // TVA---------------------------------------------------------------
    const [activeCalculTva, setActiveCalculTva] = useState(0);
    const [tvaRateList, setTvaRateList] = useState([]);


    // Shipping ---------------------------------------------------------
    const [listTransporters, setListTransporters] = useState([]);


    // GENERAL -----------------------------------------------------------
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [showSideNav, setShowSideNav] = useState(true);
    const [isVisible, setIsVisible] = useState(getIsDocumentHidden())
    const [hasLeaveThisPage, setHasLeaveThisPage] = useState(false);



    useEffect(() => {
        localStorage.removeItem('productForm');
        localStorage.removeItem('collectionForm');

        // chargement des collections
        if (listCollections.length === 0) {
            Axios.get(`/collections-list-back-end`)
                .then(res => {
                    setListCollections(res.data[0]);
                    setListCategories(res.data[1]);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }

        // chargement des configurations
        Axios.get("/getConfigs")
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].param == 'activation_calcul_tva') {
                        setActiveCalculTva(res.data[i].value == "1");
                    }
                }
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });

        // delete all tmp products
        Axios.get("/deleteTmpProducts")
            .then(res => {
                // doit mettre à jour listProductsFiltered pour ne plus afficher le tmp_product dans list quand on rafraichi la page. ce qui est sensé le supprimer.
                setProducts(res.data[0]);
                setListProductsFiltered(res.data[0]);
                setListCollectionNames(res.data[1]);
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });

        // nettoie la table images_products des images temporaires
        Axios.post(`/clean_Images_product_table`);


        // Listener screen size change
        function handleResizeScreen() {
            setScreenSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResizeScreen);
        return () => {
            window.removeEventListener('resize', handleResizeScreen);
        };

    }, []);


    // remove records and images files from folders and temporaryStorage db when unused 
    function cleanTemporayStorage(keys_toDelete) {
        let toDelete = new FormData;
        for (var i = 0; i < keys_toDelete.length; i++) {
            toDelete.append('keys[]', keys_toDelete[i]);
        }
        Axios.post(`/cleanTemporayStorage`, toDelete,
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


    const checkIfCreateProductIsDirty = () => {
        if (isEditProduct) {
            // check collections
            let idsCollectionsPrev = hooksComparation?.collections?.map(x => x.id);
            let idsCollectionsCurr = productForm.collections?.map(x => x.id);
            let isNotColectionsChanged = idsCollectionsPrev?.every(id => idsCollectionsCurr?.includes(id)) && idsCollectionsPrev?.length === idsCollectionsCurr?.length;

            let idsTransportersPrev = hooksComparation?.transporter?.map(x => x.modeId);
            let idsTransportersCurr = productForm.transporter?.map(x => x.modeId);
            let isNotTransportersChanged = idsTransportersPrev?.every(id => idsTransportersCurr?.includes(id)) && idsTransportersPrev?.length === idsTransportersCurr?.length;

            let comparVariantesLibelle = hooksComparation?.variantes?.map(x => x.optionsString)
            let variantesLibelle = productForm.variantes?.map(x => x.optionsString)
            let isNotVaraiantesChanged = variantesLibelle?.every(x => comparVariantesLibelle?.includes(x)) && comparVariantesLibelle?.length === variantesLibelle?.length;

            if (
                hooksComparation.nameProduct != productForm.nameProduct ||
                hooksComparation.isInAutoCollection != productForm.isInAutoCollection ||
                hooksComparation.ribbonProduct != productForm.ribbonProduct ||
                hooksComparation.descriptionProduct != productForm.descriptionProduct ||
                isNotColectionsChanged === false ||
                hooksComparation.productPrice != productForm.productPrice ||
                hooksComparation.reducedProductPrice != productForm.reducedProductPrice ||
                hooksComparation.promoApplied != productForm.promoApplied ||
                hooksComparation.promoType != productForm.promoType ||
                hooksComparation.productCost != productForm.productCost ||
                hooksComparation.productStock != productForm.productStock ||
                hooksComparation.unlimited != productForm.unlimited ||
                hooksComparation.productParcelWeight != productForm.productParcelWeight ||
                hooksComparation.productParcelWeightMeasureUnit != productForm.productParcelWeightMeasureUnit ||
                hooksComparation.productCode != productForm.productCode ||
                isNotTransportersChanged === false ||
                hooksComparation.metaUrlProduct != productForm.metaUrlProduct ||
                hooksComparation.metaTitleProduct != productForm.metaTitleProduct ||
                hooksComparation.metaDescriptionProduct != productForm.metaDescriptionProduct ||
                // // hooksComparation.// // dateFieldProduct
                hooksComparation.tva != productForm.tva?.id ||
                hooksComparation.supplier != productForm.supplier ||
                isNotVaraiantesChanged == false ||
                hooksComparation.isShowPromoProduct != productForm.isShowPromoProduct
            ) {
                setIsDirtyCreateProduct(true);
                return true;
            } else {
                setIsDirtyCreateProduct(false);
                return false;
            }
        } else {
            if (
                productForm.nameProduct != '' ||
                productForm.isInAutoCollection != true ||
                productForm.ribbonProduct != '' ||
                productForm.descriptionProduct != '' ||
                productForm.collections.length > 0 ||
                productForm.productPrice != '' ||
                productForm.reducedProductPrice != '' ||
                productForm.promoApplied != '' ||
                productForm.promoType != '%' ||
                productForm.productCost != '' ||
                productForm.productStock != '' ||
                productForm.unlimited != false ||
                productForm.productParcelWeight != '' ||
                productForm.productParcelWeightMeasureUnit != 'gr' ||
                productForm.productCode != '' ||
                productForm.transporter.length > 0 ||
                productForm.metaUrlProduct != '' ||
                productForm.metaTitleProduct != '' ||
                productForm.metaDescriptionProduct != '' ||
                // // dateFieldProduct
                productForm.tva?.id != tvaComparation?.id ||
                productForm.supplier != '' ||
                productForm.variantes.length > 0 ||
                imageVariantes[0].length > 0 ||
                productForm.isShowPromoProduct != false
            ) {
                setIsDirtyCreateProduct(true);
                return true;
            } else {
                setIsDirtyCreateProduct(false);
                return false;
            }
        }
    }


    // réinitialisation du product form
    const initCreateProduct = () => {
        setProductForm({
            nameProduct: '',
            isInAutoCollection: true,
            ribbonProduct: '',
            descriptionProduct: '',
            productStatus: 1,
            collections: [],
            productPrice: '',
            reducedProductPrice: '',
            promoApplied: '',
            promoType: '%',
            productCost: '',
            productStock: '',
            unlimited: false,
            productParcelWeight: '',
            productParcelWeightMeasureUnit: 'gr',
            productCode: '',
            transporter: [],
            metaUrlProduct: '',
            metaTitleProduct: '',
            metaDescriptionProduct: '',
            dateFieldProduct: getNow(),
            tva: '',
            supplier: '',
            variantes: [],
            optionsObj: [],
            showOptions: false,
            imageVariantes: [[]],
            isShowPromoProduct: false,
            isDirtyCreateProduct: false,
            isEditProduct: false,
            idProduct: 0,
            changedVariantes: [],
        });
        setShowOptions(false);
        setImageVariantes([[]]);
        setIsDirtyCreateProduct(false);
        checkIfCreateProductIsDirty();
        setIdProduct(0);
    }

    // met dans localStorage le productForm et ses images
    const handleLocalStorageProduct = () => {
        let prodGlobalHook = {};
        prodGlobalHook = { ...productForm };
        prodGlobalHook.imageVariantes = imageVariantes;
        localStorage.setItem('productForm', JSON.stringify(prodGlobalHook));
    }



    async function handleLocalStorageCollection() {
        console.log('isEditProduct  ', isEditProduct)
        let collGlobalHook = {};
        if (conditions.length > 0) {
            collGlobalHook.conditions = conditions;
        } else {
            collGlobalHook.conditions = [{ id: 0, parameter: '1', operator: '1', value: '' }];
        }
        collGlobalHook.automatise = isAutoConditions;
        localStorage.setItem('isAutoConditions', isAutoConditions);
        collGlobalHook.allConditionsNeeded = allConditionsNeeded;
        localStorage.setItem('allConditionsNeeded', allConditionsNeeded);
        collGlobalHook.notIncludePrevProduct = notIncludePrevProduct;
        localStorage.setItem('notIncludePrevProduct', notIncludePrevProduct);
        collGlobalHook.idCollection = idCollection;
        collGlobalHook.name = nameCollection;
        collGlobalHook.description = descriptionCollection;
        collGlobalHook.meta_title = metaTitle;
        collGlobalHook.meta_description = metaDescription;
        collGlobalHook.meta_url = metaUrl;

        function readFileAsync(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();

                reader.onload = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;

                reader.readAsDataURL(file);
            })
        }

        async function processFile() {
            try {
                return await readFileAsync(image);
                // const imageBase64 = await readFileAsync(image);
                // return await imageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            } catch (err) {
                console.log(err);
                return '';
            }
        }

        if (image !== null && image !== undefined && image !== '') {
            if (image instanceof File || image instanceof Blob) {
                collGlobalHook.image = await processFile();
                collGlobalHook.imageName = imageName;
            }
        }
        collGlobalHook.imageName = imageName;
        collGlobalHook.alt = alt;
        collGlobalHook.categoryName = categoryName.name !== null ? categoryName.name : 'Sans catégorie';
        collGlobalHook.dateField = dateField;
        collGlobalHook.descriptionCollectionForMeta = '';
        collGlobalHook.categoryId = categoryId !== null ? categoryId : 1;
        localStorage.setItem('collectionForm', JSON.stringify(collGlobalHook));
    }


    const checkIfIsDirty = () => {

        if (is_Edit) {
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

        if (!is_Edit) {
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


    // réinitialisation des states du form collection --------------------------
    const initCollectionForm = () => {
        setNameCollection('');
        setDescriptionCollection('');
        setDescriptionCollectionForMeta('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');
        setAlt('');
        setImageName('');
        setImagePath('');
        setImage([]);
        setCategoryName('Sans catégorie');
        setCategoryId(1);
        setIsDirty(false);
        setConditions([{
            id: 0,
            parameter: '1',
            operator: '1',
            value: '',
            disableOperator: '',
        }]);
        setIsAutoConditions(localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 1);
        setAllConditionsNeeded(localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1);
        setNotIncludePrevProduct(localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1);
        setDateField(getNow());
        setCollectionForm({
            conditions: [{
                id: 0,
                parameter: '1',
                operator: '1',
                value: '',
                disableOperator: '',
            }],
            nameCollection: '',
            descriptionCollection: '',
            metaTitle: '',
            metaDescription: '',
            metaUrl: window.location.origin + '/',
            imageName: '',
            alt: '',
            categoryName: 'Sans catégorie',
            categoryId: 1,
            dateField: getNow(),
            descriptionCollectionForMeta: '',
            imagePath: '',
            image: [],
            isAutoConditions: localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 0,
            notIncludePrevProduct: localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1,
            allConditionsNeeded: localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1,
        });
        setWrapIndexcroppe({ component: 'CreateCollection', blob: null });
        setShowInitButton(false);

        // gére le netoyage des images et vidéos dans  temporayStorage 
        let keys_toDelete = ['tmp_tinyMceImages', 'tmp_tinyMceVideos', 'tmp_imageCollection']
        cleanTemporayStorage(keys_toDelete);

        // éfface l'image de la dropZone
        let img = document.getElementById("imageZone");
        if (img != null) {
            img.src = null;
            img.style.display = "none";

            // remet l'image de fond
            let containerDropZone = document.getElementById('drop-region-dropZone');
            containerDropZone.style.backgroundColor = '#FFFFFF';
            document.getElementById("drop-message-dropZone").style.display = 'block';
        }
    }
    //----------------------------------------------------Reset collection Form

    // reset supplier form ----------------------------------------------------
    const initSupplierForm = () => {
        setNameSupplier('');
        setEmailSupplier('');
        setPhoneSupplier('');
        setWebSiteSupplier('');
        setAdressSupplier('');
        setCitySupplier('');
        setCountrySupplier('');
        setIsDirty(false);
        document.getElementById('nameSupplier').style.border = "solid 1px rgb(220, 220, 220)";
    }
    //------------------------------------------------------reset supplier form


    // remove caracteres unauthorized for url
    const normalizUrl = (str) => {
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };


    //ModalConfirm--------------------------------------------------------------
    const handleModalConfirm = () => {
        setShowModalConfirm(false);

        switch (sender) {
            case 'deleteCategory':
                setDeleteThisCategory(tmp_parameter);
                break;
            case 'deleteCollection':
                let idToDelete = new FormData;
                if (Array.isArray(tmp_parameter)) {
                    var ids_arr = JSON.stringify(tmp_parameter);
                    idToDelete.append('id', ids_arr);
                } else {
                    idToDelete.append('id', tmp_parameter);
                }
                Axios.post(`/deleteCollection`, idToDelete)
                    .then(res => {
                        setListCollections(res.data);
                        setIdCollection(null);
                        setIs({ ...is, collectionDeleted: true });
                        setListCollectionsChecked([]);
                    });
                break;
            case 'initCollectionForm':
                localStorage.removeItem('collectionForm');
                initCollectionForm();
                break;
            case 'initSupplierForm':
                initSupplierForm();
                break;
            case 'leaveEditCollectionWithoutSaveChange':
                setIs({ ...is, leaveEditCollectionWithoutSaveChange: true });
                // vider form creat collection quand on edit sans rien changer
                setIs_Edit(false);
                setIdCollection(null);
                setIsDirty(false);
                initCollectionForm();
                // pour que les conditions soit vides quand on ajoute des conditions à un group de collections
                setConditions([{
                    id: 0,
                    parameter: '1',
                    operator: '1',
                    value: '',
                    disableOperator: '',
                }])
                break;
            case 'addNewConditions':
                let newConditionsData = new FormData;
                newConditionsData.append('conditions', JSON.stringify(tmp_parameter));
                Axios.post(`/addCondtionsToGroup`, newConditionsData)
                    .then(res => {
                        if (res.data === 'ok') {
                            console.log('res.data  --->  ok');
                            setShowModalListOperations(false);
                            setSenderCancel(false);
                            setSender(false);
                            setTmp_parameter(null);
                            setShowModalConfirmOperations(false);
                            setListCollectionsChecked([]);
                            setConditions([{
                                id: 0,
                                parameter: '1',
                                operator: '1',
                                value: '',
                                disableOperator: '',
                            }]);
                            // refresh data after save new conditions
                            // il n'y a pas de delete mais ça permet de refresh list collection
                            setIs({ ...is, collectionDeleted: true });
                        }
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
                break;
            default:
                '';
        }
    };
    //--------------------------------------------------------------ModalConfirm

    const handleModalCancel = () => {
        setShowModalConfirm(false);
        setShowModalConfirmOperations(false);
        setShowModalSimpleMessage(false);
        setShowModalInput(false);
        senderCancel != 'addNewConditions' && setShowModalListOperations(false);
        setSenderCancel(false);
        setMessageArray([]);
    };


    const contextValue = {
        image, setImage,
        imagePath, setImagePath,
        showModalConfirm, setShowModalConfirm,
        showModalSimpleMessage, setShowModalSimpleMessage,
        showModalCroppeImage, setShowModalCroppeImage,
        showModalInput, setShowModalInput,
        messageModal, setMessageModal,
        sender, setSender,
        inputTextModify, setInputTextModify,
        textButtonConfirm, setTextButtonConfirm,
        imageModal, setImageModal,
        selectedColor, setSelectedColor,
        listCollections, setListCollections,
        listCategories, setListCategories,
        is_Edit, setIs_Edit,
        categoriesChecked,
        setCategoriesChecked,
        searchValue, setSearchValue,
        isDirty, setIsDirty,
        tmp_parameter, setTmp_parameter,
        deleteThisCategory, setDeleteThisCategory,
        handleModalConfirm, handleModalCancel,
        nameCollection, setNameCollection,
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
        dateField, setDateField,
        tinyLanguage, setTinyLanguage,
        idCollection, setIdCollection,
        initCollectionForm,
        cleanTemporayStorage,
        is, setIs,
        collectionForm, setCollectionForm,
        deleteThisCollection, setDeleteThisCollection,
        wrapIndexcroppe, setWrapIndexcroppe,
        listCollectionsChecked, setListCollectionsChecked,
        listCollectionsFiltered, setListCollectionsFiltered,
        showModalListOperations, setShowModalListOperations,
        typeOperationListCollections, setTypeOperationListCollections,
        senderCancel, setSenderCancel,
        showModalConfirmOperations, setShowModalConfirmOperations,
        messageArray, setMessageArray,
        notThisId, setNotThisId,
        dsablNamProd, setDsablNamProd,
        dsablType, setDsablType,
        dsablSuppl, setDsablSuppl,
        dsablPrice, setDsablPrice,
        dsablTag, setDsablTag,
        dsablBeforePromo, setDsablBeforePromo,
        dsablWeight, setDsablWeight,
        dsablStock, setDsablStock,
        dsablDate, setDsablDate,
        refresh, setRefresh,
        nameSupplier, setNameSupplier,
        emailSupplier, setEmailSupplier,
        phoneSupplier, setPhoneSupplier,
        webSiteSupplier, setWebSiteSupplier,
        adressSupplier, setAdressSupplier,
        citySupplier, setCitySupplier,
        countrySupplier, setCountrySupplier,
        listSuppliers, setListSuppliers,
        initSupplierForm,
        imageVariantes, setImageVariantes,
        checkedVariantesList, setCheckedVariantesList,
        selectedVariantesList, setSelectedVariantesList,
        allOptionsVariantesNeeded, setAllOptionsVariantesNeeded,
        isHideDeletedVariantes, setIsHideDeletedVariantes,
        variante, setVariante,
        listType, setListType,
        optionsData, setOptionsData,
        activeCalculTva, setActiveCalculTva,
        tvaRateList, setTvaRateList,
        listTransporters, setListTransporters,
        screenSize,
        showSideNav, setShowSideNav,
        products, setProducts,
        listProductsFiltered, setListProductsFiltered,
        listProductsChecked, setListProductsChecked,
        listCollectionNames, setListCollectionNames,
        isEditProduct, setIsEditProduct,
        showInitButton, setShowInitButton,
        imageHasBeenChanged, setImageHasBeenChanged,
        showOptions, setShowOptions,
        IdProduct, setIdProduct,
        initCreateProduct,
        tvaComparation, setTvaComparation,
        isDirtyCreateProduct, setIsDirtyCreateProduct,
        checkIfCreateProductIsDirty,
        hooksComparation, setHooksComparation,
        hasLeaveThisPage, setHasLeaveThisPage,
        isVisible, setIsVisible,
        handleLocalStorageProduct,
        productForm, setProductForm,
        handleLocalStorageCollection,
        localStorageImage, setLocalStorageImage,
        checkIfIsDirty,

    }


    return (
        <AppContext.Provider value={contextValue}>
            <MainNav />
            <div
                className='w-full h-full flex flex-row justify-center items-start'
            >
                <Navbar />
                <div className='w-full bg-[#f6f6f7] overflow-auto'>
                    <Routes>
                        <Route path="/listProduct" element={<List />} />
                        <Route path="/addProduct" element={<CreateProduct />} />
                        <Route path="/collections-list" element={<ListCollections />} />
                        <Route path="/add-collection" element={<WrapperCreateCollectionCroppeImage />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* <Route path="/cropImage" element={<CroppeImage />} /> */}
                        <Route
                            path="*"
                            element={
                                <main style={{ padding: "1rem" }}>
                                    <p>There's nothing here!</p>
                                </main>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default Appcontainer;
