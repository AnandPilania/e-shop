import { React, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
    const [conditions, setConditions] = useState([{
        id: 0,
        parameter: '1',
        operator: '1',
        value: ''
    }]);
    const [nameCollection, setNameCollection] = useState('');
    const [descriptionCollection, setDescriptionCollection] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [alt, setAlt] = useState('');
    const [image, setImage] = useState([]);
    const [showModalApp, setShowModalApp] = useState(false);
    const [textButtonModalApp, setTextButtonModalApp] = useState('Confirmer');
    const [textButtonModalApp2, setTextButtonModalApp2] = useState('Confirmer');
    const [imageModalApp, setImageModalApp] = useState('');
    const [messageModalApp, setMessageModalApp] = useState('');
    const [followThisLink, setFollowThisLink] = useState('');
    const [previousUrl, setPreviousUrl] = useState(window.location.pathname);


    // si on clique sur la fléche back du navigateur un message d'avertissement pour la sauvegarde des données apparait
    window.history.pushState(null, null, document.URL);
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
            setImageModalApp('../images/icons/exit.png');
            var link = previousUrl.replace('/admin', '');
            setFollowThisLink(link);
            setShowModalApp(true);

            setPreviousUrl(window.location.pathname);
            console.log('previousUrl  ' + previousUrl);
            console.log('location.pathname  ' + window.location.pathname);
        }
    };



    //  document.onmouseleave = function() {
    //     //User's mouse has left the page.
    //     window.innerDocClick = false;
    //     alert("mouse leave!");
    //  }

    // si on change de site un message d'avertissement pour la sauvegarde des données apparait
    window.addEventListener('beforeunload', function (e) {
        // check conditions array
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        })

        if (
            image.length > 0 ||
            nameCollection != '' ||
            descriptionCollection != '' ||
            alt != '' ||
            conditonDirty == true
        ) {
            e.preventDefault();
            e.returnValue = '';
        }
    });


    // check if form is dirty
    const checkIfLeaveWithoutSave = (e) => {
        setPreviousUrl(window.location.pathname);
        // check conditions array
        var conditonDirty = false;
        conditions.forEach(condition => {
            if (condition.value != '') {
                conditonDirty = true;
            }
        })

        if (
            image.length > 0 ||
            nameCollection != '' ||
            descriptionCollection != '' ||
            alt != '' ||
            conditonDirty == true
        ) {
            e.preventDefault();
            // autorise le popstate
            setCanPopstate(true);
            // récupère le lien clické dans Link
            const anchor = e.target.closest("a");
            if (!anchor) return;
            var link = anchor.href.replace('http://127.0.0.1:8000/admin', '');

            setTextButtonModalApp('Quitter');
            setTextButtonModalApp2('Annuler');
            setMessageModalApp('Quitter cette page sans sauvegarder vos données ?');
            setImageModalApp('../images/icons/exit.png');
            setFollowThisLink(link);
            setShowModalApp(true);
        }
    }

    const handleModalApp = () => {
        setShowModalApp(false);
window.history.back();
        // VIDAGE DES STATES DU FORM !!! 
        setNameCollection('');
        setDescriptionCollection('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');
        setAlt('');
        setImage([]);

        // alert('model closed')
        // switch (sender) {
        //     case 'deleteCategory': // if confirm delete
        //         deleteCategory(tmp_parameter);
        //         break;
        //     // case 'warningEmptyNewCategoryName':
        //     //     setShowModalInput(false);
        //     //     break;
        //     default:
        //         '';
        // }
    };

    const handleModalAppCancel = () => {
        setShowModalApp(false);
    };


    const contextValue = {
        conditions, setConditions,
        nameCollection, setNameCollection,
        descriptionCollection, setDescriptionCollection,
        metaTitle, setMetaTitle,
        metaDescription, setMetaDescription,
        metaUrl, setMetaUrl,
        alt, setAlt,
        image, setImage,
        checkLeave: checkIfLeaveWithoutSave,
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
