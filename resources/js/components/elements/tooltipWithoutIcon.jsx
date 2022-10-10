import React, { useState, useEffect } from 'react';

const TooltipWithoutIcon = ({ children, css, id, idimg, widthTip }) => {

    const [style, setStyle] = useState({
        top: 0 + 'px',
        left: 0 + 'px',
        visibility: 'hidden',
        width: widthTip,
    });


    useEffect(() => {
        var tipImg = document.getElementById(idimg);
        var tipIcon = document.getElementById(`${id}toolTipMessage2922`);
        var parent = document.getElementById(id);

        var tipIconHeight = tipIcon.offsetHeight + 20;

        tipImg.addEventListener("mouseover", () => {
            tipIcon.style.visibility = "visible";
             
            setStyle({
                top: `${-tipIconHeight}px`,
                left: `${-(widthTip / 2) - 20}px`,
                width: widthTip
            });

        });

        parent.addEventListener("mouseleave", () => {
                tipIcon.style.visibility = "hidden";
        });

    }, []);


    return (
        <div className={`w-auto flex flex-row justify-start items-center relative mb-2 ${css}`}>
            <div className={`w-[200px] absolute top-[-30px] bottom-2 left-[-150px]`}>
            </div>
            <div
                id={`${id}toolTipMessage2922`}
                style={style}
                className={`w-auto absolute flex flex-col justify-start whitespace-normal max-w-[370px] p-3 text-sm text-white bg-indigo-700 z-[100] rounded-md shadow-lg cursor-default after:content-[''] after:ml-[-10px] after:absolute after:top-full after:left-[50%] after:border-[10px] after:border-t-indigo-700 after:border-x-transparent after:border-b-transparent after:z-[100]`}
            >
                {children}
            </div>
        </div>
    );
}


export default TooltipWithoutIcon;


    // ---> how use <---
    // <parent id={id du parent}>
    // <img id="idimg" /> <--- l'image sur laquelle on fait un hover !!!
    //     <TooltipWithoutIcon css={css}, id={id du parent}, widthTip={width qu'on veut   donner au toolTip}>
    //         {children}
    //     </TooltipWithoutIcon>
    // </parent>



