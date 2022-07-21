import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';

const TvaList = ({ tvaRateList, cancelEdit, handleName, handleTaxeValue, taxeName, setTaxeName, taxeValue, setTaxeValue, idEditTva, setIdEditTva, setIsAddNewTva, getTaxes, setIsShowSaveButton, defaultTvaRateId }) => {

    const [showModalConfirmTvaList, setShowModalConfirmTvaList] = useState(false);
    const [messageModalTvaList, setMessageModalTvaList] = useState('');
    const [tmp_idtva_to_delete, setTmp_idtva_to_delete] = useState('');



    // initialise le button radio du taux de tva par default
    useEffect(() => {
        initDefaultRadioButton();
    }, [defaultTvaRateId]);

    // initialise le button radio du taux de tva par default quand on edit et qu'on annule
    useEffect(() => {
        idEditTva == null && initDefaultRadioButton();
    }, [idEditTva]);
    

    const initDefaultRadioButton = () => { 
        let radioToCheck = document.getElementById("idInputDefaultTvaRate" + defaultTvaRateId);
        if (defaultTvaRateId != '' && defaultTvaRateId != undefined && defaultTvaRateId != null) {
            radioToCheck.checked = true;
        }
    }

    const handleEditTva = (itemTva) => {
        setTaxeName(itemTva.name);
        setTaxeValue(itemTva.tva_rate);
        setIdEditTva(itemTva.id);
    }

    const showModalConfirmDeleteTvaList = (itemTva) => {
        setMessageModalTvaList('Supprimer ' + itemTva.name + ' ' + itemTva.tva_rate + '% ?');
        setTmp_idtva_to_delete(itemTva.id);
        setShowModalConfirmTvaList(true);
    }

    const handleModalCancelTvaList = () => {
        setShowModalConfirmTvaList(false);
    }

    const handleDeleteTva = () => {
        let idTva = new FormData;
        idTva.append('id', tmp_idtva_to_delete);

        Axios.post(`http://127.0.0.1:8000/deleteTaxes`, idTva)
            .then(() => {
                getTaxes();
                setTmp_idtva_to_delete('');
                setMessageModalTvaList('');
                setShowModalConfirmTvaList(false);
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }

    const updateTva = (id) => {
        let tvaToUpdate = new FormData;
        tvaToUpdate.append('id', id);
        tvaToUpdate.append('taxeName', taxeName);
        tvaToUpdate.append('taxeValue', taxeValue);

        Axios.post(`http://127.0.0.1:8000/updateTaxes`, tvaToUpdate)
            .then(() => {
                getTaxes();
                initDefaultRadioButton();
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }

    const handleDefaultTvaRate = (id) => {
        let tvaToUpdate = new FormData;
        tvaToUpdate.append('id', id);

        Axios.post(`http://127.0.0.1:8000/updateTvaRate`, tvaToUpdate)
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
                        <div className='grid grid-cols-[80px_70%_100px_40px_40px] justify-start items-center w-full'>
                            <span
                                className='flex justify-center items-center w-full h-full'>
                                <input
                                    id={`idInputDefaultTvaRate${itemTva.id}`}
                                    type='radio'
                                    className='w-4 h-4 cursor-pointer checked:bg-indigo-600'
                                    name='btnRadioDefaultTvaRate'
                                    onClick={() => handleDefaultTvaRate(itemTva.id)}
                                />
                            </span>

                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2 truncate'
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
                                    className="w-6 h-6 flex flex-row justify-center items-center bg-white cursor-pointer"
                                    onClick={() => {
                                        setIsAddNewTva(false);
                                        setIsShowSaveButton(false);
                                        handleEditTva(itemTva);
                                    }}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/pencil.svg'}
                                        className="h-4 w-4" />
                                </span>
                            </div>
                            <div
                                className="text-sm w-full border-b border-gray-200 py-3 pl-1"
                            >
                                <span
                                    className="w-6 h-6 flex flex-row justify-center items-center bg-red-600 cursor-pointer"
                                    onClick={() => showModalConfirmDeleteTvaList(itemTva)}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/x-white.svg'}
                                        className="h-5 w-5" />
                                </span>
                            </div>
                        </div>
                    }

                    {/* edit */}
                    {idEditTva == itemTva.id &&
                        <div className='grid grid-cols-[80px_70%_70px_30px_8px_80px] gap-x-[1px] justify-start items-center w-full pb-2'
                        >
                            <input
                                className="w-auto h-full border-x border-b border-gray-300 pl-2.5 bg-white text-sm col-span-2"
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
                                className="w-auto h-full border border-gray-300 pl-2.5 bg-white text-sm"
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
                                className='text-base w-20 text-red-400 underline underline-offset-1
                                    hover:text-red-600 py-3 pl-2 cursor-pointer'
                                onClick={() => {
                                    cancelEdit();
                                }}
                            >
                                Annuler
                            </span>



                            <button
                                className='flex justify-center w-24 py-1 px-2 mt-1  bg-green-500 text-white font-medium text-sm rounded-md'
                                onClick={() => {
                                    updateTva(itemTva.id);
                                    cancelEdit();
                                }}
                            >
                                Enregistrer
                            </button>
                        </div>
                    }
                </div>
            )}
            <ModalConfirmation
                show={showModalConfirmTvaList}
                handleModalConfirm={handleDeleteTva}
                handleModalCancel={handleModalCancelTvaList}
            >
                <h2>{messageModalTvaList}</h2>
            </ModalConfirmation>

        </div>
    );
}


export default TvaList;
