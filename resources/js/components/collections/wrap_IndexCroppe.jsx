import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';



const WrapIndexcroppe = () => {

    const { wrapIndexcroppe } = useContext(AppContext);

    // rend soit <CreateCollection /> soit <CroppeImage /> selon ce que contient wrapIndexcroppe. Permet de ne pas utiliser navigate qui pose des problèmes de détection de changement et d'annulation avec croppe
    return (
        <>
            {wrapIndexcroppe}
        </>
    );
}

export default WrapIndexcroppe;
