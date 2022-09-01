import React, { useState, useEffect } from 'react';

const Tooltip = ({ children, top, left, bottom, right, css }) => {

    const [heightToolTip, setHeightToolTip] = useState(0);
    const [style, setStyle] = useState({
        top: top + 'px',
        left: left + 'px',
        bottom: bottom + 'px',
        right: right + 'px',
    });


    useEffect(() => {
        const tip = document.querySelector('#toolTipMessage1922');
        const width = tip.offsetWidth;
        const height = tip.offsetHeight;

        setStyle({
            top: `${-height}px`,
            left: left + "px",
            bottom: bottom + 'px',
            right: right + 'px',
        });

        console.log('width  ', width);
        console.log('height  ', height);

        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = tip.getBoundingClientRect(),
            offsetY = elemRect.top - bodyRect.top;
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = tip.getBoundingClientRect(),
            offsetX = elemRect.left - bodyRect.left;

        console.log('x  ' + offsetX + ' y  ' + offsetY);

    }, []);

    console.log('style  ', style);

    return (
        <div className='w-auto'>
            <img src='../images/icons/info-circle.svg'
                className="w-4 h-4 ml-2 cursor-help" />
            <div
                id="toolTipMessage1922"
                style={style}
                className={`w-full absolute whitespace-normal max-w-[370px] px-3 py-2 text-sm text-gray-900 bg-white z-[100] invisible group-hover:visible overflow-auto border border-gray-700 rounded-md shadow-lg cursor-default ${css}`}
            >

                {children}

            </div>
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