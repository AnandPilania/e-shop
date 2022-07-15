import React from 'react';

const Flex_row_s_c = ( props ) => {
    return (
        <div id={`${props.id && props.id}`}
            className="flex flex-col justify-start items-center h-auto bg-white rounded-md w-full p-5 mb-2.5 shadow-md">

            {props.children}
            
        </div>
    );
}

export default Flex_row_s_c;
