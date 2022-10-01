import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import CroppeImage from '../croppeJs/croppeJs';
import CreateCollection from './index';



const ShowCreateCollectionOrCroppeImage = () => {

    const { wrapIndexcroppe } = useContext(AppContext);

    // rend soit <CreateCollection /> soit <CroppeImage /> selon ce que contient wrapIndexcroppe. Permet de ne pas utiliser navigate qui pose des problèmes de détection de changement et d'annulation avec croppe
    return (
        <>
            {wrapIndexcroppe.component === 'CreateCollection' && <CreateCollection />}
            
            {wrapIndexcroppe.component === 'CroppeImage' && <CroppeImage />}

        </>
    );
}

export default ShowCreateCollectionOrCroppeImage;
