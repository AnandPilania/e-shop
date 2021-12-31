import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/create';
import AppContext from '../contexts/AppContext';
import ModalApp from '../modal/modalApp';



const App = () => {

    const [showModalApp, setShowModalApp] = useState(false);
    const [textButtonModalApp, setTextButtonModalApp] = useState('Confirmer');
    const [textButtonModalApp2, setTextButtonModalApp2] = useState('Confirmer');
    const [imageModalApp, setImageModalApp] = useState('');
    const [messageModalApp, setMessageModalApp] = useState('');
    const [followThisLink, setFollowThisLink] = useState(null);
    const [darkMode, setDarkMode] = useState(false);



    window.onpopstate = function (event) {
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        })
        if (
            (image.length > 0 ||
                nameCollection != '' ||
                descriptionCollection != '' ||
                alt != '' ||
                conditonDirty == true)
        ) {
            event.preventDefault();
            setTextButtonModalApp('Quitter');
            setTextButtonModalApp2('Annuler');
            setMessageModalApp('Quitter cette page sans sauvegarder vos données ?');
            setImageModalApp('../images/icons/warning.png');
            setFollowThisLink(-1);
            setShowModalApp(true);
        }

    };



    //  document.onmouseleave = function() {
    //     //User's mouse has left the page.
    //     window.innerDocClick = false;
    //     alert("mouse leave!");
    //  }


    const handleModalApp = () => {
        setShowModalApp(false);


    };

    const handleModalAppCancel = () => {
        setShowModalApp(false);
    };


    const contextValue = {
        darkMode, setDarkMode,
    }


    return (
        <div className="App">
            <AppContext.Provider value={contextValue}>
                <BrowserRouter basename='/admin'>
                    <Navbar />
                    <Routes>
                        <Route path="/listProduct" element={<List />} />
                        <Route path="/addProduct" element={<FormProduct />} />
                        <Route path="/editProduct/:productId" element={<EditProduct />} />
                        <Route path="/editImagesProduct/:product_id" element={<EditImages />} />
                        <Route path="/collections-list" element={<ListCollections />} />
                        <Route path="/add-collection" element={<CreateCollection />} />
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