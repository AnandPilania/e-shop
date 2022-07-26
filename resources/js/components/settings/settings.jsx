import React, { useState } from 'react';
import SettingNav from './settingNav';
import Taxes from '../taxes/taxes';
import CreateSupplier from '../suppliers/createSupplier';
import Transporter from '../transporter/transporter';


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
            compo = <Transporter />;
            break;
        default:
            compo = '';
    }

    return (
        <div className='grid grid-cols-[400px_1fr] gap-x-[1px] w-[80%] min-w-[800px] mx-auto'>
            <SettingNav setCurrentComponent={setCurrentComponent} />
            <div>
                {compo}
            </div>
        </div>
    );
}

export default Settings;
