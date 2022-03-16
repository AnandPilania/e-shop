import { useEffect, useRef, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useBlocker } from './useBlocker';


export function usePromptCollection(messageObj, shouldPrompt) {

    const { is, setIs, setMessageModal, setTextButtonConfirm, setImageModal, setSender, setTmp_parameter, setShowModalConfirm } = useContext(AppContext);

    const retryFn = useRef(() => { });


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
            retry();
        }

    }

    useBlocker(handleBlockNavigation, !is.leaveEditCollectionWithoutSaveChange);
}

