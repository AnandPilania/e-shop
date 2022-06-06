import React, { useState, useEffect } from 'react';
import Axios from 'axios';



const SelectOption = ({ listType }) => {

    const [optionObj, steOptionObj] = useState([]);
    const [option, steOption] = useState('');
    const [listOptionValues, setListOptionValues] = useState([]);
    const [optionValues, setOptionValues] = useState([]);
    const [tmp_optionValues, setTmp_optionValues] = useState('');
    const [showListType, setShowListType] = useState(false);
    const [showOptionValues, setShowOptionValues] = useState(false);



    // récupération de toutes les valeurs pour une option donnée
    const getOptionValues = () => {
        Axios.get(`http://127.0.0.1:8000/getOptionValues`,
            {
                params: {
                    option_name: option,
                }
            }).then((res) => {
                if (res.data.length > 0) {
                    setListOptionValues(res.data);
                }
            });
    }


    const handleChangeOption = (e) => {
        if (e.target != undefined) {
            steOption(e.target.value);
        }
        if (e != undefined && e.length > 0) {
            steOption(e);
        }
    };

    useEffect(() => {
        setListOptionValues([]);
        setOptionValues([]);
        if (option.length > 0) {
            getOptionValues();
        }
    }, [option]);


    const handleShowListType = () => {
        setShowListType(!showListType);
    }

    // ferme le dropDown input listType quand on clique en dehors
    const onClickOutside_inputListType = (e) => {
        if (!e.target.className.includes('inputListType')) {
            setShowListType(false);

            let inputListType = document.getElementById('inputListType');
            inputListType.className = "inputListType w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center"
        }
    };
    useEffect(() => {
        if (showListType) {
            let inputListType = document.getElementById('inputListType');
            inputListType.className = "inputListType w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat bg-caret-down bg-right-center"

            // gère la fermeture du dropDown input listType quand on clique en dehors
            window.addEventListener("click", onClickOutside_inputListType);
        } else {
            window.removeEventListener("click", onClickOutside_inputListType);
        }
    }, [showListType]);



var test = '';
    const handleChangeOptionValues = (e) => {
        test = e.target.value;
        setTmp_optionValues(e.target.value);

        // gère la fermeture du dropDown input OptionValues quand on clique en dehors
        // on remov dabord pour être sur de ne pas accumuler les eventListener
        window.removeEventListener("click", onClickOutside_inputOptionValues);
        window.addEventListener("click", onClickOutside_inputOptionValues);
    };

    // const addNewOptionValue = () => {
    //     // console.log('tmp_optionValues  ', tmp_optionValues)
    //     if (tmp_optionValues.length > 0) {
    //         setOptionValues([...optionValues, tmp_optionValues]);
    //     }
    // }

    const handleSelectOptionValues = (e) => {
        if (e.target != undefined) {
            let index = optionValues.indexOf(e.target.value);
            if (index > -1) {
                let tmp_arr = [...optionValues];
                tmp_arr.splice(index, 1);
                setOptionValues([...tmp_arr]);
            } else {
                setOptionValues([...optionValues, e.target.value]);
            }
            return;
        }
    };

    const removeOptionValue = (item) => {
        let index = optionValues.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...optionValues];
            tmp_arr.splice(index, 1);
            setOptionValues([...tmp_arr]);
        }
    }

    const handleShowOptionValues = () => {
        setShowOptionValues(!showOptionValues);
    }

    // ferme le dropDown input OptionValues quand on clique en dehors
    const onClickOutside_inputOptionValues = (e) => {
        if (!e.target.className.includes('inputOptionValues')) {
            setShowOptionValues(false);

            let inputOptionValues = document.getElementById('inputOptionValues');
            inputOptionValues.className = "inputOptionValues w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center"
console.log('tmp_optionValues  ', tmp_optionValues)
            // addNewOptionValue();
            if (test.length > 0) {
                setOptionValues([...optionValues, test]);
            }
            setTmp_optionValues('');
        }
    };
    useEffect(() => {
        if (showOptionValues) {
            let inputOptionValues = document.getElementById('inputOptionValues');
            inputOptionValues.className = "inputOptionValues w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat bg-caret-down bg-right-center"

            // gère la fermeture du dropDown input OptionValues quand on clique en dehors
            window.addEventListener("click", onClickOutside_inputOptionValues);
        } else {
            window.removeEventListener("click", onClickOutside_inputOptionValues);
        }
    }, [showOptionValues]);



    return (
        <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start'>

            <div className='w-full flex flex-col justify-start items-start'>

                <label>Option</label>

                <div className="relative w-full m-0 p-0 mt-[3px]">
                    <div className='w-full h-[42px] p-0 m-0 border border-slate-400 rounded-4'>
                        <input
                            id="inputListType"
                            type="text"
                            value={option}
                            onChange={handleChangeOption}
                            onClick={handleShowListType}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                    setShowListType(false);
                                }
                            }}
                            placeholder="Ex. Couleur, Taille, Dimension,..."
                            autoComplete="off"
                            className="inputListType w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center"
                        />
                    </div>
                    {showListType &&
                        <ul id="listType"
                            className='absolute t-[40px] l-0 w-full max-h-[242px] border border-slate-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                        >
                            {listType.map((item, index) =>
                                (item.name.toLowerCase().includes(option.toLowerCase()) || option.length == 0) &&
                                <li
                                    key={index}
                                    value={item.name}
                                    onClick={() => {
                                        handleChangeOption(item.name);
                                        getOptionValues();
                                    }}
                                    className="w-full h-[40px] flex justify-start items-center pl-[10px] cursor-pointer hover:bg-slate-100"
                                >
                                    {item.name}
                                </li>
                            )
                            }
                        </ul>}
                </div>
            </div>

            <div className='w-full flex flex-col justify-start items-start'>

                <label>Valeurs de l'option</label>

                <div className="relative w-full m-0 p-0 mt-[3px]">
                    <div className='w-full h-[40px] p-0  mt-[3px] border border-slate-400 rounded-4 '>
                        <input
                            id="inputOptionValues"
                            type="text"
                            value={tmp_optionValues}
                            onChange={handleChangeOptionValues}
                            onClick={handleShowOptionValues}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                                    setShowOptionValues(false);
                                    // addOption(e.target.value);
                                }
                            }}
                            placeholder="Ex. Bleu, Large, 40cm,..."
                            autoComplete="off"
                            className="inputOptionValues w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center"
                        />
                    </div>

                    {showOptionValues &&
                        <ul id="listOptionValues"
                            className='absolute t-[40px] l-0 w-full max-h-[242px] border border-slate-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100 brd-red-2'
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
                                        checked={optionValues.indexOf(item.name) > -1}
                                        onChange={() => handleSelectOptionValues(item.name)}
                                        className="w-[17px] h-[17px] mr-[17px] hover:cursor-pointer" />
                                    <label htmlFor={item.id}
                                        className="text-stone-800 text-base hover:cursor-pointer">
                                        {item.name}
                                    </label>
                                </li>
                            )
                            }
                        </ul>}
                </div>
            </div>

            <div className="col-span-2 flex flex-wrap pt-[20px] w-full">
                {optionValues.map(item =>
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

export default SelectOption;