import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { upperFirstLetter } from '../../functions/upperFirstLetter';
import Axios from 'axios';

const ModalCreateOption = ({ show, handleModalConfirm, handleModalCancel, textButtonConfirm, setShowModalCreateOption }) => {

    const [inputOptionName, setInputOptionName] = useState('');
    const [inputOptionValue, setInputOptionValue] = useState('');
    const [lisNewOptionValue, setListNewOptionValue] = useState([]);
    const [optionValueAlreadyExist, setOptionValueAlreadyExist] = useState(false);
    const [optionNameAlreadyExist, setOptionNameAlreadyExist] = useState(false);
    const [showResetButton, setShowResetButton] = useState(false);
    const [newOption, setNewOption] = useState(true);
    const [optionTabActive, setOptionTabActive] = useState(1);
    const [optionsNamesValuesList, setOptionsNamesValuesList] = useState([]);
    const [listIdOptionName, setListIdOptionName] = useState([]);
    const [optionNameId, setOptionNameId] = useState(null);
    const [titleHandleOption, setTitleHandleOption] = useState('Gérer les options');

    const { optionObj, setOptionObj, setListType, showOptions, setShowOptions } = useContext(AppContext);

    useEffect(() => {
        getOptionsNamesValuesList();
    }, []);

    const getOptionsNamesValuesList = () => {
        Axios.get(`http://127.0.0.1:8000/getOptionsNamesValuesList`)
            .then(res => {
                if (res) {
                    setOptionsNamesValuesList(res.data);
                    console.log('res.data  ', res.data);
                }
            })
            .catch((error) => console.log('error: ', error));
    }

    // handle option name change
    const handleChangeOptionName = (e) => {
        if (e.target != undefined) {
            setInputOptionName(upperFirstLetter(e.target.value));
            removeErrorMessageOptionName();
        }
        setShowResetButton(e.target.value.length > 0 ? true : false);
    };

    const handleChangeOptionValues = (e) => {
        setInputOptionValue(upperFirstLetter(e.target.value));
        removeErrorMessageOptionValue();
    };

    const removeErrorMessageOptionName = () => {
        // input option name
        let spanMessageName = document.getElementById(`inputOptionName041122`);
        spanMessageName.innerHTML = '';
        let inputOptionError = document.getElementsByClassName(`inputOptionName041122`)[0];
        if (inputOptionError !== undefined) {
            inputOptionError.className = `inputOptionName041122 w-full h-10 pl-[10px] m-0 border border-gray-300 rounded-md cursor-text bg-white`;
        }
        // value duplicate
        setOptionNameAlreadyExist(false);
    }

    const removeErrorMessageOptionValue = () => {
        // input option Value
        let spanMessageValue = document.getElementById(`inputOptionValue041122`);
        spanMessageValue.innerHTML = '';
        let inputOptionValueError = document.getElementsByClassName(`inputOptionValue041122`)[0];
        if (inputOptionValueError !== undefined) {
            inputOptionValueError.className = `inputOptionValue041122 w-full h-10 pl-[10px] m-0 mr-4 border border-gray-300 rounded-md cursor-text bg-white`;
        }
        // value duplicate
        setOptionValueAlreadyExist(false);
    }

    const removeInputOptionValue = (item) => {
        let index = lisNewOptionValue.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...lisNewOptionValue];
            tmp_arr.splice(index, 1);
            setListNewOptionValue([...tmp_arr]);
        }
        // lisNewOptionValue.length > 1 pcq listNewOptionValue est toujours = à 1 au moment où on arrive ici, même si on a delete toutes les pastilles
        setShowResetButton(lisNewOptionValue.length > 1 || inputOptionName.length > 0 ? true : false);
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

        lisNewOptionValue.length > 0 || val.length > 0 && 
        setShowResetButton(true);
    }

    const saveNewOption = () => {
        let form_Data = new FormData;
        form_Data.append('name', inputOptionName);
        form_Data.append('idOptionName', optionNameId);
        form_Data.append('values', JSON.stringify(lisNewOptionValue));

        Axios.post(`http://127.0.0.1:8000/saveOptionVariante`, form_Data)
            .then(res => {
                setListType(res.data);
            })
            .catch((error) => console.log('error: ', error));

        setOptionNameId(null);
        initModalCreateOption();
        setShowModalCreateOption(false);
        getOptionsNamesValuesList();
    }


    const updateOption = (idOptionName) => {
        Axios.get(`http://127.0.0.1:8000/getOneOptionWithHerValues/${idOptionName}`)
            .then(res => {
                console.log('res.data  ', res.data)
                setInputOptionName(res.data.name);
                setListNewOptionValue(res.data.options_values.map(x => x.name));
                setShowResetButton(true);
            })
            .catch((error) => console.log('error: ', error));
        setOptionTabActive(1);
        setOptionNameId(idOptionName);
        setTitleHandleOption('Revenir à la liste')
    }


    const deleteOptionNameAndHerOptionsValues = (idOptionName) => {
        Axios.get(`http://127.0.0.1:8000/deleteOptionNameAndHerOptionsValues/${idOptionName}`)
            .then(res => {
                setOptionsNamesValuesList(res.data[0]);
                setListType(res.data[1]);
            })
            .catch((error) => console.log('error: ', error));
    }

    const handleOptionTabActive = (tabNum) => {
        setOptionTabActive(tabNum);
        setNewOption(tabNum == 1 ? true : false);
        // ferme la liste des values dans gerer les options
        setListIdOptionName([]);

        if (tabNum == 1) {
            initModalCreateOption();
        }
        if (tabNum == 2) {
            setTitleHandleOption('Gérer les options')
        }
    }

    const resetInputs = () => {
        initModalCreateOption();
    }

    const handleShowListOptionValues = (idOptionName) => {
        let tmp = [...listIdOptionName];
        if (tmp.includes(idOptionName)) {
            tmp = tmp.filter(x => x != idOptionName);
        } else {
            tmp.push(idOptionName);
        }
        setListIdOptionName(tmp);
    }

    const handleCancelShowModalCreateOption = () => {
        initModalCreateOption();
        setShowModalCreateOption(false);
    }

    const initModalCreateOption = () => {
        setInputOptionName('');
        setInputOptionValue('');
        setListNewOptionValue([]);
        setNewOption(1);
        setShowResetButton(false);
        removeErrorMessageOptionValue();
    }


    console.log('optionsNamesValuesList  ', optionsNamesValuesList)
    return (
        <div
            className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-full flex flex-col justify-start items-center`}>
            <section
                className="fixed sm:w-full sm:h-hauto md:w-[572px] md:min-h-[425px] pb-8 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50">
                <div
                    className="w-full flex flex-row justify-start items-start bg-gray-50 rounded-t-md">
                    <button
                        className={`w-1/2 h-16 px-4 flex justify-center items-center shrink-0 bg-white text-gray-600 cursor-pointer rounded-tl-md ${newOption ? "font-semibold border-r rounded-t-xl border-gray-300" : "border-b bg-gray-50"}`}
                        onClick={() => handleOptionTabActive(1)}>
                        Ajouter une option
                    </button>
                    <button
                        className={`w-1/2 h-16 px-4 flex justify-center items-center shronk-0 bg-white text-gray-600 cursor-pointer rounded-tr-md ${!newOption ? "font-semibold border-l rounded-t-xl border-gray-300" : "border-b bg-gray-50"}`}
                        onClick={() => handleOptionTabActive(2)}>
                        {titleHandleOption}
                    </button>
                </div>

                {/* add option */}
                {optionTabActive == 1 &&
                    <div className='w-full'>
                        <div className='w-full px-8 flex flex-col justify-start items-start'>
                            <div className="w-full flex flex-col justify-start items-start">
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
                                            className={`inputOptionName041122 w-full h-10 pl-2.5 border border-gray-300 rounded-md cursor-text bg-white`}
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
                                                className={`inputOptionValue041122 w-full shrink h-10 pl-2.5 m-0 mr-4 border border-gray-300 rounded-md cursor-text bg-white`}
                                            />
                                            <button
                                                className="h-10 px-4 flex justify-center items-center border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-600 cursor-pointer"
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
                        </div>

                        {/* pastilles */}
                        <div className="col-span-3 flex flex-wrap pt-2.5 px-8 w-full">
                            {!!lisNewOptionValue?.length > 0 && lisNewOptionValue?.map((item, index) =>
                                <div
                                    key={index}
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
                    </div>}

                {/* handle options */}
                {optionTabActive == 2 &&
                    <div className='w-full mt-10 max-h-[300px] overflow-y-auto flex flex-col justify-start items-center'>
                        {optionsNamesValuesList.length > 0 &&
                            optionsNamesValuesList.map((optionName, ndx) =>
                                <div
                                    key={ndx}
                                    className="w-[88%] flex flex-col justify-start items-center"
                                >
                                    <div className='w-full flex flex-row justify-start items-center flex-nowrap border-b border-gray-300 hover:bg-gray-50'>
                                        <span
                                            className='w-4/5 h-12 pl- flex justify-start items-center font-semibold'>
                                            {optionName.name}
                                        </span>
                                        {listIdOptionName.includes(optionName.id) ?
                                            <img
                                                src={window.location.origin + '/images/icons/eye-slash.svg'}
                                                className="h-5 w-5 mr-4  cursor-pointer"
                                                onClick={() => handleShowListOptionValues(optionName.id)}
                                            />
                                            :
                                            <img
                                                src={window.location.origin + '/images/icons/eye.svg'}
                                                className="h-5 w-5 mr-4  cursor-pointer"
                                                onClick={() => handleShowListOptionValues(optionName.id)}
                                            />
                                        }
                                        <img
                                            src={window.location.origin + '/images/icons/pencil.svg'}
                                            className="h-5 w-5 mr-4 cursor-pointer"
                                            onClick={() => updateOption(optionName.id)}
                                        />
                                        <img
                                            src={window.location.origin + '/images/icons/trash.svg'}
                                            className="h-5 w-5 cursor-pointer"
                                            onClick={() => deleteOptionNameAndHerOptionsValues(optionName.id)}
                                        />
                                    </div>

                                    {listIdOptionName.includes(optionName.id) &&
                                        <div
                                            className='w-full flex flex-col justify-start items-start last:border-none'
                                        >
                                            {optionName?.options_values?.length > 0 &&
                                                optionName.options_values.map((value, indx) =>
                                                    <div
                                                        key={indx}
                                                        className='w-full h-10 flex flex-row justify-start items-center flex-nowrap border-b border-gray-100 hover:bg-gray-50 cursor-row-resize'>
                                                        <span className='w-4/5 h-10 pl-5 flex justify-start items-center'>
                                                            {value.name}
                                                        </span>
                                                    </div>)}
                                        </div>
                                    }
                                </div>
                            )}
                    </div>}

                {/* save - cancel */}
                <div className="w-full px-8 flex flex-row justify-start items-center mt-12">
                    <button className="w-32 h-12 flex justify-center items-center rounded-md bg-indigo-600 text-white hover:bg-indigo-800"
                        onClick={saveNewOption}>
                        Enregistrer
                    </button>
                    <button
                        className="w-32 h-12 ml-5 flex justify-center items-center border border-gray-300 rounded-md bg-white text-gray-600 hover:border-gray-600"
                        onClick={() => handleCancelShowModalCreateOption()}>
                        Fermer
                    </button>
                    {showResetButton &&
                        <button
                            className="w-32 h-12 ml-5 flex justify-center items-center border border-gray-300 rounded-md bg-white text-gray-600 hover:border-gray-600"
                            onClick={() => resetInputs()}>
                            Reset
                        </button>}
                </div>
            </section>
        </div>
    );
};

export default ModalCreateOption;