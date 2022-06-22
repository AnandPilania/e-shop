import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';

const SelectionVariantesInList = ({ variantes, checkedVariantesList, setCheckedVariantesList }) => {

    const [selectedVariantesList, setSelectedVariantesList] = useState([]);
    const [toggleSelectionVariantesList, setToggleSelectionVariantesList] = useState(false);
    const [allOptionsVariantesNeeded, setAllOptionsVariantesNeeded] = useState(1);
    const [checkedVariantesList_toObject, setCheckedVariantesList_toObject] = useState([]);

    const unikIdSelectionVariantesList = 'SelectWithCheckbox_selectionVariantesList';

    const { optionsObj } = useContext(AppContext);

    useEffect(() => {
        let tmpArr = [];
        for (let i = 0; i < checkedVariantesList.length; i++) {
            let tmpObj = {
                value: checkedVariantesList[i],
                indexToRemove: null
            }
            tmpArr.push(tmpObj);
        }
        setCheckedVariantesList_toObject([...tmpArr]);
    }, [selectedVariantesList]);
    console.log('checkedVariantesList_toObject   ', checkedVariantesList_toObject)


    // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox
    const handleChangeSelectionVariantesList = (value, name) => {
        let index = selectedVariantesList.indexOf(value);
        if (index > -1) {
            let tmp_arr = [...selectedVariantesList];
            tmp_arr.splice(index, 1);
            setSelectedVariantesList([...tmp_arr]);

            let toRemoveIndex = checkedVariantesList_toObject.findIndex(x => x.indexToRemove == value);
            if (toRemoveIndex > -1) {

            }
            let tmp_tab = [...checkedVariantesList_toObject];
            for (let i = 0; i < tmp_tab.length; i++) {
                if (tmp_tab[i].indexToRemove == value) {
                    tmp_tab[i].remove();
                }
            }
            let tmp = tmp_tab.map(x => x.value);
            setCheckedVariantesList([...tmp]);
            setCheckedVariantesList_toObject([...tmp_tab]);

        } else {
            setSelectedVariantesList([...selectedVariantesList, value]);

            let tmpArr = [];
            let tmp_tab = [...checkedVariantesList];
            for (let i = 0; i < variantes.length; i++) {
                if (variantes[i].options[name].includes(value)) {
                    tmp_tab.push(variantes[i].id);

                   
                    let tmpObj = {
                        value: variantes[i].id,
                        indexToRemove: value
                    }
                    tmpArr.push(tmpObj);
                }
            }
            setCheckedVariantesList([...tmp_tab]);
            setCheckedVariantesList_toObject([...tmpArr]);
        }
    };
    console.log('checkedVariantesList-- * --  ', checkedVariantesList)


    const showDropDownSelectionVariantesList = () => {
        let ul = document.getElementById('ul' + unikIdSelectionVariantesList);
        if (!toggleSelectionVariantesList) {
            ul.style.height = 'auto';
            ul.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l';
            setToggleSelectionVariantesList(true);
        } else {
            ul.style.height = 0;
            ul.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l';
            setToggleSelectionVariantesList(false);
        }
    }

    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeULSelectDropDownSelectionVariantesList);
        return () => {
            document.removeEventListener('click', closeULSelectDropDownSelectionVariantesList);
        };
    }, []);
    // ferme le ul quand on click en dehors du select
    function closeULSelectDropDownSelectionVariantesList(e) {
        const ulSelectionVariantesList = document.getElementById("ul" + unikIdSelectionVariantesList);
        const ButtonSelectDropDown = document.getElementById("Button" + unikIdSelectionVariantesList);
        let targetElement = e.target; // clicked element

        do {
            if (targetElement == ulSelectionVariantesList || targetElement == ButtonSelectDropDown) {
                // click inside
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside.
        ulSelectionVariantesList.style.height = 0;
        ulSelectionVariantesList.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l';
        setToggleSelectionVariantesList(false);
    }


    const handleChangeRadioSelectionOptionsVariantes = (val) => {
        if (val == 0) {
            setAllOptionsVariantesNeeded(0);
        } else {
            setAllOptionsVariantesNeeded(1);
        }
    }

    console.log('selectedVariantesList   ', selectedVariantesList)
    return (
        <div className="w-full relative mb-[20px]">
            <button
                id={'Button' + unikIdSelectionVariantesList}
                className='flex items-center pl-[10px] w-[130px] h-[30px] text-gray-500 text-base hover:cursor-pointer border border-gray-300 rounded-md'
                onClick={() => showDropDownSelectionVariantesList()}
            >
                <span>Sélection</span>
                <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
            </button>
            <ul
                id={'ul' + unikIdSelectionVariantesList}
                className="absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-0 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l rounded-r-sm">
                {
                    optionsObj?.length > 0 &&
                    <div className="w-full flex flex-col justify-center items-start py-[10px] px-[10px] bg-blue-50">
                        <div className="w-full flex flex-row justify-start items-center leading-7">
                            <input type='radio'
                                id='leastOnOptionVariante'
                                onChange={() => { handleChangeRadioSelectionOptionsVariantes(1) }}
                                checked={allOptionsVariantesNeeded == 1}
                                className="w-5 h-5"
                            />
                            <label htmlFor='leastOnOptionVariante'
                                className='ml-[7px]'>
                                La sélection doit contenir au moins une option
                            </label>
                        </div>
                        <div className="w-full flex flex-row stify-start items-center leading-7">
                            <input type='radio'
                                id='allOptionsVariante'
                                onChange={() => { handleChangeRadioSelectionOptionsVariantes(0) }}
                                checked={allOptionsVariantesNeeded == 0}
                                className="w-5 h-5"
                            />
                            <label htmlFor='allOptionsVariante'
                                className='ml-[7px]'>
                                La sélection doit contenir toutes les options
                            </label>
                        </div>
                    </div>}
                {optionsObj?.length > 0 && optionsObj.map(item =>
                    <li key={item.id + unikIdSelectionVariantesList} className="flex flex-row justify-start items-center flex-wrap pl-[10px] py-[10px] w-full h-auto border-b border-gray-200"
                    >
                        <span className='w-full flex flex-row justify-start items-center font-semibold px-[3px] mb-[5px]'>
                            {item.name}
                        </span>
                        {item.values.map((value, index) =>
                            <div key={index}
                                className="flex flex-row justify-start items-start px-[3px] mb-[5px] mr-[5px]"
                            >
                                <input type='checkbox'
                                    value={value}
                                    id={value + unikIdSelectionVariantesList}
                                    checked={selectedVariantesList.indexOf(value) > -1}
                                    onChange={() => handleChangeSelectionVariantesList(value, item.name)}
                                    className="w-[17px] h-[17px] mr-[17px] hover:cursor-pointer"
                                />
                                <label htmlFor={value + unikIdSelectionVariantesList}
                                    className="text-stone-800 text-base hover:cursor-pointer"
                                >
                                    {value}
                                </label>
                            </div>
                        )}
                    </li>
                )
                }
            </ul>
        </div>
    )
}

export default SelectionVariantesInList;
