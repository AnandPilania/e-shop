import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';
import ListCollections from '../collections/list';
import CreateCollection from '../collections/create';

        

const App = () => {
    return (
        <div className="App">
            <BrowserRouter basename='/admin'>
                <Navbar />
                <Routes>
                    <Route path="/listProduct" element={<List />} />
                    <Route path="/addProduct" element={<FormProduct />} />
                    <Route path="/editProduct/:productId" element={<EditProduct />} />
                    <Route path="/editImagesProduct/:product_id" element={<EditImages />} />
                    <Route path="/collections-list" element={<ListCollections />} />
                    <Route path="/add-collection" element={<CreateCollection />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
