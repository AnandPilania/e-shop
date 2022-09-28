import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import WithHandleSelectionList from './withHandleSelectionList';
import ModalEditSelectionVariantes from './modalEditSelectionVariantes';


const SelectionVariantesInList = ({ handleChangeSelectionVariantesList }) => {

    const [showModalEditSelectionVariantes, setShowModalEditSelectionVariantes] = useState(false);

    const unikIdSelectionVariantesList = 'SelectWithCheckbox_selectionVariantesList';

    const { optionsObj, selectedVariantesList, allOptionsVariantesNeeded, setAllOptionsVariantesNeeded, variantes, setVariantes, checkedVariantesList, setCheckedVariantesList, setSelectedVariantesList, isHideDeletedVariantes, setIsHideDeletedVariantes } = useContext(AppContext);



    const showDropDownSelectionVariantesList = (id) => {
        let ul = document.getElementById(id);
        if (ul != null) {
            if (ul.offsetHeight == 0) {
                ul.style.height = 'auto';
                ul.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l rounded-r-sm';
            } else if (ul.offsetHeight > 0) {
                ul.style.height = 0;
                ul.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l rounded-r-sm';
            }
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
        if (ulSelectionVariantesList != null && ButtonSelectDropDown != null) {
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
            ulSelectionVariantesList.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l rounded-r-sm';
        }
    }



    const showDropDownSelectionVariantesList2 = (id) => {
        let ul = document.getElementById(id);
        if (ul != null) {
            if (ul.offsetHeight == 0) {
                ul.style.height = 'auto';
                ul.className = 'absolute top-[30px] left-0 w-[130px] h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-md';
            } else if (ul.offsetHeight > 0) {
                ul.style.height = 0;
                ul.className = 'absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-md';
            }
        }
    }

    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeULSelectDropDownSelectionVariantesList2);
        return () => {
            document.removeEventListener('click', closeULSelectDropDownSelectionVariantesList2);
        };
    }, []);
    // ferme le ul quand on click en dehors du select
    function closeULSelectDropDownSelectionVariantesList2(e) {
        const ulSelectionVariantesList2 = document.getElementById("ul2" + unikIdSelectionVariantesList);
        const ButtonSelectDropDown2 = document.getElementById("Button2" + unikIdSelectionVariantesList);
        let targetElement2 = e.target; // clicked element
        if (ulSelectionVariantesList2 != null && ButtonSelectDropDown2 != null) {
            do {
                if (targetElement2 == ulSelectionVariantesList2 || targetElement2 == ButtonSelectDropDown2) {
                    // click inside
                    return;
                }
                // Go up the DOM
                targetElement2 = targetElement2.parentNode;
            } while (targetElement2);

            // click outside.
            ulSelectionVariantesList2.style.height = 0;
            ulSelectionVariantesList2.className = 'absolute top-[30px] left-0 w-[130px] h-0 max-h-[300px] bg-white mb-[15px] transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-0 border-gray-300 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-md';
        }
    }


    const handleChangeRadioSelectionOptionsVariantes = (val) => {
        if (val == 1) {
            setAllOptionsVariantesNeeded(1);
        } else {
            setAllOptionsVariantesNeeded(0);
        }
    }
    // met à jour la sélection dans la liste lorsqu'on modifie allOptionsVariantesNeeded 
    useEffect(() => {
        selectedVariantesList.length > 0 && handleChangeSelectionVariantesList(null, null);
    }, [allOptionsVariantesNeeded]);



    const handleModalCancelSelectionVariantes = () => {
        setShowModalEditSelectionVariantes(false);
    }


    const deleteSelectedVariantes = () => {
        let temp_variantes = [...variantes];
        if (checkedVariantesList.length > 0) {
            for (let i = 0; i < temp_variantes.length; i++) {
                if (checkedVariantesList.indexOf(temp_variantes[i].id) > -1) {
                    temp_variantes[i].deleted = true;
                }
            }
            setCheckedVariantesList([]);
            // selectedVariantesList contien les options cochées
            setSelectedVariantesList([]);
            setVariantes([...temp_variantes]);
        }
        handleModalCancelSelectionVariantes();
    }


    const cancelAllDeletedVariante = () => {
        let tmp_variantes = [...variantes];

        tmp_variantes.forEach(x => x.deleted = false);
        setVariantes([...tmp_variantes]);
        setIsHideDeletedVariantes(false);
    }


    const hideDeletedVariantes = () => {
        setIsHideDeletedVariantes(!isHideDeletedVariantes);
    }

    return (
        <div className="w-full relative mb-[10px] flex flex-row flex-wrap justify-start items-center">
            <div className="w-[130px] mr-[15px] mb-[20px]">
                <button
                    id={'Button' + unikIdSelectionVariantesList}
                    className='flex items-center pl-[10px] w-[130px] h-[30px] text-gray-500 text-base hover:cursor-pointer border border-gray-300 rounded-md'
                    onClick={() => showDropDownSelectionVariantesList('ul' + unikIdSelectionVariantesList)}
                >
                    <span>Sélection</span>
                    <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
                </button>
                <ul
                    id={'ul' + unikIdSelectionVariantesList}
                    className="absolute top-[30px] left-0 w-full h-0 max-h-[300px] bg-white transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-0 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-l rounded-r-sm">
                    {
                        optionsObj?.length > 0 &&
                        <div className="w-full flex flex-col justify-center items-start py-[10px] px-[10px] bg-blue-50"
                        >
                            <div className="w-full flex flex-row justify-start items-center leading-7">
                                <input type='radio'
                                    id='leastOnOptionVariante'
                                    onChange={() => {
                                        handleChangeRadioSelectionOptionsVariantes(0);
                                    }}
                                    checked={allOptionsVariantesNeeded == 0}
                                    className="w-5 h-5"
                                />
                                <label htmlFor='leastOnOptionVariante'
                                    className='ml-[7px] font-semibold cursor-pointer hover:font-bold'>
                                    La sélection doit contenir au moins une option
                                </label>
                            </div>
                            <div className="w-full flex flex-row stify-start items-center leading-7">
                                <input type='radio'
                                    id='allOptionsVariante'
                                    onChange={() => {
                                        handleChangeRadioSelectionOptionsVariantes(1);
                                    }}
                                    checked={allOptionsVariantesNeeded == 1}
                                    className="w-5 h-5"
                                />
                                <label htmlFor='allOptionsVariante'
                                    className='ml-[7px] font-semibold cursor-pointer hover:font-bold'>
                                    La sélection doit contenir toutes les options
                                </label>
                            </div>
                        </div>}
                    {optionsObj?.length > 0 && optionsObj.map(item =>
                        <li
                            key={item.id + unikIdSelectionVariantesList} className="flex flex-row justify-start items-center flex-wrap pl-[10px] py-[10px] w-full h-auto border-b border-gray-200"
                        >
                            <span className='w-full flex flex-row justify-start items-center font-semibold px-[3px] mb-[5px]'>
                                {item.name}
                            </span>
                            {item.values.map((value, index) =>
                                <div key={index}
                                    className="flex flex-row justify-start items-center px-[3px] mb-[5px] mr-[7px] group"
                                >
                                    {/* checkbox qui sélectionne les variantes dans la liste des variantes en fonction des options cochées  !!! --> x.name et idValues_Names représentent l'id du type d'options */}
                                    <input type='checkbox'
                                        value={value}
                                        id={value + unikIdSelectionVariantesList}
                                        checked={selectedVariantesList.findIndex(x => x.name == item.idValues_Names && x.value == value) > -1}
                                        onChange={() =>
                                            handleChangeSelectionVariantesList(value, item.idValues_Names)}
                                        className="w-[17px] h-[17px] mr-[5px] cursor-pointer"
                                    />
                                    <label htmlFor={value + unikIdSelectionVariantesList}
                                        className="text-gray-500 text-base cursor-pointer group-hover:font-semibold"
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
            {variantes.length > 0 &&
                <div className="w-[130px] mr-[15px] mb-[20px] relative">
                    <button
                        id={'Button2' + unikIdSelectionVariantesList}
                        className='flex items-center pl-[10px] w-[130px] h-[30px] text-gray-500 text-base hover:cursor-pointer border border-gray-300 rounded-md'
                        onClick={() => showDropDownSelectionVariantesList2('ul2' + unikIdSelectionVariantesList)}
                    >
                        <span>Opérations</span>
                        <img src='../images/icons/caret-down.svg' className='ml-auto mr-[17px]' />
                    </button>
                    <ul
                        id={'ul2' + unikIdSelectionVariantesList}
                        className="absolute top-[30px] left-0 w-[130px] h-0 max-h-[300px] bg-white transition-height duration-150 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-0 shadow-md scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 rounded-md"
                    >
                        <li
                            className="flex flex-row justify-start items-center flex-wrap pl-[10px] py-[10px] w-full h-auto border-b border-gray-200"
                        >
                            <span
                                className={`w-full flex flex-row justify-start items-center px-[3px] mb-[5px] cursor-pointer ${checkedVariantesList.length > 0 ? "text-gray-500 hover:font-semibold" : "text-gray-400"}`}
                                onClick={() => {
                                    checkedVariantesList.length > 0 && setShowModalEditSelectionVariantes(true);
                                }}
                            >
                                Modifier
                            </span>
                            {/* divider */}
                            <div className='h-1 w-[90%] border-b border-gray-300 mb-1.5'></div>
                            <span
                                className={`w-full flex flex-row justify-start items-center px-[3px] mb-[5px] cursor-pointer ${checkedVariantesList.length > 0 ? "text-gray-500 hover:font-semibold" : "text-gray-400"}`}
                                onClick={() => {
                                    checkedVariantesList.length > 0 &&
                                        deleteSelectedVariantes();
                                }}
                            >
                                Supprimer
                            </span>
                            {/* divider */}
                            <div className='h-1 w-[90%] border-b border-gray-300 mb-1.5'></div>
                            <span
                                className={`w-full flex flex-row justify-start items-center px-[3px] mb-[5px] cursor-pointer ${variantes.findIndex(x => x.deleted === true) > -1 ? "text-gray-500 hover:font-semibold" : "text-gray-400"}`}
                                onClick={() => {
                                    variantes.findIndex(x => x.deleted === true) > -1 &&
                                        cancelAllDeletedVariante();
                                }}
                            >
                                Annuler les suppressions
                            </span>
                        </li>
                    </ul>
                </div>}

            {/* Cacher les variantes supprimées */}
            {variantes.findIndex(x => x.deleted === true) > -1 &&
                <span className='flex flex-row justify-center items-center w-auto h-[30px] px-[10px] mb-[20px] text-blue-500 text-sm no-underline hover:underline hover:cursor-pointer'
                    onClick={hideDeletedVariantes}
                >
                    {/* visible que s'il y a des variantes deleted */}
                    {!isHideDeletedVariantes ?
                        'Cacher les variantes supprimées' :
                        'Montrer les variantes supprimées'}
                </span>
            }


            <ModalEditSelectionVariantes
                show={showModalEditSelectionVariantes}
                handleModalCancel={handleModalCancelSelectionVariantes}
            />
        </div>
    )
}

export default WithHandleSelectionList(SelectionVariantesInList);
