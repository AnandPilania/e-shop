import { React, useState } from 'react';
import AppContext from '../contexts/AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocalStorage } from "../hooks/useLocalStorage";
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/index';
import ModalApp from '../modal/modalApp';
import CroppeImage from '../croppeJs/croppeJs';



const App = () => {

    const [showModalApp, setShowModalApp] = useState(false);
    const [textButtonModalApp, setTextButtonModalApp] = useState('Confirmer');
    const [textButtonModalApp2, setTextButtonModalApp2] = useState('Confirmer');
    const [imageModalApp, setImageModalApp] = useState('');
    const [messageModalApp, setMessageModalApp] = useState('');
    const [followThisLink, setFollowThisLink] = useLocalStorage("followThisLink", "");
    const [imagePath, setImagePath] = useLocalStorage("imagePath", "");
    const [image, setImage] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalSimpleMessage, setShowModalSimpleMessage] = useState(false);
    const [showModalCroppeImage, setShowModalCroppeImage] = useState(false);
    const [showModalInput, setShowModalInput] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [sender, setSender] = useState(''); // for modal
    const [inputTextModify, setInputTextModify] = useState('');
    const [textButtonConfirm, setTextButtonConfirm] = useState('Confirmer');
    const [imageModal, setImageModal] = useState('');

    const handleModalApp = () => {
        setShowModalApp(false);
    };

    const handleModalAppCancel = () => {
        setShowModalApp(false);
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
        darkMode, setDarkMode,
    }


    return (
        <div className="app-container">
            <AppContext.Provider value={contextValue}>
                <BrowserRouter basename='/admin'>
                <div className="main-nav">my horizontal nav</div>
                    <Navbar />
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
                    <ModalApp
                        show={showModalApp} // true/false show modal
                        handleModalApp={handleModalApp}
                        handleModalAppCancel={handleModalAppCancel}
                        textButtonModalApp={textButtonModalApp}
                        textButtonModalApp2={textButtonModalApp2}
                        image={imageModalApp}
                        followThisLink={followThisLink}>
                        <h2 className="childrenModal">{messageModalApp}</h2>
                    </ModalApp>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}

export default App;

    //setTextButtonModalApp('Quitter');
    //setTextButtonModalApp2('Annuler');
    //setMessageModalApp('Quitter cette page sans sauvegarder vos données ?');
    //setImageModalApp('../images/icons/warning.png');
    //setFollowThisLink(-1);
    //setShowModalApp(true);