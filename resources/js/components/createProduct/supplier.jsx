import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Select from '../elements/select';
import Label from '../form/label';

const Supplier = () => {

    const [toggleSelectSupplier, setToggleSelectSupplier] = useState(false);
    const [selectValueColorSupplier, setSelectValueColorSupplier] = useState('');

    const { listSuppliers, supplier, setSupplier } = useContext(AppContext);

    return (
        <Flex_col_s_s id="supplierSelectId22822">
            <Label label="Fournisseur" />
            <Select
                list={listSuppliers}
                itemSelected={supplier}
                setItemSelected={setSupplier}
                toggleSelect={toggleSelectSupplier}
                setToggleSelect={setToggleSelectSupplier}
                selectValueColor={selectValueColorSupplier}
                setSelectValueColor={setSelectValueColorSupplier}
                ulUnikId="ulSupplierSelectUniqueId22822"
                buttonUnikId="buttonSupplierSelectUniqueId22822"
            />
        </Flex_col_s_s>
    );
}

export default Supplier;
