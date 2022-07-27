import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';

const TransportersList = ({ listTransporters, setListTransporters, cancelEdit, handleName, handleTaxeValue, taxeName, setTaxeName, taxeValue, setTaxeValue, idEditTransporter, setIdEditTva, setIsAddNewTva, getTaxes, setIsShowSaveButton, defaultTransporterId }) => {

    const [showModalConfirmTvaList, setShowModalConfirmTvaList] = useState(false);
    const [messageModalTransporterList, setMessageModalTransporterList] = useState('');
    const [tmp_idtransporter_to_delete, setTmp_idtransporter_to_delete] = useState('');

    useEffect(() => {
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
        .then(res => {
            setListTransporters(res.data);
        })
        .catch(error => {
            console.log('Error : ' + error.status);
        });
    })

    // initialise le button radio du taux de tva par default
    useEffect(() => {
        initDefaultRadioButton();
    }, [defaultTransporterId]);

    // initialise le button radio du taux de tva par default quand on edit et qu'on annule
    useEffect(() => {
        idEditTransporter == null && initDefaultRadioButton();
    }, [idEditTransporter]);
    

    const initDefaultRadioButton = () => { 
        let radioToCheck = document.getElementById("idInputDefaultTransporter" + defaultTransporterId);
        if (defaultTransporterId != '' && defaultTransporterId != undefined && defaultTransporterId != null) {
            radioToCheck.checked = true;
        }
    }

    const handleEditTransporter = (itemTransporter) => {
        setTaxeName(itemTransporter.name);
        setTaxeValue(itemTransporter.tva_rate);
        setIdEditTva(itemTransporter.id);
    }

    const showModalConfirmDeleteTvaList = (itemTransporter) => {
        setMessageModalTransporterList('Supprimer ' + itemTransporter.name + ' ' + itemTransporter.tva_rate + '% ?');
        setTmp_idtransporter_to_delete(itemTransporter.id);
        setShowModalConfirmTvaList(true);
    }

    const handleModalCancelTvaList = () => {
        setShowModalConfirmTvaList(false);
    }

    const handleDeleteTransporter = () => {
        let idTva = new FormData;
        idTva.append('id', tmp_idtransporter_to_delete);

        Axios.post(`http://127.0.0.1:8000/deleteTaxes`, idTva)
            .then(() => {
                getTaxes();
                setTmp_idtransporter_to_delete('');
                setMessageModalTransporterList('');
                setShowModalConfirmTvaList(false);
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }

    const updateTransporter = (id) => {
        let transporterToUpdate = new FormData;
        transporterToUpdate.append('id', id);
        transporterToUpdate.append('taxeName', taxeName);
        transporterToUpdate.append('taxeValue', taxeValue);

        Axios.post(`http://127.0.0.1:8000/updateTaxes`, transporterToUpdate)
            .then(() => {
                getTaxes();
                initDefaultRadioButton();
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }

    const handleDefaultTransporter = (id) => {
        let transporterToUpdate = new FormData;
        transporterToUpdate.append('id', id);

        Axios.post(`http://127.0.0.1:8000/updateTvaRate`, transporterToUpdate)
            .then(getTaxes())
            .catch(error => {
                console.log('Error : ' + error.status);
            });
    }



    return (
        <div className='w-full'>
            {listTransporters?.length > 0 && listTransporters.map(itemTransporter =>
                <div
                    key={itemTransporter.id}
                    className='w-full'
                >
                    {idEditTransporter != itemTransporter.id &&
                        <div className='grid grid-cols-[80px_70%_100px_40px_40px] justify-start items-center w-full'>
                            <span
                                className='flex justify-center items-center w-full h-full'>
                                <input
                                    id={`idInputDefaultTransporter${itemTransporter.id}`}
                                    type='radio'
                                    className='w-4 h-4 cursor-pointer checked:bg-indigo-600'
                                    name='btnRadioDefaultTvaRate'
                                    onClick={() => handleDefaultTransporter(itemTransporter.id)}
                                />
                            </span>

                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2 truncate'
                            >
                                {itemTransporter.name}
                            </span>
                            <span
                                className='text-sm w-full border-b border-gray-200 py-3 pl-2'
                            >
                                {itemTransporter.tva_rate} %
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
                                        handleEditTransporter(itemTransporter);
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
                                    onClick={() => showModalConfirmDeleteTvaList(itemTransporter)}
                                >
                                    <img
                                        src={window.location.origin + '/images/icons/x-white.svg'}
                                        className="h-5 w-5" />
                                </span>
                            </div>
                        </div>
                    }

                    {/* edit */}
                    {idEditTransporter == itemTransporter.id &&
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
                                    updateTransporter(itemTransporter.id);
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
                handleModalConfirm={handleDeleteTransporter}
                handleModalCancel={handleModalCancelTvaList}
            >
                <h2>{messageModalTransporterList}</h2>
            </ModalConfirmation>

        </div>
    );
}


export default TransportersList;
