import React from 'react';

const Tooltip = ({ children, top, left }) => {

    const style = {
        top: top + '%',
        left: left + '%'
    }

    return (
        <div
            style={style}
            className="absolute whitespace-normal w-auto h-auto max-w-[370px] px-[10px] py-[5px] text-sm text-black bg-slate-50 z-10 invisible group-hover:visible group-hover:default overflow-visible border border-slate-400 cursor-default"
        >
            {children}

        </div>
    );
}

export default Tooltip;


    // ---> how use <---> example in OptionVariantesList <---
    // <parent className="group">
    //     {parent.content}
    //     <Tooltip top={-5} left={2}>
    //         {children}
    //     </Tooltip>
    // </parent>