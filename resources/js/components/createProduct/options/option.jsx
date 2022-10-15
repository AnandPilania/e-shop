import React, { useEffect, useRef, useContext } from 'react';
import { useStateIfMounted } from "use-state-if-mounted";
import AppContext from '../../contexts/AppContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { upperFirstLetter } from '../../functions/upperFirstLetter';
import Axios from 'axios';


const Option = ({ option_obj, saveOption, deleteOption, optionsObj, index }) => {

    const [optionObj, setOptionObj] = useStateIfMounted({
        id: option_obj.id,
        name: option_obj.name,
        values: [...option_obj.values],
        ordre: option_obj.ordre
    });

    const [listOptionValues, setListOptionValues] = useStateIfMounted([]);
    const [tmp_optionValues, setTmp_optionValues] = useStateIfMounted('');
    const [tmp_selectOptionValues, setTmp_selectOptionValues] = useStateIfMounted('');
    const [showListType, setShowListType] = useStateIfMounted(false);
    const [showOptionValues, setShowOptionValues] = useStateIfMounted(false);
    const [optionValueMessage, setOptionValueMessage] = useStateIfMounted(false);

    const { listType, isEditProduct } = useContext(AppContext);


    // fourni les valeurs pour une option donnée
    const getOptionValues = () => {
        // charge les données des types d'options et leurs valeurs ex. Couleurs, rouge, vert, ...
        Axios.get(`http://127.0.0.1:8000/getOptionValues`)
            .then((res) => {
                let ndx = null;
                const tmp_optionData = Object.values(res.data);
                for (let i = 0; i < tmp_optionData.length; i++) {
                    if (tmp_optionData[i][0].optionName == optionObj.name) {
                        ndx = i;
                        break;
                    }
                }
                if (ndx !== null) {
                    setListOptionValues(tmp_optionData[ndx]);
                } else {
                    setListOptionValues([]);
                }
            });
    }

    
    const removeErrorMessageOptionName = () => {
        // input option name
        let spanMessageName = document.getElementById(`name${optionObj.id}`);
        spanMessageName.innerHTML = '';
        let inputOptionError = document.getElementsByClassName(`name${optionObj.id}`)[0];
        if (inputOptionError !== undefined) {
            inputOptionError.className = `inputListType name${optionObj.id} w-full h-10 pl-[10px] m-0 mb-1 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat ${listTypesNoEmpty && "hover:bg-caret-down"}  bg-right-center`;
        }
        // value duplicate
        setOptionValueMessage(false);
    }

    const removeErrorMessageOptionValue = () => {
        // input option Value
        let spanMessageValue = document.getElementById(`value${optionObj.id}`);
        spanMessageValue.innerHTML = '';
        let inputOptionValueError = document.getElementsByClassName(`value${optionObj.id}`)[0];
        if (inputOptionValueError !== undefined) {
            inputOptionValueError.className = `inputOptionValues value${optionObj.id} w-full h-10 pl-[10px] m-0 mb-1 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  ${listOptionValuesNotEmpty && "hover:bg-caret-down"} bg-right-center`;
        }

        // value duplicate
        setOptionValueMessage(false);
    }


    const handleChangeOption = (e) => {
        console.log('e   -->  ', e)
        console.log('idValues_Names   -->  ??? ') // <-----------------------!!!
        if (e.target != undefined) {
            setOptionObj({ ...optionObj, name: e.target.value, values: [], idValues_Names: null });
            setShowListType(false);
            removeErrorMessageOptionName();
        }
        if (e != undefined && e.name?.length > 0) {
            setOptionObj({ ...optionObj, name: e.name, values: [], idValues_Names: e.id });
            setShowListType(false);
            removeErrorMessageOptionName();
        }
    };

    // initialise quand on change d'option
    useEffect(() => {
        setListOptionValues([]);
        if (isEditProduct) {
            getOptionValues();
            setOptionObj({ ...optionObj });
        } else {
            setOptionObj({ ...optionObj, values: [] });
            if (optionObj.name?.length > 0) {
                getOptionValues();
            }
        }
    }, [optionObj.name]);


    // save optionObj
    useEffect(() => {
        saveOption(optionObj);
    }, [optionObj]);

    const handleShowListType = () => {
        input_optionValuesRef.current.blur();
        setShowListType(!showListType);
    }

    const handleShowOptionValuesList = () => {
        setShowOptionValues(!showOptionValues);
        setOptionValueMessage(false);
    }

    // ferme le dropDown input listType quand on clique en dehors
    const onClickOutside_inputListType = (e) => {
        if (e.target.className.length > 0 && e.target.className != null && e.target.className != undefined) {
            if (!e.target.className.includes('inputListType')) {
                setShowListType(false);
            }
        }
    };
    useEffect(() => {
        if (showListType) {
            // gère la fermeture du dropDown input listType quand on clique en dehors
            window.addEventListener("click", onClickOutside_inputListType);
        } else {
            window.removeEventListener("click", onClickOutside_inputListType);
        }
    }, [showListType]);


    const handleChangeOptionValues = (e) => {
        setTmp_optionValues(upperFirstLetter(e.target.value));
        setShowOptionValues(false);
        removeErrorMessageOptionValue();
    };

    const handleEnterOptionsValue = () => {
        setShowOptionValues(false);
        if (optionObj.values.includes(upperFirstLetter(tmp_optionValues))) {
            setOptionValueMessage(true);
            return;
        } else {
            removeErrorMessageOptionValue();
        }

        // remove comma from tmp_optionValues if comma is pressed
        let val = '';
        let ndx = tmp_optionValues.indexOf(',');
        if (ndx > -1 && ndx == tmp_optionValues.length - 1) {
            val = tmp_optionValues.trim().slice(0, -1);
        } else {
            val = tmp_optionValues.trim();
        }

        tmp_optionValues.length > 0 &&
            setOptionObj({ ...optionObj, values: [...optionObj.values, val] });
        setTmp_optionValues('');
    }

    // toggle l'ajout ou le retrait des options cheked dans le dropdown
    const handleSelectOptionValues = (optionValue) => {
        if (optionValue != undefined && optionValue.length > 0) {
            let index = optionObj.values.indexOf(optionValue);
            if (index > -1) {
                let tmp_arr = [...optionObj.values];
                tmp_arr.splice(index, 1);
                setOptionObj({ ...optionObj, values: [...tmp_arr] });
            } else {
                setOptionObj({ ...optionObj, values: [...optionObj.values, optionValue] });
            }
        }
        setTmp_selectOptionValues(optionValue);

        setTmp_optionValues('');
        setOptionValueMessage(false);
        removeErrorMessageOptionValue();

    };

    const input_optionValuesRef = useRef(null);
    // gère la fermeture du dropDown input OptionValues quand on clique en dehors
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [tmp_optionValues]);
    const handleClickOutside = (event) => {
        // check qu'on a bien click en dehors de l'input
        if (input_optionValuesRef.current && !input_optionValuesRef.current.contains(event.target)) {
            // si le nom de l'option tapée existe déjà affiche un message d'errreur
            if (tmp_optionValues.length > 0) {
                if (optionObj.values.includes(upperFirstLetter(tmp_optionValues))) {
                    setOptionValueMessage(true);
                    return;

                } else {
                    // sinon l'ajoute
                    setOptionObj({ ...optionObj, values: [...optionObj.values, tmp_optionValues] });
                    setTmp_optionValues('');
                    setShowOptionValues(false);
                }
            }
        }
    };

    const removeOptionValue = (item) => {
        let index = optionObj.values.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...optionObj.values];
            tmp_arr.splice(index, 1);
            setOptionObj({ ...optionObj, values: [...tmp_arr] });
        }
    }


    const ul_optionValuesRef = useRef(null);
    // gère la fermeture du dropDown input OptionValues quand on clique en dehors
    useEffect(() => {
        document.addEventListener('click', handleClickOutside2, true);
        return () => {
            document.removeEventListener('click', handleClickOutside2, true);
        };
    }, [tmp_selectOptionValues]);
    const handleClickOutside2 = (event) => {
        // check qu'on a bien click en dehors de l'input
        if (ul_optionValuesRef.current && !ul_optionValuesRef.current.contains(event.target) && input_optionValuesRef.current && !input_optionValuesRef.current.contains(event.target)) {
            setShowOptionValues(false);
        }
    };


    // permet d'afficher le arrow dans le dropdown s'il y a une liste
    const listTypesNoEmpty = listType != undefined && listType != null && listType?.length > 0;
    const listOptionValuesNotEmpty = listOptionValues != undefined && listOptionValues != null && listOptionValues?.length > 0;

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        backgroundColor: isDragging && "#fafafa",
        border: isDragging && "dashed 4px #d1d1d1",

        // styles we need to apply on draggables
        ...draggableStyle,
    });

    const getStyleOnGrip = (id) => {
        let optionCardDnD = document.getElementById(id);
        optionCardDnD.style.border = "dashed 4px #d1d1d1";
    }

    const getStyleOffGrip = (id) => {
        let optionCardDnD = document.getElementById(id);
        optionCardDnD.style.border = "solid 1px rgb(209 213 219)";
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // si on drop en dehors de la zone droppable 
        if (!destination) {
            return;
        }

        // si on drop sur l'emplacement initial 
        if (destination.droppableId === destination.droppableId && destination.index === source.index) {
            return;
        }

        // si on drop ailleurs que sur l'emplacement initial sur la zone droppable
        const tmp_values = Array.from(optionObj.values);
        const [removed] = tmp_values.splice(source.index, 1);
        tmp_values.splice(destination.index, 0, removed);

        setOptionObj({ ...optionObj, values: [...tmp_values] });
    };


    return (
        <Draggable
            key={option_obj.id}
            draggableId={`${option_obj.id}`}
            index={index}
        >
            {(provided, snapshot) => (
                <div
                    id={`${"optionCardDnD" + option_obj.id}`}
                    className="w-full h-auto grid gap-x-4 grid-cols-[25px_1fr_1fr_25px] justify-start items-start px-4 pt-4 pb-2 mb-2 rounded border border-gray-300 bg-white"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}
                >
                    {/* drag */}
                    <div className='h-10 pt-[9px]'>
                        <img src={window.location.origin + '/images/icons/grip-vertical.svg'} className="h-[22px] w-[22px] cursor-move"
                            onMouseDown={() => getStyleOnGrip(`${"optionCardDnD" + option_obj.id}`)}
                            onMouseUp={() => getStyleOffGrip(`${"optionCardDnD" + option_obj.id}`)}
                            {...provided.dragHandleProps}
                        />
                    </div>

                    {/* option namme */}
                    <div className='w-full h-auto p-0 flex flex-col justify-start items-start'>
                        <div className="relative w-full m-0 p-0">
                            <div className='w-full h-[40px] p-0 m-0'>
                                <input
                                    id="inputListType"
                                    type="text"
                                    value={optionObj.name}
                                    onChange={handleChangeOption}
                                    onClick={handleShowListType}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                            setShowListType(false);
                                        }
                                    }}
                                    placeholder="Ex. Couleur, Taille,..."
                                    autoComplete="off"
                                    className={`inputListType name${optionObj.id} w-full h-10 pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat ${listTypesNoEmpty && "hover:bg-caret-down"} bg-right-center `}
                                />
                            </div>

                            {/* affiche les erreurs */}
                            <span
                                id={`name${optionObj.id}`}
                                className='text-red-700 text-sm mb-1'>
                            </span>

                            {showListType &&
                                <ul id="listType"
                                    className='absolute t-[40px] l-0 w-full max-h-[242px] border border-gray-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                                >
                                    {listTypesNoEmpty &&
                                        listType.map((item, index) =>
                                            optionsObj?.findIndex(x => x.name == item.name) == -1 &&
                                            <li
                                                key={index}
                                                value={item.name}
                                                onClick={() => {
                                                    handleChangeOption(item);
                                                    getOptionValues();
                                                }}
                                                className="w-full h-[40px] cursor-pointer hover:bg-slate-100"
                                            >
                                                <span className="flex flex-row justify-start items-center pl-[10px] w-full h-full pr-[30px] text-stone-800 text-base hover:cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {item.name}
                                                </span>
                                            </li>
                                        )
                                    }
                                </ul>}
                        </div>
                    </div>

                    {/* option value */}
                    <div className='w-full h-auto p-0 flex flex-col justify-start items-start'>
                        <div className="relative w-full m-0 p-0">
                            <div className='w-full h-[40px] p-0'>
                                <input
                                    id="inputOptionValues"
                                    type="text"
                                    value={tmp_optionValues}
                                    ref={input_optionValuesRef}
                                    onChange={handleChangeOptionValues}
                                    onClick={handleShowOptionValuesList}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                            handleEnterOptionsValue();
                                        }
                                    }}
                                    onKeyUp={(e) => {
                                        if (e.key == ',') {
                                            handleEnterOptionsValue();
                                        }
                                    }}
                                    placeholder="Ex. Bleu, Large,..."
                                    autoComplete="off"
                                    disabled={optionObj.name?.length == 0}
                                    className={`inputOptionValues value${optionObj.id} w-full h-10 pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat ${listOptionValuesNotEmpty && "hover:bg-caret-down"}  bg-right-center`}
                                />
                            </div>
                            {optionValueMessage &&
                                <span className='block text-red-700 text-sm pb-1'>Cette option existe déjà</span>
                            }

                            {/* affiche les erreurs */}
                            <span
                                id={`value${optionObj.id}`}
                                className='text-red-700 text-sm pb-3'>
                            </span>

                            {showOptionValues &&
                                listOptionValues.length > 0 &&
                                <ul id="listOptionValues"
                                    ref={ul_optionValuesRef}
                                    className='absolute t-[40px] l-0 w-full max-h-[242px] border border-gray-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                                >
                                    {listOptionValues.map((item, index) =>
                                        <li
                                            key={index}
                                            value={item.name}
                                            onClick={() => {
                                                handleSelectOptionValues(item.name);
                                            }}
                                            className="w-full h-10 flex flex-row justify-start items-center pl-2.5 cursor-pointer hover:bg-slate-100"
                                        >
                                            <input type='checkbox'
                                                value={item.id}
                                                id={item.id}
                                                checked={optionObj.values.indexOf(item.name) > -1}
                                                // pour pas avoir de warning "checked non controlé"
                                                onChange={() => { }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                                        setShowOptionValues(false);
                                                        removeErrorMessageOptionValue();
                                                    }
                                                }}
                                                className="w-[17px] h-[17px] mr-[10px] hover:cursor-pointer"
                                            />
                                            <label
                                                className="flex flex-row justify-start items-center w-full h-full pr-[30px] text-stone-800 text-base hover:cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                                                {item.name}
                                            </label>
                                        </li>
                                    )
                                    }
                                </ul>}
                        </div>
                    </div>

                    {/* supprimer */}
                    <div className='flex justify-start items-center w-[40px] h-[40px] p-0 m-0 cursor-pointer'>
                        <span
                            onClick={() => deleteOption(optionObj.id)}
                            className='flex justify-center items-center w-[22px] h-[22px] p-0 m-0 cursor-pointer group hover:bg-red-500 rounded-[5px]'>
                            <img src={window.location.origin + '/images/icons/trash.svg'} className="h-[18px] w-[18px] group-hover:hidden" />
                            <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[18px] w-[18px] hidden group-hover:block" />
                        </span>
                    </div>

                    {/* values pastilles*/}
                    <DragDropContext
                        onDragEnd={onDragEnd}
                    >
                        <Droppable
                            droppableId={"option_ObjDroppableId"}
                            direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    className="col-span-3 flex flex-wrap pt-[5px] w-full"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {!!optionObj.values?.length > 0 && optionObj.values?.map((item, indx) =>
                                        <Draggable
                                            key={indx}
                                            draggableId={`${indx}`}
                                            index={indx}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-[8px] pr-[6px] py-[3px] mb-1 mr-2 cursor-move"
                                                    onClick={() => setShowOptionValues(false)
                                                    }
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    <span
                                                        className="h-full text-gray-500 mr-2 rounded-md">
                                                        {item}
                                                    </span>
                                                    <span
                                                        className="h-[20px] w-[20px] flex justify-center items-center hover:cursor-pointer bg-gray-600  hover:bg-red-500 rounded-md"
                                                        onClick={() => removeOptionValue(item)}>
                                                        <img src='../images/icons/x-white.svg'
                                                            className="w-[20px] h-[20px] hover:scale-125" />
                                                    </span>
                                                </div>
                                            )}
                                        </Draggable>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}
        </Draggable>
    )
}

export default Option;