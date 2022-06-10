import React, { useState, useEffect } from 'react';
import Option from './option';
import Axios from "axios";

const Options = () => {

    const [listType, setListType] = useState([]);
    const [optionsObj, setOptionsObj] = useState([]);


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
                id: 0,
                name: '',
                values: []
            }
        ])
    }, []);


    const addOption = () => {
        let bigId = 0;
        if (optionsObj.length > 0) {
            bigId = optionsObj.reduce((acc, curr) => {
                return (acc.id > curr.id) ? acc : curr;
            });
        }

        setOptionsObj([
            ...optionsObj,
            {
                id: bigId.id + 1,
                name: '',
                values: []
            }
        ])

    }
    console.log('optionsObj  ', optionsObj)
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
        console.log('id  ', id)
        let arr = [...optionsObj];
        let ndx = arr.findIndex(obj => obj.id == id);
        if (ndx > -1) {
            arr.splice(ndx, 1);
            setOptionsObj([...arr]);
        }
    }


    return (
        <div className="w-full">

            {optionsObj?.map((item, index) =>
                <Option
                    key={index}
                    listType={listType}
                    option_obj={item}
                    saveOption={saveOption}
                    deleteOption={deleteOption}
                />
            )}

            <button
                onClick={addOption}
                className='h-[40px] px-[10px] border border-slate-200 '>
                Ajouter une option
            </button>

        </div>
    );
}

export default Options;
