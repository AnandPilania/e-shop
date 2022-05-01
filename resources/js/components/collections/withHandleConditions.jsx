import { forEach } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import { getParameter, getOperator } from './conditionsFunctions';


const withHandleConditions = (Component) => (props) => {

    const [refreshCondition, setRefreshCondition] = useState(Date());
    const [okAddNewCondition, setOkAddNewCondition] = useState(false);

    const { conditions, setConditions, setIsAutoConditions, showModalSimpleMessage, setShowModalSimpleMessage, messageModal, setMessageModal, imageModal, setDsablNamProd, setDsablType, setDsablSuppl, setDsablPrice, setDsablTag, setDsablBeforePromo, setDsablWeight, setDsablStock, setDsablDate } = useContext(AppContext);

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


    // !!! ATTENTION !!! IL FAUT TENIR COMPTE DE L OPTION AU MOINS UNE CONDITIONS ET ALL CONDITIONS NEEDED !!!


    const closeSimpleModal = () => {
        setShowModalSimpleMessage(false);
    }

    useEffect(() => {
        // idNewCondition contien l'id de la nouvelle condition créée dans addCondition ou l'id transmit par le changement du parameter ou de l'operator. Ceci permet de mettre à jour conditions pour tenir compte des derniers changements et déterminer si on disable "est égale à" ou pas
        canIUseThisConbinaison();
    }, [refreshCondition]);

    // vérifie si les conditions ne sont pas en conflis. ex. "est égale à" avec 
    //  A CLARIFIER !!!
    const canIUseThisConbinaison = () => {
        if (conditions.length > 0) {
            var tmp = conditions;
            tmp.forEach(x => {
                let sameParam = tmp.filter(y => y.parameter == x.parameter);
                if (sameParam.length > 1) {
                    console.log('tmp  ', tmp);
                    console.log('sameParam  ', sameParam);
                   
                    // permet de laisser le premier "est égale à" activé
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
    }


    // gère le paramètre à changer dans les conditions automatiques
    const handleChangeParam = (param, id) => {
        let tmp_conditions = [...conditions];
        let ndx = tmp_conditions.findIndex(obj => obj.id == id);
        tmp_conditions[ndx].parameter = param;
        setConditions(tmp_conditions);
        handleDisableParam();
        setRefreshCondition(Date());
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
        setRefreshCondition(Date());
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

        // get bigger id to define the next id to insert in conditions
        let objWithBiggerId = {};
        if (conditions.length > 0) {
            objWithBiggerId = conditions.reduce(function (prev, current) {
                return (prev.id > current.id) ? prev : current
            });
        } else {
            objWithBiggerId.id = -1;
        }
        // on check qu'il n'y a pas de champ value vide
        if (conditions.findIndex(c => c.value.length == 0) == -1) {
            handleDisableParam();
            // on check s'il n'y a pas de conditions en conflis
            setRefreshCondition(Date());
            // canIUseThisConbinaison(objWithBiggerId.id + 1);

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
            // dropDown
            let dropable = document.getElementById('conditions_collection');
            if (dropable != null) {
                dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
            }
            // } else {
            //     alert('pas ok');
            // }
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
        // permet de mettre à jour conditions grace à useEffect avant traitement dans canIUseThisConbinaison
        setRefreshCondition(Date());

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
            <ModalSimpleMessage
                show={showModalSimpleMessage} // true/false show modal
                handleModalCancel={closeSimpleModal}
                image={imageModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage>
        </div>
    );
};
export default withHandleConditions;
