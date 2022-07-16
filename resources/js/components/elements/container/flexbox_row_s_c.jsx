import React from 'react';

const Flexbox_row_s_c = (props) => {
    return (
        <div
            id={`${props.id && props.id}`}
            className="flex flex-row justify-start items-center w-full"
        >

            {props.children}

        </div>
    );
}

export default Flexbox_row_s_c;
