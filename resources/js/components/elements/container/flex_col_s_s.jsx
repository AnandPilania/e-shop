import React from 'react';

const Flex_col_s_s = ( props ) => {
    return (
        <div id={`${props.id && props.id}`}
            className={`flex flex-col justify-start items-start h-auto bg-white rounded-md w-full p-4 shadow ${props.css}`}>

            {props.children}
            
        </div>
    );
}

export default Flex_col_s_s;
