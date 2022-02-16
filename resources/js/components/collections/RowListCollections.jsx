import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getOnlyDate } from '../functions/dateTools';


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

    useEffect(() => {
        setConditions(JSON.parse(collection.objConditions));
    }, []);



    function handleDeletCollection(id) {
        // console.log(id)
    }

    category && console.log('category  ', category.name)
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
        <li className='sub-div-horiz-align bg-white p15 m5 flex-row-align-c'>
            <div className='w50 p5'>
                {collection && <input
                    className={classes.checkBox}
                    type='checkbox'
                    value={collection.id} />}
            </div>
            <div className='w250 p5'>
                {collection && collection.name}
            </div>
            <div className='w75'>
                {collection.thumbnail && <img src={window.location.origin + '/' + collection.thumbnail} />}
            </div>
            <div className='w50 p5 txt-c'>
                {collection && <i className={classes.trash + " far fa-trash-alt trash-alt-dropZone tooltip_"} style={{ display: "block", marginLeft: "auto" }} onClick={() => { handleDeletCollection(collection.id) }}>
                    <span className="tooltiptext">Supprimer l'image</span>
                </i>}
            </div>
            <div>
                <div className="sub-div-vert-align w300 p5">
                    {conditions && conditions.map(item =>
                        <span key={item.id}>
                            {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                        </span>
                    )}
                </div>
            </div>
            <div className='w200 p5'>
                {category && category.name}
            </div>
            <div className='w200 p5'>
                {collection && getOnlyDate(collection.created_at)}
            </div>
        </li>
    );
}

export default RowListCollections;

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}