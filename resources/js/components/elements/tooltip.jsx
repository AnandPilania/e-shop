import React, { useState, useEffect } from 'react';

const Tooltip = ({ children, css, id, widthTip }) => {

    const [style, setStyle] = useState({
        top: 0 + 'px',
        left: 0 + 'px',
        display: 'none'
    });


    useEffect(() => {
        var tipImg = document.getElementById(`${id}toolTipImg2922`);
        var tipIcon = document.getElementById(`${id}toolTipMessage2922`);
        var parent = document.getElementById(id);
        var width = 300;
        var left;

        var bodyWidth = document.body.offsetWidth,
            bodyHeight = document.body.offsetHeight,
            bodyRect = document.body.getBoundingClientRect(),

            parentRect = parent.getBoundingClientRect(),
            offsetParentY = parentRect.top - bodyRect.top,
            offsetParentX = parentRect.left - bodyRect.left,

            toolTipIconRect = tipIcon.getBoundingClientRect(),
            offsetToolTipIconY = toolTipIconRect.top - bodyRect.top,
            offsetToolTipIconX = toolTipIconRect.left - bodyRect.left,
            toolTipWidth = tipIcon.offsetWidth,

            tipIconWidth = tipIcon.offsetWidth,
            tipIconHeight = tipIcon.offsetHeight;



            parent.addEventListener("mouseover", () => {
            tipIcon.style.visibility = "visible";
            tipIconWidth = tipIcon.offsetWidth;
            tipIconHeight = tipIcon.offsetHeight + 12;

            if (bodyWidth - parentRect.right < widthTip) {
                width = bodyWidth;
                left = (toolTipIconRect.left);
                console.log('toolTipIconRect.left  ', toolTipIconRect.left)
                console.log('left 1  ', left)
            } else {
                width = bodyWidth < widthTip ? "w-full" : widthTip;
                left = ((widthTip / 2) - 16);
                console.log('left 2  ', left)
            }
             
            setStyle({
                top: `${-tipIconHeight}px`,
                left: `${-left}px`,
                width: width
            });

        });

        tipIcon.addEventListener("mouseover", () => { 
            tipIcon.style.visibility = "visible";
            tipIconWidth = tipIcon.offsetWidth;
            tipIconHeight = tipIcon.offsetHeight + 12;

            if (bodyWidth - parentRect.right < widthTip) {
                width = bodyWidth;
                left = (toolTipIconRect.left);
                console.log('toolTipIconRect.left  ', toolTipIconRect.left)
                console.log('left 1  ', left)
            } else {
                width = bodyWidth < widthTip ? "w-full" : widthTip;
                left = ((widthTip / 2) - 16);
                console.log('left 2  ', left)
            }
             
            setStyle({
                top: `${-tipIconHeight}px`,
                left: `${-left}px`,
                width: width
            });

        });

        parent.addEventListener("mouseleave", () => {
            setTimeout(function () {
                tipIcon.style.visibility = "hidden";;
            }, 300);
        });



        // console.log('tipIconHeight  ', tipIconHeight)
        // console.log('tipIconWidth  ', tipIconWidth)
        // console.log('tipIconWidth / 2  ', `${-(tipIconWidth / 2)}px`)
        // console.log('bodyWidth  ' + bodyWidth + ' bodyHeight  ' + bodyHeight);
        // console.log('offsetParentY  ' + offsetParentY + ' offsetParentX  ' + offsetParentX);
        // console.log('offsetToolTipIconY  ' + offsetToolTipIconY + ' offsetToolTipIconX  ' + offsetToolTipIconX);

    }, []);

    // console.log('style  ', style);

    return (
        <div className={`w-auto flex flex-row justify-start items-center relative ${css}`}>
            <img
                id={`${id}toolTipImg2922`}
                src='../images/icons/info-circle.svg'
                className="w-4 h-4 ml-2 cursor-help" />
            <div
                id={`${id}toolTipMessage2922`}
                style={style}
                className={`w-[300px] absolute invisible whitespace-normal max-w-[370px] px-3 py-2 text-sm text-white bg-indigo-700 z-[100] rounded-md shadow-lg cursor-default after:content-[''] after:ml-[-10px] after:absolute after:top-full after:left-[50%] after:border-[10px] after:border-t-indigo-700 after:border-x-transparent after:border-b-transparent after:z-[100]`}
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


