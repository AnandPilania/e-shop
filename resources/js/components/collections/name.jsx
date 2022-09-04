import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import InputText from '../form/inputText';
import Label from '../form/label';


const NameCollection = () => {

    const { nameCollection, setNameCollection } = useContext(AppContext);

    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
    };

    return (
        <div className="w-full mb-5 flex flex-col justify-start items-start">
            <Label label="Nom de la collection*" />
            <InputText
                value={nameCollection}
                handleChange={handleNameCollection}
                css="rounded-md"
                maxLength="255"
            />
            <span className={`text-sm text-red-600 ${nameCollection.length > 191 ? "block" : "none"}`}>Le nom de la collection ne peut pas dépasser 191 caractères</span>
        </div>
    );
}

export default NameCollection;
