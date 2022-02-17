import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getOnlyDate } from '../functions/dateTools';
import AppContext from '../contexts/AppContext';

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
    checkBox: {
        marginRight: '10px',
    },
    trash: {
        marginLeft: 'auto',
    }
});

// affiche les rows dans list.jsx
const RowListCollections = ({ collection, category }) => {
    const classes = useStyles();
    const [conditions, setConditions] = useState(null);

    const {
        selectedColor, setSelectedColor } = useContext(AppContext);

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

    return (
        <li className='sub-div-horiz-align bg-white p15 m10'>
            <div className='w50 p5'>
                {collection && <input
                    className={classes.checkBox}
                    type='checkbox'
                    value={collection.id} />}
            </div>
            <div className='w20pct p5'>
                {collection && collection.name}
            </div>
            <div className='w75'>
                {collection.thumbnail && <img src={window.location.origin + '/' + collection.thumbnail} />}
            </div>
            <div className='w150 p5 txt-c'>
                {collection && <i className={classes.trash + " far fa-trash-alt trash-alt-dropZone tooltip_"} style={{ display: "block", marginLeft: "auto" }} onClick={() => { handleDeletCollection(collection.id) }}>
                    <span className="tooltiptext">Supprimer la collection</span>
                </i>}
            </div>
            <div className="w30pct p5">
                {conditions !== null ? <div className="sub-div-vert-align">
                    {conditions && conditions.map(item =>
                        <span key={item.id}>
                            {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                        </span>
                    )}
                </div> : '_'}
            </div>
            <div className='w20pct p5'>
                <span className='radius5 p-l-10 p-r-10 p-t-3 p-b-3 white' style={{ backgroundColor: `${category && category.color}` }}>{category && category.name}</span>
            </div>
            <div className='w20pct p5'>
                {collection && getOnlyDate(collection.created_at)}
            </div>
        </li>
    );
}

export default RowListCollections;

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}