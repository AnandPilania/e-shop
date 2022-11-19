import React, { useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import withHandleConditions from './withHandleConditions';
import ConditionCollection from './conditionCollection';
import Label from '../form/label';



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
            setIsAutoConditions(localStorage.getItem('isAutoConditions') ? localStorage.getItem('isAutoConditions') : 0);
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
                value: '',
                disableOperator: '',
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
            <div className="w-full h-auto flex flex-col justify-start items-start bg-white mb-2.5 p-5 rounded-md shadow-sm">
                <h2 className='text-lg font-bold pb-5'>Type de collection</h2>
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="w-full flex flex-row justify-start items-center">
                        <input
                            id="isAutoConditionsFalseCollection5922"
                            type='radio'
                            checked={isAutoConditions == 0}
                            onChange={() => showHideConditions(0)}
                            className="appearance-none rounded-full min-w-[18px] min-h-[18px] mr-2 border border-indigo-700 transition-all ease-linear duration-200 p-0 checked:border-[5px] cursor-pointer"
                        />
                        <Label
                            label="Manuel"
                            id="isAutoConditionsFalseCollection5922"
                            css="pt-1 cursor-pointer"
                        />
                    </div>
                    <p className='text-base text-gray-700'>
                        Sélectionner manuellement cette collection lors de l'ajout d'articles.
                    </p>
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-2">
                    <div className="w-full flex flex-row justify-start items-center">
                        <input
                            id="isAutoConditionsTrueCollection5922"
                            type='radio'
                            checked={isAutoConditions == 1}
                            onChange={() => showHideConditions(1)}
                            className="appearance-none rounded-full min-w-[18px] min-h-[18px] mr-2 border border-indigo-700 transition-all ease-linear duration-200 p-0 checked:border-[5px] cursor-pointer"
                        />
                        <Label
                            label="Automatisé"
                            id="isAutoConditionsTrueCollection5922"
                            css="pt-1 cursor-pointer"
                        />
                    </div>
                    <p className='text-base text-gray-700'>
                        Ajouter automatiquement les produits lorsqu'ils correspondent aux conditions définies.
                    </p>
                </div>
                {/* conditions */}
                <div className="w-full h-auto max-h-0 flex flex-col justify-start items-start overflow-hidden mt-4"
                    id="conditions_collection">
                    <span className='w-full mt-2 mb-5 border-b border-gray-200'></span>
                    <div className="w-full flex flex-col justify-start">
                        <Label label="Condition(s)" />
                        <p className='text-base text-gray-700'>
                            Définissez une ou plusieurs règles. Ex. Le prix du produit est inférieur à 50 €, Le nom du produit contient le mot Robe, etc. Seuls les produits correspondants à vos règles seront intégrés automatiquement dans cette collection.
                        </p>
                        <div className="w-full my-4 flex flex-row justify-start items-center">
                            <div className="w-full flex flex-row justify-start items-center">
                                <input
                                    type='radio'
                                    name="condition"
                                    id='allConditions5922'
                                    onChange={() => handleAllConditionsNeeded(1)}
                                    checked={allConditionsNeeded == 1}
                                    className="appearance-none rounded-full min-w-[18px] min-h-[18px] mr-2 border border-indigo-700 transition-all ease-linear duration-200 p-0 checked:border-[5px] cursor-pointer"
                                />
                                <Label
                                    label="Les produits doivent répondre à toutes les conditions"
                                    id="allConditions5922"
                                    css="pt-1 cursor-pointer"
                                />
                            </div>
                            <div className="w-full flex flex-row justify-start items-center">
                                <input
                                    type='radio'
                                    name="condition"
                                    id='leastOnConditions5922'
                                    onChange={() => handleAllConditionsNeeded(0)}
                                    checked={allConditionsNeeded == 0}
                                    className="appearance-none rounded-full min-w-[18px] min-h-[18px] mr-2 border border-indigo-700 transition-all ease-linear duration-200 p-0 checked:border-[5px] cursor-pointer"
                                />
                                <Label
                                    label="Les produits doivent répondre à au moins une condition"
                                    id="leastOnConditions5922"
                                    css="pt-1 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* inputs conditions */}
                        {/* <Condition-----sForm /> */}
                        <div className="w-full flex flex-col justify-start items-start">
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
                            <button className="w-auto h-auto py-2 px-3 flex justify-center items-center text-base text-gray-700 border border-gray-700 rounded-md hover:bg-slate-50 cursor-pointer" onClick={addCondition}>
                                Ajouter une condition
                            </button>
                        </div>

                        <div className="w-full flex flex-row justify-start items-center my-5">
                            <input type='checkbox'
                                id="includOnlyNewProducts"
                                checked={notIncludePrevProduct == 1 ? true : false}
                                onChange={handleNotIncludePrevProducts}
                                className="accent-indigo-700 mr-2"
                            />
                            <label
                                htmlFor='includOnlyNewProducts'>
                                Ne pas inclure les produits déjà enregistrés avant la date d'activation
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withHandleConditions(Conditions);
