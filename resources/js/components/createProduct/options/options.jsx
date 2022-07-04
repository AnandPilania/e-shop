import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Option from './option';
import OptionVariantesList from './optionVariantesList';
import Axios from "axios";
import Toggle from "../../elements/toggle/toggle";
import ModalconfirmCancelWithoutSapveOptions from './modalconfirmCancelWithoutSapveOptions';


const Options = () => {

    const [listType, setListType] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [showmodalCancelWithoutSapveOptions, setShowmodalCancelWithoutSapveOptions] = useState(false);

    const { optionsObj, setOptionsObj } = useContext(AppContext);


    const confirmCancelWithoutSapveOptions = () => {
        setShowmodalCancelWithoutSapveOptions(false);
        setShowOptions(false);
        setOptionsObj([]);
    }

    const closeModal = () => {
        setShowmodalCancelWithoutSapveOptions(false);
    }


    useEffect(() => {
        // get list of option types
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });

        // setOptionsObj([
        //     ...optionsObj,
        //     {
        //         id: Date.now(),
        //         name: '',
        //         values: []
        //     }
        // ]);
    }, []);


    const addOption = () => {
        setOptionsObj([
            ...optionsObj,
            {
                id: Date.now(),
                name: '',
                values: []
            }
        ]);
    }


    const saveOption = (newOption) => {
        let arr = [...optionsObj];
        let ndx = arr.findIndex(obj => obj.id == newOption.id);
        if (ndx > -1) {
            arr.splice(ndx, 1, newOption);
            setOptionsObj([...arr]);
        } else {
            setOptionsObj([...optionsObj, newOption]);
        }
    }

    const deleteOption = (id) => {
        let arr = [...optionsObj];
        let ndx = arr.findIndex(obj => obj.id == id);
        if (ndx > -1) {
            arr.splice(ndx, 1);
            setOptionsObj([...arr]);
        }
    }

    // const removeOptionValue = (item, optionObj_data) => {
    //     // whatOptionBeenDeleted est utilisé pour mettre à jour checkedVariantesList dans selectionVariantesList
    //     setWhatOptionBeenDeleted({ item: item, data: optionObj_data });

    //     let index = optionsObj.values.indexOf(item);
    //     if (index > -1) {
    //         let tmp_arr = [...optionsObj.values];
    //         tmp_arr.splice(index, 1);
    //         setOptionsObj({ ...optionsObj, values: [...tmp_arr] });
    //     }
    // }

    // show and hide add options
    const handleShowOptions = () => {
        if (showOptions) {
            // on demande confirmation avant d'annuler les options et de perdre tout ce qu'il y a dans les champs 
            if (optionsObj.findIndex(x => x.name.length > 0 || x.values.length > 0) > -1) {
                setShowmodalCancelWithoutSapveOptions(true);
            } else {
                setShowOptions(false);
                setOptionsObj([]);
            }
        } else {
            setOptionsObj([
                ...optionsObj,
                {
                    id: Date.now(),
                    name: '',
                    values: []
                }
            ]);
            setShowOptions(true);
        }

    }
    // console.log('optionsObj  -> ', optionsObj)
    return (
        <div className="w-full">
            <div className='w-full h-auto flex flex-row flex-wrap justify-start items-center mb-5'>
                <Toggle
                    isChecked={showOptions}
                    change={handleShowOptions}
                />
                <label className='m-0 ml-2 p-0'>
                    Ajouter des options. Exemples, "Couleur, taille, poids, ..."
                </label>
            </div>


            {optionsObj.length > 0 &&
                <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_1fr_25px] justify-start items-start pb-[20px]'>
                    <label className='mt-0 mx-0 p-0'>Nom de l'option</label>
                    <label className='mt-0 mx-0 p-0'>Valeur de l'option</label>
                    <label className='mt-0 mx-0 p-0'></label>
                    <div className='w-full border-b border-gray-200 col-span-3'></div>
                </div>
            }

            {optionsObj?.map(item =>
                <Option
                    key={item.id}
                    listType={listType}
                    option_obj={item}
                    saveOption={saveOption}
                    deleteOption={deleteOption}
                    optionsObj={optionsObj}
                // removeOptionValue={removeOptionValue}
                />
            )}

            {optionsObj.length < 4 && showOptions &&
                <div className="w-full h-auto flex flrx-row justify-start items-center mb-[25px]">
                    <button
                        onClick={addOption}
                        className='h-[40px] px-[10px] mt-4 border border-slate-200 '>
                        Ajouter une option
                    </button>
                </div>
            }
            {optionsObj.length === 4 &&
                <span className='text-blue-500 text-sm relative top-[-20px] left-0'>
                    Vous pouvez ajouter jusqu'à 4 options
                </span>
            }

            <OptionVariantesList
                // listType={listType}
                setShowOptions={setShowOptions}
            />

            {/* modal for confirmation */}
            <ModalconfirmCancelWithoutSapveOptions
                show={showmodalCancelWithoutSapveOptions}
                handleModalConfirm={confirmCancelWithoutSapveOptions}
                handleModalCancel={closeModal}
                textButtonConfirm="Confirmer">
                <h2 className="childrenModal">Fermer sans sauvegarder les options</h2>
            </ModalconfirmCancelWithoutSapveOptions>

        </div>
    );
}

export default Options;
