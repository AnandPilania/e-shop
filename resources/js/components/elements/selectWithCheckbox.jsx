import React, { useState, useEffect } from 'react';


export default function SelectWithCheckbox({ unikId, list, selected, setSelected }) {

    // list contient la liste à afficher dans le select
    // selected et setSelected sont le hook qui contient les éléments électionnés
    // example dans creatProduct

    const [toggleSelectWithCheckbox, setToggleSelectWithCheckbox] = useState(false);

    // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox
    const handleChange = (name) => {  
        let index = selected.indexOf(name);
        if (index > -1) {
            let tmp_arr = [...selected];
            tmp_arr.splice(index, 1);
            setSelected([...tmp_arr]);
        } else {
            setSelected([...selected, name]);
        }
    };

    const showDropDown = () => {  
        let ul = document.getElementById('ul' + unikId);
        let button = document.getElementById('button' + unikId);
        if (!toggleSelectWithCheckbox) {
            ul.style.height = '240px';
            ul.classList.add('border-b');
            button.classList.remove('rounded-md');
            button.classList.add('rounded-t-md');
            setToggleSelectWithCheckbox(true);
        } else {
            ul.style.height = 0;
            ul.classList.remove('border-b');
            button.classList.remove('rounded-t-md');
            button.classList.add('rounded-md');
            setToggleSelectWithCheckbox(false);
        }
    }

    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeULSelectDropDown);
        return () => {
            document.removeEventListener('click', closeULSelectDropDown);
        };
    }, []);
    // ferme le ul quand on click en dehors du select
    function closeULSelectDropDown(e) {
        const ulSelectWithCheckbox = document.getElementById("ul" + unikId);
        const ButtonSelectDropDown = document.getElementById("button" + unikId);
        let targetElement = e.target; // clicked element

        do {
            if (targetElement == ulSelectWithCheckbox || targetElement == ButtonSelectDropDown) {
                // click inside
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside.
        ulSelectWithCheckbox.style.height = 0;
        ulSelectWithCheckbox.classList.remove('border-b');
        ButtonSelectDropDown.classList.remove('rounded-t-md');
        ButtonSelectDropDown.classList.add('rounded-md');
        setToggleSelectWithCheckbox(false);
    }


    return (
        <div className="w-full relative">
            <button
                id={'button' + unikId}
                className='w-full h-[38px] pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white hover:border-gray-400'
                onClick={() => showDropDown()}
            >
                <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
            </button>
            <ul
                id={'ul' + unikId}
                className="absolute top-[38px] left-0 w-full h-0 bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-l border-r shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100">
                {
                    list.length > 0 && list.map(item =>
                        <li key={item.id + unikId} className="flex items-center pl-[17px] w-full h-[40px] border-gray-300 border-b">
                            <input type='checkbox'
                                value={item.id}
                                id={item.id + unikId}
                                checked={selected.indexOf(item.name) > -1} onChange={() => handleChange(item.name)}
                                className="w-[17px] h-[17px] mr-[17px] hover:cursor-pointer" />
                            <label htmlFor={item.id + unikId}
                                className="text-stone-800 text-base hover:cursor-pointer">
                                {item.name}
                            </label>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

