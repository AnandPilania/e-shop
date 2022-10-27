import { useCallback, useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import AppContext from '../contexts/AppContext';

function useConfirmExit(confirmExit: () => boolean, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) {
      return;
    }

    const push = navigator.push;

    navigator.push = (...args: Parameters<typeof push>) => {
      const result = confirmExit();
      if (result !== false) {
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, confirmExit, when]);
}



export function usePrompt(message: string, when = true, setShowModalConfirm, setMessageModal, leaveProductFormWithoutSaveChange, setLeaveProductFormWithoutSaveChange) {

  const { setTextButtonConfirm, setTmp_parameter } = useContext(AppContext);

  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        return message;
      };
    }

        // confirm leave without save collection modal
        function openModal() {
          setMessageModal(message);
          setShowModalConfirm(true);
      }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  const confirmExit = useCallback(() => {
    const confirm = window.confirm(message);
    return confirm;
  }, [message]);
  useConfirmExit(confirmExit, when);
}