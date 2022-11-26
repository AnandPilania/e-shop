import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import ConditionsForm from '../conditionsForm';
import ModalConfirmOperations from '../../modal/modalConfirmOperations';


const ModalListOperations = ({ setShowModalListOperations, show, sender }) => {

    const [textButtonConfirmOperations, setTextButtonConfirmOperations] = useState('');
    const [messageHeader, setMessageHeader] = useState('');

    const { conditions, listCollectionsFiltered, listCollectionsChecked, typeOperationListCollections, imageModal, setImageModal, setSender, setTmp_parameter, setSenderCancel, showModalConfirmOperations, setShowModalConfirmOperations, is, setIs, setConditions, setListCollectionsChecked, handleModalCancel, messageArray, setMessageArray, notThisId, setNotThisId } = useContext(AppContext);

    const textButton = typeOperationListCollections == 0 ? "Enregistrer" : "Supprimer"

    // ajoute dans notThisId les ids des nouvelles conditions avec l'id de la collection concernée qui ne doivent pas être remplacer quand on ajoute des nouvelles conditions à un groupe de collection
    const notForThisId = (collectionId, newConditionId) => {
        let arr = [...notThisId];
        let index_arr = arr.findIndex(obj => obj.id == collectionId && obj.newConditionId == newConditionId);
        if (index_arr != -1) {
            arr.splice(index_arr, 1);
            setNotThisId([...arr]);
        } else {
            setNotThisId([...notThisId, { "id": collectionId, "newConditionId": newConditionId }]);
        }
    };


    // combine parameter et operator pour pouvoir vérifier s'il n y a pas de conditions dupliquées. Conditions contient les nouvelles conditions
    var newCondParaOper = conditions.map(item => {
        return item.parameter + item.operator;
    });

    const handleSave = () => {

        let arrWarning = [];
        let blockConditionsToSave = [];
        listCollectionsFiltered.map(item => {
            // on check que les collections sélectionnées
            if (listCollectionsChecked.includes(item.id)) {
                // on met dans arrObj les conditions avec la combinaison (parameter + operator) pas présente dans les nouvelles condtions pour ne pas avoir de duplications de conditions. Les autres vont dans arrWarning
                let arrObj = [];
                if (item.objConditions != null) {
                    JSON.parse(item.objConditions).forEach(cond => {

                        if (!newCondParaOper.includes(cond.parameter + cond.operator)) {
                            arrObj.push(cond);
                        } else {
                            let newCond = conditions.filter(c => {
                                return (c.parameter + c.operator) == (cond.parameter + cond.operator)
                            })
                            let tmpObj = { "id": item.id, "name": item.name, "condition": cond, "newCondition": newCond[0] }
                            arrWarning.push(tmpObj);
                        }
                    });
                }

                // certains type de conditions avec certains operator annulent obligatoirement d'autres conditons avec certains parameter. Ex. "poids est égale à 10" annulera "poids est suppèrrieur à" ou "poids est inférieur à". Donc on les retire de arrObj. // si une combinaison de para + oper fait partie des conditions qui en exclu d'autres. Donc, on ne la met pas dans tmp_arrObj
                let tmp_arrObj = [];
                let para = [];
                conditions.forEach(x => {
                    switch (x.parameter + x.operator) {
                        case '11': para.push('1'); break;
                        case '21': para.push('2'); break;
                        case '31': para.push('3'); break;
                        case '41': para.push('4'); break;
                        case '51': para.push('5'); break;
                        case '61': para.push('6'); break;
                        case '71': para.push('7'); break;
                        case '81': para.push('8'); break;
                        case '91': para.push('9'); break;
                    }
                });
                // retire les conditions avec le parameter = para, pcq condition non duplcable
                arrObj.forEach(cond => {
                    if (!para.includes(cond.parameter)) {
                        tmp_arrObj.push(cond);
                    } else {
                        let newCond = conditions.filter(c => {
                            return (c.parameter + c.operator) == (cond.parameter + '1');
                        });

                        let tmpObj = { "id": item.id, "name": item.name, "condition": cond, "newCondition": newCond[0] };
                        arrWarning.push(tmpObj);
                    }
                });


                // remplie unDuplicableCond avec les combinaisons para_oper des nouvelles conditions non duplicables 
                let tmpTab = [];
                let unDuplicableCond = [];
                conditions.forEach(cond => {
                    switch (cond.parameter) {
                        case '1': unDuplicableCond.push('11'); break;
                        case '2': unDuplicableCond.push('21'); break;
                        case '3': unDuplicableCond.push('31'); break;
                        case '4': unDuplicableCond.push('41'); break;
                        // case '5': unDuplicableCond.push('51'); break;
                        case '6': unDuplicableCond.push('61'); break;
                        case '7': unDuplicableCond.push('71'); break;
                        case '8': unDuplicableCond.push('81'); break;
                        case '9': unDuplicableCond.push('91'); break;
                    }
                })
                // retire les conditions non duplcables de tmp_arrObj et les met dans arrWarning quand on ajoute une nouvelle condtion avec le même paramètre qu'une condition non duplcable précédement ajoutée dans unDuplicableCond
                tmp_arrObj.map(cond => {
                    if (!unDuplicableCond.includes(cond.parameter + cond.operator)) {
                        tmpTab.push(cond);
                    } else {
                        let newCond = conditions.filter(c => {
                            return (c.parameter + c.operator) == (cond.parameter + cond.operator);
                        });
                        arrWarning.push({ "id": item.id, "name": item.name, "condition": cond, "newCondition": newCond[0] });
                    }
                });
                tmp_arrObj = tmpTab;

                // ensuite on ajoute les nouvelles condtions. s'il y a des conditions qui ne pouvaient pas être dupliquées, elles sont remplacées par le nouvelles en concaténant les arrays
                tmp_arrObj = tmp_arrObj.concat(conditions);
                for (let i = 0; i < tmp_arrObj.length; i++) {
                    tmp_arrObj[i].id = i;
                }

                let tmp_cond_to_save = { "id": item.id, "conditions": tmp_arrObj }

                blockConditionsToSave.push(tmp_cond_to_save);
            }
        })

        // s'il y a des conditions qui doivent être remplacés par les nouvelles conditons alors on les met dans arrWarning et on affiche une modalCofirm pour demander confirmation et montrer de quelles conditions il s'agis
        if (arrWarning.length > 0) {

            setMessageArray(arrWarning);

            let textMessageHeader = "<div> <b>Attention !</b><br> Certaines de vos anciennes conditions vont être remplacées par vos nouvelles conditions. Souhaitez vous continuer ? <br><br> </div>";

            setMessageHeader(textMessageHeader)
            // setMessageModalListOperations('');
            setTmp_parameter(blockConditionsToSave);
            setTextButtonConfirmOperations('Confirmer');
            setImageModal('../images/icons/trash_dirty.png');
            setSender('addNewConditions');
            setSenderCancel('addNewConditions');
            setShowModalConfirmOperations(true);

        } else {
            let newConditionsData = new FormData;
            newConditionsData.append('conditions', JSON.stringify(blockConditionsToSave));
            Axios.post(`/addCondtionsToGroup`, newConditionsData)
                .then(res => {
                    if (res.data === 'ok') {
                        console.log('res.data  --->  ok');
                        setShowModalListOperations(false);
                        setSenderCancel(false);
                        setSender(false);
                        setShowModalConfirmOperations(false);
                        setListCollectionsChecked([]);
                        setConditions([{
                            id: 0,
                            parameter: '1',
                            operator: '1',
                            value: '',
                            disableOperator: '',
                        }]);
                        arrWarning = [];
                        // refresh data after save new conditions
                        // il n'y a pas de delete mais ça permet de refresh list collection
                        setIs({ ...is, collectionDeleted: true });
                    }
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });
        }
    }


    return (
        <div
            className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-full  flex flex-col justify-start items-center`}>

            <section
                className="fixed w-auto max-h-[90vh] max-w-[650px] min-w-[350] px-8 pt-5 pb-8 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50">
                <div
                    className="w-full flex flex-row justify-end items-center pr-2">
                    <h1 className="text-lg font-semibold">Conditions</h1>
                    <img src='../images/icons/x-white.svg'
                        className="w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                        onClick={() => setShowModalListOperations(false)} />
                </div>

                {sender === 'conditions' &&
                    <div className="w-full px-12">
                        <ConditionsForm />
                    </div>}

                <div className="flex flex-row justify-start items-center w-full pl-12 mt-10">
                    {conditions?.findIndex(c => c?.value.length === 0) == -1 &&
                        <button
                            className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                            onClick={handleSave}>
                            {textButton}
                        </button>}
                    <button
                        className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                        onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </section>

            {messageArray?.length > 0 &&
                <ModalConfirmOperations
                    show={showModalConfirmOperations} // true/false show modal
                    textButtonConfirm={textButtonConfirmOperations}
                    // messageModal={messageModalListOperations}
                    messageHeader={messageHeader}
                    notForThisId={notForThisId}
                    image={imageModal}>
                </ModalConfirmOperations>}
        </div>
    );
};

export default ModalListOperations;
