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


    // const colorArr = ["bg-slate-300", "bg-gray-300", "bg-zinc-300", "bg-neutral-300", "bg-stone-300", "bg-red-300", "bg-orange-300", "bg-amber-300", "bg-yellow-300", "bg-lime-300", "bg-green-300", "bg-emerald-300", "bg-teal-300", "bg-cyan-300", "bg-sky-300", "bg-blue-300", "bg-indigo-300", "bg-violet-300", "bg-purple-300", "bg-fuchsia-300", "bg-pink-300",
    // "bg-slate-400", "bg-gray-400", "bg-zinc-400", "bg-neutral-400", "bg-stone-400", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-yellow-400", "bg-lime-400", "bg-green-400", "bg-emerald-400", "bg-teal-400", "bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-fuchsia-400", "bg-pink-400",
    // "bg-slate-500", "bg-gray-500", "bg-zinc-500", "bg-neutral-500", "bg-stone-500", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    // "bg-slate-600", "bg-gray-600", "bg-zinc-600", "bg-neutral-600", "bg-stone-600", "bg-red-600", "bg-orange-600", "bg-amber-600", "bg-yellow-600", "bg-lime-600", "bg-green-600", "bg-emerald-600", "bg-teal-600", "bg-cyan-600", "bg-sky-600", "bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-purple-600", "bg-fuchsia-600", "bg-pink-600"];

    const colorArr = ["bg-gray-300", "bg-zinc-300", "bg-neutral-300",  "bg-red-300", "bg-orange-300", "bg-lime-300", "bg-green-300",  "bg-sky-300", "bg-blue-300", "bg-indigo-300", "bg-violet-300", "bg-purple-300", "bg-fuchsia-300", "bg-stone-400", "bg-red-400", "bg-green-400", "bg-sky-400", "bg-violet-400", "bg-purple-400", "bg-fuchsia-400", "bg-pink-400", "bg-gray-500", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500"];

    return (
        <div className="w-full relative">
            <div
                id='ButtonSelectMenu'
                className='flex flex-row justify-start items-center w-full max-w-[100%] h-10 pl-2.5 m-0 border border-gray-300 rounded-md cursor-pointer  hover:border-gray-400 bg-white bg-no-repeat 
                bg-right-center bg-chevron-expand'
                onClick={() => showSelectMenu()}
            >
                <span className='w-[calc(100% - 44px)] truncate'>
                    {itemSelected}
                </span>
                <span className='w-[44px] ml-auto flex justify-center '>
                    {/* espace pour le bg-caret-down */}
                </span>
            </div>
            <ul
                id='ulSelect'
                className="absolute top-[46px] left-0 w-full h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-auto z-10 border-gray-100 border-l border-r shadow-lg rounded-md">
                {
                    list.length > 0 && list.map((item, ndx) =>
                        <li
                            key={item.id}
                            className="flex flex-row justify-start items-center px-4 w-full py-2 text-gray-700 text-base hover:cursor-pointer hover:bg-indigo-600 group"
                            onClick={() => handleChangeSelect(item.name)}
                        >
                            <span className={`rounded-full h-4 w-4 ${colorArr[Math.floor(Math.random() * colorArr.length - 1)]} mr-3`}>
                            </span>
                            <span className="truncate group-hover:text-white">
                                {item.name}
                            </span>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

