import React from 'react';

const Flexbox_row_s_c_wrap = (props) => {
    return (
        <div
            id={`${props.id && props.id}`}
            className={`flex flex-row flex-wrap justify-start items-center h-auto bg-white rounded-md w-full p-4 shadow ${props.css?.length > 0 && props.css}`}
        >

            {props.children}

        </div>
    );
}

export default Flexbox_row_s_c_wrap;
