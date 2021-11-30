// import * as React from 'react';


import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import SelectCollectionsAli from "./selectCollectionsAli";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
                    {/* component={'span'} permet de ne pas avoir l'erreur "<div> as children of <p>" */}
                    <Typography component={'span'}>{children}</Typography>
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
    const [type, setType] = React.useState('');
    const [tags, setTags] = React.useState([]);
    const [title, setTitle] = React.useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCollections = (event) => {
        setCollection(event.target.value);
    };

    const handleType = (event) => {
        setType(event.target.value);
    };

    const handleTags = (event) => {
        setTags(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    return (
        <Box sx={{ width: '100%' }} className="container_tabs">
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
                <FormControl className={classes.formControl}>
                    <TextField id="outlined-basic" label="Modifier le titre" variant="outlined" value={title} onChange={handleTitle} />
                    <SelectCollectionsAli
                        handleFunction={handleCollections}
                        caracteristique={collection}
                        endPointAxios="getCollections"
                        label="Choisir des collections"
                        inputLabel="collections-inputLabel"
                        labelId="collections-labelId"
                        id="collections-checkbox-id"
                    />
                    <SelectCollectionsAli
                        handleFunction={handleType}
                        caracteristique={type}
                        endPointAxios="getType"
                        label="Choisir un type"
                        inputLabel="type-inputLabel"
                        labelId="type-labelId"
                        id="type-checkbox-id"
                    />
                    <SelectCollectionsAli
                        handleFunction={handleTags}
                        caracteristique={tags}
                        endPointAxios="getTags"
                        label="Choisir des balises"
                        inputLabel="tags-inputLabel"
                        labelId="tags-labelId"
                        id="tags-checkbox-id"
                    />
                </FormControl>
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
    );
}


