import React from 'react';
import { makeStyles } from '@material-ui/styles';

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
});

// affiche les rows dans list.jsx
const RowListCollections = ({ collection }) => {
    const classes = useStyles();

    function handleDeletCollection(id) {
        console.log(id)
    }
    console.log('collection  ', collection)
    return (
        <div className={classes.inputText + " searchRowInputText"}>
            {collection.name}

            <i className="far fa-trash-alt trash-alt-dropZone tooltip_" style={{ display: "block", marginLeft: "auto" }} onClick={() => { handleDeletCollection(collection.id) }}>
                <span className="tooltiptext">Supprimer l'image</span>
            </i>

            {/* <input
                className={classes.checkBox}
                type='checkbox'
                value="{props.collection.id}" /> */}
        </div>
    );
}

export default RowListCollections;
