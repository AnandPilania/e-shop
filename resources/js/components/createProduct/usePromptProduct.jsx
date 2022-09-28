import { useEffect, useRef, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useBlocker } from './useBlocker';


export function usePromptProduct(messageObj, shouldPrompt, setShowModalConfirm, setMessageModal, leaveProductFormWithoutSaveChange, setLeaveProductFormWithoutSaveChange) {

    const { setTextButtonConfirm, setTmp_parameter } = useContext(AppContext);

    const retryFn = useRef(() => { });

    useEffect(() => {
        if (leaveProductFormWithoutSaveChange) {
            setLeaveProductFormWithoutSaveChange(false);
            retryFn.current();
        }
    }, [leaveProductFormWithoutSaveChange]);

    // confirm leave without save collection modal
    function openModal() {
        setMessageModal(messageObj);
        setTextButtonConfirm('Confirmer');
        setTmp_parameter('');
        setShowModalConfirm(true);
    }

    const handleBlockNavigation = ({ retry }) => {
        const shouldDisplayPrompt =
            typeof shouldPrompt === "boolean" ? shouldPrompt : shouldPrompt();
        // if form edit collection is dirty
        if (shouldDisplayPrompt) {
            openModal();
            retryFn.current = retry;
        } else {
            retry();
        }
    }

    useBlocker(handleBlockNavigation, !leaveProductFormWithoutSaveChange);
}

