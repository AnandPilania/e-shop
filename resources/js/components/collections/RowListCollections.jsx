import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getOnlyDate } from '../functions/dateTools';
import AppContext from '../contexts/AppContext';
import CheckBox from '../elements/checkBox';
import { getNowUs } from '../functions/dateTools';


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
    const [timeOut, setTimeOut] = useState(null);

    const { selectedColor, setSelectedColor } = useContext(AppContext);

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
            case '9':
                return 'Le nom de la variante';
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


    // delay before dropUp list conditions
    // const showHideConditions = () => {
    //     if (!showConditions) {
    //         setShowConditions(true);
    //         setTimeOut(setTimeout(() => setShowConditions(false), 10000));
    //     } else if (showConditions) {
    //         setTimeOut(clearTimeout(timeOut));
    //         setShowConditions(false);
    //     }
    // }

    const showHideConditions = () => {
        setShowConditions(!showConditions);
    }

    useEffect(() => {
        if (conditions !== null) {
            // dropDown optimisation
            var dropable = document.getElementById('conditions_drop');

            if (!showConditions) {
                // cache borders sinon y a un bout qui reste visible
                dropable.style.borderLeft = 'none';
                dropable.style.borderRight = 'none';
                dropable.style.borderBottom = 'none';
                document.getElementsByClassName('shadow-l')[0].style.boxShadow = "none";

                filterCard.style.maxHeight = null;
                filterCard.style.paddingBottom = '0';

                dropable.style.maxHeight = null;
                dropable.style.paddingTop = 0;

            } else {

                dropable.style.maxHeight = "250px";
                // montre les borders quand ouvert seulement
                dropable.style.borderLeft = 'rgb(220, 220, 220) solid 1px';
                dropable.style.borderRight = 'rgb(220, 220, 220) solid 1px';
                dropable.style.borderBottom = 'rgb(220, 220, 220) solid 1px';
                document.getElementsByClassName('shadow-l')[0].style.boxShadow = "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px";
            }
        }
    }, [showConditions]);

    return (
        // <li className='sub-div-horiz-align bg-white p15 m10'>
        <li className='grid grid-col-list2 w100pct h-auto min-h50 bg-white p15 brd-b-gray-light-1'>

            <div className='flex-row min-h50 p5'>
                {collection && <CheckBox unikId={collection.id} />}
            </div>
            <div className='flex-row min-h50 p5'>
                {collection && collection.name}
            </div>
            <div className='flex-row-c-c min-h50 w50'>
                <figure className="h50 w50 radius-round">
                    {collection.thumbnail && <img className="h100pct radius-round" src={window.location.origin + '/' + collection.thumbnail} />}
                </figure>
            </div>
            <div className="flex-row-c-c w40 h40 radius-round bg-blue-light m-auto">
                50
            </div>


            <div className={`relative flex-row wrap min-h50 p5 ${conditions?.length > 1 && "cursor hover-bg-gray-light"}`}
                onClick={showHideConditions}>
                {conditions !== null ?
                    <div id='conditions_drop' className='w-auto flex-col justify-s align-s dropable absolute t30 r0 bg-white shadow-l radius5'>
                        {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}

                        <ul className="ul-category scroll1 w100pct h200 bg-white">
                            {conditions.map((item, index) =>
                                index > 0 && <li key={index}>
                                    {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                                </li>)}
                        </ul>
                    </div> : '_'}
                {conditions?.length > 1 && <div className="w20 h20 m-r-10">
                    {!showConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                </div>}
            </div>


            <div className='flex-row min-h50 p5'>
                <span className='h30'>{category && category.name}</span>
            </div>
            <div className='flex-row min-h50 p5'>
                <span className={`noshrink flex-row-c-c radius15 h30 p-lr-15 ${collection?.dateActivation < getNowUs() ? 'active-collection' : 'unactive-collection'}`}>{collection?.dateActivation < getNowUs() ? "Activée" : "Non activée"}</span>
            </div>
            <div className='flex-row min-h50 p5'>
                {collection && getOnlyDate(collection.created_at)}
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