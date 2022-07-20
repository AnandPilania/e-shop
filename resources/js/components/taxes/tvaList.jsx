import React from 'react';
import Axios from 'axios';

const TvaList = ({ tvaRateList, cancelEdit, handleName, handleTaxeValue,  taxeName, setTaxeName, taxeValue, setTaxeValue, idEditTva, setIdEditTva, setIsAddNewTva, getTaxes  }) => {


    const handleEditTva = (itemTva) => {
        setTaxeName(itemTva.name);
        setTaxeValue(itemTva.tva_rate);
        setIdEditTva(itemTva.id);
    }

    const handleDeleteTva = (id) => {
        let idTva = new FormData;
        idTva.append('id', id);

        Axios.post(`http://127.0.0.1:8000/deleteTaxes`, idTva)
            .then(getTaxes())
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }


    return (
        <div className='w-full'>
            {tvaRateList?.length > 0 && tvaRateList.map(itemTva =>
                <div
                    key={itemTva.id}
                    className='w-full'
                >
                    {idEditTva != itemTva.id &&
                        <div className='grid grid-cols-[70%_100px_40px_40px] justify-start items-center w-full'>
                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2'
                            >
                                {itemTva.name}
                            </span>
                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2'
                            >
                                {itemTva.tva_rate} %
                            </span>


                            {/* icons ->  edit - delete */}
                            <div
                                className="text-sm w-full border-b border-gray-200 py-3 pl-2"
                            >
                                <span
                                    className="w-6 h-6 flex flex-row justify-center items-center bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setIsAddNewTva(false); 
                                        handleEditTva(itemTva);
                                    }}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/pencil.svg'}
                                        className="h-4 w-4" />
                                </span>
                            </div>
                            <div
                                className="text-sm w-full border-b border-gray-200 py-3 pl-2"
                            >
                                <span
                                    className="w-6 h-6 flex flex-row justify-center items-center bg-red-600 cursor-pointer"
                                    onClick={() => handleDeleteTva(itemTva.id)}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/x-white.svg'}
                                        className="h-5 w-5" />
                                </span>
                            </div>
                        </div>
                    }

                    {/* inputs */}
                    {idEditTva == itemTva.id &&
                        <div className='grid grid-cols-[70%_70px_30px_8px_80px] justify-start items-center w-full'
                        >
                            <input
                                className="w-auto h-full border-x border-b border-gray-200 pl-2.5 bg-[#fafafa] text-sm"
                                id="inputTvaName"
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
                                onClick={() => cancelEdit()}
                            >
                                Annuler
                            </span>
                        </div>
                    }
                </div>
            )}
        </div>
    );
}


export default TvaList;
