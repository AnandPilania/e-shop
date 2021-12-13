import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    inputText: {
        color: '#000000',
        backgroundColor: 'white',
        fontWeight: 400,
        fontSize: '16px',
        width: '100%',
        height: '50px',
        border: '#f4f4f4 solid 1px',
        borderRadius: '5px',
    }
});

// affiche les rows dans list.jsx
const SearchRow = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.inputText}>
            <input type='checkbox' value="{props.collection.id}" />
            {props.collection.name}
        </div>
    );
}

export default SearchRow;
