import { React, useContext } from 'react';
import AppContext from '../contexts/AppContext';



const Conditionselectoperator = ({ condition, hideOp, handleChangeOperator }) => {

    const { } = useContext(AppContext);

    return (
        <div>
            <select
                className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1"
                value={condition.operator}
                onChange={(e) => handleChangeOperator(e, condition.id)} >
                {hideOp.op1 == 'show' && <option
                    value="1"
                    className={`${condition.disableOperator && "disableColor"}`}
                    disabled={condition.disableOperator}>
                    est égale à</option>} {/* = */}
                {hideOp.op2 == 'show' && <option
                    value="2"
                >
                    n'est pas égale à</option>} {/* != */}
                {hideOp.op3 == 'show' && <option
                    value="3"
                >
                    est suppérieur à</option>} {/* > */}
                {hideOp.op4 == 'show' && <option
                    value="4"
                >
                    est infèrieur à</option>} {/* < */}
                {hideOp.op5 == 'show' && <option
                    value="5"
                >
                    commence par</option>} {/* %_ */}
                {hideOp.op6 == 'show' && <option
                    value="6"
                >
                    se termine par</option>} {/* _% */}
                {hideOp.op7 == 'show' && <option
                    value="7"
                >
                    contient</option>} {/* %_% */}
                {hideOp.op8 == 'show' && <option
                    value="8"
                >
                    ne contient pas</option>} {/* !%_% */}
                {hideOp.op9 == 'show' && <option
                    value="9"
                >
                    n'est pas vide</option>} {/* !null_empty */}
                {hideOp.op10 == 'show' && <option
                    value="10"
                >
                    est vide</option>} {/* null_empty */}
            </select>
        </div>
    );
}

export default Conditionselectoperator;
