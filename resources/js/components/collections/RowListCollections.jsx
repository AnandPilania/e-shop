import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { getNowUs, getOnlyDate, getOnlyDateAndHour } from '../functions/dateTools';
import CheckboxListCollection from '../elements/Checkbox_listCollection';

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
const RowListCollections = ({ collection, category, handleCheckboxListCollection, listCollectionsChecked, confirmDeleteCollection }) => {

    const classes = useStyles();
    const [conditions, setConditions] = useState(null);
    const [showConditions, setShowConditions] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);

    var navigate = useNavigate();

    useEffect(() => {
        setConditions(JSON.parse(collection.objConditions));
    }, []);



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
            case '9':
                return 'La date de création du produit';
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
        // isEdit indique qu'on veut éditer la collection
        navigate('/add-collection', { state: { collectionId: id, isEdit: true } });
    }



    const figureSize = {
        width: "50px",
        height: "50px",
        background: "url(" + window.location.origin + '/' + collection.thumbnail + ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    }

    return (
        <li className='grid grid-col-list2 w100pct h-auto min-h50 bg-white p15 brd-b-gray-light-1'>
            {/* checkBox */}
            <div className='flex-row min-h50 p5'>
                {collection && <CheckboxListCollection unikId={collection.id} handleCheckboxListCollection={handleCheckboxListCollection} listCollectionsChecked={listCollectionsChecked} />}
            </div>
            {/* name */}
            <div className='flex-row min-h50 p5 p-l-10 w95pct cursor word-break'>
                {collection && collection.name}
            </div>
            {/* thumbnail */}
            <div className='flex-row-c-c min-h50 w50'>
                {collection.thumbnail &&
                    <figure className="h50 w50 radius-round" style={figureSize}>
                    </figure>}
            </div>
            {/* nb product */}
            <div className="flex-row-c-c w40 h40 radius-round bg-blue-light m-auto">
                {collection.products.length}
            </div>
            {/* conditions */}
            <div className={`flex-row min-h50 ${conditions?.length > 1 && "cursor"}`} onClick={showHideConditions}>
                {conditions !== null ?
                    <div className='relative w-auto flex-col justify-s align-s bg-white radius5 m-r-10'>

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
                                    <ul className="scroll flex-col-s-s w300 max-h265 p20 bg-white ul  scrolly">
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

                {conditions?.length > 1 && <div className="w20 h20 m-r-10 m-l-auto min-w20">
                    {!showConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} className="w17" /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                </div>}
            </div>
            {/* category */}
            <div className='flex-row min-h50 p5'>
                <span>{category && category.name}</span>
            </div>
            {/* date activation */}
            <div className='flex-row min-h50 p5'>
                <span className={`noshrink flex-row-c-c radius15 h30 p-lr-15 ${collection?.dateActivation < getNowUs() ? 'active-collection' : 'unactive-collection'}`}>{collection?.dateActivation < getNowUs() ? "Activée" : `${getOnlyDateAndHour(collection?.dateActivation)}`}</span>
            </div>
            {/* created_at */}
            <div className='flex-row min-h50 p5'>
                {collection && getOnlyDate(collection.created_at)}
            </div>
            {/* edit & delete */}
            <div>
                <i className="fas fa-recycle m-r-20 cursor fs20 hover-green"
                    onClick={() => {
                        editCollection(collection.id);
                    }}>
                </i>
                <i className="far fa-trash-alt cursor fs20 hover-red"
                    onClick={() => confirmDeleteCollection(collection.id, collection.name)}></i>
            </div>

            {/* <div className='flex-row-c-c min-h50 p5'>
                {collection && <img src={window.location.origin + '/images/icons/trash-flat.png'} className="w25 h25 tooltip_" style={{ margin: "0" }} onClick={() => { handleDeletCollection(collection.id) }}>
                  //  <span className="tooltiptext">Supprimer la collection</span>
                </img>}
            </div> */}
        </li>
    );
}

export default RowListCollections;

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}