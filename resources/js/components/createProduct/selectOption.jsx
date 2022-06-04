import React, { useState } from 'react';


const SelectOption = ({ listType }) => {

    const [optionObj, steOptionObj] = useState([]);
    const [option, steOption] = useState('');
    const [values, steValues] = useState('');
    const [showListType, setShowListType] = useState(false);

    const handleChangeOption = (e) => {
        if (e.target.value != undefined) {
            console.log('target  ', e.target.value);
        } 
        if (e.length != undefined && e.length > 0) {
            console.log('e  ', e);
        }
        // steOption(e.target.value);
    };

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


    return (
        <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-2 justify-start items-start brd-blue-1'>

            <div className='w-full flex flex-col justify-start items-start'>
                <label>Option</label>
                <input
                    type="text"
                    value={option}
                    onChange={handleChangeOption}
                    onClick={handleShowListType}
                    placeholder="Ex. Couleur, Taille, Dimension,..."
                    className="w-full h-[40px] pl-[10px] mt-1 border border-slate-400 rounded-4 cursor-text"
                />
                {showListType &&
                    <ul id="listType"
                        className='w-full border border-slate-200'
                    >
                        {listType.map((item, index) =>
                            <li
                                key={index}
                                value={item.name}
                                onClick={handleChangeOption(item.name)}
                                className="w-full h-[40px] flex justify-start items-center pl-[10px] cursor-pointer hover:bg-slate-100"
                            >
                                {item.name}
                            </li>)
                        }
                    </ul>}
            </div>

            <div className='w-full flex flex-col justify-start items-start'>
                <label>Valeurs de l'option</label>
                <input
                    type="text"
                    list="data_options"
                    onChange={handleChangeOption}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
                            addOption(e.target.value);
                        }
                    }
                    }
                    placeholder="Ex. Bleu, Large, 40cm,..."
                    className="w-full h-[40px] pl-[10px] mt-1 border border-slate-400 rounded-4 cursor-text"
                />
                <datalist id="data_options">
                    {listType.map((item, index) =>
                        <option
                            key={index}
                            value={item.name} >
                            {item.name}
                        </option>)
                    }
                </datalist>
            </div>

            <div className='w-full h-auto col-span-2 brd-red-1'>
                <p>
                    20*lorem
                </p>
            </div>
        </div>
    )
}

export default SelectOption;