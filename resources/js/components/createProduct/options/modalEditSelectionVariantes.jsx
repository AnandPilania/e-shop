import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';


const ModalEditSelectionVariantes = ({ handleModalCancel, show }) => {

    const [productPriceModal, setProductPriceModal] = useState('');
    const [reducedProductPriceModal, setReducedProductPriceModal] = useState('');
    const [productStockModal, setProductStockModal] = useState('');
    const [costModal, setCostModal] = useState('');
    const [SKUModal, setSKUModal] = useState('');
    const [parcelWeightModal, setParcelWeightModal] = useState('');
    const [conservNotModifiedFieldsCheckbox, setConservNotModifiedFieldsCheckbox] = useState(true);

    // const placeholder_price = 'Ajouter un prix';
    const placeholder_promo = 'Ajouter un prix avant promo';
    const placeholder_stock = 'Ajouter une quantité';

    const { variantes, setVariantes, checkedVariantesList, setCheckedVariantesList, setSelectedVariantesList, setAllOptionsVariantesNeeded, changedVariantes, setChangedVariantes } = useContext(AppContext);

    const handleChangeProductPriceModal = (e) => {
        setProductPriceModal(e.target.value);
    }

    const handleChangeReducedProductPriceModal = (e) => {
        setReducedProductPriceModal(e.target.value);
    }

    const handleChangeProductStockModal = (e) => {
        setProductStockModal(e.target.value);
    }

    const handleChangeCostModal = (e) => {
        setCostModal(e.target.value);
    }

    const handleChangeSKUModal = (e) => {
        setSKUModal(e.target.value);
    }

    const handleChangeParcelWeightModal = (e) => {
        setParcelWeightModal(e.target.value);
    }

    // affecte les nouvelles valeurs aux champs concernés des variantes sélectionnées
    const saveChanges = () => {
        let temp_variantes = [...variantes];
        if (checkedVariantesList.length > 0) {
            for (let i = 0; i < temp_variantes.length; i++) {
                if (checkedVariantesList.indexOf(temp_variantes[i].id) > -1) {
                    if (conservNotModifiedFieldsCheckbox) {
                        temp_variantes[i].price = productPriceModal != '' ? productPriceModal : temp_variantes[i].price;
                        temp_variantes[i].reducedPrice = reducedProductPriceModal != '' ? reducedProductPriceModal : temp_variantes[i].reducedPrice;
                        temp_variantes[i].stock = productStockModal != '' ? productStockModal : temp_variantes[i].stock;
                        temp_variantes[i].unlimited = productStockModal != '' ? false : true;
                        temp_variantes[i].cost = costModal != '' ? costModal : temp_variantes[i].cost;
                        temp_variantes[i].productCode = SKUModal != '' ? SKUModal : temp_variantes[i].productCode;
                        temp_variantes[i].parcelWeight = parcelWeightModal != '' ? parcelWeightModal : temp_variantes[i].parcelWeight;
                    } else {
                        temp_variantes[i].price = productPriceModal;
                        temp_variantes[i].reducedPrice = reducedProductPriceModal;
                        temp_variantes[i].stock = productStockModal;
                        temp_variantes[i].placeholderStock = String.fromCharCode(0x221E);
                        temp_variantes[i].unlimited = true;
                        temp_variantes[i].cost = costModal;
                        temp_variantes[i].productCode = SKUModal;
                        temp_variantes[i].parcelWeight = parcelWeightModal;
                    }

                }
            }


            //----------------------------------------------------------------
            // sauvegarde les variantes avec des paramètres modifiés ex. price, stock,... pour ne pas perdre ces modifiactions quand on ajoute ou supprime des options
            let tmp_changedVariantes = [...changedVariantes];
            for (let i = 0; i < temp_variantes.length; i++) {
                if (temp_variantes[i].reducedPrice != '' ||
                    temp_variantes[i].price != '' ||
                    temp_variantes[i].selectedImage != {} ||
                    temp_variantes[i].stock != '' ||
                    temp_variantes[i].cost != '' ||
                    temp_variantes[i].productCode != '' ||
                    temp_variantes[i].parcelWeight != '') {
                    let index = tmp_changedVariantes.findIndex(x => x.id == temp_variantes[i].id);

                    if (index > -1) {
                        tmp_changedVariantes[index] = temp_variantes[i];
                    } else {
                        tmp_changedVariantes.push(temp_variantes[i]);
                    }
                }
            }
            setChangedVariantes([...tmp_changedVariantes]);
            //----------------------------------------------------------------


            setVariantes([...temp_variantes]);
            setProductPriceModal('');
            setReducedProductPriceModal('');
            setProductStockModal('');
            setCostModal('');
            setSKUModal('');
            setParcelWeightModal('');
            setCheckedVariantesList([]);
            setSelectedVariantesList([]);
            setAllOptionsVariantesNeeded(0);
        }
        handleModalCancel();
    }


    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-[100] w-full h-[100%]  flex flex-col justify-start items-start`}>
            <div className="fixed max-h-[100vh] w-[98%] lg:w-[70%] xl:w-[55%] 2xlw-[45%] 3xl:w-[40%] max-x-[650px] p-3 sm:p-5 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50 overflow-y-auto"
            >
                <div className='w-full flex flex-row justify-between mb-[20px] order-1'>
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
                    className="w-full h-auto mb-2.5 sm:mb-[50px] mt-[30px] grid grid-cols-1 sm:grid-cols-3 gap-4 justify-start items-start flex-wrap order-2"
                >
                    {/* price */}
                    <div className="w-full flex flex-col">
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

                    {/* reduced price -- promo -- */}
                    <div className="w-full flex flex-col">
                        <label className='font-semibold'>Prix réduit</label>
                        <input
                            type="number"
                            step=".01"
                            onChange={handleChangeReducedProductPriceModal}
                            value={reducedProductPriceModal}
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

                    {/* cost -- */}
                    <div className="w-full flex flex-col">
                        <label className='font-semibold'>Prix d'achat</label>
                        <input
                            type="number"
                            step=".01"
                            onChange={handleChangeCostModal}
                            value={costModal}
                            placeholder="Cout du produit"
                            min="0"
                            max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>

                    {/* sku */}
                    <div className="w-full flex flex-col">
                        <label className='font-semibold'>SKU</label>
                        <input
                            type="number"
                            onChange={handleChangeSKUModal}
                            value={SKUModal}
                            placeholder="Code - Identifiant"
                            min="0" max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>

                    {/* weight -- */}
                    <div className="w-full flex flex-col">
                        <label className='font-semibold'>Poids du colis</label>
                        <input
                            type="number"
                            step=".01"
                            onChange={handleChangeParcelWeightModal}
                            value={parcelWeightModal}
                            placeholder="Poids total"
                            min="0"
                            max="9999999999"
                            className="w-full h-[38px] border border-gray-300 rounded-md pl-[8px] text-[13px] leading-6 bg-white"
                        />
                    </div>
                </section>

                <div className="w-full flex flex-row justify-start items-center order-4 sm:order-3 mb-4 sm:mb-0">
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

                <div className="w-full flex flex-row justify-start sm:justify-end items-center mb-5 sm:mb-3 mt-3 sm:mt-5 order-3 sm:order-4">
                    <input
                        id="conservNotModifiedFieldsCheckbox"
                        type="checkbox"
                        className='mr-1 cursor-pointer'
                        checked={conservNotModifiedFieldsCheckbox}
                        onChange={() => setConservNotModifiedFieldsCheckbox(!conservNotModifiedFieldsCheckbox)}
                    />
                    <label
                        htmlFor="conservNotModifiedFieldsCheckbox"
                        className='cursor-pointer text-sm'
                    >
                        Conserver les champs non modifiés
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ModalEditSelectionVariantes;
