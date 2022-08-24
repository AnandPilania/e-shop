import React, { useState, useEffect } from 'react';
import CheckBox_generic from '../elements/checkBox_generic';


export default function SelectWithCheckbox_icon_search({ unikId, list, selected, setSelected, toggleSelectWithCheckbox, setToggleSelectWithCheckbox, placeholder, inputValue, setInputValue }) {

    // list contient la liste à afficher dans le select
    // selected et setSelected sont le hook qui contient les éléments électionnés
    // example dans deliveryZoneForm.jsx


    const [listFiltered, setListFiltered] = useState([]);

    useEffect(() => {
        setListFiltered(list);
    }, []);

    // si l'élément a déjà été sélectionné on le retire sinon on l'ajoute, ceci coche ou décoche la checkbox
    const handleChange = (e, item) => {
        let index = selected.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...selected];
            tmp_arr.splice(index, 1);
            // si "Tous les pays" est coché et qu'on décoche un pays alors on décoche "Tous les pays"
            let all_countries_index = selected.findIndex(x => x.id == 1);
            if (all_countries_index > -1) {
                tmp_arr.splice(all_countries_index, 1);
            }
            setSelected([...tmp_arr]);
        } else {
            setSelected([...selected, item]);
        }
        // coche "Tous les pays"
        if (item.id == 1 && selected.findIndex(x => x.id == 1) == -1) {
            setSelected([...list]);
            // décoche "Tous les pays"
        } else if (item.id == 1 && selected.findIndex(x => x.id == 1) > -1) {
            setSelected([]);
        }
        setInputValue('');
        setListFiltered(list);
    };
    console.log('selected  ', selected)
    const handleInputValue = (e) => {
        setInputValue(e.target.value.toLowerCase());

        // si on écrit et que le dropdown est fermé alors on le déroule
        setTimeout(() => {
            let ul = document.getElementById('ul' + unikId);
            let inputSelectCheckIconSearch = document.getElementById('inputSelectCheckIconSearch' + unikId);

            if (ul != null && inputSelectCheckIconSearch != null) {
                ul.style.height = 'auto';
                ul.style.maxHeight = '240px';
                ul.classList.add('border');
                inputSelectCheckIconSearch.classList.remove('rounded-md');
                inputSelectCheckIconSearch.classList.add('rounded-t-md');
                setToggleSelectWithCheckbox(true);
            }
        }, 500);
    }

    const clearInputValue = (e) => {
        setInputValue('');
        setListFiltered(list);
    }

    // affiche dans le dropdown seulement les destinations qui correspondes à ce qui est tapé dans la barre de recherche
    function handleListFiltered(e) {
        setListFiltered(list.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }


    const showDropDown = () => {
        let ul = document.getElementById('ul' + unikId);
        let inputSelectCheckIconSearch = document.getElementById('inputSelectCheckIconSearch' + unikId);
        if (!toggleSelectWithCheckbox) {
            ul.style.height = 'auto';
            ul.style.maxHeight = '240px';
            ul.classList.add('border');
            inputSelectCheckIconSearch.classList.remove('rounded-md');
            inputSelectCheckIconSearch.classList.add('rounded-t-md');
            setToggleSelectWithCheckbox(true);
        } else {
            ul.style.height = 0;
            ul.style.maxHeight = 0;
            ul.classList.remove('border');
            inputSelectCheckIconSearch.classList.remove('rounded-t-md');
            inputSelectCheckIconSearch.classList.add('rounded-md');
            setToggleSelectWithCheckbox(false);
        }
    }

    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeULSelectDropDownCheckIconSearch);
        return () => {
            document.removeEventListener('click', closeULSelectDropDownCheckIconSearch);
        };
    }, []);
    // ferme le ul quand on click en dehors du select
    function closeULSelectDropDownCheckIconSearch(e) {
        if (unikId != undefined && unikId != null && unikId.length > 0) {
            let ulSelectWithCheckbox = document.getElementById("ul" + unikId);
            let inputSelectCheckIconSearch = document.getElementById("inputSelectCheckIconSearch" + unikId);
            let targetElement = e.target; // clicked element
            do {
                if (targetElement == ulSelectWithCheckbox || targetElement == inputSelectCheckIconSearch) {
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
                ulSelectWithCheckbox.classList.remove('border');
            }
            if (inputSelectCheckIconSearch != null) {
                inputSelectCheckIconSearch.classList.remove('rounded-t-md');
                inputSelectCheckIconSearch.classList.add('rounded-md');
            }
            setToggleSelectWithCheckbox(false);
        }
    }


    return (
        <div className="w-full">
            <div className='w-full relative'>
                <input
                    type='text'
                    id={'inputSelectCheckIconSearch' + unikId}
                    value={inputValue}
                    maxLength="20"
                    className="w-full h-10 px-2 m-0 border border-gray-300 rounded-md cursor-text bg-white hover:border-gray-400  bg-no-repeat bg-right-center bg-chevron-expand flex items-center"
                    onClick={() => showDropDown()}
                    onChange={(e) => {
                        handleInputValue(e);
                        handleListFiltered(e);
                    }}
                    placeholder={placeholder}
                />
                {inputValue.length > 0 &&
                    <span
                        className="w-6 h-6 flex flex-row justify-center items-center bg-red-600 cursor-pointer absolute right-10 top-2"
                        onClick={clearInputValue}
                    >
                        <img
                            src={window.location.origin + '/images/icons/x-white.svg'}
                            className="h-5 w-5" />
                    </span>
                }
                {inputValue.length > 0 && listFiltered.length == 0 &&
                    <span className='text-sm text-red-700'>
                        Aucun nom dans la liste ne correspond à votre recherche
                    </span>
                }
                {listFiltered?.length > 0 &&
                    <ul
                        id={'ul' + unikId}
                        className="absolute top-11 left-0 w-full h-0 bg-white mb-4 transition-height duration-150 ease-in-out overflow-auto z-10 border-gray-300 shadow-lg rounded-md"
                    >
                        {
                            listFiltered.map(item =>
                                <li
                                    key={item.id + unikId}
                                    className="flex items-center w-full h-10 text-gray-700 text-base hover:cursor-pointer hover:bg-indigo-400 group">
                                    <CheckBox_generic
                                        unikId={`SelectWithCheckbox_icon_search${item.id}`}
                                        handleCheckBox={handleChange}
                                        checked={selected.findIndex(x => x.id == item.id) > -1}
                                        item={item}
                                    />
                                    <img src={`../images/flags_4_3/${item.code_1}.svg`} className={`h-4 hover:scale-125 ${item.code_1 == "ALL" && "ml-1"}`} />
                                    <label
                                        htmlFor={`SelectWithCheckbox_icon_search${item.id}`}
                                        className="truncate group-hover:text-white cursor-pointer p-2 w-full h-full">
                                        {item.name}
                                    </label>
                                </li>
                            )
                        }
                    </ul>
                }
            </div>

        </div>
    );
}

