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
    const [inputType, setInputType] = useState('text');
    const [inputStep, setInputStep] = useState('0.01');
    const [inputTypeDate, setinputTypeDate] = useState('');


    // initialise à show les operators qui correspondent à "Nom du produit"
    useEffect(() => {
        // met dabord à hide partout
        hideUselessOperatorReset();

        // met à show la première condition par défaut
        setHideOp1('show');
        setHideOp2('show');
        setHideOp5('show');
        setHideOp6('show');
        setHideOp7('show');
        setHideOp8('show');

        // when data comes from localStorage it get only the operators needed to show
        showOnlyUsableOperator(props.condition.parameter);

        document.getElementById('parameterValue').value == 10 ? setinputTypeDate('inputTypeDate') : setinputTypeDate('');

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
        setTypeValue('')

        if (param == 1 || param == 2 || param == 3 || param == 9) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp5('show');
            setHideOp6('show');
            setHideOp7('show');
            setHideOp8('show');
            setInputType('text');
        }
        if (param == 4 || param == 7) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp3('show');
            setHideOp4('show');
            setInputType('number');
            setInputStep('0.01');
        }
        if (param == 5) {
            setHideOp1('show');
            setInputType('text');
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
            setInputType('number');
            setInputStep('1');
        }
        if (param == 4 || param == 6) {
            setTypeValue('€');
            setInputType('number');
        }

        if (param == 7) {
            setTypeValue('Kg');
            setInputType('number');
            setInputStep('0.01');
        }

        if (param == 10) {
            setHideOp1('show');
            setHideOp2('show');
            setHideOp3('show');
            setHideOp4('show');
            setInputType('date');
        }

    }

    // récup le param et l'envoi à handleChangeParam pour mettre à jours l'obj conditions + l'envoi à showOnlyUsableOperator pour détermine quelle liste d'opérators afficher
    const changeParamValue = (e) => {

        let param = e.target.value;

        // active la class .inputTypeDate quand l'input devient de type date pour le styliser 
        param == 10 ? setinputTypeDate('inputTypeDate') : setinputTypeDate('');

        props.handleChangeParam(param, props.condition.id);
        showOnlyUsableOperator(param);
    }

    const borderRed = props.warningIdCondition.includes(props.condition.id) ? 'borderRed' : '';


    return (
        <div className={"block-select-conditions " + borderRed}>

            {/* parameters */}
            <div>
                <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={props.condition.parameter}
                    onChange={changeParamValue}
                    id="parameterValue">
                    <option value="1">Nom du produit</option>
                    <option value="2">Type du produit</option>
                    <option value="3">Distributeur du produit</option>
                    <option value="4">Prix du produit</option>
                    <option value="5">Balise du produit</option>
                    <option value="6">Prix avant réduction</option>
                    <option value="7">Poids</option>
                    <option value="8">Stock</option>
                    <option value="9">Nom de la variante</option>
                    <option value="10">Date ajout produit</option>
                    <option value="11">Unité vendue par mois</option>
                    <option value="12">Total d'unité vendue</option>
                </select>
            </div>

            {/* operator */}
            <div>
                <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={props.condition.operator}
                    onChange={(e) => props.handleChangeOperator(e, props.condition.id)} >
                    {HideOp1 == 'show' && <option value="1">est égale à</option>} {/* = */}
                    {HideOp2 == 'show' && <option value="2">n'est pas égale à</option>} {/* != */}
                    {HideOp3 == 'show' && <option value="3">est suppérieur à</option>} {/* > */}
                    {HideOp4 == 'show' && <option value="4">est infèrieur à</option>} {/* < */}
                    {HideOp5 == 'show' && <option value="5">commence par</option>} {/* %_ */}
                    {HideOp6 == 'show' && <option value="6">se termine par</option>} {/* _% */}
                    {HideOp7 == 'show' && <option value="7">contient</option>} {/* %_% */}
                    {HideOp8 == 'show' && <option value="8">ne contient pas</option>} {/* !%_% */}
                    {HideOp9 == 'show' && <option value="9">n'est pas vide</option>} {/* !null_empty */}
                    {HideOp10 == 'show' && <option value="10">est vide</option>} {/* null_empty */}
                </select>
            </div>

            {/* value */}
            <div className="input-span">
                <input
                    className={inputTypeDate + "w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"}
                    type={inputType}
                    step={inputStep}
                    min="0"
                    value={props.condition.value}
                    onChange={(e) => props.handleChangeValue(e, props.condition.id)}
                />
                {typeValue != '' && <span className="typeValue">
                    {typeValue}
                </span>}
            </div>

            {/* Annuler */}
            <div className="remove-condition">
                <i className="fas fa-trash-alt trashRemoveCondition"
                    onClick={() => props.deleteCondition(props.condition.id)}>

                </i>
            </div>
        </div>
    );
}

export default ConditionCollection;
