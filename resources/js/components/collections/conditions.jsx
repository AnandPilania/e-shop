import React, { useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import withHandleConditions from './withHandleConditions';
import ConditionCollection from './conditionCollection';
import ConditionsForm from './conditionsForm';


const Conditions = ({
    handleChangeParam,
    handleChangeOperator,
    handleChangeValue,
    addCondition,
    deleteCondition
}) => {

    const {
        conditions, setConditions, isAutoConditions, setIsAutoConditions,
        allConditionsNeeded, setAllConditionsNeeded, notIncludePrevProduct, setNotIncludePrevProduct, warningIdCondition } = useContext(AppContext);

    useEffect(() => {
        // détermine si on montre le block conditions
        setIsAutoConditions(localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 1);
        // détermine si toutes les conditions doivent être remplies
        setAllConditionsNeeded(localStorage.getItem('allConditionsNeeded') ? localStorage.getItem('allConditionsNeeded') : 1);
        // détermine si toutes les conditions doivent être remplies
        setNotIncludePrevProduct(localStorage.getItem('notIncludePrevProduct') ? localStorage.getItem('notIncludePrevProduct') : 1);
    }, []);

    // show / hide conditions
    const showHideConditions = (value) => {
        localStorage.setItem('isAutoConditions', value);
        setIsAutoConditions(value);
        if (value == 1) {
            // réinitialise conditions quand on passe en conditions manuelles
            setConditions([{
                id: 0,
                parameter: '1',
                operator: '1',
                value: ''
            }]);
        }
    };

    useEffect(() => {
        // dropDown conditions
        var dropable = document.getElementById('conditions_collection');
        if (isAutoConditions == 0) {
            dropable.style.maxHeight = null;
        } else if (isAutoConditions == 1) {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
        }
    }, [isAutoConditions]);


    // détermine si on inclus les produits déjà enregistrer dans la nouvelle collection
    const handleNotIncludePrevProducts = (e) => {
        setNotIncludePrevProduct(e.target.checked === true ? 1 : 0);
        localStorage.setItem('notIncludePrevProduct', e.target.checked === true ? 1 : 0);
    };

    const handleAllConditionsNeeded = (value) => {
        setAllConditionsNeeded(value);
        localStorage.setItem('allConditionsNeeded', value);
    };


    return (
        <div>
            <div className="div-vert-align">
                <h2>Type de collection</h2>
                <div className="sub-div-vert-align">
                    <div className="div-radio-label">
                        <input type='radio'
                            checked={isAutoConditions == 0}
                            onChange={() => showHideConditions(0)} />
                        <label
                            onClick={() => showHideConditions(0)}>
                            Manuel
                        </label>
                    </div>
                    <p>Ajouter un produit à la fois dans cette collection</p>
                </div>
                <div className="sub-div-vert-align">
                    <div className="div-radio-label">
                        <input type='radio'
                            checked={isAutoConditions == 1}
                            onChange={() => showHideConditions(1)} />
                        <label
                            onClick={() => showHideConditions(1)}>
                            Automatisé
                        </label>
                    </div>
                    <p>Ajouter automatiquement les produits lorsqu'ils correspondent aux conditions définies</p>
                </div>
                {/* conditions */}
                <div className="sub-div-vert-align dropable"
                    id="conditions_collection">
                    <div className="sub-div-vert-align-border-top">
                        <h2>Condition(s)</h2>
                        <p>Définissez une ou plusieurs règles. Ex. Prix du produit est inférieur à 50 €, Nom du produit contient Robe, etc. Seuls les produits correspondants à vos règles seront intégrés dans cette collection. </p>
                        <div className="sub-div-horiz-align-m">
                            <div className="div-radio-label">
                                <input type='radio' name="condition" id='allConditions'
                                    onChange={() => handleAllConditionsNeeded(1)}
                                    checked={allConditionsNeeded == 1}
                                />
                                <label htmlFor='allConditions'>Les produits doivent répondre à toutes les conditions</label>
                            </div>
                            <div className="div-radio-label">
                                <input type='radio' name="condition" id='leastOnConditions'
                                    onChange={() => handleAllConditionsNeeded(0)}
                                    checked={allConditionsNeeded == 0}
                                />
                                <label htmlFor='leastOnConditions'>Les produits doivent répondre à au moins une condition</label>
                            </div>
                        </div>

                        {/* inputs conditions */}
                        {/* <ConditionsForm /> */}
                        <div className="sub-div-vert-align">
                            {conditions && conditions.map((condition, i) => (
                                <ConditionCollection
                                    key={i}
                                    handleChangeParam={handleChangeParam}
                                    handleChangeOperator={handleChangeOperator}
                                    handleChangeValue={handleChangeValue}
                                    condition={condition}
                                    deleteCondition={deleteCondition}
                                    warningIdCondition={warningIdCondition}
                                />
                            ))}
                            <button className="btn-bcknd mb15" onClick={addCondition}>
                                Ajouter une condition
                            </button>
                        </div>

                        <div className="sub-div-horiz-align-m">
                            <div className="div-radio-label">
                                <input type='checkbox'
                                    id="includOnlyNewProducts"
                                    checked={notIncludePrevProduct == 1 ? true : false}
                                    onChange={handleNotIncludePrevProducts} />
                                <label
                                    htmlFor='includOnlyNewProducts'>
                                    Ne pas inclure les produits déjà enregistrés avant la date d'activation
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withHandleConditions(Conditions);
