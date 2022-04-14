import { React, useContext } from 'react';
import AppContext from '../contexts/AppContext';



const Conditionselectoperator = ({ condition, hideOp, handleChangeOperator }) => {

    const { operatorDisable } = useContext(AppContext);

    return (
        <div>
             <select
                    className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                    value={condition.operator}
                    onChange={(e) => handleChangeOperator(e, condition.id)} >
                    {hideOp.op1 == 'show' && <option
                        value="1"
                        className={`${condition.disableOperator == 'equal' && "disableColor"}`}
                        disabled={condition.disableOperator == 'equal'}>
                        est égale à</option>} {/* = */}
                    {hideOp.op2 == 'show' && <option
                        value="2"
                        className={`${operatorDisable.notEqual && "disableColor"}`}
                        disabled={operatorDisable.notEqual}>
                        n'est pas égale à</option>} {/* != */}
                    {hideOp.op3 == 'show' && <option
                        value="3"
                        className={`${operatorDisable.upper && "disableColor"}`}
                        disabled={operatorDisable.upper}>
                        est suppérieur à</option>} {/* > */}
                    {hideOp.op4 == 'show' && <option
                        value="4"
                        className={`${operatorDisable.lower && "disableColor"}`}
                        disabled={operatorDisable.lower}>
                        est infèrieur à</option>} {/* < */}
                    {hideOp.op5 == 'show' && <option
                        value="5"
                        className={`${operatorDisable.beginWith && "disableColor"}`}
                        disabled={operatorDisable.beginWith}>
                        commence par</option>} {/* %_ */}
                    {hideOp.op6 == 'show' && <option
                        value="6"
                        className={`${operatorDisable.finishWith && "disableColor"}`}
                        disabled={operatorDisable.finishWith}>
                        se termine par</option>} {/* _% */}
                    {hideOp.op7 == 'show' && <option
                        value="7"
                        className={`${operatorDisable.contain && "disableColor"}`}
                        disabled={operatorDisable.contain}>
                        contient</option>} {/* %_% */}
                    {hideOp.op8 == 'show' && <option
                        value="8"
                        className={`${operatorDisable.notContain && "disableColor"}`}
                        disabled={operatorDisable.notContain}>
                        ne contient pas</option>} {/* !%_% */}
                    {hideOp.op9 == 'show' && <option
                        value="9"
                        className={`${operatorDisable.notEmpty && "disableColor"}`}
                        disabled={operatorDisable.notEmpty}>
                        n'est pas vide</option>} {/* !null_empty */}
                    {hideOp.op10 == 'show' && <option
                        value="10"
                        className={`${operatorDisable.empty && "disableColor"}`}
                        disabled={operatorDisable.empty}>
                        est vide</option>} {/* null_empty */}
                </select>
        </div>
    );
}

export default Conditionselectoperator;
