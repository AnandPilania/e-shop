import React from 'react';

const MainNav = () => {
    return (
        <div
            className="col-span-2 sticky top-0 left-0 w-full h-14 flex flex-row justify-start items-center bg-white z-50 border-b border-gray-300"
        >
            <div className='flex flex-row justify-start items-center ml-10'>
                <span
                    className='text-[24px] text-teal-700 font-semibold'
                >
                    my
                </span>
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
            <button
                className="py-2 px-5 bg-blue-500 rounded-md text-white ml-auto mr-10"
            >
                Login
            </button>
        </div>
    );
}

export default MainNav;
