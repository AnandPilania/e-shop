import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { upperFirstLetter } from '../../functions/upperFirstLetter';


const ModalCreateOption = ({ show, handleModalConfirm, handleModalCancel, textButtonConfirm, setShowModalCreateOption }) => {

    const [inputOptionName, setInputOptionName] = useState('');
    const [inputOptionValue, setInputOptionValue] = useState('');

    const { optionObj, setOptionObj, setListType, showOptions, setShowOptions } = useContext(AppContext);

    // handle option name change
    const handleChangeOptionName = (e) => {
        if (e.target != undefined) {
            setInputOptionName(e.target.value);
            removeErrorMessageOptionName();
        }
    };

    const handleChangeOptionValues = (e) => {
        setInputOptionValue(upperFirstLetter(e.target.value));
        removeErrorMessageOptionValue();
    };

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
        // let spanMessageValue = document.getElementById(`value${optionObj.id}`);
        // spanMessageValue.innerHTML = '';
        // let inputOptionValueError = document.getElementsByClassName(`value${optionObj.id}`)[0];
        // if (inputOptionValueError !== undefined) {
        //     inputOptionValueError.className = `inputOptionValues value${optionObj.id} w-full h-10 pl-[10px] m-0 mb-1 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  ${listOptionValuesNotEmpty && "hover:bg-caret-down"} bg-right-center`;
        // }
        // // value duplicate
        // setOptionValueMessage(false);
    }

    const removeInputOptionValue = (item) => {
        let index = inputOptionValue.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...inputOptionValue];
            tmp_arr.splice(index, 1);
            setInputOptionValue([...tmp_arr]);
        }
    }

    const handleEnterOptionsValue = () => {
        if (optionObj.values.includes(upperFirstLetter(tmp_optionValues))) {
            setOptionValueAlreadyExist(true);
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

    const saveNewOption = () => {
        alert('ok')
    }

    return (
        <div
            className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-full  flex flex-col justify-start items-center`}>
            <section
                className="fixed w-auto max-h-[90vh] max-w-[650px] min-w-[350] px-8 pt-5 pb-8 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50">
                <div
                    className="w-full flex flex-row justify-end items-center pr-2">
                    <img src='../images/icons/x-white.svg'
                        className="w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                        onClick={() => setShowModalCreateOption(false)} />
                </div>


                <div className="w-full flex flex-col justify-start items-start mt-8">

                    <div className="w-full flex flex-row justify-start items-center mt-8">
                        {/* option name */}
                        <div className='w-full h-[40px] p-0 m-0'>
                            <input
                                id="inputListType"
                                type="text"
                                value={optionObj?.name}
                                onChange={handleChangeOptionName}
                                placeholder="Ex. Couleur, Taille,..."
                                autoComplete="off"
                                className={`inputListType name${optionObj?.id} w-full h-10 pl-[10px] mr-6 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  bg-right-center `}
                            />
                            {/* affiche les erreurs */}
                            <span
                                id={`name${optionObj?.id}`}
                                className='text-red-700 text-sm mb-1'>
                            </span>
                        </div>

                        {/* option value */}
                        <div className='w-full h-[40px] p-0'>
                            <input
                                id="inputOptionValues"
                                type="text"
                                value={inputOptionValue}
                                onChange={handleChangeOptionValues}
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
                                disabled={optionObj?.name?.length == 0}
                                className={`inputOptionValues value${optionObj?.id} w-full h-10 pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  bg-right-center`}
                            />
                            {/* affiche les erreurs */}
                            <span
                                id={`value${optionObj?.id}`}
                                className='text-red-700 text-sm pb-3'>
                            </span>

                        </div>

                        <button className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-white text-gary-700 hover:font-semibold cursor-pointer"
                        onClick={saveNewOption}>
                        <img src='../images/icons/add_icon.svg'
                        className="w-8 h-8 mr-2 rounded-md"
                        onClick={() => setShowModalCreateOption(false)} />
                        Ajouter
                    </button>


                    </div>
                </div>

                {/* pastilles */}
                <div className="col-span-3 flex flex-wrap pt-[5px] w-full">
                    {!!inputOptionValue?.length > 0 && inputOptionValue?.map((item, indx) =>
                        <div
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-[8px] pr-[6px] py-[3px] mb-1 mr-2 cursor-move">
                            <span
                                className="h-full text-gray-500 mr-2 rounded-md">
                                {item}
                            </span>
                            <span
                                className="h-[20px] w-[20px] flex justify-center items-center hover:cursor-pointer bg-gray-600  hover:bg-red-500 rounded-md"
                                onClick={() => removeInputOptionValue(item)}>
                                <img src='../images/icons/x-white.svg'
                                    className="w-[20px] h-[20px] hover:scale-125" />
                            </span>
                        </div>
                    )}
                </div>


                <div className="w-full flex flex-row justify-start items-center mt-8">

                    <button className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                        onClick={saveNewOption}>
                        Enregistrer
                    </button>
                    <button
                        className="w-32 h-12 ml-5 flex justify-center items-center border border-gray-300 rounded-md bg-red-700 text-white hover:font-semibold"
                        onClick={() => setShowModalCreateOption(false)}>
                        Annuler
                    </button>
                </div>


            </section>
        </div>
    );
};

export default ModalCreateOption;