import { React, useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';
import { useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Axios from 'axios';
import { getNow } from '../functions/dateTools';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/index';
import ModalApp from '../modal/modalApp';
import CroppeImage from '../croppeJs/croppeJs';


const Appcontainer = () => {

    // collection form----------------------------------------------------------
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
    const [descriptionCollectionForMeta, setDescriptionCollectionForMeta] = useState('');
    const [imagePath, setImagePath] = useLocalStorage("imagePath", "");
    const [image, setImage] = useState([]);
    const [isAutoConditions, setIsAutoConditions] = useState(true);
    const [notIncludePrevProduct, setNotIncludePrevProduct] = useState(false);
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [collectionForm, setCollectionForm] = useState({
        conditions: [{
            id: 0,
            parameter: '1',
            operator: '1',
            value: ''
        }],
        nameCollection: '',
        descriptionCollection: '',
        metaTitle: '',
        metaDescription: '',
        metaUrl: window.location.origin + '/',
        imageName: '',
        alt: '',
        categoryName: 'Aucune catégorie',
        categoryId: '',
        dateField: '',
        descriptionCollectionForMeta: '',
        imagePath: '',
        image: [],
        isAutoConditions: true,
        notIncludePrevProduct: false,
        allConditionsNeeded: true,
    })
    //---------------------------------------------------------- collection Form

    // collection --------------------------------------------------------------


    const [warningIdCondition, setWarningIdCondition] = useState([]);
    const [tinyLanguage, setTinyLanguage] = useState('fr_FR');
    const [id, setId] = useState(null);
    // ------------------------------------------------------------- collection 

    const [showModalApp, setShowModalApp] = useState(false);
    const [textButtonModalApp, setTextButtonModalApp] = useState('Confirmer');
    const [textButtonModalApp2, setTextButtonModalApp2] = useState('Confirmer');
    const [imageModalApp, setImageModalApp] = useState('');
    const [messageModalApp, setMessageModalApp] = useState('');
    const [followThisLink, setFollowThisLink] = useLocalStorage("followThisLink", "");


    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalSimpleMessage, setShowModalSimpleMessage] = useState(false);
    const [showModalCroppeImage, setShowModalCroppeImage] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [sender, setSender] = useState(''); // for modal
    const [inputTextModify, setInputTextModify] = useState('');
    const [textButtonConfirm, setTextButtonConfirm] = useState('Confirmer');
    const [imageModal, setImageModal] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4A90E2');
    const [listCollections, setListCollections] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [is_Edit, setIs_Edit] = useState(false); // -->  dropZone
    const [categoriesChecked, setCategoriesChecked] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [tmp_parameter, setTmp_parameter] = useState(); // pour stocker provisoirement une variable
    const [deleteThisCategory, setDeleteThisCategory] = useState(null);
    const [is, setIs] = useState({
        leaveEditCollectionWithoutSaveChange: false,
        leave: false,
    });


    var navigate = useNavigate();

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


    // réinitialisation des states du form -------------------------------------
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

        setCollectionForm({
            conditions: [{
                id: 0,
                parameter: '1',
                operator: '1',
                value: ''
            }],
            nameCollection: '',
            descriptionCollection: '',
            metaTitle: '',
            metaDescription: '',
            metaUrl: window.location.origin + '/',
            imageName: '',
            alt: '',
            categoryName: 'Aucune catégorie',
            categoryId: '',
            dateField: getNow(),
            descriptionCollectionForMeta: '',
            imagePath: '',
            image: [],
            isAutoConditions: true,
            notIncludePrevProduct: false,
            allConditionsNeeded: true,
        })

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

    const handleModalApp = () => {
        setShowModalApp(false);
    };

    const handleModalAppCancel = () => {
        setShowModalApp(false);
    };

    // remove caracteres unauthorized for url
    const normalizUrl = (str) => {
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };

    const location = useLocation();

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
            case 'editCollection':
                setIs({ ...is, leaveEditCollectionWithoutSaveChange: true });
                // isEdit indique qu'on veut éditer la collection
                navigate('/add-collection', { state: { collectionId: tmp_parameter, isEdit: true } });
                break;
            case 'leaveEditCollectionWithoutChange':
                setIs({ ...is, leave: true });
                // vider form creat collection quand on edit sans rien changer
                setIs_Edit(false);
                setId(null);
                setIsDirty(false);
                initCollectionForm();
                break;
            default:
                '';
        }
    };
    //--------------------------------------------------------------ModalConfirm

    const handleModalCancel = () => {
        setShowModalConfirm(false);
        setShowModalSimpleMessage(false);
        setShowModalInput(false);
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
        id, setId,
        initCollectionForm,
        cleanTemporayStorage,
        is, setIs,
        collectionForm, setCollectionForm,
        
    }



    return (
        <AppContext.Provider value={contextValue}>
            <Navbar />
            <div className='bg-gray-cool'>
                <Routes>
                    <Route path="/listProduct" element={<List />} />
                    <Route path="/addProduct" element={<FormProduct />} />
                    <Route path="/editProduct/:productId" element={<EditProduct />} />
                    <Route path="/editImagesProduct/:product_id" element={<EditImages />} />
                    <Route path="/collections-list" element={<ListCollections />} />
                    <Route path="/add-collection" element={<CreateCollection />} />
                    <Route path="/cropImage" element={<CroppeImage />} />
                    <Route
                        path="*"
                        element={
                            <main style={{ padding: "1rem" }}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />
                </Routes>
                {/* modal for confirmation */}
                {/* <ModalApp
                    show={showModalApp} // true/false show modal
                    handleModalApp={handleModalApp}
                    handleModalAppCancel={handleModalAppCancel}
                    textButtonModalApp={textButtonModalApp}
                    textButtonModalApp2={textButtonModalApp2}
                    image={imageModalApp}
                    followThisLink={followThisLink}>
                    <h2 className="childrenModal">{messageModalApp}</h2>
                </ModalApp> */}
            </div>
        </AppContext.Provider>
    );
}

export default Appcontainer;
