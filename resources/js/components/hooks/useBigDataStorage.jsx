import { useState, useEffect } from "react";
import Axios from 'axios';

// récupère les données de key ou met defaultValue s'il n'y en a pas
function getStorageValue(key, defaultValue) {

    Axios.post(`http://127.0.0.1:8000/temporaryStoreTinyDescription`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            console.log('res.data  --->  ok');
            if (res.data === 'ok') {
    

            }
        });


    if (localStorage.getItem(key) != '') {
        return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } else {
        return defaultValue;
    }
}
// set le hook correspondant au hook appelant
export const useBigDataStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });
    // save in localStorage every changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

