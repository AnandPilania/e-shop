import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Label from '../form/label';
import DatePicker from 'react-date-picker';


const Activation = () => {
    const { dateFieldProduct, setDateFieldProduct } = useContext(AppContext);
    const [value, onChange] = useState(new Date());


    return (
        <div>
            <div className="w-full h-auto flex flex-col justify-start items-start mb-2.5 p-5 shadow-sm bg-white rounded-md">
                <div className="w-full h-auto flex flex-col justify-start items-start">
                    <div className='w-full h-auto flex flex-col justify-start items-start'>
                        <Label label="Date d'activation" css="mb-2"/>
                        <DatePicker onChange={onChange} value={value} showTimeSelect
  dateFormat="Pp" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activation;
