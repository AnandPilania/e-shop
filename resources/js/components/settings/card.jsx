import React from 'react';
import { useNavigate } from "react-router-dom";


const Card = ({ icon, title, text, color, link }) => {

    const navigate = useNavigate();

    const goTo = () => {
        navigate(link);
    }
    return (
        <div 
        className='flex flex-col justify-start items-start self-stretch p-6 w-[33.3333%] min-w-80 bg-white border border-gray-200  hover:border-indigo-600 hover:rounded-md hover:bg-slate-500 group transition ease-in delay-25 cursor-pointer'
        onClick={goTo}>
            <span className={`w-12 h-12 mb-6 rounded-md flex flex-row justify-center items-center ${color}`}>
                <img src={window.location.origin + '/images/icons/' + icon} className="h-6 w-6" />
            </span>
            <h2 className='text-base font-semibold mb-2 w-full transition ease-in delay-50 group-hover:text-white'>{title}</h2>
            <p className='w-full transition ease-in delay-50 group-hover:text-white'>
                {text}
            </p>
        </div>
    );
}

export default Card;
