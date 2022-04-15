import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { getParameter, getOperator } from './conditionsFunctions';


const withHandleConditions = (Component) => (props) => {

    const { conditions, setConditions, setTypeOperationListCollections, warningIdCondition, setIsAutoConditions, showModalSimpleMessage, setShowModalSimpleMessage, messageModal, setMessageModal, imageModal, setDsablNamProd, setDsablType, setDsablSuppl, setDsablPrice, setDsablTag, setDsablBeforePromo, setDsablWeight, setDsablStock, setDsablDate, operatorDisable, setOperatorDisable } = useContext(AppContext);

    var p = '3';
    // gère l'affichage et le disable des paramètres des conditions
    const handleDisableParam = () => {
        // disable un parameter quand il a déjà été utilisé avec l'operator "est égale à"
        setDsablNamProd(false);
        setDsablType(false);
        setDsablSuppl(false);
        setDsablPrice(false);
        setDsablTag(false);
        setDsablBeforePromo(false);
        setDsablWeight(false);
        setDsablStock(false);
        setDsablDate(false);
        conditions.forEach(x => {
            switch (x.parameter + x.operator) {
                case '11': setDsablNamProd(true); break;
                case '21': setDsablType(true); break;
                case '31': setDsablSuppl(true); break;
                case '41': setDsablPrice(true); break;
                case '51': setDsablTag(true); break;
                case '61': setDsablBeforePromo(true); break;
                case '71': setDsablWeight(true); break;
                case '81': setDsablStock(true); break;
                case '91': setDsablDate(true); break;
            }
        });

        // paraOperArray contient toutes les combinaisons de parameter + operator qui représentent des conditions non duplicables
        let paraOperArray = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
        let tmp_paraOperArray = [];
        // on extrait la plus petite valeur de paraOperArray qui n'est pas dans conditions pour déterminer quel paramètre afficher quand on ajoute une condition. on ne garde que le premier chiffre qui correspond au parameter
        for (let i = 0; i < conditions.length; i++) {
            if (paraOperArray.includes(conditions[i].parameter + conditions[i].operator)) {
                tmp_paraOperArray.push(conditions[i].parameter + conditions[i].operator)
            }
        }
        paraOperArray = paraOperArray.filter(val => !tmp_paraOperArray.includes(val));
        p = Math.min(...paraOperArray).toString().substring(0, 1);

    }


    const handleDisableOperator = (id) => {
        let notEqualOperator = ['12', '15', '16', '17', '18', '22', '25', '26', '27', '28', '32', '35', '36', '37', '38', '42', '43', '44', '62', '63', '64', '69', '610', '72', '73', '74', '82', '83', '84', '92', '93', '94'];

        let tmp = [...conditions];
        console.log('tmp 1  ', tmp)
        console.log('id  ', id)
        // let alreadySelected = conditions.map(item =>  item.parameter);
        // console.log('alreadySelected  ', alreadySelected)
        tmp.forEach(c => {
            if (notEqualOperator.includes(c.parameter + c.operator)) {
                let ndx = tmp.findIndex(obj => obj.id == id);
                if (ndx != -1) {
                    tmp[ndx].disableOperator = "equal";
                    console.log('tmp 2  ', tmp)
                }
            } else {
                let po = c.parameter + c.operator;
                if (po == '11' || po == '21' || po == '31' || po == '41' || po == '61' || po == '71' || po == '81' || po == '91') {
                    let ndx = tmp.findIndex(obj => obj.id == id);
                    if (ndx != -1) {
                        tmp[ndx].disableOperator = "otherThanEqual";
                        console.log('tmp 3  ', tmp)
                    }
                }
            }
        });
        setConditions(tmp);
        console.log('tmp 4  ', tmp)
        console.log('conditions  ', conditions)

        // si "est égale à" est sélectionné alors desable tout le reste
        // si n'importe quel oper qui n'est pas "est égale à" est sélectionné alors desable "est égale à"
    }



    // gère le paramètre à changer dans les conditions automatiques
    const handleChangeParam = (param, id) => {
        let tmp_conditions = [...conditions];
        let ndx = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[ndx].parameter = param;
        setConditions(tmp_conditions);
        handleDisableParam();
    };

    // gère le type d'opérations à éffectuer dans les conditons automatiques
    const handleChangeOperator = (e, id) => {
        let tmp_conditions = [...conditions];
        let ndx = tmp_conditions.findIndex(obj => obj.id == id);
        // if e is not a event target but just a variable 
        if (e.target == undefined || e.target == null || e.target == '') {
            tmp_conditions[ndx].operator = e
        } else {
            tmp_conditions[ndx].operator = e.target.value;
        }
        setConditions(tmp_conditions);
        handleDisableParam();
        handleDisableOperator(id);
    };

    // gère la valeur entrée dans les conditions automatiques
    const handleChangeValue = (e, id) => {
        let tmp_conditions = [...conditions];
        let ndx = tmp_conditions.findIndex(obj => obj.id == id);
        // if e comes from FltaPickr then this is not a event target but just a variable 
        if (e.target == undefined || e.target == null || e.target == '') {
            tmp_conditions[ndx].value = e.replace(/ (\d|:)+/, '');
        } else {
            tmp_conditions[ndx].value = e.target.value;
        }
        setConditions(tmp_conditions);
    };

    //add condition
    const addCondition = () => {

        if (conditions.findIndex(c => c.value.length == 0) == -1) {
            // get bigger id to define the next id to insert in conditions
            let objWithBiggerId = {};
            if (conditions.length > 0) {
                objWithBiggerId = conditions.reduce(function (prev, current) {
                    return (prev.id > current.id) ? prev : current
                });
            } else {
                objWithBiggerId.id = -1;
            }

            handleDisableParam();
            // p est défini dans handleDisableParam pour déterminer quels parameters peuvent resté activés et lesquels doivent être disabled
            setConditions([
                ...conditions, {
                    id: objWithBiggerId.id + 1,
                    parameter: p,
                    operator: '1',
                    value: '',
                    disableOperator: '',
                }
            ]);
console.log('objWithBiggerId.id + 1   ', objWithBiggerId.id + 1)
            handleDisableOperator(objWithBiggerId.id + 1);

            // dropDown
            let dropable = document.getElementById('conditions_collection');
            if (dropable != null) {
                dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
            }
        } else {
            setShowModalSimpleMessage(true);
            setMessageModal('Le champ valeur ne peut pas être vide.');
        }

    };

    // delete la condition dont l'id correspond à l'id transmit
    const deleteCondition = (id) => {
        let arr = [...conditions];
        let index = arr.findIndex(obj => obj.id == id);
        arr.splice(index, 1);

        setConditions([...arr]);
        handleDisableOperator();
        // repasse à isAutoConditions = 0 quand on delete toutes les conditions
        arr.length === 0 && setIsAutoConditions(0);
        localStorage.setItem('isAutoConditions', 0);
    }
    return (
        <div>
            <Component
                handleChangeParam={handleChangeParam}
                handleChangeOperator={handleChangeOperator}
                handleChangeValue={handleChangeValue}
                addCondition={addCondition}
                deleteCondition={deleteCondition}
                {...props} />
        </div>
    );
};
export default withHandleConditions;
