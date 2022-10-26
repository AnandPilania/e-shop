import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Appcontainer from './appContainer';

const App = () => {
    
    return (
        <div className="w-full min-h-full relative">
                <BrowserRouter basename='/admin'>
                    <Appcontainer />
                </BrowserRouter>
        </div>
    );
}

export default App;

