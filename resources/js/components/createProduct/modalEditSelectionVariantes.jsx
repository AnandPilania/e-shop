import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';


const ModalEditSelectionVariantes = ({ handleModalCancel, show }) => {

    const [productPriceModal, setProductPriceModal] = useState('');
    const [previousProductPriceModal, setPreviousProductPriceModal] = useState('');
    const [productStockModal, setProductStockModal] = useState('');

    // const placeholder_price = 'Ajouter un prix';
    const placeholder_promo = 'Ajouter un prix avant promo';
    const placeholder_stock = 'Ajouter une quantité';

    const { variantes, setVariantes, checkedVariantesList } = useContext(AppContext);

    const handleChangeProductPriceModal = (e) => {
        setProductPriceModal(e.target.value);
    }

    const handleChangePreviousProductPriceModal = (e) => {
        setPreviousProductPriceModal(e.target.value);
    }

    const handleChangeProductStockModal = (e) => {
        setProductStockModal(e.target.value);
    }

    // affecte les nouvelles valeurs aux champs concernés des variantes sélectionnées
    const saveChanges = () => {
        let temp_variantes = [...variantes];
        if (checkedVariantesList.length > 0) {
            for (let i = 0; i < temp_variantes.length; i++) {
                if (checkedVariantesList.indexOf(temp_variantes[i].id) > -1) {
                    temp_variantes[i].price = productPriceModal;
                    temp_variantes[i].prev_price = previousProductPriceModal;
                    temp_variantes[i].stock = productStockModal;
                }
            }
            setVariantes([...temp_variantes]);
            setProductPriceModal('');
            setPreviousProductPriceModal('');
            setProductStockModal('');
        }
        handleModalCancel();
    }


    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-start`}>
            <div className="fixed w-[40%] max-x-[650px] min-x-[350] p-[20px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
            >
                <div className='w-full flex flex-row justify-between mb-[20px]'>
                    <h3 className='h-[30px] ml-[10px] font-semibold text-lg'>
                        Modifier la sélection
                    </h3>
                    <span
                        onClick={handleModalCancel}
                        className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer bg-red-500 rounded-[5px]'>
                        <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[20px] w-[20px]" />
                    </span>
                </div>

                <section
                    className="w-full h-auto mb-[50px] mt-[30px] grid grid-cols-3 gap-4 justify-start items-start flex-wrap"
                >
                    {/* price */}
                    <div className="w-full flex flex-col mr-4">
                        <label className='font-semibold'>Prix</label>
                        <input
                            type="number"
                            step=".01"
                            value={productPriceModal}
                            onChange={handleChangeProductPriceModal}
                            placeholder="Ajouter un prix"
                            min="0"
                            max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>

                    {/* prev_price -- promo -- */}
                    <div className="w-full flex flex-col mr-4">
                        <label className='font-semibold'>Prix avant promo</label>
                        <input
                            type="number"
                            step=".01"
                            onChange={handleChangePreviousProductPriceModal}
                            value={previousProductPriceModal}
                            placeholder={placeholder_promo}
                            min="0"
                            max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>

                    {/* stock */}
                    <div className="w-full flex flex-col">
                        <label className='font-semibold'>Stock</label>
                        <input
                            type="number"
                            onChange={handleChangeProductStockModal}
                            value={productStockModal}
                            placeholder={placeholder_stock}
                            min="0" max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>
                </section>

                <div className="w-full flex flex-row justify-start items-center">
                    <button
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px] bg-green-500 text-white"
                        onClick={saveChanges}
                    >
                        Enregister
                    </button>

                    <button
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px] ml-[15px] border border-gray-300"
                        onClick={() => {
                            handleModalCancel();
                        }}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalEditSelectionVariantes;
