import React, { useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ConditionCollection from './conditionCollection';


const ConditionsForm = (handleChangeParam, handleChangeOperator,  handleChangeValue, deleteCondition, addCondition) => {

    const { conditions, warningIdCondition } = useContext(AppContext);
    console.log('conditions   ', conditions);

    return (
        <div className="sub-div-vert-align brd-red-1">
            {conditions && conditions.map((condition, i) => (
                <ConditionCollection
                    key={i}
                    handleChangeParam={handleChangeParam}
                    handleChangeOperator={handleChangeOperator} handleChangeValue={handleChangeValue}
                    condition={condition}
                    deleteCondition={deleteCondition}
                    warningIdCondition={warningIdCondition}
                />
            ))}
            <button className="btn-bcknd mb15" onClick={addCondition}>
                Ajouter une condition
            </button>
        </div>
    );
}

export default ConditionsForm;
