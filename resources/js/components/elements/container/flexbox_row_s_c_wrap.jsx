import React from 'react';

const Flexbox_row_s_c_wrap = (props) => {
    return (
        <div
            id={`${props.id && props.id}`}
            className={`flex flex-row justify-start items-center flex-wrap w-full ${props.css?.length > 0 && props.css}`}
        >

            {props.children}

        </div>
    );
}

export default Flexbox_row_s_c_wrap;
