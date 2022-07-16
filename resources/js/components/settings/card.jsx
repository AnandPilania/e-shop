import React from 'react';
import Flexbox_row_s_c_wrap from '../elements/container/flexbox_row_s_c_wrap';

const Card = ({ icon, title, text, color, component, setCurrentComponent }) => {


    const goTo = () => {
        setCurrentComponent(component);
    }

    return (
        <div
            className='flex flex-col justify-start items-start p-5 w-full min-w-80 bg-transparent border-b border-gray-200  hover:rounded-md hover:border-indigo-600 hover:bg-slate-500 group transition ease-in delay-25 cursor-pointer'
            onClick={goTo}
        >
            <Flexbox_row_s_c_wrap css="mb-2">
                <span className={`w-6 h-6 mr-2 rounded-md flex flex-row justify-center items-center ${color}`}>
                    <img src={window.location.origin + '/images/icons/' + icon} className="h-4 w-4" />
                </span>
                <h2 className='text-base font-semibold transition ease-in delay-50 group-hover:text-white'>
                    {title}
                </h2>
            </Flexbox_row_s_c_wrap>
            <p className='w-full text-sm text-gray-600 pl-8 transition ease-in delay-50 group-hover:text-white'>
                {text}
            </p>
        </div>
    );
}

export default Card;
