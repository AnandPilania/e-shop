import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import ConditionsForm from './conditionsForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
        var mustNotBeDuplicate = conditions.filter(condition => {
            return (condition.operator == 1 || condition.operator == 5 || condition.operator == 6) && condition.value != '';
        })

        // concatène le nombre représentant le paramètre avec celui de l'operator pour faciliter la comparaison 
        var tmp_tab_mustNotBeDuplicate = [];
        mustNotBeDuplicate.forEach(item => {
            tmp_tab_mustNotBeDuplicate.push(item.parameter + item.operator);
        })

        // récupère les conditions déjà éxistantes qui sont dans le tableaux des nouvelles conditons qui ne peuvent pas être dupliquées. every et return false se charge de ne pas mettre deux fois la même collection dans la liste si elle a deux condtions qui ne peuvent pas être dupliquée   
        let arrObj = [];
        listCollectionsFiltered.map(item => {
            // on check que les collections sélectionnées
            if (listCollectionsChecked.includes(item.id)) {
                let id = item.id;
                let blockConditionsToSave = {};

                // on parcoure toutes les conditions de la collection
                JSON.parse(item.objConditions).every(cond => {
                    console.log('item.id  ', item.id);
                    console.log('cond  ', cond);
                    // forme le chiffre a comparer en concaténant parameter et operator
                    let para_oper = cond.parameter + cond.operator;

                    // si duplicate condition
                    for (let i = 0; i < conditions.length; i++) {
                        if((conditions[i].operator == 1 || conditions[i].operator == 5 || conditions[i].operator == 6) && conditions[i].value != '') {

                        }
                    }
                    if (tmp_tab_mustNotBeDuplicate.includes(para_oper)) {

                        // array of duplicates conditions -> sert pour l'affichage du warning "voulez-vous remplacer cette conditions ?"
                        let obj = { "id": item.id, "name": item.name, "condition": cond }
                        arrObj.push(obj);


                        // !!! IL FAUT ENVOYER UN ARRAY AVEC L ID DE LA COLLECTION ET SONT BLOCK DE CONDITIONS SOUS FORME DE ARRAY OF OBJ POUR FAIRE LE REMPLACEMENT EN UNE TRAITE COTE PHP !!!

                        console.log('item.objConditions  ', item.objConditions);
                        var arr = [...JSON.parse(item.objConditions)];
                        var index_arr = arr.findIndex(condition => condition.id == item.id);
                        console.log('index_arr  ', index_arr);
                        arr[index_arr] = cond; console.log('arr  ', arr)
                        // obj = { "id": item.id, "name": item.name, "condition": arr }
                        // arrObj.push(obj);

                        //   return false;
                    }
                    return true;

                })
            }
        })
        // console.log('listCollectionsChecked  ', listCollectionsChecked);
        if (arrObj.length > 0) {
            // afficher message --> "voulez vous remplacer les condtions suivantes par les nouvelles conditions ?"
            console.log('arrObj  ', arrObj);
        }

        // détermine si on ajoute des conditions ou si on nen supprime
        let typeOperation = typeOperationListCollections === 0 ? 'save' : 'delete';

        let formData = new FormData;
        formData.append('arrObj', JSON.stringify(arrObj));
        formData.append('conditions', JSON.stringify(conditions));
        formData.append('typeOperation', typeOperation);

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
