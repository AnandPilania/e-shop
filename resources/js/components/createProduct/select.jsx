import React, { useState, useEffect } from 'react';
import './createProduct_Js.scss';
import Axios from "axios";


const SelectType = (props) => {

    const [listType, setListType] = useState([]);

    useEffect(() => {
                // récupére les types de détails de la table type_detail_products pour remplire le select id=selectdetails
                Axios.get(`http://127.0.0.1:8000/listtype`)
                .then(res => {
                    setListType(res.data);

                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
    }, []);


     var types = props.selectedType ? [{name: props.selectedType}, ...props.listTypes] : props.listTypes;
     

    return (
        <label>
            <select
                id={props.id + 'type'}
                // defaultValue={type}
                onChange={props.handleType}
            >
                {types.map((type, index) =>
                    <option
                        key={index}
                        value={type.name} >
                        {type.name}
                    </option>)}
            </select>
        </label>
    )
}

export default SelectType;