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

    //setTextButtonModalApp('Quitter');
    //setTextButtonModalApp2('Annuler');
    //setMessageModalApp('Quitter cette page sans sauvegarder vos données ?');
    //setImageModalApp('../images/icons/warning.png');
    //setFollowThisLink(-1);
    //setShowModalApp(true);