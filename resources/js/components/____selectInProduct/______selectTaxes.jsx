import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from "axios";

const useStyles = makeStyles({
    formControl: {
        width: '100%',
        height: '50px',
        backgroundColor: '#2b2e4c',
        lineHeight: 1,
        padding: '0.600rem 1rem',
        marginBottom: 22,
    },
    inputText: {
        color: '#aaa7a7',
        fontWeight: 400,
        fontSize: '0.875rem',
        width: '100%',
        height: '100%',
    }
});


export default function SelectTaxes(props) {
    const classes = useStyles();
    const [taxe, setTaxe] = React.useState('');

    const handleChange = (event) => {
        setTaxe(event.target.value);
        // props.handleTaxes(event.target.value);
    };

    useEffect(() => {
        console.log(taxe);
        props.handleTaxes(taxe);
    }, [taxe]);

    return (
        <div>
            <label htmlFor="taxe">Taxes</label>
            <FormControl className={classes.formControl}>
                <Select
                    id="taxe"
                    native={false}
                    value={taxe}
                    defaultValue='21'
                    onChange={handleChange}
                    input={<Input className={classes.inputText} />}
                >
                    {props.taxesRelations.map((item) => (
                        <MenuItem key={item.id} value={item.id} selected={item.tva_rate == '21'} >
                            {item.tva_rate}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}



