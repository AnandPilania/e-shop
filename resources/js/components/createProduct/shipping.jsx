import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Label from '../form/label';
import SelectWithCheckboxProduct from './selectWithCheckboxProduct';

const Shipping = () => {

    const [toggleSelectWithCheckboxTransporter, setToggleSelectWithCheckboxTransporter] = useState(false);

    const { listTransporters, transporter, setTransporter } = useContext(AppContext);

    // delete pastille des transporteurs sélectionnés
    const removeTransporter = (item) => {
        let index = transporter.findIndex(x => x.modeId == item.modeId);
        if (index > -1) {
            let tmp_arr = [...transporter];
            tmp_arr.splice(index, 1);
            setTransporter([...tmp_arr]);
        }
    }
console.log('listTransporters[0]  ', listTransporters[0])
console.log('transporter  ', transporter)
    return (
        <Flex_col_s_s>
                    <Label label="Mode.s de livraison exclusif.s" />
                    <SelectWithCheckboxProduct
                        key="SelectWithCheckbox_transporter"
                        unikId="SelectWithCheckbox_transporter22822"
                        list={listTransporters[0]}
                        selected={transporter}
                        setSelected={setTransporter}
                        toggleSelectWithCheckbox={toggleSelectWithCheckboxTransporter}
                        setToggleSelectWithCheckbox={setToggleSelectWithCheckboxTransporter}
                    />
                    <div className={`flex flex-wrap ${transporter.length > 0 && "pt-4"} w-full`}>
                        {transporter.map(item =>
                            <div key={item.modeId}
                                className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                                {console.log('item  ', item)}
                                <span
                                    className="h-full text-gray-500 mr-2 rounded-md">
                                    {item.zoneName} ({item.modeName})
                                </span>
                                <span
                                    className="h-5 w-5 min-w-[20px] min-h-[20px] flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                                    onClick={() => removeTransporter(item)}>
                                    <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                                </span>
                            </div>
                        )}
                    </div>
                </Flex_col_s_s>
    );
}

export default Shipping;
