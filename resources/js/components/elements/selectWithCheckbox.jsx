import React, { useEffect } from 'react';


export default function SelectWithCheckbox({ unikId, list, selected, setSelected, toggleSelectWithCheckbox, setToggleSelectWithCheckbox }) {

    // list contient la liste à afficher dans le select
    // selected et setSelected sont le hook qui contient les éléments électionnés
    // example dans creatProduct



    // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox
    const handleChange = (item) => {
        let index = selected.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...selected];
            tmp_arr.splice(index, 1);
            setSelected([...tmp_arr]);
        } else {
            setSelected([...selected, item]);
        }
    };

    const showDropDown = () => {
        let ul = document.getElementById('ul' + unikId);
        let button = document.getElementById('button' + unikId);
        if (!toggleSelectWithCheckbox) {
            ul.style.height = 'auto';
            ul.style.maxHeight = '240px';
            ul.classList.add('border-b');
            button.classList.remove('rounded-md');
            button.classList.add('rounded-t-md');
            setToggleSelectWithCheckbox(true);
        } else {
            ul.style.height = 0;
            ul.style.maxHeight = 0;
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
        if (unikId != undefined && unikId != null && unikId.length > 0) {
            let ulSelectWithCheckbox = document.getElementById("ul" + unikId);
            let ButtonSelectDropDown = document.getElementById("button" + unikId);
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
            if (ulSelectWithCheckbox != null) {
                ulSelectWithCheckbox.style.height = 0;
                ulSelectWithCheckbox.style.maxHeight = 0;
                ulSelectWithCheckbox.classList.remove('border-b');
            }
            if (ButtonSelectDropDown != null) {
                ButtonSelectDropDown.classList.remove('rounded-t-md');
                ButtonSelectDropDown.classList.add('rounded-md');
            }
            setToggleSelectWithCheckbox(false);
        }
    }


    return (
        <div className="w-full relative">
            <div
                id={'button' + unikId}
                className="w-full h-10 px-2 m-0 border border-gray-300 rounded-md cursor-pointer bg-white hover:border-gray-400  bg-no-repeat bg-right-center bg-chevron-expand"
                onClick={() => showDropDown()}
            >
            </div>
            <ul
                id={'ul' + unikId}
                className="absolute top-[46px] left-0 w-full h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-auto z-10 border-gray-100 border-l border-r shadow-lg rounded-md">
                {
                    list?.length > 0 && list.map(item =>
                        <li
                            key={item.id + unikId}
                            className="flex items-center w-full h-10 text-gray-700 text-base hover:cursor-pointer hover:bg-indigo-600 group">
                            <input type='checkbox'
                                value={item.id}
                                id={item.id + unikId}
                                checked={selected.findIndex(x => x.id == item.id) > -1}
                                onChange={() => handleChange(item)}
                                className="w-4 h-4 ml-3 mr-2 cursor-pointer" />
                            <label
                                htmlFor={item.id + unikId}
                                className="truncate group-hover:text-white cursor-pointer p-2 w-full h-full">
                                {item.name}
                            </label>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

