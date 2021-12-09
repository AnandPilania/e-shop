import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../dashboard/dashboard';
import Dashboard2 from '../dashboard/dashboard2';
import Navbar from '../navBar/navBar';

const App = () => {
    return (
        <div className="App">
            <BrowserRouter basename='/admin'>
                <Navbar />
                <Routes>
                    <Route path="/dash" element={<Dashboard />} />
                    <Route path="/dash2" element={<Dashboard2 />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
