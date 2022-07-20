import React from 'react';


const AddNewTva = ({ cancelEdit, handleName, handleTaxeValue, taxeName, taxeValue, isAddNewTva, setIsAddNewTva, setIsShowSaveButton }) => {


    return (
        <div className='w-full'>
            {isAddNewTva &&
                <div className='grid grid-cols-[70%_70px_30px_8px_80px] justify-start items-center w-full mt-10'
                >
                    <input
                        className="w-auto h-full border-x border-b border-gray-200 pl-2.5 bg-[#fafafa] text-sm"
                        type="text"
                        onChange={handleName}
                        value={taxeName}
                        placeholder="Exemple. TVA à taux réduit -> 6%"
                        autoFocus
                    />
                    <input
                        type="number"
                        step={0.01}
                        onChange={handleTaxeValue}
                        value={taxeValue}
                        className="w-auto h-full border border-gray-200 rounded-l-md pl-2.5 bg-[#fafafa] text-sm"
                        min="0" max="9999999999"
                        placeholder="-"
                    />
                    <span
                        className="w-8 h-full px-3 border-y border-r border-gray-200 rounded-r-md bg-gray-50 text-sm flex justify-center items-center"
                    >
                        %
                    </span>
                    <span></span>
                    <span
                        className='text-base w-20 text-blue-400 underline underline-offset-1
                                    hover:text-blue-600 py-3 pl-2 cursor-pointer'
                        onClick={() => {
                            setIsAddNewTva(false);
                            setIsShowSaveButton(false);;
                        }}
                    >
                        Annuler
                    </span>
                </div>
            }


            <div className='flex flex-row justify-start items-center w-full pt-10 pb-5'
            >
                {/* add new tva button */}
                {!isAddNewTva &&
                    <div className='flex flex-row justify-start items-center'
                    >
                        <span
                            className='text-base text-blue-400 underline underline-offset-1 cursor-pointer hover:text-blue-600'
                            onClick={() => {
                                cancelEdit();
                                setIsAddNewTva(true);
                                setIsShowSaveButton(true);
                            }}
                        >
                            Ajouter un nouveau taux de tva
                        </span>
                    </div>
                }
            </div>
        </div>
    );
}

export default AddNewTva;
