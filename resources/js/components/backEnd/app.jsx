import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../dashboard/dashboard';
import Dashboard2 from '../dashboard/dashboard2';
import Navbar from '../navBar/navBar';
import FormProduct from '../createProduct/formProduct';
import EditProduct from '../createProduct/editProduct';
import EditImages from '../createProduct/edit_images';
import List from '../createProduct/list';

        

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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
