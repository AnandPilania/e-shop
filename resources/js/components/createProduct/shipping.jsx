import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectWithCheckbox from '../elements/selectWithCheckbox';

const Shipping = () => {

    const [toggleSelectWithCheckboxTransporter, setToggleSelectWithCheckboxTransporter] = useState(false);

    const { listTransporters, transporter, setTransporter } = useContext(AppContext);

    const removeTransporter = (item) => {
        let index = transporter.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...transporter];
            tmp_arr.splice(index, 1);
            setTransporter([...tmp_arr]);
        }
    }

    return (
        <Flex_col_s_s>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                        Transporteurs
                    </h3>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_transporter"
                        unikId="SelectWithCheckbox_transporter22822"
                        list={listTransporters[0]?.reduce((prev, next) => {
                            return prev.shipping_modes.concat(next.shipping_modes)
                        })}
                        selected={transporter}
                        setSelected={setTransporter}
                        toggleSelectWithCheckbox={toggleSelectWithCheckboxTransporter}
                        setToggleSelectWithCheckbox={setToggleSelectWithCheckboxTransporter}
                    />
                    <div className={`flex flex-wrap ${transporter.length > 0 && "pt-4"} w-full`}>
                        {transporter.map(item =>
                            <div key={item.id}
                                className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                                <span
                                    className="h-full text-gray-500 mr-2 rounded-md">
                                    {item.name}
                                </span>
                                <span
                                    className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
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
