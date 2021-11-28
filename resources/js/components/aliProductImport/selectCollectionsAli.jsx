import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";

import './aliProductImport.scss';


const useStyles = makeStyles({
    formControl: {
        width: '100%',
        height: '50px',
        backgroundColor: '#fafafa',
        lineHeight: 1,
        padding: '0.600rem 1rem',
        marginBottom: 22,
        border: 'none',
    },
    inputText: {
        color: '#000000',
        fontWeight: 400,
        fontSize: '16px',
        width: '100%',
        height: '100%',
    }
});



export default function SelectCollectionsAli(props) {
    const classes = useStyles();
    const [collectionsAll, setCollectionsAll] = useState([]);

    useEffect(() => {
        // récupére les collections
        axios.get(`http://127.0.0.1:8000/getCollections`)
            .then(res => {
                setCollectionsAll(res.data.collections);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    return (
        <div className="container_tabs">
            <FormControl className={classes.formControl}>
                <Select
                    id="collection"
                    multiple
                    value={props.collection}
                    onChange={props.handleCollections}
                    input={<Input className={classes.inputText} />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    <MenuItem value="selectionnez une collection">
                        selectionnez une collection
                    </MenuItem>
                    {collectionsAll.map((item) => (
                        <MenuItem key={item.id} value={item.name} >
                            <Checkbox checked={props.collection.indexOf(item.name) > -1} />
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>

    );
}



