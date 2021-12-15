import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Axios from 'axios';


const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,          
        },
    },
};


export default function SelectCollectionsAli(props) {
    const [checkItemsList, setCheckItemsList] = React.useState([]);

    React.useEffect(() => {
        // récupére les collections
        Axios.get(`http://127.0.0.1:8000/${props.endPointAxios}`)
            .then(res => {
                res.data.collections && setCheckItemsList(res.data.collections);
                res.data.type && setCheckItemsList(res.data.type);
                res.data.tags && setCheckItemsList(res.data.tags);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    return (
        <div>
            <FormControl sx={{ marginTop: "30px", width: "100%", backgroundColor: "#fafafa" }}>
                <InputLabel id={props.inputLabel}>{props.label}</InputLabel>
                <Select
                    labelId={props.labelId}
                    id={props.id}
                    multiple
                    value={props.caracteristique}
                    onChange={props.handleFunction}
                    input={<OutlinedInput label={props.label} />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {checkItemsList.map((item) => (
                        // caracteristique représente les collection, le type ou les tags, ... 
                        <MenuItem key={item.id} value={item.name}>
                            <Checkbox checked={props.caracteristique.indexOf(item.name) > -1} />
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
