import { useState, useEffect } from "react";

// récupère les données de key ou met defaultValue s'il n'y en a pas
function getStorageValue(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
}
// set le hook correspondant au hook appelant
export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });
// save in localStorage every changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

