import { React, useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';
// import { useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Axios from 'axios';
import { getNow } from '../functions/dateTools';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../navBar/navBar';
// import AliProductImport from '../aliProductImport/aliProductImport';
import CreateProduct from '../createProduct/createProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/index';
import WrapIndexcroppe from '../collections/wrap_IndexCroppe';
import CreateSupplier from '../suppliers/createSupplier';

const Appcontainer = () => {

    //----------------------------------------------------------------------
    //COLLECTION------------------------------------------------------------
    //----------------------------------------------------------------------

    // collection form----------------------------------------------------------
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
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [imageName, setImageName] = useState('');
    const [alt, setAlt] = useState('');
    const [categoryName, setCategoryName] = useState('Sans catégorie');
    const [categoryId, setCategoryId] = useState(1);
    const [dateField, setDateField] = useState(getNow());
    const [descriptionCollectionForMeta, setDescriptionCollectionForMeta] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [image, setImage] = useState([]);
    const [isAutoConditions, setIsAutoConditions] = useState(localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 0);
    const [notIncludePrevProduct, setNotIncludePrevProduct] = useState(localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1);
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
        alt: '',
        categoryName: 'Sans catégorie',
        categoryId: 1,
        dateField: getNow(),
        descriptionCollectionForMeta: '',
        imagePath: '',
        image: [],
        isAutoConditions: localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 1,
        notIncludePrevProduct: localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1,
        allConditionsNeeded: localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1,
        hasBeenChanged: false,
    })
    const [hasBeenChanged, setHasBeenChanged] = useState(false);
    const [isNot_isEdit, setIsNot_isEdit] = useState(false);
    const [wrapIndexcroppe, setWrapIndexcroppe] = useState(<CreateCollection />);
    //---------------------------------------------------------- collection Form

    const [warningIdCondition, setWarningIdCondition] = useState([]);
    const [tinyLanguage, setTinyLanguage] = useState('fr_FR');
    const [idCollection, setIdCollection] = useState(null);
    // ------------------------------------------------------------- collection 

    const [followThisLink, setFollowThisLink] = useLocalStorage("followThisLink", "");
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
        newCollection: false,
        collectionDeleted: false,
    });
    const [listCollectionsChecked, setListCollectionsChecked] = useState([]);
    const [typeOperationListCollections, setTypeOperationListCollections] = useState(0);
    const [notThisId, setNotThisId] = useState([]);
    const [refresh, setRefresh] = useState('');

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

    const [nameProduct, setNameProduct] = useState('');
    const [descriptionProduct, setDescriptionProduct] = useState('');
    const [collection, setCollection] = useState([]);
    const [productPrice, setProductPrice] = useState('');
    const [previousProductPrice, setPreviousProductPrice] = useState(0);
    const [productCost, setProductCost] = useState(0);
    const [productStock, setProductStock] = useState('');



    // supplier-------------------------------------------------------------
    const [nameSupplier, setNameSupplier] = useState('');
    const [emailSupplier, setEmailSupplier] = useState('');
    const [phoneSupplier, setPhoneSupplier] = useState('');
    const [webSiteSupplier, setWebSiteSupplier] = useState('');
    const [adressSupplier, setAdressSupplier] = useState('');
    const [citySupplier, setCitySupplier] = useState('');
    const [countrySupplier, setCountrySupplier] = useState('');
    const [listSuppliers, setListSuppliers] = useState([]);
    const [supplier, setSupplier] = useState('');


    //---------------------------------------------------------------PRODUCT


    useEffect(() => {
        // chargement des collections
        if (listCollections.length === 0) {
            Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
                .then(res => {
                    setListCollections(res.data[0]);
                    setListCategories(res.data[1]);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }

    }, []);

    // remove records and images files from folders and temporaryStorage db when unused 
    function cleanTemporayStorage(keys_toDelete) {
        let toDelete = new FormData;
        for (var i = 0; i < keys_toDelete.length; i++) {
            toDelete.append('keys[]', keys_toDelete[i]);
        }

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
        setHasBeenChanged(false);
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
            isAutoConditions: localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 1,
            notIncludePrevProduct: localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1,
            allConditionsNeeded: localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1,
            hasBeenChanged: false,
        })
        setIsNot_isEdit(false);

        // gére le netoyage des images et vidéos dans  temporayStorage 
        let keys_toDelete = ['tmp_tinyMceImages', 'tmp_tinyMceVideos', 'tmp_imageCollection']
        cleanTemporayStorage(keys_toDelete);

        // éfface l'image de la dropZone
        var imagesToRemove = document.getElementsByClassName('image-view-dropZone') && document.getElementsByClassName('image-view-dropZone');
        if (imagesToRemove.length > 0) {
            for (let i = 0; i < imagesToRemove.length; i++) {
                imagesToRemove[i].remove();
            }
        }
        // remet l'image de fond
        let checkDropZoneExist = document.getElementById('drop-region-dropZone');
        if (document.body.contains(checkDropZoneExist)) {
            document.getElementById('drop-region-dropZone').style.backgroundColor = 'none';
            document.getElementById('drop-region-dropZone').style.background = 'no-repeat url("../images/icons/backgroundDropZone.png")';
            document.getElementById('drop-region-dropZone').style.backgroundPosition = 'center 90%';
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

    // reset product form ----------------------------------------------------
    const initProductForm = () => {
        setProductPrice(null);
        setPreviousProductPrice(null);
        setProductCost(null);
        setIsDirty(false);
    }
    //------------------------------------------------------reset product form

    // remove caracteres unauthorized for url
    const normalizUrl = (str) => {
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };

    // const location = useLocation();

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

                Axios.post(`http://127.0.0.1:8000/deleteCollection`, idToDelete)
                    .then(res => {
                        setListCollections(res.data);
                        setIdCollection(null);
                        setIs({ ...is, collectionDeleted: true });
                        setListCollectionsChecked([]);
                    });
                break;
            case 'initCollectionForm':
                initCollectionForm();
                break;
            case 'initSupplierForm':
                initSupplierForm();
                break;
            case 'leaveEditCollectionWithoutSaveChange':
                setIs({ ...is, leaveEditCollectionWithoutSaveChange: true });
                setCollectionForm({ ...collectionForm, hasBeenChanged: false });
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
                Axios.post(`http://127.0.0.1:8000/addCondtionsToGroup`, newConditionsData)
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
        followThisLink, setFollowThisLink,
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
        hasBeenChanged, setHasBeenChanged,
        wrapIndexcroppe, setWrapIndexcroppe,
        isNot_isEdit, setIsNot_isEdit,
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
        nameProduct, setNameProduct,
        descriptionProduct, setDescriptionProduct,
        nameSupplier, setNameSupplier,
        emailSupplier, setEmailSupplier,
        phoneSupplier, setPhoneSupplier,
        webSiteSupplier, setWebSiteSupplier,
        adressSupplier, setAdressSupplier,
        citySupplier, setCitySupplier,
        countrySupplier, setCountrySupplier,
        listSuppliers, setListSuppliers,
        supplier, setSupplier,
        initSupplierForm,
        collection, setCollection,
        productPrice, setProductPrice,
        previousProductPrice, setPreviousProductPrice,
        productCost, setProductCost,
        productStock, setProductStock,

    }



    return (
        <AppContext.Provider value={contextValue}>
            <Navbar />
            <div className='bg-gray-cool'>
                <Routes>
                    <Route path="/listProduct" element={<List />} />
                    <Route path="/addProduct" element={<CreateProduct />} />
                    <Route path="/editProduct/:productId" element={<EditProduct />} />
                    <Route path="/editImagesProduct/:product_id" element={<EditImages />} />


                    <Route path="/collections-list" element={<ListCollections />} />
                    <Route path="/add-collection" element={<WrapIndexcroppe />} />
                    <Route path="/add-supplier" element={<CreateSupplier />} />
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
        </AppContext.Provider>
    );
}

export default Appcontainer;
