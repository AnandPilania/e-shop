import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import CheckBox from '../elements/checkBox';
import { getNowUs, getOnlyDate, getOnlyDateAndHour } from '../functions/dateTools';
import ModalConfirm from '../modal/modalConfirm';


const useStyles = makeStyles({
    inputText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '60px',
        paddingLeft: '20px',
        color: '#000000',
        backgroundColor: 'white',
        fontWeight: 400,
        fontSize: '16px',
        border: '#f4f4f4 solid 1px',
        borderRadius: '5px',
    },
});

// affiche les rows dans list.jsx
const RowListCollections = ({ collection, category }) => {
    const classes = useStyles();
    const [conditions, setConditions] = useState(null);
    const [showConditions, setShowConditions] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);
    const [idToEdit, setIdToEdit] = useState(null);

    const { isDirty, setIsDirty, setMessageModal, sender, setSender, setImageModal, setTmp_parameter, showModalConfirm, setShowModalConfirm, textButtonConfirm, setTextButtonConfirm, handleModalConfirm, handleModalCancel, imageModal, messageModal } = useContext(AppContext);

    var navigate = useNavigate();

    useEffect(() => {
        setConditions(JSON.parse(collection.objConditions));
    }, []);



    function handleDeletCollection(id) {
        // console.log(id)
    }

    function getParameter(parameter) {
        switch (parameter) {
            case '1':
                return 'Le nom';
            case '2':
                return 'Le type';
            case '3':
                return 'Le fournisseur';
            case '4':
                return 'Le prix';
            case '5':
                return 'Le tag';
            case '6':
                return 'Le prix avant promo';
            case '7':
                return 'Le poids';
            case '8':
                return 'Le stock';
            default:
                return '';
        }
    }


    function getOperator(operator) {
        switch (operator) {
            case '1':
                return 'est égale à';
            case '2':
                return 'n\'est pas égale à';
            case '3':
                return 'est suppérieur à';
            case '4':
                return 'est infèrieur à';
            case '5':
                return 'commence par';
            case '6':
                return 'se termine par';
            case '7':
                return 'contient';
            case '8':
                return 'ne contient pas';
            case '9':
                return 'n\'est pas vide';
            case '10':
                return 'est vide';
            default:
                return '';
        }
    }

    const showHideConditions = (e) => {
        // getBoundingClientRect give position of div, ul or li
        var element = e.target;
        setDistanceFromBottom(window.innerHeight - element.getBoundingClientRect().bottom);
        setShowConditions(!showConditions);
    }

    // permet la fermeture du popover quand on clique n'importe où en dehors du popover
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '-5px',
        zIndex: '-10',
        cursor: 'default',
    }

    const editCollection = (id) => {
        if (isDirty) {
            setIdToEdit(id);
            setMessageModal('Le formulaire d\'édition contient d\'anciennes données non sauvegardées. ')
            setTextButtonConfirm('Continuer');
            setImageModal('../images/icons/trash_dirty.png');
            setSender('editCollection');
            setTmp_parameter(id);
            setShowModalConfirm(true);
        } else {
            // isEdit indique qu'on veut éditer la collection
            navigate('/add-collection', { state: { collectionId: id, isEdit: true } });
        }
    }


    // delete collection
    const deleteCollection = (id) => {
        let idToDelete = new FormData;
        idToDelete.append('id', id);

        Axios.post(`http://127.0.0.1:8000/deleteCollection`, idToDelete)
            .then(res => {
                console.log(res.data);
                setId(null);
            });
    }


    return (
        <li className='grid grid-col-list2 w100pct h-auto min-h50 bg-white p15 brd-b-gray-light-1'>

            <div className='flex-row min-h50 p5'>
                {collection && <CheckBox unikId={collection.id} />}
            </div>
            <div className='flex-row min-h50 p5 p-l-10 w95pct cursor word-break'>
                {collection && collection.name}
            </div>
            <div className='flex-row-c-c min-h50 w50'>
                <figure className="h50 w50 radius-round">
                    {collection.thumbnail && <img className="h100pct radius-round" src={window.location.origin + '/' + collection.thumbnail} />}
                </figure>
            </div>
            <div className="flex-row-c-c w40 h40 radius-round bg-blue-light m-auto">
                {collection.products.length}
            </div>

            <div className={`flex-row min-h50 ${conditions?.length > 1 && "cursor"}`}
                onClick={showHideConditions}>

                {conditions !== null ?
                    <div className='relative w-auto flex-col justify-s align-s bg-white radius5'>

                        {!showConditions ?
                            <div className='w100pct'>
                                <span>
                                    {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                </span>
                            </div>
                            :
                            conditions.length > 1 ?
                                <div className={`flex-col-s-s w300 max-h310 absolute l0 bg-white shadow-l radius5 z3 ${distanceFromBottom < 300 ? "b0" : "t0"}`}>
                                    <div style={cover} onClick={showHideConditions} />
                                    <div className='w100pct h60 p-l-20  flex-row-s-c bg-gray-light'>
                                        <span className="w30 h30 radius-round bg-blue white flex-row-c-c fs12">{conditions.length} </span>  &nbsp; Conditions
                                    </div>
                                    <ul className="scrolly scroll flex-col-s-s  w300 max-h265 p20 bg-white ul">
                                        {conditions.map((item, index) =>
                                            <li key={index} className="w100pct word-break">
                                                {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                                            </li>)}
                                    </ul>
                                </div>
                                :
                                <div className='w100pct'>
                                    <span>
                                        {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                    </span>
                                </div>
                        }
                    </div> : '_'}

                {conditions?.length > 1 && <div className="w20 h20 m-r-10 m-l-auto">
                    {!showConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                </div>}
            </div>

            <div className='flex-row min-h50 p5'>
                <span>{category && category.name}</span>
            </div>
            <div className='flex-row min-h50 p5'>
                <span className={`noshrink flex-row-c-c radius15 h30 p-lr-15 ${collection?.dateActivation < getNowUs() ? 'active-collection' : 'unactive-collection'}`}>{collection?.dateActivation < getNowUs() ? "Activée" : `${getOnlyDateAndHour(collection?.dateActivation)}`}</span>
            </div>
            <div className='flex-row min-h50 p5'>
                {collection && getOnlyDate(collection.created_at)}
            </div>
            <div>
                <i className="fas fa-recycle m-r-20 cursor fs20 hover-green"
                    onClick={() => {
                        editCollection(collection.id);
                    }}>
                </i>
                <i className="far fa-trash-alt cursor fs20 hover-red"
                    onClick={() => deleteCollection(collection.id)}></i>
            </div>

            {/* <div className='flex-row-c-c min-h50 p5'>
                {collection && <img src={window.location.origin + '/images/icons/trash-flat.png'} className="w25 h25 tooltip_" style={{ margin: "0" }} onClick={() => { handleDeletCollection(collection.id) }}>
                  //  <span className="tooltiptext">Supprimer la collection</span>
                </img>}
            </div> */}

            {/* modal for confirmation */}
            <ModalConfirm
                show={showModalConfirm} // true/false show modal
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
                textButtonConfirm={textButtonConfirm}
                image={imageModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirm>
        </li>
    );
}

export default RowListCollections;

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}