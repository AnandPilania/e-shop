import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import ConditionsForm from './conditionsForm';
import { getParameter, getOperator } from './conditionsFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ModalConfirm from '../modal/modalConfirm';



const useStyles = makeStyles({
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: ' 100%',
        background: 'rgba(255, 255, 255, 0.75)',
        zIndex: '1',
    },

    modalMain: {
        position: 'fixed',
        background: 'white',
        width: '60%',
        minWidth: '300px',
        minHeight: '500px',
        padding: '50px',
        top: ' 50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: '5px',
        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
        zIndex: '1',
    },

    BlockButtons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30px',
    },

    btnModal: {
        width: '150px',
        height: '50px',
        padding: '0 25px',
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(52, 115, 252)',
        color: 'white',
        fontSize: '20px',
        borderRadius: '5px',
        border: 'solid 1px rgb(220, 220, 220)',
        transition: 'ease-in-out 0.15s',
        '&:hover': {
            cursor: 'pointer',
            color: '#eeeeee',
        },
    },

    close: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '25px',
        paddingTop: '25px',
    },

    image: {
        margin: '20px 0',
    },

    faTimes: {
        fontSize: '26px',
        transition: 'ease-in-out .15s',
        color: '#333333',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.15)',
        },
    },

    inputTextModify: {
        width: '100%',
        height: '50px',
        padding: '0 20px',
        margin: '20px 0 0 0',
        borderRadius: '5px',
        border: 'solid 1px rgb(220, 220, 220)',
    },

    displayBlock: {
        visibility: 'visible',
        width: '100%',
        height: '100%',
    },

    displayNone: {
        visibility: 'hidden',
        width: '0',
        height: '0',
    }
});


const ModalListOperations = ({ setShowModalListOperations, show, sender }) => {

    const classes = useStyles();
    const showHideClassName = show ? classes.displayBlock : classes.displayNone;

    const [messageModalListOperations, setMessageModalListOperations] = useState('');
    const [textButtonConfirmOperations, setTextButtonConfirmOperations] = useState('');
    const [messageHeader, setMessageHeader] = useState('');
    const [messageArray, setMessageArray] = useState([]);
    const [notThisId, setNotThisId] = useState([]);

    const { conditions, listCollectionsFiltered, listCollectionsChecked, typeOperationListCollections, imageModal, setImageModal, setSender, setTmp_parameter, setSenderCancel, showModalConfirmOperations, setShowModalConfirmOperations, is, setIs, setConditions, setListCollectionsChecked, handleModalCancel } = useContext(AppContext);

    const textButton = typeOperationListCollections == 0 ? "Enregistrer" : "Supprimer"

    const notForThisId = (id) => {
        alert('okok')
        setNotThisId([...notThisId, id])
    }

    const handleSave = () => {

        let arrWarning = [];
        let blockConditionsToSave = [];
        listCollectionsFiltered.map(item => {
            // on check que les collections sélectionnées
            if (listCollectionsChecked.includes(item.id)) {
                let arrObj = [];
                // on récupère que les conditions avec la combinaison de (parameter et operator) pas présente dans les nouvelles condtions pour ne pas avoir de duplications de conditions
                JSON.parse(item.objConditions).forEach(cond => {
                    conditions.map(newCond => {
                        if ((newCond.parameter + newCond.operator) != (cond.parameter + cond.operator)) {
                            arrObj.push(cond);
                        } else {
                            let tmpObj = { "id": item.id, "name": item.name, "condition": cond, "newCondition": newCond }
                            arrWarning.push(tmpObj);
                        }
                    })
                })

                let tmp_arrObj = [];
                let para = '';
                // certains type de conditions avec certains operator annulent obligatoirement d'autres conditons avec certains parameter. Ex. "poids est égale à 10" annulera "poids est suppèrrieur à" ou "poids est inférieur à". Donc on les retire de arrObj. // si une combinaison de para + oper fait partie des conditions qui en exclu d'autres alors on ne la met pas dans tmp_arrObj
                conditions.forEach(x => {
                    switch (x.parameter + x.operator) {
                        case '11': para = 1; break;
                        // case '15': para = 1; break;
                        // case '16': para = 1; break;
                        case '21': para = 2; break;
                        // case '25': para = 2; break;
                        // case '26': para = 2; break;
                        case '31': para = 3; break;
                        // case '35': para = 3; break;
                        // case '36': para = 3; break;
                        case '41': para = 4; break;
                        case '51': para = 5; break;
                        case '61': para = 6; break;
                        case '71': para = 7; break;
                        case '81': para = 8; break;
                        case '91': para = 9; break;
                    }
                    // retive les conditions avec le parameter = para, pcq condition non duplcable
                    arrObj.forEach(cond => {
                        if (cond.parameter != para) {
                            tmp_arrObj.push(cond);
                        } else {
                            let tmpObj = { "id": item.id, "name": item.name, "condition": cond, "newCondition": x };
                            arrWarning.push(tmpObj);
                        }
                    })
                })

                // retire les conditions non duplcables de tmp_arrObj et les met dans arrWarning quand on ajoute une nouvelle condtion avec le même paramètre qu'une condition non duplcable précédement ajoutée
                let tmpTab = [];
                let x;
                conditions.forEach(cond => {
                    switch (cond.parameter) {
                        case '1': x = '11'; break;
                        // case '1': x = '15'; break;
                        // case '1': x = '16'; break;
                        case '2': x = '21'; break;
                        // case '2': x = '25'; break;
                        // case '2': x = '26'; break;
                        case '3': x = '31'; break;
                        // case '3': x = '35'; break;
                        // case '3': x = '36'; break;
                        case '4': x = '41'; break;
                        case '5': x = '51'; break;
                        case '6': x = '61'; break;
                        case '7': x = '71'; break;
                        case '8': x = '81'; break;
                        case '9': x = '91'; break;
                    }
                    tmp_arrObj.map(el => {
                        if ((el.parameter + el.operator) != x) {
                            tmpTab.push(el);
                        } else {
                            arrWarning.push({ "id": item.id, "name": item.name, "condition": el, "newCondition": cond });
                        }
                    });

                    tmp_arrObj = tmpTab;
                })

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

            let txt = [];
            arrWarning.forEach(item => {
                txt.push(`Dans la collection  <b> ${item.name} </b> <br> ${getParameter(item.condition.parameter)}  ${getOperator(item.condition.operator)} ${item.condition.value} <br> sera remplacé par: <br> ${getParameter(item.newCondition.parameter)}  ${getOperator(item.newCondition.operator)} ${item.newCondition.value} <br> <input type="checkbox" onChange=${() => notForThisId(item.id)} /><br><br><hr>`);
            })

            let textMessage = txt.toString().replaceAll(',', '<br>');

            let textMessageHeader = "<div> <b>Attention !</b><br> Certaines de vos anciennes conditions vont être remplacées par vos nouvelles conditions. Souhaitez vous continuer ? <br><br> </div>";

            setMessageHeader(textMessageHeader)
            setMessageModalListOperations(textMessage);
            setTmp_parameter(blockConditionsToSave);
            setTextButtonConfirmOperations('Confirmer');
            setImageModal('../images/icons/trash_dirty.png');
            setSender('addNewConditions');
            setSenderCancel('addNewConditions');
            setShowModalConfirmOperations(true);

        } else {
            let newConditionsData = new FormData;
            newConditionsData.append('conditions', JSON.stringify(blockConditionsToSave));
            Axios.post(`http://127.0.0.1:8000/addCondtionsToGroup`, newConditionsData)
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
                            value: ''
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
        <div className={classes.modal + ' ' + showHideClassName}>

            <section className={classes.modalMain}>

                <div className={classes.close}>
                    <FontAwesomeIcon icon={faTimes} className="h20 cursor" onClick={() => setShowModalListOperations(false)} />
                </div>

                {sender === 'conditions' && <ConditionsForm />}

                <div className="flex-row-s-c w100pct p-l-20">
                    {conditions[0]?.value.length > 0 &&
                        <button className="btn-bcknd mb15 m-r-20" onClick={handleSave}>
                            {textButton}
                        </button>}
                    <button className="btn-bcknd mb15" onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </section>

            {messageModalListOperations?.length > 0 &&
                <ModalConfirm
                    show={showModalConfirmOperations} // true/false show modal
                    textButtonConfirm={textButtonConfirmOperations}
                    messageModal={messageModalListOperations}
                    messageHeader={messageHeader}
                    messageArray={messageArray}
                    image={imageModal}>
                </ModalConfirm>}
        </div>
    );
};

export default ModalListOperations;
