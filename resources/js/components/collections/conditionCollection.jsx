import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import FlatpickrDate from '../tools/flatpickr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ConditionCollection = ({ condition, handleChangeValue, handleChangeParam, warningIdCondition, handleChangeOperator, deleteCondition }) => {

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
    const [hideFieldValue, setHideFieldValue] = useState(false);

    const { conditions, dateField } = useContext(AppContext);

    // initialise à show les operators qui correspondent à "Nom du produit"
    useEffect(() => {
        // met dabord à hide partout
        hideUselessOperatorReset();

        // met à show la première condition par défaut
        setHideOp1('show'); // est égale à
        setHideOp2('show'); // n'est pas égale à
        setHideOp5('show'); // commence par
        setHideOp6('show'); // se termine par
        setHideOp7('show'); // contient
        setHideOp8('show'); // ne contient pas

        showOnlyUsableOperator(condition.parameter);

        document.getElementById('parameterValue').value == 9 ? setinputTypeDate('inputTypeDate') : setinputTypeDate('');

    }, []);

    // initialise quand on edit
    useEffect(() => {
        // met dabord à hide partout
        hideUselessOperatorReset();
        showOnlyUsableOperator(condition.parameter);
    }, [conditions]);


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
        // Nom du produit / Type du produit / Fournisseur
        if (param == 1 || param == 2 || param == 3) {
            setHideOp1('show'); // est égale à
            setHideOp2('show'); // n'est pas égale à
            setHideOp5('show'); // commence par
            setHideOp6('show'); // se termine par
            setHideOp7('show'); // contient
            setHideOp8('show'); // ne contient pas
            setInputType('text');
        }
        // Prix du produit 
        if (param == 4) {
            setHideOp1('show'); // est égale à
            setHideOp2('show'); // n'est pas égale à
            setHideOp3('show'); // est suppérieur à
            setHideOp4('show'); // est infèrieur à
            setTypeValue('€');
            setInputType('number');
            setInputStep('0.01');
        }
        // Balise du produit
        if (param == 5) {
            setHideOp1('show'); // est égale à
            setInputType('text');
        }
        // Prix avant réduction
        if (param == 6) {
            setHideOp1('show'); // est égale à
            setHideOp2('show'); // n'est pas égale à
            setHideOp3('show'); // est suppérieur à
            setHideOp4('show'); // est infèrieur à
            setHideOp9('show'); // n'est pas vide
            setHideOp10('show'); // est vide
            setTypeValue('€');
            setInputType('number');
            setInputStep('0.01');
        }
        // Poids
        if (param == 7) {
            setHideOp1('show'); // est égale à
            setHideOp2('show'); // n'est pas égale à
            setHideOp3('show'); // est suppérieur à
            setHideOp4('show'); // est infèrieur à
            setTypeValue('Kg');
            setInputType('number');
            setInputStep('0.01');
        }
        // Stock
        if (param == 8) {
            setHideOp1('show'); // est égale à
            setHideOp3('show'); // est suppérieur à
            setHideOp4('show'); // est infèrieur à
            setInputType('number');
            setInputStep('1');
        }
        if (param == 9) {
            setHideOp1('show'); // est égale à
            setHideOp2('show'); // n'est pas égale à
            setHideOp3('show'); // est suppérieur à
            setHideOp4('show'); // est infèrieur à
            setInputType('date');
        }

    }

    // show or hide value field according to operator selected
    useEffect(() => {
        handleHideFieldValue();
    }, [condition.operator, condition.parameter]);

    const handleHideFieldValue = () => {
        if ((condition.operator == 9 || condition.operator == 10) && condition.parameter == 6) {
            setHideFieldValue(true);
        } else {
            setHideFieldValue(false);
        }
    }

    // récup le param et l'envoi à handleChangeParam pour mettre à jours l'obj conditions + l'envoi à showOnlyUsableOperator pour détermine quelle liste d'opérators afficher
    const changeParamValue = (e) => {

        setHideOp1('show'); // est égale à
        // met l'opérator à est égale à lorsqu'on change le paramètre. 'c'est un init du champ operator'
        handleChangeOperator(1, condition.id)
        // show / hide value field
        handleHideFieldValue();

        let param = e.target.value;

        // active la class .inputTypeDate quand l'input devient de type date pour le styliser 
        param == 9 ? setinputTypeDate('inputTypeDate') : setinputTypeDate('');

        handleChangeParam(param, condition.id);
        showOnlyUsableOperator(param);
    }

    const borderRed = warningIdCondition.includes(condition.id) ? 'borderRed' : '';


    return (
        <div className={"block-select-conditions " + borderRed}>

            {/* parameters */}
            <div>
                <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={condition.parameter}
                    onChange={changeParamValue}
                    id="parameterValue">
                    <option value="1">Nom du produit</option>
                    <option value="2">Type du produit</option>
                    <option value="3">Fournisseur</option>
                    <option value="4">Prix du produit</option>
                    <option value="5">Balise du produit</option>
                    <option value="6">Prix avant réduction</option>
                    <option value="7">Poids</option>
                    <option value="8">Stock</option>
                    <option value="9">Date création produit</option>
                </select>
            </div>

            {/* operator */}
            <div>
                <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={condition.operator}
                    onChange={(e) => handleChangeOperator(e, condition.id)} >
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
            {!hideFieldValue && inputType == 'date' ? <FlatpickrDate placeholder={condition.value} setFunction={handleChangeValue} id={condition.id} /> :
                <div className="input-span">
                    <input
                        className={inputTypeDate + "w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"}
                        type={inputType}
                        step={inputStep}
                        min="0"
                        value={condition.value}
                        onChange={(e) => handleChangeValue(e, condition.id)}
                    />
                    {typeValue != '' && <span className="typeValue">
                        {typeValue}
                    </span>}
                </div>
            }

            {/* Annuler */}
            <div className="remove-condition">
                <span className="trashRemoveCondition"
                    onClick={() => deleteCondition(condition.id)}>
                    <FontAwesomeIcon icon={faTrash} className="faTrashIcon" />
                </span>
            </div>
        </div>
    );
}

export default ConditionCollection;
