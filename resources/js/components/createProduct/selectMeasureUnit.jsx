import React, { useEffect } from 'react';


export default function SelectMeasureUnit({ list, itemSelected, setItemSelected, toggleSelect, setToggleSelect, ulUnikId, buttonUnikId }) {

    // !!!   !!!   !!!
    // list contient la liste à afficher dans le select
    // itemSelected et setItemSelected sont le hook qui contient l'élément sélectionné
    // exemple dans stock.jsx


    const handleChangeSelect = (item) => {
        setItemSelected(item);
        showSelectMenu();
    };


    const showSelectMenu = () => {
        let ul = document.getElementById(ulUnikId);
        if (ul != null) {
            if (!toggleSelect) {
                ul.style.height = 'auto';
                ul.classList.add('border-b');
                ul.classList.add('border-t');
                setToggleSelect(true);
            } else {
                ul.style.height = 0;
                ul.classList.remove('border-b');
                ul.classList.remove('border-t');
                setToggleSelect(false);
            }
        }
    }

    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeULSelectMenu);
        return () => {
            document.removeEventListener('click', closeULSelectMenu);
        };
    }, []);
    // ferme le ul quand on click en dehors du select
    function closeULSelectMenu(e) {
        const ulSelect = document.getElementById(ulUnikId);
        const buttonSelect = document.getElementById(buttonUnikId);
        let targetElement = e.target; // clicked element
        if (ulSelect != null && buttonSelect != null) {
            do {
                if (targetElement == ulSelect || targetElement == buttonSelect) {
                    // click inside
                    return;
                }
                // Go up the DOM
                targetElement = targetElement.parentNode;
            } while (targetElement);

            // click outside.
            ulSelect.style.height = 0;
            ulSelect.classList.remove('border-b');
            ulSelect.classList.remove('border-t');
            setToggleSelect(false);
        }
    }



    return (
        <div className="w-full relative">
            <div
                id={buttonUnikId}
                className={`flex justify-start items-center w-48 max-w-full h-10 pl-3 pr-2 m-0 border-r border-y border-gray-300 rounded-r-md cursor-pointer  hover:border-gray-400 bg-white bg-no-repeat 
                bg-right-center bg-chevron-expand`}
                onClick={() => {
                    showSelectMenu();
                }}
            >
                <span className='text-sm text-gray-700 font-semibold'>
                    {itemSelected}
                </span>
            </div>
            <ul
                id={ulUnikId}
                className="absolute top-[46px] left-0 w-auto min-w-[64px] h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-auto z-10 border-gray-100 border-l border-r shadow-lg rounded-md">
                {
                    list.length > 0 && list.map((item, ndx) => (
                        itemSelected != item &&
                        <li
                            key={`${item}${() => date()}`}
                            className="flex justify-start items-center p-2 w-full  text-gray-700 text-base hover:cursor-pointer hover:bg-indigo-600 group"
                            onClick={() => handleChangeSelect(item, ndx)}
                        >
                            <span className="truncate group-hover:text-white">
                                {item}
                            </span>
                        </li>
                    )
                    )
                }
            </ul>
        </div>
    );
}

