import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { upperFirstLetter } from '../../functions/upperFirstLetter';


const ModalCreateOption = ({ show, handleModalConfirm, handleModalCancel, textButtonConfirm, setShowModalCreateOption }) => {

    const [inputOptionName, setInputOptionName] = useState('');
    const [inputOptionValue, setInputOptionValue] = useState('');
    const [lisNewOptionValue, setListNewOptionValue] = useState([]);
    const [optionValueAlreadyExist, setOptionValueAlreadyExist] = useState(false);
    const [optionNameAlreadyExist, setOptionNameAlreadyExist] = useState(false);

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
            inputOptionError.className = `inputOptionName041122 name${optionObj.id} w-full h-10 pl-[10px] m-0 mb-1 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat ${listTypesNoEmpty && "hover:bg-caret-down"}  bg-right-center`;
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
            inputOptionValueError.className = `inputOptionValue041122 value${optionObj.id} w-full h-10 pl-[10px] m-0 mb-1 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  ${listOptionValuesNotEmpty && "hover:bg-caret-down"} bg-right-center`;
        }
        // value duplicate
        setOptionValueMessage(false);
    }

    const removeInputOptionValue = (item) => {
        let index = lisNewOptionValue.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...lisNewOptionValue];
            tmp_arr.splice(index, 1);
            setListNewOptionValue([...tmp_arr]);
        }
    }

    const handleEnterOptionsValue = () => {
        if (lisNewOptionValue.includes(upperFirstLetter(inputOptionValue))) {
            setOptionValueAlreadyExist(true);
            return;
        } else {
            removeErrorMessageOptionValue();
        }

        // remove comma from tmp_optionValues if comma is pressed
        let val = '';
        let ndx = inputOptionValue.indexOf(',');
        if (ndx > -1 && ndx == inputOptionValue.length - 1) {
            val = inputOptionValue.trim().slice(0, -1);
        } else {
            val = inputOptionValue.trim();
        }

        inputOptionValue.length > 0 &&
        setListNewOptionValue([...lisNewOptionValue, val]);
        setInputOptionValue('');
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
                        className="w-8 h-8 bg-indigo-700 rounded-md cursor-pointer"
                        onClick={() => setShowModalCreateOption(false)} />
                </div>


                <div className="w-full flex flex-col justify-start items-start mt-8">
                    <div className="w-full flex flex-row flex-wrap justify-start items-center mt-8">
                        {/* option name */}
                        <div className='w-full flex flex-col justify-start items-start shrink-0 p-0 m-0 mb-5'>
                            <label className='text-gray-500 mb-1'>
                            Nom de l'option
                            </label>
                            <input
                                id="inputOptionName041122"
                                type="text"
                                value={inputOptionName}
                                onChange={handleChangeOptionName}
                                placeholder="Ex. Couleur, Taille, M²,..."
                                autoComplete="off"
                                className={`inputOptionName041122 name${optionObj?.id} w-full h-10 pl-2.5 mr-6 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  bg-right-center `}
                            />
                            {/* affiche les erreurs */}
                            {optionNameAlreadyExist &&
                                <span className='block text-red-700 text-sm pb-1'>Ce nom d'option existe déjà</span>
                            }
                        </div>

                        {/* option value */}
                        <div className='w-full flex flex-col justify-start items-start p-0 m0'>
                            <label className='w-full text-gray-500 mb-1'>Nom de la variante</label>
                            <div className='w-full flex flex-row justify-start items-center shrink-0 h-10 p-0'>
                                <input
                                    id="inputOptionValue041122"
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
                                    placeholder="Ex. Bleu, XXL, 5,..."
                                    autoComplete="off"
                                    className={`inputOptionValue041122 value${optionObj?.id} w-full shrink h-10 pl-2.5 m-0 mr-2 border border-gray-300 rounded-md cursor-text bg-white bg-no-repeat  bg-right-center`}
                                />
                                <button
                                    className="h-10 px-4 flex justify-center items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:font-semibold cursor-pointer"
                                    onClick={handleEnterOptionsValue}>
                                    Valider
                                </button>
                            </div>
                        </div>
                        {/* affiche les erreurs */}
                        {optionValueAlreadyExist &&
                                <span className='block text-red-700 text-sm pb-1'>Cette variante existe déjà</span>
                            }
                    </div>
                </div>

                {/* pastilles */}
                <div className="col-span-3 flex flex-wrap pt-1.5 w-full">
                    {!!lisNewOptionValue?.length > 0 && lisNewOptionValue?.map((item, indx) =>
                        <div
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-[3px] mb-1 mr-2 cursor-move">
                            <span
                                className="h-full text-gray-500 mr-2 rounded-md">
                                {item}
                            </span>
                            <span
                                className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-gray-600  hover:bg-red-500 rounded-md"
                                onClick={() => removeInputOptionValue(item)}>
                                <img src='../images/icons/x-white.svg'
                                    className="w-5 h-5 hover:scale-125" />
                            </span>
                        </div>
                    )}
                </div>


                <div className="w-full flex flex-row justify-start items-center mt-12">

                    <button className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-indigo-600 text-white hover:font-semibold"
                        onClick={saveNewOption}>
                        Enregistrer
                    </button>
                    <button
                        className="w-32 h-12 ml-5 flex justify-center items-center border border-indigo-600 rounded-md bg-white text-gray-600 hover:border-gray-600"
                        onClick={() => setShowModalCreateOption(false)}>
                        Annuler
                    </button>
                </div>


            </section>
        </div>
    );
};

export default ModalCreateOption;