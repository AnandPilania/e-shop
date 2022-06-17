import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Tooltip from '../elements/tooltip';
import ModalImageVariante from './modalImageVariante';



const OptionVariantesList = () => {

    const [variantes, setVariantes] = useState([]);
    const [showModalImageVariante, setShowModalImageVariante] = useState(false);
    const [showMCancelDeleteButton, setShowMCancelDeleteButton] = useState(false);
    const [deletedVariantesList, setDeletedVariantesList] = useState([]);

    const { optionsObj, productPrice, previousProductPrice, productStock } = useContext(AppContext);

    useEffect(() => {
        // check if there is deleted variantes and show cancel button if true
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.deleted == true);
        if (ndx > -1) {
            setShowMCancelDeleteButton(true);
        }
    }, [variantes]);


    useEffect(() => {
        let allValuesAsString = [];

        // renvoi toutes les combinaisons possible des différentes options ex:
        // 0: "Bleu / S / 1"
        // 1: "Bleu / S / 2"
        // 2: "Bleu / M / 1"
        // 3: "Bleu / M / 2"
        for (let i = 0; i < optionsObj.length - 1; i++) {
            if (i === 0) {
                allValuesAsString = optionsObj[i].values.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            } else {
                allValuesAsString = allValuesAsString.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            }
        }

        // récupère tous les noms d'option pour les associer à leur values dans un objet
        let optionsName = optionsObj.map(x => x.name);

        let variantesAsString = [...variantes];
        let tmp_variantesAsString = [];
        for (let i = 0; i < allValuesAsString.length; i++) {

            // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet "destiné pour le back-end !" ex:
            // Couleur: "Rouge"
            // Taille: "M"
            let tmp = allValuesAsString[i].split(',')
            let valuesSplited = tmp[0].split(' / ');
            let variantesOptions = {};
            for (let j = 0; j < optionsName.length; j++) {
                variantesOptions[optionsName[j]] = valuesSplited[j];
            }

            // renvoi le début de la string allValuesAsString[i] qui correspond au précédent allValuesAsString[i] pour conserver les params s'ils ont été modifiés
            let startPattern = allValuesAsString[i].substring(0, allValuesAsString[i].lastIndexOf(' / '));

            // check si le précédent allValuesAsString[i] contient le pattern recherché pour récupérer ses params s'ils ont été modifiés
            let indexStartPattern = variantesAsString.findIndex(x => x.optionsString.startsWith(startPattern));

            if (indexStartPattern > -1) {
                tmp_variantesAsString.push({
                    id: i,
                    optionsString: allValuesAsString[i],
                    options: variantesOptions,
                    price: variantesAsString[indexStartPattern].price,
                    prev_price: variantesAsString[indexStartPattern].prev_price,
                    stock: variantesAsString[indexStartPattern].stock,
                    unlimited: variantesAsString[indexStartPattern].unlimited,
                    placeholderStock: variantesAsString[indexStartPattern].placeholderStock,
                    deleted: variantesAsString[indexStartPattern].deleted,
                });
                variantesAsString.splice(indexStartPattern, 1);
            } else {
                tmp_variantesAsString.push({
                    id: i,
                    optionsString: allValuesAsString[i],
                    options: variantesOptions,
                    price: productPrice,
                    prev_price: previousProductPrice,
                    stock: productStock,
                    unlimited: true,
                    placeholderStock: String.fromCharCode(0x221E),
                    deleted: false,
                })
            }
        }

        // si un des optionsObj.values est vide alors allValuesAsString sera vide aussi même si d'autres optionsObj.values ne le sont pas
        // évite la disparition de la liste des combinaisons d'options tant qu'un optionsObj.values est vide  
        let can_I_SetVariantes = optionsObj.findIndex(x => x.values.length == 0);
        if (can_I_SetVariantes == -1) {
            setVariantes(tmp_variantesAsString);
        }

    }, [optionsObj]);





    const handleVariantes = (id, field, data) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == id);
        if (ndx > -1) {
            tmp_variantes[ndx][field] = data;
        }
        setVariantes([...tmp_variantes]);
    }


    const handleVariantetPrice = (e) => {
        handleVariantes(e.target.id, 'price', e.target.value);
    }

    const handleVariantetPrevPrice = (e, item) => {
        handleVariantes(item.id, 'prev_price', e.target.value);
    }

    const handleProductStock2 = (e, item) => {
        handleVariantes(item.id, 'stock', e.target.value);
    }

    const handleProductStockOnFocus2 = (item) => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox' + item.id);
        unlimitedStockCheckbox.checked = false;

        if (item.unlimited) {
            handleVariantes(item.id, 'unlimited', false);
            handleVariantes(item.id, 'stock', '');
            handleVariantes(item.id, 'placeholderStock', '0');
        }
    }

    const handleUnlimitedStock2 = (item) => {
        if (item.unlimited && item.stock == '') {
            handleVariantes(item.id, 'unlimited', false);
            handleVariantes(item.id, 'stock', '');
            handleVariantes(item.id, 'placeholderStock', '0');
        } else {
            handleVariantes(item.id, 'unlimited', true);
            handleVariantes(item.id, 'stock', '');
            handleVariantes(item.id, 'placeholderStock', String.fromCharCode(0x221E));
        }
    }

    const deleteVariante = (id) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == id);
        if (ndx > -1) {
            tmp_variantes[ndx].deleted = true;
        }
        setVariantes([...tmp_variantes]);

        setDeletedVariantesList([...deletedVariantesList, id]);
    }

    // annule les suppressions de variantes une par une en commençant par la dernière
    const cancelDeleteVariante = () => {

        let tmp_variantes = [...variantes];

        // trouve l'id de la variante à récupérer et met son deleted à false 
        if (deletedVariantesList.length > 0) {
            let idLastDeleted = deletedVariantesList[deletedVariantesList.length - 1];
            let ndx = tmp_variantes.findIndex(x => x.id == idLastDeleted);
            if (ndx > -1) {
                tmp_variantes[ndx].deleted = false;
                setVariantes([...tmp_variantes]);
            }
            // supprime le dernier id des variantes supprimées dans la liste deletedVariantesList. cet id corrspond à celui de la variante récupérée 
            let tmp_deletedVariantesList = [...deletedVariantesList];
            tmp_deletedVariantesList.pop();
            setDeletedVariantesList([...tmp_deletedVariantesList]);
        }

        // check s'il y a encore des variantes deleted = true
        let ndx = tmp_variantes.findIndex(x => x.deleted == true);
        if (ndx > -1) {
            setShowMCancelDeleteButton(true);
        } else {
            setShowMCancelDeleteButton(false);
        }
    }

    const handleModalCancel = () => {
        setShowModalImageVariante(false);
    }

    const handleConfirm = () => {

    }

    console.log('variantes  ', variantes)

    return (
        <div>
            {!!showMCancelDeleteButton &&
                <button
                    onClick={cancelDeleteVariante}
                    className='h-[40px] px-[10px] bg-slate-500 border border-slate-200'>
                    Annuler les suppressions
                </button>
            }
            {variantes?.length > 0 &&
                <div className="w-full h-auto grid gap-x-2 grid-cols-[1fr_100px_100px_150px_50px_30px] justify-start items-center border-b-[1px] border-slate-200 mb-[20px]">
                    <span>Variantes</span>
                    <span>Prix</span>
                    <span>Promo</span>
                    <span>Stock</span>
                    <span>img</span>
                    <span></span>
                </div>}

            {variantes?.length > 0 && variantes.map((item, index) =>
                item.deleted == false &&
                <div
                    key={index}
                    className="w-full h-auto grid gap-x-2 grid-cols-[1fr_100px_100px_150px_50px_30px] justify-start items-center mb-[15px] relative"
                >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis cursor-default group">
                        {item?.optionsString}
                        <Tooltip top={-100} left={2}>
                            {item?.optionsString}
                        </Tooltip>
                    </span>

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
                        className="w-full h-[30px] border border-slate-400 rounded-4 pl-[8px] text-[13px] leading-6"
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
                        className="w-full h-[30px] border border-slate-400 rounded-4 pl-[8px] text-[13px] leading-6"
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
                            className={`w-[100px] h-[30px] border border-slate-400 
                            ${(item?.stock != '' || !item?.unlimited) ? "bg-white" : "bg-slate-100"}  
                            rounded-4 pl-[8px] text-[13px] leading-6`}
                        />
                        <span
                            className='flex flex-rox justify-start items-center h-[30px] border-y-[1px] border-r-[1px]  border-slate-400 rounded-4 px-[10px] cursor-pointer caret-transparent group relative'
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


                    <span onClick={() => setShowModalImageVariante(true)}>
                        image
                    </span>

                    {/* delete */}
                    <div className='group flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer'>
                        <span
                            onClick={() => deleteVariante(item.id)}
                            className='flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer hover:bg-red-500 rounded-[5px]'>
                            <img src={window.location.origin + '/images/icons/trash.svg'} className="h-[20px] w-[20px] group-hover:hidden" />
                            <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[25px] w-[25px] hidden group-hover:block" />
                        </span>
                    </div>
                </div>

            )}

            <ModalImageVariante
                show={showModalImageVariante}
                handleConfirm={handleConfirm}
                handleModalCancel={handleModalCancel}
            />
        </div>
    );
}

export default OptionVariantesList;
