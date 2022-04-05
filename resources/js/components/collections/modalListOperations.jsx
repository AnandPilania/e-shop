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
    // const [tmp_parameterOperations, setTmp_parameterOperations] = useState('');

    const { conditions, listCollectionsFiltered, listCollectionsChecked, typeOperationListCollections, imageModal, setImageModal, setSender, tmp_parameter, setTmp_parameter, setSenderCancel, showModalConfirmOperations, setShowModalConfirmOperations } = useContext(AppContext);

    const textButton = typeOperationListCollections == 0 ? "Enregistrer" : "Supprimer"

    const handleSave = () => {

        // combine parameter et operator pour pouvoir vérifier s'il n y a pas de conditions dupliquées
        var newCondParaOper = conditions.map(item => {
            return item.parameter + item.operator;
        })

        let arrWarning = [];
        let blockConditionsToSave = [];
        listCollectionsFiltered.map(item => {
            // on check que les collections sélectionnées
            if (listCollectionsChecked.includes(item.id)) {
                let arrObj = [];
                // on récupère que les conditions avec la combinaison de (parameter et operator) pas présente dans les nouvelles condtions pour ne pas avoir de duplications de conditions
                JSON.parse(item.objConditions).forEach(cond => {
                    if (!newCondParaOper.includes((cond.parameter + cond.operator))) {
                        arrObj.push(cond);
                    } else {
                        let tmpObj = { "name": item.name, "condition": cond }
                        arrWarning.push(tmpObj);
                    }
                })
                // ensuite on ajoute les nouvelles condtions. s'il y a des conditions qui ne pouvaient pas être dupliquées, elles sont remplacées par le nouvelles en concaténant les arrays
                let tmp_cond_to_save = { "id": item.id, "conditions": arrObj.concat(conditions) }
                blockConditionsToSave.push(tmp_cond_to_save);
            }
        })

        if (arrWarning.length > 0) {

            let txt = [];
            arrWarning.forEach(item => {
                txt.push(getParameter(item.condition.parameter) + ' ' + getOperator(item.condition.operator) + ' ' + item.condition.value);
            })

            let textMessage = "<div> Voulez vous remplacer les condtions suivantes par vos nouvelles conditions ?" + "<br>" + txt.toString().replaceAll(',', '<br>') + "</div>";

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

                <div>
                    <button className="btn-bcknd mb15" onClick={handleSave}>
                        {textButton}
                    </button>
                </div>

            </section>

            {messageModalListOperations?.length > 0 &&
                <ModalConfirm
                    show={showModalConfirmOperations} // true/false show modal
                    textButtonConfirm={textButtonConfirmOperations}
                    messageModal={messageModalListOperations}
                    image={imageModal}>
                </ModalConfirm>}
        </div>
    );
};

export default ModalListOperations;
