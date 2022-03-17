import React, { useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ConditionCollection from './conditionCollection';


const Conditions = () => {

    const {
        conditions, setConditions,
        isAutoConditions, setIsAutoConditions,
        allConditionsNeeded, setAllConditionsNeeded,
        notIncludePrevProduct, setNotIncludePrevProduct,
        warningIdCondition, setWarningIdCondition,
    } = useContext(AppContext);

    useEffect(() => {
        // détermine si on montre le block conditions
        if (localStorage.getItem('isAutoConditions')) {   /// <---- A CHNGER !!!
            if (localStorage.getItem('isAutoConditions') == 'false') {
                setIsAutoConditions(false);
            } else {
                setIsAutoConditions(true);
            }
        }
        if (localStorage.getItem('allConditionsNeeded')) {
                setIsAutoConditions(localStorage.getItem('allConditionsNeeded'));
        }
    }, []);

    // show / hide conditions
    const showHideConditions = (auto) => {
        if (auto) {
            localStorage.setItem('isAutoConditions', true);
            setIsAutoConditions(true);
        } else {
            localStorage.setItem('isAutoConditions', false);
            setIsAutoConditions(false);
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
        if (isAutoConditions === false) {
            dropable.style.maxHeight = null;
        } else if (isAutoConditions === true) {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
        }
    }, [isAutoConditions]);


    // gère le paramètre à changer dans les conditions automatiques
    const handleChangeParam = (param, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].parameter = param;
        setConditions(tmp_conditions);
    };

    // gère le type d'opérations à éffectuer dans les conditons automatiques
    const handleChangeOperator = (e, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].operator = e.target.value;
        setConditions(tmp_conditions);
    };

    // gère la valeur entrée dans les conditions automatiques
    const handleChangeValue = (e, id) => {
        let tmp_conditions = [...conditions];
        var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].value = e.target.value;
        setConditions(tmp_conditions);
    };

    //add condition
    const addCondition = () => {
        // get bigger id for define the next id to insert in conditions
        const objWithBiggerId = conditions.reduce(function (prev, current) {
            return (prev.id > current.id) ? prev : current
        });
        setConditions([
            ...conditions, {
                id: objWithBiggerId.id + 1,
                parameter: '1',
                operator: '1',
                value: ''
            }
        ]);

        // dropDown
        var dropable = document.getElementById('conditions_collection');
        dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
    };

    // delete la condition dont l'id correspond à l'id transmit
    const deleteCondition = (id) => {
        var arr = [...conditions];
        var index_arr = arr.findIndex(obj => obj.id == id);
        arr.splice(index_arr, 1);

        setConditions([...arr]);
    }

    // détermine si on inclus les produits déjà enregistrer dans la nouvelle collection
    const handleNotIncludePrevProducts = () => {
        setNotIncludePrevProduct(!notIncludePrevProduct);
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
                            checked={isAutoConditions == false}
                            onChange={() => showHideConditions(false)} />
                        <label
                            onClick={() => showHideConditions(false)}>
                            Manuel
                        </label>
                    </div>
                    <p>Ajouter un produit à la fois dans cette collection</p>
                </div>
                <div className="sub-div-vert-align">
                    <div className="div-radio-label">
                        <input type='radio'
                            checked={isAutoConditions == true}
                            onChange={() => showHideConditions(true)} />
                        <label
                            onClick={() => showHideConditions(true)}>
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
                                    checked={allConditionsNeeded === 1}
                                />
                                <label htmlFor='allConditions'>Les produits doivent répondre à toutes les conditions</label>
                            </div>
                            <div className="div-radio-label">
                                <input type='radio' name="condition" id='leastOnConditions'
                                    onChange={() => handleAllConditionsNeeded(0)}
                                    checked={allConditionsNeeded === 0}
                                />
                                <label htmlFor='leastOnConditions'>Les produits doivent répondre à au moins une condition</label>
                            </div>
                        </div>

                        {/* inputs conditions */}
                        <div className="sub-div-vert-align">
                            {conditions && conditions.map((condition, i) => (
                                <ConditionCollection
                                    key={i}
                                    handleChangeParam={handleChangeParam}
                                    handleChangeOperator={handleChangeOperator} handleChangeValue={handleChangeValue}
                                    condition={condition}
                                    deleteCondition={deleteCondition}
                                    warningIdCondition={warningIdCondition}
                                />))}
                            <button className="btn-bcknd mb15" onClick={addCondition}>Ajouter une condition</button>
                        </div>
                        <div className="sub-div-horiz-align-m">
                            <div className="div-radio-label">
                                <input type='checkbox'
                                    id="includOnlyNewProducts"
                                    checked={notIncludePrevProduct}
                                    onChange={handleNotIncludePrevProducts} />
                                <label
                                    htmlFor='includOnlyNewProducts'>
                                    Ne pas inclure les produits déjà enregistrés
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Conditions;
