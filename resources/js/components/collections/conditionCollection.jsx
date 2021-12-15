import { React } from 'react';

const ConditionCollection = (props) => {

    var typeValue = '€';


    return (
        <div className="sub-div-horiz-align space-between">
            <div className="div-label-select grow-shrink">
                <select value={props.condition.parameter} onChange={(e) => props.handleChangeParam(e, props.index)} >
                    <option>Nom du produit</option>
                    <option disabled>Type du produit</option>
                    {/* <option>Distributeur du produit</option> */}
                    <option>Prix du produit</option>
                    <option>Balise du produit</option>
                    <option>Prix avant réduction</option>
                    <option>Poids</option>
                    <option>Stock</option>
                    <option>Nom de variante</option>
                </select>
            </div>
            <div className="div-label-select grow-shrink">
                <select value={props.condition.operator} onChange={(e) => props.handleChangeOperator(e, props.index)} >
                    <option value="=">est égale à</option>
                    <option value="!=">n'est pas égale à</option>
                    <option value=">">est suppérieur à</option>
                    <option value="<">est infèrieur à</option>
                    <option value="%_">commence par</option>
                    <option value="_%">se termine par</option>
                    <option value="%_%">contient</option>
                    <option value="!%_%">ne contient pas</option>
                    <option value="!null_empty">n'est pas vide</option>
                    <option value="null_empty">est vide</option>
                </select>
            </div>
            <div className="div-input grow-shrink">
                <input type='text' value={props.condition.value} onChange={(e) => props.handleChangeValue(e, props.index)} placeholder={typeValue} />
            </div>
        </div>
    );
}

export default ConditionCollection;
