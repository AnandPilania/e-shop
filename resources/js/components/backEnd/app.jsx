import { React, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/create';
import AppContext from '../contexts/AppContext';







const App = (props) => {
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

    

    const checkIfLeaveWithoutSave = (e) => {
        e.preventDefault();
        // var navTo = useNavigate();
        // if (
        //     conditions[0].value != '' ||
        //     // image.length > 0 || 
        //     nameCollection != '' ||
        //     descriptionCollection != '' ||
        //     alt != ''
        // ) {
        //     // navTo(`/addProduct`);
        // }
       alert('okokokoki');
       console.log(nameCollection)
    }

     
    const contextValue = {
        conditions, setConditions,
        nameCollection, setNameCollection,
        descriptionCollection, setDescriptionCollection,
        metaTitle, setMetaTitle,
        metaDescription, setMetaDescription,
        metaUrl, setMetaUrl,
        alt, setAlt,
        checkLeave: checkIfLeaveWithoutSave,
    }

    return (
        <div className="App">
            <AppContext.Provider value={contextValue}>
                <BrowserRouter basename='/admin'>
                    <Navbar />
                    <Routes>
                        <Route path="/listProduct" element={nameCollection == 'a' ?  <List /> : checkIfLeaveWithoutSave} />
                        <Route path="/addProduct" element={<FormProduct />} />
                        <Route path="/editProduct/:productId" element={<EditProduct />} />
                        <Route path="/editImagesProduct/:product_id" element={<EditImages />} />
                        <Route path="/collections-list" element={<ListCollections />} />
                        <Route path="/add-collection" element={<CreateCollection />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}

export default App;
