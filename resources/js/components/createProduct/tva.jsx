import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import SelectTva from './selectTva';

const Tva = () => {

    const [toggleSelectTva, setToggleSelectTva] = useState(false);
    const [selectValueColorTva, setSelectValueColorTva] = useState('');

    const { tvaRateList, productForm, setProductForm } = useContext(AppContext);

    return (
        <Flex_col_s_s id="tvaSelectId22822">
            <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                Tva {productForm.tva != '' && productForm.tva?.tva_rate + '%'} {productForm.tva?.is_default == 1 &&
                    <span className='text-sm  italic'>
                        (Par défaut)
                    </span>}
            </h3>
            <SelectTva
                list={tvaRateList}
                itemSelected={productForm.tva}
                setItemSelected={setProductForm}
                toggleSelect={toggleSelectTva}
                setToggleSelect={setToggleSelectTva}
                selectValueColor={selectValueColorTva}
                setSelectValueColor={setSelectValueColorTva}
                ulUnikId="ulTvaSelectUniqueId22822"
                buttonUnikId="buttonTvaSelectUniqueId22822"
            />
        </Flex_col_s_s>
    );
}

export default Tva;
