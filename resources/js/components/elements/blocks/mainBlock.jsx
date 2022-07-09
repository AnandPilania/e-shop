import React from 'react';

const MainBlock = ( props ) => {
    return (
        <div id={`${props.id && props.id}`}
            className="flex flex-col justify-start items-start h-auto bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">

            {props.children}
            
        </div>
    );
}

export default MainBlock;
