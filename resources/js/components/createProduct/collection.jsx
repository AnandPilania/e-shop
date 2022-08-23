import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectWithCheckbox from '../elements/selectWithCheckbox';
import Axios from 'axios';
import Label from '../form/label';


const Collection = () => {

    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [toggleSelectWithCheckboxCollection, setToggleSelectWithCheckboxCollection] = useState(false);

    const { collection, setCollection } = useContext(AppContext);

    useEffect(() => {
        // récupére les collections
        Axios.get(`http://127.0.0.1:8000/getCollections`)
            .then(res => {
                setCollectionsRelations(res.data.collections);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    const removeCollection = (item) => {
        let index = collection.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...collection];
            tmp_arr.splice(index, 1);
            setCollection([...tmp_arr]);
        }
    }

    return (
        <Flex_col_s_s>
            <Label label="Collections" />
            <SelectWithCheckbox
                key="SelectWithCheckbox_collection"
                unikId="SelectWithCheckbox_collection"
                list={collectionsRelations}
                selected={collection}
                setSelected={setCollection}
                toggleSelectWithCheckbox={toggleSelectWithCheckboxCollection}
                setToggleSelectWithCheckbox={setToggleSelectWithCheckboxCollection}
            />
            <div className={`flex flex-wrap ${collection.length > 0 && "pt-4"} w-full`}>
                {collection.map(item =>
                    <div key={item.id}
                        className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                        <span
                            className="h-full text-gray-500 mr-2 rounded-md">
                            {item.name}
                        </span>
                        <span
                            className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                            onClick={() => removeCollection(item)}>
                            <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                        </span>
                    </div>
                )}
            </div>
        </Flex_col_s_s>
    );
}

export default Collection;
