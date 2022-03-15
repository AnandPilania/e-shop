import { useEffect, useRef, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useBlocker } from './useBlocker';
import { getNow } from '../functions/dateTools';

export function usePromptCollection(messageObj, shouldPrompt) {

    const { is, setIs, setMessageModal, setTextButtonConfirm, setImageModal, setSender, setTmp_parameter, setShowModalConfirm, isDirty, setIsDirty, nameCollection, descriptionCollection, conditions, isAutoConditions, allConditionsNeeded, notIncludePrevProduct, metaTitle, metaDescription, metaUrl, image, imageName, alt, categoryName, categoryId, dateField, collectionForm, setIs_Edit, setIdCollection, initCollectionForm } = useContext(AppContext);

    const retryFn = useRef(() => { });

    const checkDirty = () => {
        setIs({...is, newCollection: false});
        return false;
        if (!is.newCollection) {
            // tinyMCE ajoute des caractères undefined qui e permettent pas de faire une comparaison alors on compte chaque caractères dans les deux texte et on compare leur nombre pour avoir plus de chances de repérer les textes différents 
            let maxLength = Math.max(collectionForm.descriptionCollection.length, descriptionCollection.length);
            var a = descriptionCollection;
            var b = collectionForm.descriptionCollection;
            var tab = [];
            for (let i = 0; i < maxLength; i++) {
                if (!tab.includes(a[i]) && a[i] !== null) {
                    tab.push(a[i]);
                }
            }
            var occurenceA = 0;
            var occurenceB = 0;
            for (let i = 0; i < tab.length; i++) {
                occurenceA = [...a].filter(item => item === tab[i]).length;
                occurenceB = [...b].filter(item => item === tab[i]).length;
                if (occurenceA !== occurenceB) {
                    setIsDirty(true);
                    return true;
                }
            }
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
                default:
                    setIsDirty(false);
                    setIs({...is, newCollection: false});
                    return false;
            }
        }

        // if (is.newCollection) {
        //     setIs({...is, newCollection: false});
        //     // check if form is dirty
        //     var conditonDirty = false;
        //     conditions.forEach(condition => {
        //         if (condition.value != '') {
        //             conditonDirty = true;
        //         }
        //     })
        //     if (
        //         nameCollection != '' ||
        //         descriptionCollection != '' ||
        //         alt != '' ||
        //         imageName != '' ||
        //         metaTitle != '' ||
        //         metaDescription != '' ||
        //         metaUrl != window.location.origin + '/' ||
        //         image != '' ||
        //         categoryName != 'Sans catégorie' ||
        //         categoryId != 1 ||
        //         // dateField != getNow() ||
        //         conditonDirty == true
        //     ) {
        //         setIsDirty(true);
        //         return true;
        //     } else {
        //         setIsDirty(false);
        //     }
        // }
    }



    useEffect(() => {
        if (is.leaveEditCollectionWithoutSaveChange) {
            setIs({ ...is, leaveEditCollectionWithoutSaveChange: false });
            retryFn.current();
        }
    }, [is.leaveEditCollectionWithoutSaveChange]);

    // confirm leave without save collection modal
    function openModal() {
        setMessageModal(messageObj);
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('leaveEditCollectionWithoutSaveChange');
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

            // si on click pour éditer mais qu'on change rien et qu'on quitte isDirty reste false mais si on change qlq chose isDirty ne se met pas à true et donc on "checkDirty" pour voir si qlq chose a changée 
            if (checkDirty()) { console.log('checkDirty()  ', checkDirty())
                openModal();
                retryFn.current = retry;
            } else {
                // rien a changé mais on initialise pour nettoyer le form !Important
                setIs_Edit(false);
                setIdCollection(null);
                initCollectionForm();
                retry();
            }
        }
    }

    useBlocker(handleBlockNavigation, !is.leave);
}

