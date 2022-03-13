import { useEffect, useRef, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useBlocker } from './useBlocker';


export function usePromptCollection(messageObj, shouldPrompt, sendedBy) {

    const { is, setIs, setMessageModal, setTextButtonConfirm, setImageModal, setSender, setTmp_parameter, setShowModalConfirm, isDirty, setIsDirty, nameCollection, descriptionCollection, conditions, isAutoConditions, allConditionsNeeded, notIncludePrevProduct, metaTitle, metaDescription, metaUrl, imageName, alt, categoryName, categoryId, dateField, collectionForm, setIs_Edit, setId, initCollectionForm } = useContext(AppContext);

    const retryFn = useRef(() => { });


    const checkDirty = () => {

        if (collectionForm.nameCollection !== nameCollection) {
            let smallerString = Math.min(collectionForm.descriptionCollection.length, descriptionCollection.length);
            smallerString = smallerString > 5 ? (smallerString - 5) : smallerString;
    
            let a = descriptionCollection.substring(0, smallerString);
            let b = collectionForm.descriptionCollection.substring(0, smallerString);
    
            let pattern = /\w[\!\^\$\?\+\*\|&"\'_=\-\.\(\)\{\}¤£¨\/,;:ù%µ@€ ]*/;
            let aa = a.match(pattern);
            let bb = b.match(pattern);
    
            if (aa !== bb) {
                setIsDirty(true);
                return true;
            } 
        }


        console.log('descriptionCollection  ', descriptionCollection);
        switch (true) {
            case JSON.stringify(collectionForm.conditions) !== JSON.stringify(conditions):
                setIsDirty(true);
                return true;
            case collectionForm.nameCollection !== nameCollection:
                setIsDirty(true);
                return true;
            case collectionForm.metaTitle !== metaTitle:
                setIsDirty(true);
                return true;
            case collectionForm.metaDescription !== metaDescription:
                setIsDirty(true);
                return true;
            case collectionForm.metaUrl !== metaUrl:
                setIsDirty(true);
                return true;
            case collectionForm.imageName !== imageName:
                setIsDirty(true);
                return true;
            case collectionForm.alt !== alt:
                setIsDirty(true);
                return true;
            case collectionForm.categoryName !== categoryName:
                setIsDirty(true);
                return true;
            case collectionForm.categoryId !== categoryId:
                setIsDirty(true);
                return true;
            case collectionForm.dateField !== dateField:
                setIsDirty(true);
                return true;
            case collectionForm.isAutoConditions !== isAutoConditions:
                setIsDirty(true);
                return true;
            case collectionForm.notIncludePrevProduct !== notIncludePrevProduct:
                setIsDirty(true);
                return true;
            case collectionForm.allConditionsNeeded !== allConditionsNeeded:
                setIsDirty(true);
                return true;
        }
    }



    useEffect(() => {
        if (is.leave) {
            setIs({ ...is, leave: false });
            retryFn.current();
        }
    }, [is.leave]);

    function openModal() {
        setMessageModal(messageObj);
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender(sendedBy);
        setTmp_parameter('');
        setShowModalConfirm(true);
    }

    const handleBlockNavigation = ({ retry }) => {
        const shouldDisplayPrompt =
            typeof shouldPrompt === "boolean" ? shouldPrompt : shouldPrompt();
        if (shouldDisplayPrompt) {
            openModal();
            retryFn.current = retry;
        } else {
            console.log('checkDirty   ', checkDirty())
            // si on click pour éditer mais qu'on change rien et qu'on quitte isDirty reste false mais si on change qlq chose isDirty ne se met pas à true et donc on "checkDirty" pour voir si qlq chose a changée 
            if (checkDirty()) {
                openModal();
                retryFn.current = retry;
            } else {
                // rien a changé mais on initialise pour nettoyer le form
                setIs_Edit(false);
                setId(null);
                initCollectionForm();
                retry();
            }
        }
    }

    useBlocker(handleBlockNavigation, !is.leave);
}

