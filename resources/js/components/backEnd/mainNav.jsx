import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const MainNav = () => {

    const navigate = useNavigate();

    const { screenSize, showSideNav, setShowSideNav } = useContext(AppContext);


    //  handle hamberguer nav
    const handleShowSideNav = (e) => {
        e.target.setAttribute("aria-expanded", showSideNav ? "false" : "true");
        setShowSideNav(!showSideNav);
    }

    const navigateTo = () => {
        navigate(window.location.href = '/');
    }

    return (
        <div
            className="col-span-2 sticky top-0 left-0 w-full h-14 flex flex-row justify-start items-center bg-[#fcfcfc] z-[150] border-b border-gray-200"
        >
            <button
                className="absolute top-2 left-5 w-10 h-10 p-1 cursor-pointer flex flex-col justify-around items-center bg-[#fafafa] rounded-md z-50 hover:bg-slate-200 lg:hidden"
                type="button"
                aria-label="Toggle navigation"
                aria-expanded="false"
                onClick={handleShowSideNav}
            >
                <span className='w-full h-[3px] bg-gray-900 pointer-events-none'></span>
                <span className='w-full h-[3px] bg-gray-900 pointer-events-none'></span>
                <span className='w-full h-[3px] bg-gray-900 pointer-events-none'></span>
            </button>


            <div className='flex flex-row justify-start items-center ml-80 cursor-pointer'
                onClick={navigateTo}>
                <span
                    className='text-[24px] text-teal-700 font-semibold'
                >
                    easy
                </span>
                <span
                    className='text-[24px] text-indigo-700 font-semibold'
                >
                    boutique
                </span>
            </div>

            {/* SCREEN SIZE */}
            <div>
                <span className="ml-[15%] text-gray-700 text-base font-semibold">
                    {screenSize}
                </span>
            </div>

            <button
                className="py-1 px-5 bg-indigo-900 rounded-md text-white ml-auto mr-20"
            >
                Login
            </button>
        </div>
    );
}

export default MainNav;
