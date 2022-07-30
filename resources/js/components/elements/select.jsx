import React, { useEffect } from 'react';


export default function Select({ list, itemSelected, setItemSelected, toggleSelect, setToggleSelect, selectValueColor, setSelectValueColor, ulUnikId, buttonUnikId }) {

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
        ul.style.maxHeight = 0;
        ul.classList.remove('border-b');
        ul.classList.remove('border-t');
        setToggleSelect(false);

    }, [list]);


    const handleChangeSelect = (item, index) => {
        let ndx = 0;
        if (index >= colorArr.length) {
            let x = (index + 1) / colorArr.length;
            if (x % 1 == 0) {
                ndx = colorArr.length - 1;
            } else {
                ndx = ((index) - (Math.floor(x) * colorArr.length));
            }
        } else {
            ndx = index;
        }
        setSelectValueColor(colorArr[ndx]);
        setItemSelected(item);
        showSelectMenu();
    };


    const showSelectMenu = () => {
        let ul = document.querySelector('#' + ulUnikId);
        if (!toggleSelect) {
            ul.style.height = 'auto';
            ul.style.maxHeight = '240px';
            ul.classList.add('border-b');
            ul.classList.add('border-t');
            setToggleSelect(true);
        } else {
            ul.style.height = 0;
            ul.style.maxHeight = 0;
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
        ulSelect.style.maxHeight = 0;
        ulSelect.classList.remove('border-b');
        ulSelect.classList.remove('border-t');
        setToggleSelect(false);
    }


    const colorTab = [
        "bg-fuchsia-600", "bg-blue-600", "bg-orange-600", "bg-pink-400", "bg-green-600", "bg-blue-500", "bg-fuchsia-400", "bg-blue-400", "bg-cyan-400", "bg-neutral-400", "bg-lime-600", "bg-red-500", "bg-green-400", "bg-sky-400", "bg-amber-500", "bg-violet-500", "bg-teal-500", "bg-zinc-500", "bg-yellow-500", "bg-pink-500", "bg-lime-700", "bg-stone-500", "bg-sky-500", "bg-green-500", "bg-slate-500", "bg-sky-700", "bg-slate-400", "bg-emerald-400", "bg-red-400", "bg-indigo-400", "bg-lime-400", "bg-orange-400", "bg-stone-400", "bg-violet-400", "bg-yellow-400", "bg-zinc-400", "bg-cyan-600", "bg-neutral-600", "bg-gray-600", "bg-fuchsia-500", "bg-teal-600", "bg-emerald-600", "bg-purple-400", "bg-blue-700",
        "bg-indigo-700", "bg-gray-700", "bg-fuchsia-700", "bg-teal-400", "bg-neutral-700", "bg-green-700", "bg-slate-700", "bg-red-700", "bg-teal-700", "bg-stone-700", "bg-indigo-600", "bg-purple-700", "bg-orange-700", "bg-sky-600", "bg-amber-600", "bg-yellow-600",
        "bg-zinc-600", "bg-emerald-700", "bg-cyan-700", "bg-gray-500", "bg-purple-500", "bg-orange-500", "bg-neutral-500", "bg-emerald-500", "bg-cyan-500", "bg-slate-600", "bg-amber-700", "bg-violet-700", "bg-stone-600", "bg-zinc-700", "bg-yellow-700", "bg-pink-700", "bg-gray-400", "bg-amber-400", "bg-violet-600", "bg-pink-600", "bg-purple-600", "bg-red-600", "bg-lime-500", "bg-indigo-500"
    ];
    const colorArr = colorTab.sort(() => Math.random() - 0.5);


    const getColor = (index) => {
        let ndx = 0;
        if (index >= colorArr.length) {
            let x = (index + 1) / colorArr.length;
            if (x % 1 == 0) {
                ndx = colorArr.length - 1;
            } else {
                ndx = ((index) - (Math.floor(x) * colorArr.length));
            }
        } else {
            ndx = index;
        }
        return colorArr[ndx];
    }

    const cancelSelected = () => {
        setItemSelected('');
        setSelectValueColor('');
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
                <span className={`rounded-full h-4 w-4 ml-2.5 ${selectValueColor}`}></span>
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
                            <span className={`rounded-full h-4 w-4 ml-2.5 ${getColor(ndx)}`}>
                            </span>
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

