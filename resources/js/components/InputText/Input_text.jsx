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

const InputText = () => {
    const classes = useStyles();

    return (
            <input className={classes.inputText} type="text" />
    );
}

export default InputText;

