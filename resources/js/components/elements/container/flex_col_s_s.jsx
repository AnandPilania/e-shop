import React from 'react';

const Flex_col_s_s = ( props ) => {
    return (
        <div id={`${props.id && props.id}`}
            className={`flex flex-col justify-start items-start h-auto bg-white rounded-md w-full p-5 mb-2.5 shadow-md ${props.css}`}>

            {props.children}
            
        </div>
    );
}

export default Flex_col_s_s;
