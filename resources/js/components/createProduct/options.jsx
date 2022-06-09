import React, { useState, useEffect } from 'react';
import Option from './option';
import Axios from "axios";

const Options = () => {

    const [listType, setListType] = useState([]);
    const [optionsObj, setOptionsObj] = useState([
        {
            option: '',
            values: []
        }
    ]);

    useEffect(() => {
        // get list of option types
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    const addOption = (newOption) => {
        setOptionsObj([...optionsObj, newOption])
    }

    return (
        <div className="w-full">

            {!!optionsObj && optionsObj.map(item => {
                <div className='w-full'>
                    <Option
                        listType={listType}
                        optionObj={item}
                        addOption={addOption}
                    />
                    <button className='h-[40px] px-[10px] border border-slate-200 '>
                        Supprimer
                    </button>
                </div>
            })
            }

            <button
                onClick={addOption}
                className='h-[40px] px-[10px] border border-slate-200 '>
                Ajouter une option
            </button>

        </div>
    );
}

export default Options;
