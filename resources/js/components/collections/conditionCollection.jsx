import { React } from 'react';

const ConditionCollection = (props) => {

    var typeValue = '€';

    const hideUselessOperator = (e) => {
        if (e.target.value == 3) {
            HideOp3 = 'hideOperator'; 
            HideOp4 = 'hideOperator'; 
            HideOp9 = 'hideOperator'; 
            HideOp10 = 'hideOperator';
        }
    }

    var HideOp1, HideOp2, HideOp3, HideOp4, HideOp5, HideOp6, HideOp7, HideOp8, HideOp9, HideOp10;


    return (
        <div className="sub-div-horiz-align space-between">
            <div className="div-label-select grow-shrink">
                <select value={props.condition.parameter} onChange={(e) => props.handleChangeParam(e, props.index), hideUselessOperator} >
                    <option value="1">Nom du produit</option>
                    <option value="2" disabled>Type du produit</option>
                    <option value="3">Distributeur du produit</option>
                    <option value="4">Prix du produit</option>
                    <option value="5">Balise du produit</option>
                    <option value="6">Prix avant réduction</option>
                    <option value="7">Poids</option>
                    <option value="8">Stock</option>
                    <option value="9">Nom de variante</option>
                </select>
            </div>
            <div className="div-label-select grow-shrink">
                <select value={props.condition.operator} onChange={(e) => props.handleChangeOperator(e, props.index)} >
                    <option className={HideOp1} value="=">est égale à</option>
                    <option className={HideOp2} value="!=">n'est pas égale à</option>
                    <option className={HideOp3} value=">">est suppérieur à</option>
                    <option className={HideOp4} value="<">est infèrieur à</option>
                    <option className={HideOp5} value="%_">commence par</option>
                    <option className={HideOp6} value="_%">se termine par</option>
                    <option className={HideOp7} value="%_%">contient</option>
                    <option className={HideOp8} value="!%_%">ne contient pas</option>
                    <option className={HideOp9} value="!null_empty">n'est pas vide</option>
                    <option className={HideOp10} value="null_empty">est vide</option>
                </select>
            </div>
            <div className="div-input grow-shrink">
                <input type='text' value={props.condition.value} onChange={(e) => props.handleChangeValue(e, props.index)} placeholder={typeValue} />
            </div>
        </div>
    );
}

export default ConditionCollection;
