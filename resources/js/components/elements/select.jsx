import React, { useState, useEffect } from 'react';


export default function Select({ list, itemSelected, setItemSelected }) {

    // !!!   !!!   !!!
    // list contient la liste à afficher dans le select
    // itemSelected et setItemSelected sont le hook qui contient l'élément électionné
    // example dans creatProduct

    const [toggleSelect, setToggleSelect] = useState(false);

    const handleChangeSelect = (name) => {
        setItemSelected(name);
        showSelectMenu();
    };

    const showSelectMenu = () => { 
        let ul = document.querySelector('#ulSelect');
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
        const ulSelect = document.getElementById("ulSelect");
        let targetElement = e.target; // clicked element

        do {
            if (targetElement == ulSelect || targetElement == ButtonSelectMenu) {
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


    return (
        <div className="w-full relative">
            <button
                id='ButtonSelectMenu'
                className='flex justify-start items-center font-base w-full h-10 pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white hover:border-gray-400'
                onClick={() => showSelectMenu()}
            >
                {itemSelected}
                <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
            </button>
            <ul
                id='ulSelect'
                className="absolute top-[46px] left-0 w-full h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-l border-r shadow-lg rounded-md text-base scroll">
                {
                    list.length > 0 && list.map(item =>
                        <li
                            key={item.id}
                            className="flex items-center pl-[17px] w-full py-2 text-stone-800 text-base hover:cursor-pointer hover:bg-[#0068F0] hover:text-white"
                            onClick={() => handleChangeSelect(item.name)}>
                            {item.name}
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

