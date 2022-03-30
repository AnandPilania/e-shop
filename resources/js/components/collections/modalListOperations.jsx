import React from 'react';
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
        zIndex: '10000000',
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
        zIndex: '10000000',
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

    return (
        <div className={classes.modal + ' ' + showHideClassName}>

            <section className={classes.modalMain}>

                <div className={classes.close}>
                    <FontAwesomeIcon icon={faTimes} className="h20 cursor" onClick={() => setShowModalListOperations(false)} />
                </div>

               {sender === 'conditions' && <ConditionsForm />}

            </section>
        </div>
    );
};

export default ModalListOperations;
