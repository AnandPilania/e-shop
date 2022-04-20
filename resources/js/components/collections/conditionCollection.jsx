import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import FlatpickrDate from '../tools/flatpickr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ConditionCollection = ({ condition, handleChangeValue, handleChangeParam, warningIdCondition, handleChangeOperator, deleteCondition }) => {

    const [hideOp1, setHideOp1] = useState('hide');
    const [hideOp2, setHideOp2] = useState('hide');
    const [hideOp3, setHideOp3] = useState('hide');
    const [hideOp4, setHideOp4] = useState('hide');
    const [hideOp5, setHideOp5] = useState('hide');
    const [hideOp6, setHideOp6] = useState('hide');
    const [hideOp7, setHideOp7] = useState('show');
    const [hideOp8, setHideOp8] = useState('show');
    const [hideOp9, setHideOp9] = useState('hide');
    const [hideOp10, setHideOp10] = useState('hide');
    const [typeValue, setTypeValue] = useState('');
    const [inputType, setInputType] = useState('text');
    const [inputStep, setInputStep] = useState('0.01');
    const [inputTypeDate, setinputTypeDate] = useState('');
    const [hideFieldValue, setHideFieldValue] = useState(false);

    const { conditions, setConditions, dsablNamProd, setDsablNamProd, dsablType, setDsablType,
        dsablSuppl, setDsablSuppl, dsablPrice, setDsablPrice, dsablTag, setDsablTag, dsablBeforePromo, setDsablBeforePromo, dsablWeight, setDsablWeight, dsablStock, setDsablStock, dsablDate, setDsablDate, refresh } = useContext(AppContext);


    // initialise à show les operators qui correspondent à "Nom du produit"
    useEffect(() => {
        // met dabord à hide partout
        hideUselessOperatorReset();

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
        showOnlyUsableOperator(condition.parameter);
    }, [conditions]);    
    
    useEffect(() => { 
        if (conditions.length > 0) {
            var tmp = conditions;
            tmp.forEach(x => {
                let sameParam = tmp.filter(y => y.parameter == x.parameter);
                if (sameParam.length > 1) {
                    let index = tmp.findIndex(x => x.id == sameParam[0].id);
                    tmp[index].disableOperator = '';
                    for (let i = 1; i < sameParam.length; i++) {
                        let index = tmp.findIndex(x => x.id == sameParam[i].id);
                        tmp[index].disableOperator = 'equal';
                    }
                    setConditions(tmp);
                }
            });
        }
    }, [refresh]);    
    

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

        // met dabord à hide partout
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
        // date
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
        handleChangeOperator('1', condition.id)
        // show / hide value field
        handleHideFieldValue();

        let param = e.target.value;

        // active la class .inputTypeDate quand l'input devient de type date pour le styliser 
        param == 9 ? setinputTypeDate('inputTypeDate') : setinputTypeDate('');

        handleChangeParam(param, condition.id);
        showOnlyUsableOperator(param);
    }

    const borderRed = warningIdCondition.includes(condition.id) ? 'borderRed' : '';


console.log('conditionsCollection')
    return (
        <div className={"block-select-conditions " + borderRed}>

            {/* parameters */}
            <div>
                <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={condition.parameter}
                    onChange={changeParamValue}
                    id="parameterValue">
                    <option disabled={dsablNamProd && conditions.length > 1} value="1" className={`${dsablNamProd && conditions.length > 1 && "disableColor"}`}>Nom du produit</option>
                    <option disabled={dsablType && conditions.length > 1} value="2" className={`${dsablType && conditions.length > 1 && "disableColor"}`}>Type du produit</option>
                    <option disabled={dsablSuppl && conditions.length > 1} value="3" className={`${dsablSuppl && conditions.length > 1 && "disableColor"}`}>Fournisseur</option>
                    <option disabled={dsablPrice && conditions.length > 1} value="4" className={`${dsablPrice && conditions.length > 1 && "disableColor"}`}>Prix du produit</option>
                    <option disabled={dsablTag && conditions.length > 1} value="5" className={`${dsablTag && conditions.length > 1 && "disableColor"}`}>Balise du produit</option>
                    <option disabled={dsablBeforePromo && conditions.length > 1} value="6" className={`${dsablBeforePromo && conditions.length > 1 && "disableColor"}`}>Prix avant réduction</option>
                    <option disabled={dsablWeight && conditions.length > 1} value="7" className={`${dsablWeight && conditions.length > 1 && "disableColor"}`}>Poids</option>
                    <option disabled={dsablStock && conditions.length > 1} value="8" className={`${dsablStock && conditions.length > 1 && "disableColor"}`}>Stock</option>
                    <option disabled={dsablDate && conditions.length > 1} value="9" className={`${dsablDate && conditions.length > 1 && "disableColor"}`}>Date création produit</option>
                </select>
            </div>

            {/* operator */}
            {/* <div>
                <Conditionselectoperator condition={condition} hideOp={hideOp} handleChangeOperator={handleChangeOperator} />
            </div> */}
            <div>
            <select
                className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                value={condition.operator}
                onChange={(e) => handleChangeOperator(e, condition.id)} >
                {hideOp1 == 'show' && <option value="1" disabled={condition.disableOperator == 'equal'} className={`${condition.disableOperator == 'equal' && "disableColor"}`}>
                    est égale à
                </option>} {/* = */}
                {hideOp2 == 'show' && <option value="2">
                    n'est pas égale à
                </option>} {/* != */}
                {hideOp3 == 'show' && <option value="3">
                    est suppérieur à
                </option>} {/* > */}
                {hideOp4 == 'show' && <option value="4">
                    est infèrieur à
                </option>} {/* < */}
                {hideOp5 == 'show' && <option value="5">
                    commence par
                </option>} {/* %_ */}
                {hideOp6 == 'show' && <option value="6">
                    se termine par
                </option>} {/* _% */}
                {hideOp7 == 'show' && <option value="7">
                    contient
                </option>} {/* %_% */}
                {hideOp8 == 'show' && <option value="8">
                    ne contient pas
                </option>} {/* !%_% */}
                {hideOp9 == 'show' && <option value="9">
                    n'est pas vide
                </option>} {/* !null_empty */}
                {hideOp10 == 'show' && <option value="10">
                    est vide
                </option>} {/* null_empty */}
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
