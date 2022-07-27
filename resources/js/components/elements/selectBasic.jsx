import React, { useEffect } from 'react';


export default function SelectBasic({ list, itemSelected, setItemSelected, toggleSelect, setToggleSelect, ulUnikId, buttonUnikId }) {

    // !!!   !!!   !!!
    // list contient la liste à afficher dans le select
    // itemSelected et setItemSelected sont le hook qui contient l'élément électionné
    // example dans creatProduct
    // TOUS LES PROPS SONT NECESSAIRES !!!


    useEffect(() => {
        let ndx = list.findIndex(x => x.is_default == 1);
        if (ndx > -1) {
            handleChangeSelect(list[ndx], 0);
            setItemSelected(list[ndx]);
        }
        let ul = document.querySelector('#' + ulUnikId);
        ul.style.height = 0;
        ul.classList.remove('border-b');
        ul.classList.remove('border-t');
        setToggleSelect(false);

    }, [list]);


    const handleChangeSelect = (item, index) => {
        setItemSelected(item);
        showSelectMenu();
    };


    const showSelectMenu = () => {
        let ul = document.querySelector('#' + ulUnikId);
        if (!toggleSelect) {
            ul.style.height = '240px';
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


    const cancelSelected = () => {
        setItemSelected('');
    }



    return (
        <div className="w-full relative">
            <div
                id={buttonUnikId}
                className={`grid grid-cols-[30px_1fr_44px] gap-2 justify-start items-center w-full max-w-[100%] h-10 px-2 m-0 border border-gray-300 rounded-md cursor-pointer  hover:border-gray-400 bg-white bg-no-repeat 
                bg-right-center ${itemSelected.name == undefined && "bg-chevron-expand"}`}
                onClick={() => {
                    showSelectMenu();
                }}
            >
                <span className='truncate'>
                    {itemSelected.name}
                </span>
                <span className='w-[44px] ml-auto flex justify-center '>
                    {/* espace pour le bg-caret-down ou le cancel button*/}
                    {itemSelected.name != undefined &&
                        <span
                            onClick={() => cancelSelected()}
                            className='flex justify-center items-center w-6 h-6 p-0 m-0 cursor-pointer hover:bg-red-500 rounded-md group'
                        >
                            <img src={window.location.origin + '/images/icons/trash.svg'} className="h-4 w-4 group-hover:hidden"
                            />
                            <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-5 w-5 hidden group-hover:block"
                            />
                        </span>}
                </span>
            </div>
            <ul
                id={ulUnikId}
                className="absolute top-[46px] left-0 w-full h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-auto z-10 border-gray-100 border-l border-r shadow-lg rounded-md">
                {
                    list.length > 0 && list.map((item, ndx) => (
                        itemSelected.id != item.id &&
                        <li
                            key={item.id}
                            className="grid grid-cols-[30px_1fr] gap-2 justify-start items-center p-2 w-full  text-gray-700 text-base hover:cursor-pointer hover:bg-indigo-600 group"
                            onClick={() => handleChangeSelect(item, ndx)}
                        >
                            <span className="truncate group-hover:text-white">
                                {item.name}
                            </span>
                        </li>
                    )
                    )
                }
            </ul>
        </div>
    );
}

