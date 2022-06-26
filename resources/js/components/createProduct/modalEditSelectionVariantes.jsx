import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';


const ModalEditSelectionVariantes = ({ handleConfirm, handleModalCancel, show }) => {

    const { productPrice, setProductPrice, previousProductPrice, setPreviousProductPrice, productStock, setProductStock } = useContext(AppContext);



    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-center`}>
            <div className="fixed w-[40%] max-h-[90vh] max-x-[650px] min-x-[350] p-[20px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
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
                    className="classSectionModalImageVariante w-full max-h-[70%] grid grid-cols-4 gap-[10px] justify-center items-center overflow-y-auto scroll-smooth"
                >
                    {/* price */}
                    <input
                        id={item?.id}
                        type="number"
                        step=".01"
                        onChange={handleVariantetPrice}
                        value={item?.price}
                        placeholder="0.00"
                        min="0"
                        max="9999999999"
                        className={`w-full h-[30px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                    />

                    {/* prev_price -- promo -- */}
                    <input
                        id={`inputPrevPrice${item?.id}`}
                        type="number"
                        step=".01"
                        onChange={(e) => handleVariantetPrevPrice(e, item)}
                        value={item?.prev_price}
                        placeholder="0.00"
                        min="0"
                        max="9999999999"
                        className={`w-full h-[30px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                    />

                    {/* stock */}
                    <div
                        className='flex flex-rox justify-start items-center'
                    >
                        <input
                            type="number"
                            id={`inputStock${item?.id}`}
                            onChange={(e) => handleProductStock2(e, item)}
                            value={item?.stock}
                            placeholder={item.placeholderStock}
                            min="0" max="9999999999"
                            onClick={(() => handleProductStockOnFocus2(item))}
                            className={`w-[100px] h-[30px] border border-gray-300 rounded-l-md pl-[8px] text-[13px] leading-6 ${(item?.stock != '' || !item?.unlimited) ? "bg-gray-50" : "bg-white"} ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                        />
                        <span
                            className={`flex flex-rox justify-start items-center h-[30px] border-y-[1px] border-r-[1px]   border-gray-300 rounded-r-md px-[10px] cursor-pointer caret-transparent group relative  ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                            onClick={() => handleUnlimitedStock2(item)}>
                            <input
                                className='mr-[7px] caret-transparent'
                                id={`unlimitedStockCheckbox${item?.id}`}
                                type="checkbox"
                                checked={item?.stock != '' ? false : item?.unlimited}
                                // pour pas avoir de warning "input checkbox non controlé"
                                onChange={() => { }}
                            />
                            <label
                                className='cursor-pointer caret-transparent text-[20px] '>
                                {String.fromCharCode(0x221E)}
                                <Tooltip top={-100} left={2} css='whitespace-nowrap'>
                                    {item?.unlimited ? 'Stock illimité' : 'Entrer une quantité'}
                                </Tooltip>
                            </label>
                        </span>
                    </div>
                </section>

                <div className="w-full flex flex-row justify-center items-center">
                    <button
                        className={`flex flrex-row justify-center items-center h-[40px] px-[20px] ${selectedImage == null ? "bg-gray-100 text-gray-400" : "bg-green-500 text-white"}`}
                        onClick={() => {
                            selectedImage != null &&
                                handleConfirm(selectedImage);
                            cancelSelection();
                        }}
                    >
                        Enregister
                    </button>

                    <button
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px] ml-[15px] border border-gray-300"
                        onClick={() => {
                            removeImageFroTemprayStorage();
                            cancelSelection();
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
