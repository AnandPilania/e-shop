import React, { useState, useEffect } from 'react';
import SelectOption from './selectOption';
import Axios from "axios";

const Options = () => {

    const [listType, setListType] = useState([]);

    useEffect(() => {
        // get list of option types
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    return (
            <div className="w-full py-[10px]">

                <SelectOption listType={listType} />

            </div>
    );
}

export default Options;
