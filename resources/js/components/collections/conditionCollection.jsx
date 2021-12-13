import { React, useState } from 'react';

const ConditionCollection = (props) => {
    const [param, setParam] = useState(props.condition.parameter);
    const [operator, setOperator] = useState(props.condition.operator);
    const [value, setValue] = useState(props.condition.value);
    var typeValue = '€';


    const handleChangeParam = (e) => {
        setParam(e.target.value);
    }

    const handleChangeOperator = (e) => {
        setOperator(e.target.value);
    }

    const handleChangeValue = (e) => {
        setValue(e.target.value);
    }

    return (
        <div className="sub-div-horiz-align">
            <div className="div-label-select">
                <select value={param} onClick={handleChangeParam} name="parameter" id="parameter">
                    <option onClick={props.handleTitre}>Titre du produit</option>
                    <option onClick={props.handleType}>Type du produit</option>
                    <option onClick={props.handleDistributeur}>Distributeur du produit</option>
                    <option onClick={props.handlePrix}>Prix du produit</option>
                    <option onClick={props.handleBalise}>Balise du produit</option>
                    <option onClick={props.handlePrixAvantReduction}>Prix avant réduction</option>
                    <option onClick={props.handlePoids}>Poids</option>
                    <option onClick={props.handleStock}>Stock</option>
                    <option onClick={props.handleTitreVariante}>Titre de variante</option>
                </select>
            </div>
            <div className="div-label-select">
                <select value={operator} onClick={handleChangeOperator} name="operator" id="operator">
                    <option value="1">est égale à</option>
                    <option value="2">n'est pas égale à</option>
                    <option value="3">est suppérieur à</option>
                    <option value="4">est infèrieur à</option>
                    <option value="5">commence par</option>
                    <option value="6">se termine par</option>
                    <option value="7">contient</option>
                    <option value="8">ne contient pas</option>
                    <option value="9">n'est pas vide</option>
                    <option value="10">est vide</option>
                </select>
            </div>
            <div className="div-input">
                <input type='text' value={value} onClick={handleChangeValue}  id='value' placeholder={typeValue} />
            </div>
        </div>
    );
}

export default ConditionCollection;
