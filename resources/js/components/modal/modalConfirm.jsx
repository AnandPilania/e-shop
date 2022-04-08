import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { makeStyles } from '@material-ui/styles';
import parse from 'html-react-parser';
import { getParameter, getOperator } from '../collections/conditionsFunctions';


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
        width: '30%',
        minWidth: '300px',
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
        margin: '20px 20px 0 0',
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

    messageBody: {
        width: '100%',
        maxHeight: '500px',
        overflowY: 'scroll',
        border: 'solid 1px rgb(220, 220, 220)',
        padding: '20px'
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

    displayBlock: {
        display: 'block',
    },

    displayNone: {
        display: 'none',
    },

    textMessage: {
        color: 'black',
        fontSize: '16px',
        zIndex: "100000"
    }
});


const ModalConfirm = ({ textButtonConfirm, show, messageModal, messageHeader, messageArray, notForThisId, children }) => {
    const classes = useStyles();
    const showHideClassName = show ? classes.displayBlock : classes.displayNone;

    const { handleModalConfirm, handleModalCancel } = useContext(AppContext);

    return (
        <div className={classes.modal + ' ' + showHideClassName}>
            <section className={classes.modalMain}>

                <div className={classes.close}><i className={classes.faTimes + ' ' + "fas fa-times"} onClick={handleModalCancel}></i></div>

                {/* conversion d'un message en html pour affichage structuré */}
                <div className="textMessage">{messageHeader?.length > 0 && parse(messageHeader)}</div>

                <div className={classes.messageBody}>
                    <div className="textMessage">
                        {messageArray?.length > 0 &&
                            messageArray.map((item, i) => 
                                 <div key={i}>
                                        <span>Dans la collection  <b>{item.name}</b></span><br/>
                                        <span>{getParameter(item.condition.parameter)} {getOperator(item.condition.operator)} {item.condition.value}</span> <br/>
                                        <span>sera remplacé par</span><br/>
                                        <span>{getParameter(item.newCondition.parameter)}  {getOperator(item.newCondition.operator)} {item.newCondition.value}</span>
                                        <br/>

                                        <input type="checkbox" value={item.id} onChange={() => notForThisId(item.id, item.newCondition.id)} />
                                        <br/><hr/><br/>
                                </div> 
                              
                            )}
                    </div>

                    <div className="textMessage">{messageModal?.length > 0 && parse(messageModal)}</div>

                    {/* children affiche les méssages passés en children quand il y en a */}
                    {children}
                </div>


                <div className={classes.BlockButtons}>
                    <button className={classes.btnModal} onClick={handleModalConfirm}>
                        {textButtonConfirm}
                    </button>
                    <button className={classes.btnModal} onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </section>
        </div>
    );
};

export default ModalConfirm;
