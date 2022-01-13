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
    }
});

// affiche les rows dans list.jsx
const RowListCollections = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.inputText}>
            <input 
            className={classes.checkBox}
            type='checkbox' 
            value="{props.collection.id}" />
            {props.collection.name}
        </div>
    );
}

export default RowListCollections;
