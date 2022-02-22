import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getOnlyDate } from '../functions/dateTools';
import AppContext from '../contexts/AppContext';
import CheckBox from '../elements/checkBox';


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


    return (
        // <li className='sub-div-horiz-align bg-white p15 m10'>
        <li className='grid grid-col-list2 w100pct bg-white p15 m10'>

            <div className='flex-row h50 p5'>
                {collection && <CheckBox unikId={collection.id} />}
            </div>
            <div className='flex-row h50 p5'>
                {collection && collection.name}
            </div>
            <div className='flex-row-c-c h50'>
                {collection.thumbnail && <img className="h60" src={window.location.origin + '/' + collection.thumbnail} />}
            </div>
            <div className={`flex-row h50 p5 p-r-25 ${conditions?.length > 1 && "cursor hover-bg-gray-light"}`} onClick={showHideConditions}>
                {conditions !== null ? <div className="sub-div-vert-align">
                    {conditions.length < 2 ? getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value
                        :
                        (<div>
                            <span className="w100pct h50 m-b-10 radius5">
                                <span>
                                    {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                </span>
                            </span>
                            <ul className={showConditions ? "block" : "none"}>
                                {conditions.map((item, index) =>
                                    index > 0 && <li key={index} disabled={index > 0 ? true : false} className="block" >
                                        {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                                    </li>)}
                            </ul>
                        </div>
                        )
                    }
                </div> : '_'}
                {conditions?.length > 1 && <div className="w20 h20 p5">
                    {!showConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                </div>}
            </div>
            <div className='flex-row h50 p5'>
                <span className='radius5 p-l-10 p-r-10 p-t-3 p-b-3 white' style={{ backgroundColor: `${category && category.color}` }}>{category && category.name}</span>
            </div>
            <div className='flex-row h50 p5'>
                {collection && getOnlyDate(collection.created_at)}
            </div>
            <div className='flex-row-c-c h50 p5'>
                {collection && <img src={window.location.origin + '/images/icons/trash-flat.png'} className="w25 h25 tooltip_" style={{ margin: "0" }} onClick={() => { handleDeletCollection(collection.id) }}>
                    {/* <span className="tooltiptext">Supprimer la collection</span> */}
                </img>}
            </div>
        </li>
    );
}

export default RowListCollections;

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}