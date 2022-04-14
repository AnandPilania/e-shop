import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';



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


    const handleDisableOperator = () => {
        
        let equal_tab = ['12', '15', '16', '17', '18'];
        let notEqual_tab = ['22', '25', '26', '27', '28'];
        let upper_tab = ['32', '35', '36', '37', '38'];
        let lower_tab = ['12', '15', '16', '17', '18'];
        let beginWith_tab = ['42', '43', '44'];
        let finishWith_tab = ['12', '15', '16', '17', '18'];
        let contain_tab = ['12', '15', '16', '17', '18'];
        let notContain_tab = ['12', '15', '16', '17', '18'];
        let notEmpty_tab = ['12', '15', '16', '17', '18'];
        let empty_tab = ['12', '15', '16', '17', '18'];
        // if (parameter already used with operator != "est égale à") {
        //   disable("est égale à")
        // }
        // si une combinaison para + oper a déjà été utilisée alors warning !!!
        conditions.forEach(c => {
            if (equal_tab.findIndex(item => (c.parameter + c.operator) == item) != -1) {
                setConditions([...conditions, { disableOperator: 'equal'}]);
            } else {
                setConditions([...conditions, { disableOperator: ''}]);
            }
        })

        // let paraOperAlreadyUsed = conditions.filter(c => tab.includes(c.parameter + c.operator));

        // // combine parameter et operator
        // let condParaOper = paraOperAlreadyUsed.map(item => {
        //     return item.parameter + item.operator;
        // })

        console.log('conditions   ', conditions)
        // console.log('operatorDisable   ', operatorDisable)
    }



    // gère le paramètre à changer dans les conditions automatiques
    const handleChangeParam = (param, id) => {
        let tmp_conditions = [...conditions];
        let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[index_arr].parameter = param;
        setConditions(tmp_conditions);
        handleDisableParam();
    };

    // gère le type d'opérations à éffectuer dans les conditons automatiques
    const handleChangeOperator = (e, id) => {
        let tmp_conditions = [...conditions];
        let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        // if e is not a event target but just a variable 
        if (e.target == undefined || e.target == null || e.target == '') {
            tmp_conditions[index_arr].operator = e
        } else {
            tmp_conditions[index_arr].operator = e.target.value;
        }
        setConditions(tmp_conditions);
        handleDisableParam();
        handleDisableOperator();
    };

    // gère la valeur entrée dans les conditions automatiques
    const handleChangeValue = (e, id) => {
        let tmp_conditions = [...conditions];
        let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
        // if e comes from FltaPickr then this is not a event target but just a variable 
        if (e.target == undefined || e.target == null || e.target == '') {
            tmp_conditions[index_arr].value = e.replace(/ (\d|:)+/, '');
        } else {
            tmp_conditions[index_arr].value = e.target.value;
        }
        setConditions(tmp_conditions);
    };

    //add condition
    const addCondition = () => {

        // let paraOperArray = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
        // let countIfAllUnduplicable = 0;
        // for (let i = 0; i < conditions.length; i++) {
        //     if (paraOperArray.includes(conditions[i].parameter + conditions[i].operator)) {
        //         countIfAllUnduplicable++;
        //     }
        // }

        // && paraOperArray.length != countIfAllUnduplicable
        
        if (conditions.findIndex(c => c.value.length == 0) == -1) {
            // get bigger id to define the next id to insert in conditions
            var objWithBiggerId = {};
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

            // handleDisableOperator();

            // dropDown
            var dropable = document.getElementById('conditions_collection');
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
        var arr = [...conditions];
        var index_arr = arr.findIndex(obj => obj.id == id);
        arr.splice(index_arr, 1);

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
