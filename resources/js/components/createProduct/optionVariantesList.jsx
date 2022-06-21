import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import Tooltip from '../elements/tooltip';
import AnimateCheckbox from '../elements/animateCheckbox';
import ModalImageVariante from './modalImageVariante';



const OptionVariantesList = () => {

    const [variantes, setVariantes] = useState([]);
    const [idVariante, setIdVariante] = useState(null);
    const [imageVariante, setImageVariante] = useState({});
    const [showModalImageVariante, setShowModalImageVariante] = useState(false);
    const [showMCancelDeleteButton, setShowMCancelDeleteButton] = useState(false);
    const [deletedVariantesList, setDeletedVariantesList] = useState([]);
    const [checkedVariantesList, setCheckedVariantesList] = useState([]);
    const [isAllSelectedCheckbox, setIsAllSelectedCheckbox] = useState(false);

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
                    id: 'optionVarianteList' + i,
                    optionsString: allValuesAsString[i],
                    options: variantesOptions,
                    price: variantesAsString[indexStartPattern].price,
                    prev_price: variantesAsString[indexStartPattern].prev_price,
                    stock: variantesAsString[indexStartPattern].stock,
                    unlimited: variantesAsString[indexStartPattern].unlimited,
                    placeholderStock: variantesAsString[indexStartPattern].placeholderStock,
                    deleted: variantesAsString[indexStartPattern].deleted,
                    selectedImage: variantesAsString[indexStartPattern].selectedImage,
                });
                variantesAsString.splice(indexStartPattern, 1);
            } else {
                tmp_variantesAsString.push({
                    id: 'optionVarianteList' + i,
                    optionsString: allValuesAsString[i],
                    options: variantesOptions,
                    price: productPrice,
                    prev_price: previousProductPrice,
                    stock: productStock,
                    unlimited: true,
                    placeholderStock: String.fromCharCode(0x221E),
                    deleted: false,
                    selectedImage: {},
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

    const toggleDeleteUndeleteVariante = (id) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == id);
        if (ndx > -1) {
            if (tmp_variantes[ndx].deleted === false) {
                tmp_variantes[ndx].deleted = true;
            } else if (tmp_variantes[ndx].deleted === true) {
                tmp_variantes[ndx].deleted = false;
            }
        }
        setVariantes([...tmp_variantes]);

        // setDeletedVariantesList([...deletedVariantesList, id]);
    }

    const cancelAllDeletedVariante = () => {
        let tmp_variantes = [...variantes];

        tmp_variantes.forEach(x => x.deleted = false);
        setVariantes([...tmp_variantes]);
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


    const loadImagesVariantes = (varianteId) => {
        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                setImageVariante(res.data);
                setIdVariante(varianteId);
                setShowModalImageVariante(true);
            })
            .catch(error => {
                console.log('Error get Product Images failed : ' + error.status);
            });
    };


    const handleModalCancel = () => {
        setIdVariante(null);
        setShowModalImageVariante(false);
    }

    // enregistre l'image principal pour une variante donnée
    const handleConfirm = (selectedImage) => {
        setShowModalImageVariante(false);
        console.log('idVariante  ', idVariante)
        // ajoute l'image sélectionnée à la variante qui a l'id == idVariante
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == idVariante);
        if (ndx > -1) {
            tmp_variantes[ndx].selectedImage = selectedImage;
        }
        setVariantes([...tmp_variantes]);
        setIdVariante(null);
    }


    const handleChangeCheckbox = (id) => {
        let tmp_checkedVariantesList = [...checkedVariantesList];
        let ndx = tmp_checkedVariantesList.indexOf(id);
        if (ndx > -1) {
            tmp_checkedVariantesList.splice(ndx, 1);
            // décoche checkbox check all si on decoche un item
            setIsAllSelectedCheckbox(false);
        } else {
            tmp_checkedVariantesList.push(id);
            // coche checkbox check all si tout est coché
            if (variantes.length === tmp_checkedVariantesList.length) {
                setIsAllSelectedCheckbox(true);
            }
        }
        setCheckedVariantesList(tmp_checkedVariantesList);
    }

    // gère le checkbox check all
    const selectAllCheckbox = (unUseParameter) => {
        if (!isAllSelectedCheckbox) {
            let tmp_arr = [];
            variantes.forEach(item => tmp_arr.push(item.id));
            setCheckedVariantesList([...tmp_arr]);
            setIsAllSelectedCheckbox(true);
        } else {
            setCheckedVariantesList([]);
            setIsAllSelectedCheckbox(false);
        }
    }

    console.log('checkedVariantesList  ', checkedVariantesList)
    console.log('variantes  ', variantes)

    return (
        <div>
            <h3 className='w-full text-left mb-[20px] mt-[35px] font-semibold text-[16px]'>
                Variantes
            </h3>
            {!!showMCancelDeleteButton &&
                <button
                    onClick={cancelAllDeletedVariante}
                    className='h-[40px] px-[10px] bg-gray-200 border border-gray-500 text-gray-500'>
                    Annuler les suppressions
                </button>
            }
            {variantes?.length > 0 &&
                <div className="w-full h-auto grid gap-x-2 grid-cols-[25px_1fr_100px_100px_150px_50px_30px] justify-start items-center border-b-[1px] border-gray-200 mb-[20px]">
                    {/* checkbox select all */}
                    <div className='w-full h-[30px] flex flex-row justify-start items-center pt-[6px] pl-[1px]'>
                        <AnimateCheckbox
                            id='_unUsedId'
                            value=''
                            checked={isAllSelectedCheckbox}
                            handlechange={selectAllCheckbox}
                        />
                    </div>
                    <span>Variantes</span>
                    <span>Prix</span>
                    <span>Promo</span>
                    <span>Stock</span>
                    <span></span>
                    <span></span>
                </div>}

            {variantes?.length > 0 && variantes.map((item, index) =>

                <div
                    key={index}
                    className={`w-full h-auto grid gap-x-2 grid-cols-[25px_1fr_100px_100px_150px_50px_30px] justify-start items-center py-[8px] border-b border-slate-100 relative bg-white hover:bg-gray-50 ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                >
                    {/* checkbox "!!! a son css !!!" */}
                    <div className='w-full h-[30px] flex flex-row justify-start items-center pt-[6px] pl-[1px]'>
                        <AnimateCheckbox
                            id={item.id}
                            value=''
                            checked={checkedVariantesList.includes(item.id)}
                            handlechange={handleChangeCheckbox}
                        />
                    </div>

                    {/* variante */}
                    <span className={`h-[30px] pl-[8px] flex justify-start items-center rounded-md whitespace-nowrap overflow-hidden text-ellipsis cursor-default group ${item.deleted ? "text-gray-400" : "text-gray-500"} ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}>
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

                    {/* image variante */}
                    <span
                        className={`w-full h-[30px] border border-gray-300 flex justify-center items-center cursor-pointer ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                        onClick={() => loadImagesVariantes(item.id)}
                    >
                        {
                            Object.keys(item.selectedImage).length !== 0 ?
                                <img className='w-auto max-h-[28px]'
                                    src={window.location.origin + '/' + item.selectedImage.value}
                                />
                                :
                                <img className='w-[25px] h-auto'
                                    src='../images/icons/image.svg'
                                />
                        }
                    </span>

                    {/* delete */}
                    <div className='group flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer'>
                        {
                            !item.deleted ?
                                <span
                                    onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                    className='flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer hover:bg-red-500 rounded-md'>
                                    <img src={window.location.origin + '/images/icons/trash.svg'} className="h-[20px] w-[20px] group-hover:hidden" />
                                    <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[25px] w-[25px] hidden group-hover:block" />
                                </span>
                                :
                                <span
                                    onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                    className='flex justify-center items-center w-[30px] h-[30px] p-0 m-0 cursor-pointer hover:bg-blue-200 rounded-md'>
                                    <img src={window.location.origin + '/images/icons/arrow-back.svg'} className="h-[20px] w-[20px]" />
                                </span>
                        }
                    </div>
                </div>
            )}

            <ModalImageVariante
                show={showModalImageVariante}
                handleConfirm={handleConfirm}
                handleModalCancel={handleModalCancel}
                imageVariante={imageVariante}
                setImageVariante={setImageVariante}
            />
        </div>
    );
}

export default OptionVariantesList;
