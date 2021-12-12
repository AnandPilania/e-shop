import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";

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
    inputText: {
        color: '#ffffff',
        fontWeight: 400,
        fontSize: '16px',
        width: '100%',
        height: '100%',
    }
  });


export default function SelectCollectionsEdit(props) {
    const classes = useStyles();
    const [collection, setCollection] = useState([]);
    const [collectionsRelations, setCollectionsRelations] = useState([]);
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/selectCollections/${props.productId}`)
        .then(res => {
            setCollectionsRelations(res.data.collections);
            setCollection(res.data.productCollections);
            props.handleCollections(res.data.productCollections);
        }).catch(function (error) {
            console.log('error:   ' + error);
        });
    }, []);


    const handleChange = (event) => {
        console.log(event.target.value);
        setCollection(event.target.value);
        props.handleCollections(event.target.value);
    };

    return (
        <div>
            <label htmlFor="collection">Collections</label>
            <FormControl className={classes.formControl}>
                <Select
                    id="collection"
                    multiple
                    value={[...collection]}
                    onChange={handleChange}
                    input={<Input className={classes.inputText} />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {collectionsRelations.map((item) => (
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



