import React , { useState, useEffect } from 'react';

import { getIsDocumentHidden, getBrowserVisibilityProp } from '../functions/visibilityChange.js';

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(getIsDocumentHidden())
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