import React, { useState } from 'react';
import SettingNav from './settingNav';
import Taxes from '../taxes/taxes';
import CreateSupplier from '../suppliers/createSupplier';
import Shipping from '../shipping/shipping';


const Settings = () => {

    const [currentComponent, setCurrentComponent] = useState('');

    var compo;


    switch (currentComponent) {
        case 'taxes':
            compo = <Taxes />;
            break;
        case 'suppliers':
            compo = <CreateSupplier />;
            break;
        case 'shipping':
            compo = <Shipping />;
            break;
        default:
            compo = '';
    }

    return (
        <div
            className='min-h-[100vh] w-[80%] min-w-[800px] mx-auto grid grid-cols-[400px_1fr] gap-x-[1px]'
        >
            <SettingNav setCurrentComponent={setCurrentComponent} />
            <div>
                {compo}
            </div>
        </div>
    );
}

export default Settings;
