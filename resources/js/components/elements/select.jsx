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
        let button = document.getElementById("ButtonSelectMenu");
        if (!toggleSelect) {
            ul.style.height = '240px';
            ul.classList.add('border-b');
            button.classList.remove('rounded-md');
            button.classList.add('rounded-t-md');
            setToggleSelect(true);
        } else {
            ul.style.height = 0;
            ul.classList.remove('border-b');
            button.classList.remove('rounded-t-md');
            button.classList.add('rounded-md');
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
        const ButtonSelectMenu = document.getElementById("ButtonSelectMenu");
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
        ButtonSelectMenu.classList.remove('rounded-t-md');
        ButtonSelectMenu.classList.add('rounded-md');
        setToggleSelect(false);
    }


    return (
        <div className="w-full relative">
            <button
                id='ButtonSelectMenu'
                className='flex justify-start items-center font-base w-full h-[38px] pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white hover:border-gray-400'
                onClick={() => showSelectMenu()}
            >
                {itemSelected}
                <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
            </button>
            <ul
                id='ulSelect'
                className="absolute top-[38px] left-0 w-full h-0 bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-l border-r shadow-lg scrollbar scrollbar-thumb-blue-700 scrollbar-track-gray-100">
                {
                    list.length > 0 && list.map(item =>
                        <li
                            key={item.id}
                            className="flex items-center pl-[17px] w-full h-[40px] border-gray-300 border-b text-stone-800 text-base hover:cursor-pointer"
                            onClick={() => handleChangeSelect(item.name)}>
                            {item.name}
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

