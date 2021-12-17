import { React, useState, useEffect } from 'react';

const ConditionCollection = (props) => {

    const [HideOp1, setHideOp1] = useState('hide');
    const [HideOp2, setHideOp2] = useState('hide');
    const [HideOp3, setHideOp3] = useState('hide');
    const [HideOp4, setHideOp4] = useState('hide');
    const [HideOp5, setHideOp5] = useState('hide');
    const [HideOp6, setHideOp6] = useState('hide');
    const [HideOp7, setHideOp7] = useState('show');
    const [HideOp8, setHideOp8] = useState('show');
    const [HideOp9, setHideOp9] = useState('hide');
    const [HideOp10, setHideOp10] = useState('hide');
    const [typeValue, setTypeValue] = useState('');

    // initialise à show les operators qui correspondent à "Nom du produit"
    useEffect(() => {
        // met dabord à hide partout
        hideUselessOperatorReset();
        setHideOp1('show');
        setHideOp2('show');
        setHideOp5('show');
        setHideOp6('show');
        setHideOp7('show');
        setHideOp8('show');

    }, []);

    // met hide pour tous les paramètres
    const hideUselessOperatorReset = () => {
        setHideOp1('hide');
        setHideOp2('hide');
        setHideOp3('hide');
        setHideOp4('hide');
        setHideOp5('hide');
        setHideOp6('hide');
        setHideOp7('hide');
        setHideOp8('hide');
        setHideOp9('hide');
        setHideOp10('hide');
    }

    // détermine quels opérators doivent être visibles dans le select
    const showOnlyUsableOperator = (param) => {

        hideUselessOperatorReset();
        setTypeValue('');

        if (param == 1 || param == 2 || param == 3 || param == 9) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp5('show');
            setHideOp6('show');
            setHideOp7('show');
            setHideOp8('show');
        }
        if (param == 4 || param == 7) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp3('show');
            setHideOp4('show');
        }
        if (param == 5) {
            setHideOp1('show');
        }
        if (param == 6) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp3('show');
            setHideOp4('show');
            setHideOp9('show');
            setHideOp10('show');
        }
        if (param == 8) {
            setHideOp1('show');
            setHideOp3('show');
            setHideOp4('show');
        }
        if (param == 4 || param == 6) {
            setTypeValue('€');
        }

        if (param == 7) {
            setTypeValue('Kg');
        }

    }

    // récup le param et l'envoi à handleChangeParam pour mettre à jours l'obj conditions et l'envoi à showOnlyUsableOperator pour détermine quels opérators afficher
    const changeParamValue = (e) => {
        let param = e.target.value;
        props.handleChangeParam(param, props.index);
        showOnlyUsableOperator(param);
    }

    return (
        <div className="block-select-conditions">
            {/* parameters */}
            <div>
                <select
                    onChange={changeParamValue}>
                    <option value="1">Nom du produit</option>
                    <option value="2">Type du produit</option>
                    <option value="3">Distributeur du produit</option>
                    <option value="4">Prix du produit</option>
                    <option value="5">Balise du produit</option>
                    <option value="6">Prix avant réduction</option>
                    <option value="7">Poids</option>
                    <option value="8">Stock</option>
                    <option value="9">Nom de variante</option>
                </select>
            </div>
            {/* operator */}
            <div>
                <select value={props.condition.operator} onChange={(e) => props.handleChangeOperator(e, props.index)} >
                    {HideOp1 == 'show' && <option value="=">est égale à</option>}
                    {HideOp2 == 'show' && <option value="!=">n'est pas égale à</option>}
                    {HideOp3 == 'show' && <option value=">">est suppérieur à</option>}
                    {HideOp4 == 'show' && <option value="<">est infèrieur à</option>}
                    {HideOp5 == 'show' && <option value="%_">commence par</option>}
                    {HideOp6 == 'show' && <option value="_%">se termine par</option>}
                    {HideOp7 == 'show' && <option value="%_%">contient</option>}
                    {HideOp8 == 'show' && <option value="!%_%">ne contient pas</option>}
                    {HideOp9 == 'show' && <option value="!null_empty">n'est pas vide</option>}
                    {HideOp10 == 'show' && <option value="null_empty">est vide</option>}
                </select>
            </div>
            {/* value */}
            <div className="input-span">
                <input type='text' value={props.condition.value} onChange={(e) => props.handleChangeValue(e, props.index)} />
                {typeValue != '' && <span className="w30"> 
                    {typeValue}
                </span>}
                {/* <img className="settings" src="../images/icons/settings.png" alt="modifier les paramètres" /> */}
            </div>
        </div>
    );
}

export default ConditionCollection;
