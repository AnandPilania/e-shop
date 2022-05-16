import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Input from '@mui/material/Input';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';


export default function SelectCollections(props) {
    
    const { collection, setCollection } = useContext(AppContext);

    const handleChange = (e) => {
        setCollection(e.target.value);
    };

    return (
        <div className="w100pct">
            <FormControl className="w100pct h50 bg-white p-tb-10 p-lr-15 m-b-20">
                <Select
                    id="collection"
                    multiple
                    value={collection}
                    onChange={handleChange}
                    input={<Input className="w100pct h50 radius5 brd-gray-light-1 bg-white p10" />}
                    renderValue={(selected) => selected.join(', ')}
                    variant="standard"
                >
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



