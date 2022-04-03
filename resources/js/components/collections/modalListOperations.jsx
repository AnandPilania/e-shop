import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import ConditionsForm from './conditionsForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialpadOutlined } from '@material-ui/icons';

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

    const { conditions, listCollectionsFiltered, listCollectionsChecked, typeOperationListCollections, setConditions } = useContext(AppContext);

    const textButton = typeOperationListCollections == 0 ? "Enregistrer" : "Supprimer"

    const handleSave = () => {

        // récupère s'ils y en a les nouvelles conditions qui ne peuvent pas être dupliquées donc avec l'operator 1, 5 et 6
        var duplicate = conditions.filter(item => {
            return (item.operator == 1 || item.operator == 5 || item.operator == 6) && item.value != '';
        })

        let arrWarning = [];
        let blockConditionsToSave = [];
        listCollectionsFiltered.map(item => {
            // on check que les collections sélectionnées
            if (listCollectionsChecked.includes(item.id)) {
                let arrObj = [];
                // on remplace les conditions qui ne peuvent pas être dupliquées
                JSON.parse(item.objConditions).forEach(cond => {
                    if (cond.operator != 1 && cond.operator != 5 && cond.operator != 6) {
                        arrObj.push(cond);
                    } else {
                        let tmpObj = { "name": item.name, "condition": cond }
                        arrWarning.push(tmpObj);
                    }
                }
                )
                let tmp_cond_to_save = { "id": item.id, "conditons": arrObj.concat(duplicate) }
                blockConditionsToSave.push(tmp_cond_to_save);
            }
        }
        )
        console.log('blockConditionsToSave  ', blockConditionsToSave);


        if (arrWarning.length > 0) {
            // afficher message --> "voulez vous remplacer les condtions suivantes par les nouvelles conditions ?"
            // console.log('arrWarning  ', arrWarning);
        }

        // détermine si on ajoute des conditions ou si on nen supprime
        let typeOperation = typeOperationListCollections === 0 ? 'save' : 'delete';

        let formData = new FormData;
        // formData.append('arrObj', JSON.stringify(arrObj));
        // formData.append('conditions', JSON.stringify(conditions));
        // formData.append('typeOperation', typeOperation);

        Axios.post(`http://127.0.0.1:8000/addCondtionsToGroup`, formData)
            .then(res => {
                console.log('res.data  --->  ok');
                if (res.data === 'ok') {

                }
            }).catch(function (error) {
                console.log('error:   ' + error);
            });

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
        </div>
    );
};

export default ModalListOperations;
