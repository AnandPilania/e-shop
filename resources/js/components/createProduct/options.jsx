import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Option from './option';
import OptionVariantesList from './optionVariantesList';
import Axios from "axios";
import ModalSimpleMessage from '../modal/modalSimpleMessage';


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
 
    return (
        <div className="w-full">

            {optionsObj.length > 0 ?
                <div className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_1fr_40px] justify-start items-start pb-[20px]'>
                    <label className='mt-0 mx-0 p-0'>Option</label>
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
                />
            )}

            {optionsObj.length < 4 &&
                <div className='h-[120px] flex flrx-row justify-start items-center border-t border-slate-200  '>
                    <button
                        onClick={addOption}
                        className='h-[40px] px-[10px] border border-slate-200 '>
                        Ajouter une option
                    </button>
                </div>
            }
            {optionsObj.length === 4 &&
                <span className='text-slate-500 text-sm'>
                    Vous pouvez ajouter jusqu'à 4 options
                </span>
            }

            <OptionVariantesList />
            

            {/* modal for simple message */}
            {/* <ModalSimpleMessage
                show={showModalNotCompleted}  
                handleModalCancel={closelModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage> */}
        </div>
    );
}

export default Options;
