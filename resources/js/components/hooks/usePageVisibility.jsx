import { useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { getIsDocumentHidden, getBrowserVisibilityProp } from '../functions/visibilityChange.js';

export function usePageVisibility() {
  const { isVisible, setIsVisible } = useContext(AppContext);
  const onVisibilityChange = () => setIsVisible(getIsDocumentHidden())

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp()

    document.addEventListener(visibilityChange, onVisibilityChange, false)

    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange)
    }
  })

  return isVisible
}
