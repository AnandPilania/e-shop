import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';



const Option = ({ listType, option_obj, saveOption, deleteOption }) => {



    const [optionObj, setOptionObj] = useState({
        id: option_obj.id,
        name: option_obj.name,
        values: [...option_obj.values]
    });
    const [listOptionValues, setListOptionValues] = useState([]);
    const [tmp_optionValues, setTmp_optionValues] = useState('');
    const [tmp_selectOptionValues, setTmp_selectOptionValues] = useState('');
    const [showListType, setShowListType] = useState(false);
    const [showOptionValues, setShowOptionValues] = useState(false);
    const [optionValueMessage, setOptionValueMessage] = useState(false);



    // récupération de toutes les valeurs pour une option donnée
    const getOptionValues = () => {
        Axios.get(`http://127.0.0.1:8000/getOptionValues`,
            {
                params: {
                    option_name: optionObj.name,
                }
            }).then((res) => {
                if (res.data.length > 0) {
                    setListOptionValues(res.data);
                } else {
                    setListOptionValues([]);
                }
            });
    }

    const removeErrorMessage = () => {

        // input option name
        let spanMessageName = document.getElementById(`name${optionObj.id}`);
        spanMessageName.innerHTML = '';
        let inputOptionError = document.getElementsByClassName(`name${optionObj.id}`)[0];
        if (inputOptionError !== undefined) {
            inputOptionError.className = `inputListType w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-white bg-no-repeat hover:bg-caret-down bg-right-center name${optionObj.id}`;
        }

        // input option Value
        let spanMessageValue = document.getElementById(`value${optionObj.id}`);
        spanMessageValue.innerHTML = '';
        let inputOptionValueError = document.getElementsByClassName(`value${optionObj.id}`)[0];
        if (inputOptionValueError !== undefined) {
            inputOptionValueError.className = `inputOptionValues w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-white bg-no-repeat hover:bg-caret-down bg-right-center value${optionObj.id}`;
        }

        // value duplicate
        setOptionValueMessage(false);
    }

    const handleChangeOption = (e) => {
        if (e.target != undefined) {
            setOptionObj({ ...optionObj, name: e.target.value, values: [] });
            setShowListType(false);
            removeErrorMessage();
        }
        if (e != undefined && e.length > 0) {
            setOptionObj({ ...optionObj, name: e, values: [] });
            setShowListType(false);
            removeErrorMessage();
        }
    };

    // initialise quand on change d'option
    useEffect(() => {
        setListOptionValues([]);
        setOptionObj({ ...optionObj, values: [] });
        if (optionObj.name?.length > 0) {
            getOptionValues();
        }
    }, [optionObj.name]);


    // save optionObj
    useEffect(() => {
        saveOption(optionObj);
    }, [optionObj]);


    const handleShowListType = () => {
        setShowListType(!showListType);
    }

    // ferme le dropDown input listType quand on clique en dehors
    const onClickOutside_inputListType = (e) => {
        if (!e.target.className.includes('inputListType')) {
            setShowListType(false);

            let inputListType = document.getElementById('inputListType');
            if (inputListType !== null) {
                inputListType.className = "inputListType w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center";
            }
        }
    };
    useEffect(() => {
        if (showListType) {
            let inputListType = document.getElementById('inputListType');
            if (inputListType !== null) {
                inputListType.className = "inputListType w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-no-repeat bg-caret-down bg-right-center";
            }

            // gère la fermeture du dropDown input listType quand on clique en dehors
            window.addEventListener("click", onClickOutside_inputListType);
        } else {
            window.removeEventListener("click", onClickOutside_inputListType);
        }
    }, [showListType]);





    const handleChangeOptionValues = (e) => {

        setTmp_optionValues(e.target.value);
        setShowOptionValues(false);
        removeErrorMessage();
    };

    const handleEnterOptionsValue = () => {
        setShowOptionValues(false);
        if (optionObj.values.includes(tmp_optionValues)) {
            setOptionValueMessage(true);
            return;
        } else {
            removeErrorMessage();
        }

        tmp_optionValues.length > 0 && setOptionObj({ ...optionObj, values: [...optionObj.values, tmp_optionValues.trim()] });
        setTmp_optionValues('');
    }

    // toggle l'ajout ou le retrait des options cheked dans le dropdown
    const handleSelectOptionValues = (optionValue_name) => {
        if (optionValue_name != undefined && optionValue_name.length > 0) {
            let index = optionObj.values.indexOf(optionValue_name);
            if (index > -1) {
                let tmp_arr = [...optionObj.values];
                tmp_arr.splice(index, 1);
                setOptionObj({ ...optionObj, values: [...tmp_arr] });
            } else {
                setOptionObj({ ...optionObj, values: [...optionObj.values, optionValue_name] });
            }
        }
        setTmp_selectOptionValues(optionValue_name);

        setTmp_optionValues('');
        setOptionValueMessage(false);
        removeErrorMessage();
    };

    const input_optionValuesRef = useRef(null);
    // gère la fermeture du dropDown input OptionValues quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            // check qu'on a bien click en dehors de l'input
            if (input_optionValuesRef.current && !input_optionValuesRef.current.contains(event.target)) {

                if (tmp_optionValues.length > 0) {
                    if (optionObj.values.includes(tmp_optionValues)) {
                        setOptionValueMessage(true);
                        return;
                    } else {
                        setOptionObj({ ...optionObj, values: [...optionObj.values, tmp_optionValues] });
                        setTmp_optionValues('');

                        setShowOptionValues(false);
                        let inputOptionValues = document.getElementById('inputOptionValues');
                        if (inputOptionValues !== null) {
                            inputOptionValues.className = "inputOptionValues w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center";
                        }
                    }
                }
            }
        };

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [tmp_optionValues]);


    useEffect(() => {
        if (showOptionValues) {
            let inputOptionValues = document.getElementById('inputOptionValues');
            if (inputOptionValues !== null) {
                inputOptionValues.className = "inputOptionValues w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center";
            }
        }
    }, [showOptionValues]);

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
        const handleClickOutside2 = (event) => {

            // check qu'on a bien click en dehors de l'input
            if (ul_optionValuesRef.current && !ul_optionValuesRef.current.contains(event.target)) {
                setShowOptionValues(false);
            }
        };

        document.addEventListener('click', handleClickOutside2, true);
        return () => {
            document.removeEventListener('click', handleClickOutside2, true);
        };
    }, [tmp_selectOptionValues]);





    return (
        <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_1fr_40px] justify-start items-start pb-[20px]'>

            {/* option namme */}
            <div className='w-full h-[40px] p-0 flex flex-col justify-start items-start'>
                <div className="relative w-full m-0 p-0">
                    <div className='w-full h-[40px] p-0 m-0 border border-slate-400 rounded-4'>
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
                            className={`inputListType w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-white bg-no-repeat hover:bg-caret-down bg-right-center name${optionObj.id} `}
                        />
                    </div>

                    {/* affiche les erreurs */}
                    <span
                        id={`name${optionObj.id}`}
                        className='text-red-700 text-sm'>
                    </span>

                    {showListType &&
                        <ul id="listType"
                            className='absolute t-[40px] l-0 w-full max-h-[242px] border border-slate-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                        >
                            {listType.map((item, index) =>
                                <li
                                    key={index}
                                    value={item.name}
                                    onClick={() => {
                                        handleChangeOption(item.name);
                                        getOptionValues();
                                    }}
                                    className="w-full h-[40px] flex justify-start items-center pl-[10px] cursor-pointer hover:bg-slate-100"
                                >
                                    <span className="w-full h-full pr-[30px] text-stone-800 text-base hover:cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.name}
                                    </span>
                                </li>
                            )
                            }
                        </ul>}
                </div>
            </div>

            {/* option value */}
            <div className='w-full h-[40px] p-0 flex flex-col justify-start items-start'>
                <div className="relative w-full m-0 p-0">
                    <div className='w-full h-[40px] p-0  border border-slate-400 rounded-4 '>
                        <input
                            id="inputOptionValues"
                            type="text"
                            value={tmp_optionValues}
                            ref={input_optionValuesRef}
                            onChange={handleChangeOptionValues}
                            onClick={() => {
                                setShowOptionValues(!showOptionValues);
                                setOptionValueMessage(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                    handleEnterOptionsValue();
                                }
                            }}
                            placeholder="Ex. Bleu, Large,..."
                            autoComplete="off"
                            disabled={optionObj.name?.length == 0}
                            className={`inputOptionValues w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-white bg-no-repeat hover:bg-caret-down bg-right-center value${optionObj.id}`}
                        />
                    </div>
                    {optionValueMessage &&
                        <span className='block text-red-700 text-sm'>Ce nom existe déjà dans la liste des options</span>
                    }

                    {/* affiche les erreurs */}
                    <span
                        id={`value${optionObj.id}`}
                        className='text-red-700 text-sm'>
                    </span>

                    {showOptionValues &&
                        <ul id="listOptionValues"
                            ref={ul_optionValuesRef}
                            className='absolute t-[40px] l-0 w-full max-h-[242px] border border-slate-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                        >
                            {listOptionValues && listOptionValues.map((item, index) =>
                                <li
                                    key={index}
                                    value={item.name}
                                    onClick={() => handleSelectOptionValues(item.name)}
                                    className="w-full h-[40px] flex justify-start items-center pl-[10px] cursor-pointer hover:bg-slate-100"
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
                                                removeErrorMessage();
                                            }
                                        }}
                                        className="w-[17px] h-[17px] mr-[17px] hover:cursor-pointer"
                                    />
                                    <label 
                                        className="w-full h-full pr-[30px] text-stone-800 text-base hover:cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.name}
                                    </label>
                                </li>
                            )
                            }
                        </ul>}
                </div>
            </div>

            {/* supprimer */}
            <div className='group flex justify-center items-center w-[40px] h-[40px] p-0 m-0 cursor-pointer'>
                <span
                    onClick={() => deleteOption(optionObj.id)}
                    className='flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer hover:bg-red-500 rounded-[5px]'>
                    <img src={window.location.origin + '/images/icons/trash.svg'} className="h-[20px] w-[20px] group-hover:hidden" />
                    <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[25px] w-[25px] hidden group-hover:block" />
                </span>
            </div>

            {/* values */}
            <div className="col-span-3 flex flex-wrap pt-[20px] w-full">
                {!!optionObj.values.length > 0 && optionObj.values.map(item =>
                    <div key={item}
                        className="flex justify-between align-center h-[24px] rounded-full bg-sky-500 pl-3 mb-1 mr-2 ">
                        <span
                            className="h-full text-white mr-2 rounded-full">
                            {item}
                        </span>
                        <span
                            className="h-full w-[24px] flex justify-center align-center hover:cursor-pointer hover:bg-white rounded-r-[50%] bg-amber-400"
                            onClick={() => removeOptionValue(item)}>
                            <img src='../images/icons/x.svg'
                                className="w-[20px] h-[24px]" />
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Option;