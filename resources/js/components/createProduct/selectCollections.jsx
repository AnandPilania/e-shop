import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';


export default function SelectCollections({ collectionsRelations }) {

    const { collection, setCollection } = useContext(AppContext);

    const handleChange = (name) => {
        let index = collection.indexOf(name);
        if (index > -1) {
            let tmp_arr = [...collection];
            tmp_arr.splice(index, 1);
            setCollection([...tmp_arr]);
        } else {
            setCollection([...collection, name]);
        }
    };

    let toggleSelectWithCheckbox;
    const showDropDown = () => {
        let ul = document.querySelector('#ulSelectWithCheckbox');
        if (!toggleSelectWithCheckbox) {
            ul.style.height = '240px';
            ul.classList.add('border-b');
            toggleSelectWithCheckbox = true;
        } else {
            ul.style.height = 0;
            ul.classList.remove('border-b');
            toggleSelectWithCheckbox = false;
        }
    }

    // permet la fermeture du popover quand on clique n'importe où en dehors du popover
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '-5px',
        zIndex: '-10',
        cursor: 'default',
    }

    return (
        <div className="w-full relative">
            <div style={cover} onClick={showDropDown} /> 
            <button
                className='flex justify-between items-center pl-[17px] w-full h-[40px] text-stone-800 text-base hover:cursor-pointer border border-gray-300'
                onClick={() => showDropDown()}
            >
                Choisir une(des) collection(s)
                <img src='../images/icons/caret-down.svg' className='mr-[17px]' />
            </button>
            <ul
                id='ulSelectWithCheckbox'
                className="absolute top-[40px] left-0 w-full h-0 bg-white mb-[15px] transition duration-500 ease-in-out overflow-x-hidden overflow-y-scroll z-10 border-gray-300 border-l border-r">
                {
                    collectionsRelations.length > 0 && collectionsRelations.map(item =>
                        <li key={item.id} className="flex items-center pl-[17px] w-full h-[40px] border-gray-300 border-b">
                            <input type='checkbox'
                                value={item.id}
                                id={item.id}
                                checked={collection.indexOf(item.name) > -1} onChange={() => handleChange(item.name)}
                                className="w-[17px] h-[17px] mr-[17px] hover:cursor-pointer" />
                            <label htmlFor={item.id}
                                className="text-stone-800 text-base hover:cursor-pointer">
                                {item.name}
                            </label>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

