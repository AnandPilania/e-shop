import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles({
    formControl: {
        width: '100%',
        height: '50px',
        backgroundColor: '#2b2e4c',
        lineHeight: 1,
        padding: '0.600rem 1rem',
        marginBottom: 22,
        border: 'solid yellow 3px',
    },
    label_text: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0', 
        marginLeft: '5px',
        marginBottom: 10,
        marginTop: '20px',
        color: '#111fff',
        width: 'auto',
    },
    input_text: {
        margin: '0', 
        paddingLeft: '10px',
        width: '100%',
        height: '55px',
        border: '#e1e1e1 solid 1px',
        borderRadius: '5px',
        color:'#111fff',
        backgroundColor: '#fff',
    }
  });


export default function SelectCollections(props) {
    const classes = useStyles();
    const [collection, setCollection] = React.useState([]);


    const handleChange = (event) => {
        setCollection(event.target.value);
        props.handleCollections(event.target.value);
    };

    return (
        <div>
            <p className={classes.input_label}><label htmlFor="collection">Collections</label></p>
            <FormControl className={classes.formControl}>
                <Select
                    id="collection"
                    multiple
                    value={collection}
                    onChange={handleChange}
                    input={<Input className={classes.input_text} />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    <MenuItem value="selectionnez une collection">
                        selectionnez une collection
                    </MenuItem>
                    {props.collectionsRelations.map((item) => (
                        <MenuItem key={item.id} value={item.name} >
                            <Checkbox checked={collection.indexOf(item.name) > -1} />
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}



