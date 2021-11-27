// import * as React from 'react';


import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import axios from "axios";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './aliProductImport.scss';


const useStyles = makeStyles({
    formControl: {
        width: '100%',
        height: '50px',
        backgroundColor: '#fafafa',
        lineHeight: 1,
        padding: '0.600rem 1rem',
        marginBottom: 22,
        border: 'solid gray 3px',
    },
    inputText: {
        color: '#000000',
        fontWeight: 400,
        fontSize: '16px',
        width: '100%',
        height: '100%',
    }
});





function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AliProductImport() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [collection, setCollection] = React.useState([]);
    const [collectionsRelations, setCollectionsRelations] = useState([]);

    useEffect(() => {
        // récupére les collections
        axios.get(`http://127.0.0.1:8000/getCollections`)
            .then(res => {
                setCollectionsRelations(res.data.collections);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCollections = (value) => {
        setCollection(value);
    }

    return (
        // <div className="container_tabs">
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Produit" {...a11yProps(0)} />
                    <Tab label="Tarification" {...a11yProps(1)} />
                    <Tab label="Variantes" {...a11yProps(2)} />
                    <Tab label="Images" {...a11yProps(3)} />
                    <Tab label="Description" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div>
                    <label htmlFor="collection">Collections</label>
                    <FormControl className={classes.formControl}>
                        <Select
                            id="collection"
                            multiple
                            value={collection}
                            onChange={handleChange}
                            input={<Input className={classes.inputText} />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            <MenuItem value="selectionnez une collection">
                                selectionnez une collection
                            </MenuItem>
                            {collectionsRelations.map((item) => (
                                <MenuItem key={item.id} value={item.name} >
                                    <Checkbox checked={collection.indexOf(item.name) > -1} />
                                    <ListItemText primary={item.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Tarification
            </TabPanel>
            <TabPanel value={value} index={2}>
                Variantes
            </TabPanel>
            <TabPanel value={value} index={3}>
                Images
            </TabPanel>
            <TabPanel value={value} index={4}>
                Description
            </TabPanel>
        </Box>
        // </div>

    );
}



