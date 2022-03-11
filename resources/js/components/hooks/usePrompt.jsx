import { useState, useEffect, useCallback, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useBlocker } from './useBlocker';
import ModalUsePrompt from '../modal/modalUsePrompt';
import { MessageSharp } from '@material-ui/icons';

export function usePrompt(messageObj, shouldPrompt) {
    const [confirmedNavigation, setConfirmedNavigation] = useState(false)

    const { is, setMessageModal, setTextButtonConfirm, setImageModal, setSender, setTmp_parameter, setShowModalConfirm, collectionForm, conditions, nameCollection, descriptionCollection, metaTitle, metaDescription, metaUrl, imageName, alt, categoryName, categoryId, dateField, isAutoConditions, notIncludePrevProduct, allConditionsNeeded, initCollectionForm, isDirty } = useContext(AppContext);

    useEffect(() => {
        if (confirmedNavigation) {
           alert('ok')
        }
    }, [confirmedNavigation])

    const handleBlockNavigation = ({ retry }) => {
        const shouldDisplayPrompt =
            typeof shouldPrompt === "boolean" ? shouldPrompt : shouldPrompt()
        if (shouldDisplayPrompt) {
            // setMessageModal('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?')
            setMessageModal(messageObj);
            setTextButtonConfirm('Confirmer');
            setImageModal('../images/icons/trash_dirty.png');
            setSender('leaveEditCollectionWithoutChange');
            setTmp_parameter('');
            setShowModalConfirm(true);
        } else {
            retry()
        }
    }

    useBlocker(handleBlockNavigation, !confirmedNavigation)
}

// /**
//  * Prompts the user with an Alert before they leave the current screen.
//  *
//  * @param  message
//  * @param  when
//  */
// export function usePrompt(message, when = true) {

//     const { is, setMessageModal, setTextButtonConfirm, setImageModal, setSender, setTmp_parameter, setShowModalConfirm, collectionForm, conditions, nameCollection, descriptionCollection, metaTitle, metaDescription, metaUrl, imageName, alt, categoryName, categoryId, dateField, isAutoConditions, notIncludePrevProduct, allConditionsNeeded, initCollectionForm, isDirty } = useContext(AppContext);

//     console.log('isDirty prompt  ', isDirty)
//     const blocker = useCallback(
//         (tx) => {
//             // eslint-disable-next-line no-alert
//             // if ( window.confirm( message ) ) tx.retry();

//             // setMessageModal('Êtes-vous sûr de vouloir quitter sans sauvegarder vos changements ?')
//             setMessageModal(message);
//             setTextButtonConfirm('Confirmer');
//             setImageModal('../images/icons/trash_dirty.png');
//             setSender('leaveEditCollectionWithoutChange');
//             setTmp_parameter('');
//             setShowModalConfirm(true);

//             if (!isDirty) {

//                 tx.retry();
//             }
//         },
//         [message]
//     );

//     useBlocker(blocker, when);
// }

 // pour vider le form de creat collection quand on edit sans rien changer et qu'on revient sur List collections
            // if (is.leaveEditCollectionWithoutSaveChange === true) {
            //     let isLeavehoutSaveChange = false;
            //     switch (true) {
            //         case JSON.stringify(collectionForm.conditions) !== JSON.stringify(conditions):
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.nameCollection !== nameCollection:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.descriptionCollection !== descriptionCollection:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.metaTitle !== metaTitle:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.metaDescription !== metaDescription:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.metaUrl !== metaUrl:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.imageName !== imageName:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.alt !== alt:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.categoryName !== categoryName:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.categoryId !== categoryId:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.dateField !== dateField:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.isAutoConditions !== isAutoConditions:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.notIncludePrevProduct !== notIncludePrevProduct:
            //             isLeavehoutSaveChange = true;
            //             break;
            //         case collectionForm.allConditionsNeeded !== allConditionsNeeded:
            //             isLeavehoutSaveChange = true;
            //             break;
            //     }
            // }