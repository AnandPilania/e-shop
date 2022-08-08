import React from 'react';

const Tooltip = ({ children, top, left, bottom, right, css }) => {

    const style = {
        top: top + 'px',
        left: left + 'px',
        bottom: bottom + 'px',
        right: right + 'px'
    }

    return (
        <div
            style={style}
            className={`absolute  whitespace-normal w-auto h-auto max-w-[370px] px-3 py-2 text-sm text-gray-900 bg-white z-10 invisible group-hover:visible overflow-auto border border-gray-200 rounded-md shadow-lg cursor-default ${css}`}
        >
            {children}

        </div>
    );
}

export default Tooltip;


    // ---> how use <---> example in OptionVariantesList <---
    // <parent className="group relative">
    //     {parent.content}
    //     <Tooltip top={-5} left={2}>
    //         {children}
    //     </Tooltip>
    // </parent>