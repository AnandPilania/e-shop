import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Option from './option';
import OptionVariantesList from './optionVariantesList';
import Axios from "axios";


const Options = () => {

    const [listType, setListType] = useState([]);

    const { optionsObj, setOptionsObj } = useContext(AppContext);


    const closelModal = () => {
        setShowModalNotCompleted(false);
    }


    useEffect(() => {
        // get list of option types
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });

        setOptionsObj([
            ...optionsObj,
            {
                id: Date.now(),
                name: '',
                values: []
            }
        ])
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

    const removeOptionValue = (item, optionObj_data) => {
        // whatOptionBeenDeleted est utilisé pour mettre à jour checkedVariantesList dans selectionVariantesList
        setWhatOptionBeenDeleted({item: item, data: optionObj_data});

        let index = optionObj.values.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...optionObj.values];
            tmp_arr.splice(index, 1);
            setOptionObj({ ...optionObj, values: [...tmp_arr] });
        }
    }
  
    return (
        <div className="w-full">

            {optionsObj.length > 0 ?
                <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_1fr_25px] justify-start items-start pb-[20px]'>
                    <label className='mt-0 mx-0 p-0'>Nom de l'option</label>
                    <label className='mt-0 mx-0 p-0'>Valeurs de l'option</label>
                    <label className='mt-0 mx-0 p-0'></label>
                </div> :
                <div className='w-full h-auto justify-start items-center pb-[20px]'>
                    <label className='mt-0 mx-0 p-0'>Définir des variantes lorsque ce produit possède plusieurs options. Ex. Couleur, taille,...</label>
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
                    removeOptionValue={removeOptionValue}
                />
            )}

            {optionsObj.length < 4 &&
                <div className="w-full h-auto flex flrx-row justify-start items-center mb-[25px]">
                    <button
                        onClick={addOption}
                        className='h-[40px] px-[10px] border border-slate-200 '>
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
                listType={listType}
            />

        </div>
    );
}

export default Options;
