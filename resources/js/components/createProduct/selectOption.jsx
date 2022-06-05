import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SelectWithCheckbox2 from '../elements/selectWithCheckbox';


const SelectOption = ({ listType }) => {

    const [optionObj, steOptionObj] = useState([]);
    const [option, steOption] = useState('');
    const [listOptionValues, setListOptionValues] = useState('');
    const [optionValues, setOptionValues] = useState('');
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
                console.log('option --> ', option)
                console.log('resdata --> ', res.data)
                if (res.data.length > 0) {
                    setListOptionValues(res.data);
                }
            });
    }

    // ferme le dropDown input listType quand on clique en dehors
    const onClickOutside = (e) => {
        if (!e.target.className.includes('inputListType')) {
            setShowListType(false);

            let inputListType = document.getElementById('inputListType');
            inputListType.className = "inputListType w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat hover:bg-caret-down bg-right-center"
        }
    };


    const handleChangeOption = (e) => {
        if (e.target != undefined) {
            steOption(e.target.value);
        }
        if (e != undefined && e.length > 0) {
            steOption(e);
        }
    };

    useEffect(() => {
        if (option.length > 0) {
            getOptionValues();
        }
    }, [option]);

    const addOption = (selectedOpt) => {
        let tmp_tab = [...optionObj];
        let ndx = tmp_tab.findIndex(obj => obj.option == selectedOpt);
        if (ndx === -1) {
            let tmp_obj = { option: selectedOpt }
        }
    }

    const handleShowListType = () => {
        setShowListType(!showListType);
    }

    const handleShowOptionValues = () => {
        setShowOptionValues(!showOptionValues);
    }

    useEffect(() => {
        if (showListType) {
            let inputListType = document.getElementById('inputListType');
            inputListType.className = "inputListType w-full h-[38px] pl-[10px] mt-0 rounded-4 cursor-text bg-no-repeat bg-caret-down bg-right-center"

            // gère la fermeture du dropDown input listType quand on clique en dehors
            window.addEventListener("click", onClickOutside);
        } else {
            window.removeEventListener("click", onClickOutside);
        }
    }, [showListType]);


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
                <div className='w-full h-[40px] p-0  mt-[3px] border border-slate-400 rounded-4 '>
                    <input
                        id="optionValues"
                        type="text"
                        value={listOptionValues ? listOptionValues[0].name : ''}
                        onChange={handleChangeOption}
                        onClick={handleShowOptionValues}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                        //         addOption(e.target.value);
                        //     }
                        // }}
                        placeholder="Ex. Bleu, Large, 40cm,..."
                        className="w-full h-[38px] pl-[10px] m-0 rounded-4 cursor-text"
                    />
                </div>
                <SelectWithCheckbox2
                    key="SelectWithCheckbox_options"
                    list={listOptionValues}
                    selected={optionValues}
                    setSelected={setOptionValues}
                />
                {/* {showOptionValues &&
                    <ul id="listOptionValues"
                        className='absolute t-[40px] l-0 w-full max-h-[242px] border border-slate-300 bg-white overflow-x-hidden overflow-y-scroll z-10 shadow-lg scrollbar scrollbar-thumb-slate-200 scrollbar-track-gray-100'
                    >
                        {listOptionValues && listOptionValues.map((item, index) =>
                            <li
                                key={index}
                                value={item.name}
                                onClick={() => handleChangeOption(item.name)}
                                className="w-full h-[40px] flex justify-start items-center pl-[10px] cursor-pointer hover:bg-slate-100"
                            >
                                {item.name}
                            </li>
                        )
                        }
                    </ul>} */}
            </div>

            <div className='w-full h-auto col-span-2'>
                <p>
                    20*lorem
                </p>
            </div>
        </div>
    )
}

export default SelectOption;