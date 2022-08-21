import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import Tooltip from '../../elements/tooltip';
import AnimateCheckbox from '../../elements/animateCheckbox';
import ModalImageVariante from './modalImageVariante';
import SelectionVariantesInList from './selectionVariantesInList';
import WithHandleSelectionList from './withHandleSelectionList';


const OptionVariantesList = ({ handleChangeSelectionVariantesList, isAllSelectedCheckbox, setIsAllSelectedCheckbox, setShowOptions }) => {

    const [idVariante, setIdVariante] = useState(null);
    const [imageVariante, setImageVariante] = useState({});
    const [showModalImageVariante, setShowModalImageVariante] = useState(false);
    const [visiblesFields, setVisiblesFields] = useState([]);
    const [indexOfVisiblesFields, setIndexOfVisiblesFields] = useState(0);
    const [animateSlideLeftIsActived, setAnimateSlideLeftIsActived] = useState(false);
    const [animateSlideRightIsActived, setAnimateSlideRightIsActived] = useState(false);

    const { optionsObj, productPrice, previousProductPrice, productStock, listType, variantes, setVariantes, checkedVariantesList, setCheckedVariantesList, selectedVariantesList, setSelectedVariantesList, isHideDeletedVariantes, variante, setVariante, setImageVariantes, changedVariantes, setChangedVariantes, screenSize } = useContext(AppContext);



    useEffect(() => {
        selectedVariantesList.length > 0 && handleChangeSelectionVariantesList(null, null);
    }, [variantes]);


    useEffect(() => {
        let allValuesAsString = [];

        // renvoi toutes les combinaisons possible des différentes options 
        let optionsCombinations = optionsObj.map(x => x.values);
        // crée un tableau avec les index des optionsObj.values non vides pour que getCombinaisons parcoure uniquement les values non vides dans optionsCombinations
        let index_tab = [];
        for (let i = 0; i < optionsObj.length; i++) {
            if (optionsObj[i].values.length > 0) {
                index_tab.push(i);
            }
        }
        function getCombinaisons(ndxTab, comb) {
            if (!ndxTab.length) {
                allValuesAsString.push(comb);
                return;
            }
            for (var i = 0; i < optionsCombinations[ndxTab[0]]?.length; i++) {
                let separator = comb.length > 0 ? " - " : "";
                getCombinaisons(ndxTab.slice(1), comb + separator + optionsCombinations[ndxTab[0]][i]);
            }
        }
        optionsCombinations.length > 0 && getCombinaisons(index_tab, "");


        // get les noms d'options pour les associer à leur values dans un objet
        let optionsName = optionsObj.map(x => x.name);
        let tmp_variantesAsString = [];
        // quand on modifie les params d'une variantes on la copie ici pour conserver ses modifications
        let tmp_changedVariantes = [];

        for (let i = 0; i < allValuesAsString.length; i++) {
            // tmp_changedVariantes contien les variantes qui ont été modifiées
            tmp_changedVariantes = [...changedVariantes];
            // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet "destiné au back-end !" 
            let tmp = allValuesAsString[i].split(',')
            let valuesSplited = tmp[0].split(' - ');
            let variantesOptions = {};
            for (let j = 0; j < optionsObj.length; j++) {
                if (optionsObj[j].values.length > 0) {
                    variantesOptions[optionsName[j]] = valuesSplited[j];
                }
            }


            // compare deux tableaux 
            for (let j = 0; j < tmp_changedVariantes.length; j++) {

                let tmp2 = tmp_changedVariantes[j].optionsString.split(',')
                let optionsStringSplited = tmp2[0].split(' - ');

                // check si optionsStringSplited contien toutes les values de valuesSplited
                if (valuesSplited.length === optionsStringSplited.length) {
                    let isSameValuesInArray = true;
                    for (let k = 0; k < valuesSplited.length; k++) {
                        if (!optionsStringSplited.includes(valuesSplited[k])) {
                            isSameValuesInArray = false;
                        }
                    }

                    // si oui on met à jour tmp_changedVariantes.optionsString avec le allValuesAsString[i] actuelle qui contient l'entièreté de la optionsStringe tmp_changedVariantes sert à conserver les paramètres d'une variante s'ils ont été modifiés. ex. prix, stock,...
                    if (isSameValuesInArray) {
                        tmp_changedVariantes[j].optionsString = allValuesAsString[i];
                        setChangedVariantes([...tmp_changedVariantes]);
                    }
                }
            }

            // supprime de tmp_changedVariantes les variantes qui ont encore des options dans leur optionsString qui ont été supprimées. tmp_changedVariantes sert à récupérer les paramètres d'une variante s'ils ont été modifiés. ex. prix, stock,...
            tmp_changedVariantes.forEach((item, index) => {
                let ndx = allValuesAsString.findIndex(x => x == item.optionsString);
                if (ndx === -1) {
                    tmp_changedVariantes.splice(index, 1);
                    setChangedVariantes([...tmp_changedVariantes]);
                }
            });


            // crée des variantes vides. le nombre de variantes crées est = à allValuesAsString.length
            if (allValuesAsString[i] != '') { // <--si allValuesAsString est vide alors on ne crée pas de variante vide
                tmp_variantesAsString.push({
                    id: 'optionVarianteList' + i,
                    optionsString: allValuesAsString[i],
                    options: variantesOptions,
                    price: productPrice,
                    prev_price: previousProductPrice,
                    stock: productStock,
                    unlimited: true,
                    placeholderStock: 'Illimité',
                    deleted: false,
                    selectedImage: {},
                })
            }
        }

        // remplace les variantes par celles qui leurs correspondent dans tmp_changedVariantes pour récupérer leurs paramètres quand ils ont été modifiés. ex price, stock, ...
        for (let i = 0; i < tmp_variantesAsString.length; i++) {
            let ndx = tmp_changedVariantes.findIndex(x => x.optionsString == tmp_variantesAsString[i].optionsString);

            if (ndx > -1) {
                let tmp_id = tmp_variantesAsString[i].id;
                tmp_variantesAsString[i] = tmp_changedVariantes[ndx];
                tmp_variantesAsString[i].id = tmp_id;
            }
        }

        setVariantes(tmp_variantesAsString);

        // ferme "ajouter des options quand on supprime toutes les options"
        optionsObj.length === 0 && setShowOptions(false);
    }, [optionsObj]);






    const handleVariantes = (id, field, data) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == id);
        if (ndx > -1) {
            tmp_variantes[ndx][field] = data;
        }
        // sauvegarde les variantes avec des paramètres modifiés ex. price, stock,... pour ne pas perdre ces modifiactions quand on ajoute ou supprime des options
        let tmp_changedVariantes = [...changedVariantes];
        let index = tmp_changedVariantes.findIndex(x => x.id == tmp_variantes[ndx].id);

        if (index > -1) {
            tmp_changedVariantes[index] = tmp_variantes[ndx];
        } else {
            tmp_changedVariantes.push(tmp_variantes[ndx]);
        }

        setChangedVariantes([...tmp_changedVariantes]);
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
            handleVariantes(item.id, 'placeholderStock', 'Illimité');
        }
    }



    const loadImagesVariantes = (item) => {
        setVariante(item);
        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                setImageVariante(res.data);
                setIdVariante(item.id);
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
        // ajoute l'image sélectionnée à la variante qui a l'id == idVariante
        handleVariantes(idVariante, 'selectedImage', selectedImage);
        setIdVariante(null);

        // refresh dropZoneProduct
        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                let tmp_data = [[]];
                let tmp = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (tmp.length < 4) {
                        tmp.push(res.data[i]);
                        tmp_data.splice(-1, 1, tmp);
                    } else {
                        tmp_data.splice(-1, 1, tmp);
                        tmp = [];
                        tmp.push(res.data[i]);
                        tmp_data.push(tmp);
                    }
                };
                setImageVariantes(tmp_data);
            })
            .catch(error => {
                console.log('Error get Product Images failed : ' + error.status);
            });
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
    // coche le checkbox all quand les options sélectionnées font que toutes les variantes sont cochées. décoche si c'est plus le cas
    useEffect(() => {
        if (variantes.length === checkedVariantesList.length && checkedVariantesList.length > 0) {
            setIsAllSelectedCheckbox(true);
        }
        if (variantes.length !== checkedVariantesList.length) {
            setIsAllSelectedCheckbox(false);
        }
    }, [checkedVariantesList])

    // gère le checkbox check all
    // unUseParameter voir animateCheckbox.jsx
    const selectAllCheckbox = (unUseParameter) => {
        if (!isAllSelectedCheckbox) {
            let tmp_arr = [];
            variantes.forEach(item => tmp_arr.push(item.id));
            setSelectedVariantesList([]);
            setCheckedVariantesList([...tmp_arr]);
            setIsAllSelectedCheckbox(true);
        } else {
            setCheckedVariantesList([]);
            setIsAllSelectedCheckbox(false);
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
    }


    const handleChangeShowedFields = (nextOrPrevious) => {
        if (nextOrPrevious == 'next' && indexOfVisiblesFields < visiblesFields.length - 1) {
            setAnimateSlideRightIsActived(true);
            setIndexOfVisiblesFields(indexOfVisiblesFields + 1);
        } else if (nextOrPrevious == 'previous' && indexOfVisiblesFields > 0) {
            setAnimateSlideLeftIsActived(true);
            setIndexOfVisiblesFields(indexOfVisiblesFields - 1);
        }
        setTimeout(() => {
            setAnimateSlideRightIsActived(false);
            setAnimateSlideLeftIsActived(false);
        }, 350);
    }
    

    useEffect(() => {
        let tmp_arr = [];
        if (screenSize < 1000) {
            tmp_arr = [['price', 'reducedPrice'], ['stock', 'cost'], ['sku', 'weght']];
        } else {
            tmp_arr = [['price', 'reducedPrice', 'stock'], ['cost', 'sku', 'weight']];
        }
        setVisiblesFields(tmp_arr);
    }, [screenSize]);

    console.log('indexOfVisiblesFields', indexOfVisiblesFields)
    console.log('visiblesFields[indexOfVisiblesFields]', visiblesFields[indexOfVisiblesFields])

    return (
        <div className={`${variantes?.length > 0 && "border-t border-gray-200 mt-5"}`}>
            {variantes?.length > 0 &&
                <h3 className='w-full text-left mb-5 mt-6 font-semibold text-[16px]'>
                    Variantes
                </h3>
            }

            {variantes?.length > 0 &&
                <SelectionVariantesInList
                    variantes={variantes}
                    checkedVariantesList={checkedVariantesList}
                    setCheckedVariantesList={setCheckedVariantesList}
                />}

            {variantes?.length > 0 &&
                <div className="w-full h-auto grid gap-x-2 grid-cols-[25px_160px_1fr_1fr_1fr_82px] justify-start items-center border-b border-gray-200 mb-5">
                    {/* checkbox select all */}
                    <div className='w-full h-8 flex flex-row justify-start items-center pt-2 pl-[1px]'>
                        <AnimateCheckbox
                            id='_unUsedId'
                            value=''
                            checked={isAllSelectedCheckbox}
                            handlechange={selectAllCheckbox}
                        />
                    </div>
                    <span className='font-semibold text-base bg-white z-10'>Variantes</span>
                    {visiblesFields[indexOfVisiblesFields]?.includes('price') &&
                    <span className={`BRD-BLUE-1 w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        Prix
                    </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('reducedPrice') &&
                    <span className={`brd-red-1 w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        Promo
                    </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('stock') &&
                    <span className={`brd-green-1 w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        Stock
                    </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('cost') &&
                    <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        Cout
                    </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('sku') &&
                    <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        SKU
                    </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('weight') &&
                    <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                        Poids Colis (gr)
                    </span>}

                    <div className='w-full flex justify-start items-center bg-white z-10'>
                        <span
                            className='w-6 h-6 mr-2 flex justify-center items-center rounded-md bg-white border border-gray-800 hover:border-2'
                            onClick={() => handleChangeShowedFields('previous')}>
                            <svg className="h-4 w-4 fill-gray-900 cursor-pointer bi bi-caret-left-fill" viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                            </svg>
                        </span>
                        <span
                            className='w-6 h-6 flex justify-center items-center rounded-md bg-white border border-gray-800 hover:border-2'
                            onClick={() => handleChangeShowedFields('next')}>
                            <svg className="h-4 w-4 fill-gray-900 cursor-pointer bi bi-caret-right-fill" viewBox="0 0 16 16">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                            </svg>
                        </span>
                    </div>
                </div>}



            {/* isHideDeletedVariantes cache les variantes deleted -> toggle */}
            {
                variantes?.length > 0 && variantes.map((item, index) =>
                    (isHideDeletedVariantes && item.deleted === true) ? '' :
                        <div
                            key={index}
                            className={`w-full h-auto grid gap-x-2 grid-cols-[25px_160px_1fr_1fr_1fr_50px_32px] justify-start items-center py-2 relative bg-white hover:bg-gray-50 ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                        >
                            {/* checkbox "!!! a son css !!!" */}
                            <div className='w-6 h-8 flex flex-row justify-start items-center pt-2 pl-[1px]'>
                                <AnimateCheckbox
                                    id={item.id}
                                    value=''
                                    checked={checkedVariantesList.includes(item.id)}
                                    handlechange={handleChangeCheckbox}
                                />
                            </div>

                            {/* variante */}
                            <span
                                className={`w-40 min-w-[160px] h-8 pt-1 rounded-md whitespace-nowrap text-ellipsis overflow-hidden cursor-default group ${item.deleted ? "text-gray-400" : "text-gray-500"} ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                            >
                                {item?.optionsString}
                                <Tooltip top={-20} left={20}>
                                    {item?.optionsString}
                                </Tooltip>
                            </span>

                            {/* price */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('price') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={item?.id}
                                        type="number"
                                        step=".01"
                                        onChange={handleVariantetPrice}
                                        value={item?.price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* reduced_price -- promo -- */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('reducedPrice') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputPrevPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVariantetPrevPrice(e, item)}
                                        value={item?.prev_price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* stock */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('stock') &&
                                <div className='w-full'>
                                    <div
                                        className='w-36 flex flex-rox justify-start items-center'
                                    >
                                        <input
                                            type="number"
                                            id={`inputStock${item?.id}`}
                                            onChange={(e) => handleProductStock2(e, item)}
                                            value={item?.stock}
                                            placeholder={item.placeholderStock}
                                            min="0" max="9999999999"
                                            onClick={(() => handleProductStockOnFocus2(item))}
                                            className={`w-full h-8 border border-gray-300 rounded-l-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                        />
                                        <span
                                            className={`flex flex-rox justify-start items-center h-8 border-y border-r border-gray-300 rounded-r-md px-2.5 cursor-pointer caret-transparent group relative ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                            onClick={() => handleUnlimitedStock2(item)}>
                                            <input
                                                className='mr-2 caret-transparent cursor-pointer bg-red-500'
                                                id={`unlimitedStockCheckbox${item?.id}`}
                                                type="checkbox"
                                                placeholder="Illimité"
                                                checked={item?.stock != '' ? false : item?.unlimited}
                                                // pour pas avoir de warning "input checkbox non controlé"
                                                onChange={() => { }}
                                            />
                                            <Tooltip top={-40} left={-100} css='whitespace-nowrap'>
                                                {item?.unlimited ? 'Stock illimité' : 'Entrer une quantité'}
                                            </Tooltip>
                                        </span>
                                    </div>
                                </div>}

                            {/* cost -- */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('cost') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputPrevPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVariantetPrevPrice(e, item)}
                                        value={item?.prev_price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* sku -- */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('sku') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputPrevPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVariantetPrevPrice(e, item)}
                                        value={item?.prev_price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* weight */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('weight') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputPrevPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVariantetPrevPrice(e, item)}
                                        value={item?.prev_price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* image variante */}
                            <span
                                className={`w-full h-8 border border-gray-300 flex justify-center items-center cursor-pointer ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                                onClick={() => loadImagesVariantes(item)}
                            >
                                {
                                    item.selectedImage !== undefined && item.selectedImage !== null && Object.keys(item.selectedImage).length !== 0 ?
                                        <img className='w-auto max-h-[28px]'
                                            src={window.location.origin + '/' + item.selectedImage.value}
                                        />
                                        :
                                        <img className='w-6 h-auto'
                                            src='../images/icons/image.svg'
                                        />
                                }
                            </span>

                            {/* delete */}
                            <div className='group flex justify-center items-center w-8 h-8 p-0 m-0 cursor-pointer'>
                                {
                                    !item.deleted ?
                                        <span
                                            onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                            className='flex justify-center items-center w-8 h-8 p-0 m-0 cursor-pointer hover:bg-red-500 rounded-md'>
                                            <img src={window.location.origin + '/images/icons/trash.svg'} className="h-5 w-5 group-hover:hidden" />
                                            <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-6 w-6 hidden group-hover:block" />
                                        </span>
                                        :
                                        <span
                                            onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                            className='flex justify-center items-center w-8 h-8 p-0 m-0 cursor-pointer hover:bg-blue-200 rounded-md'>
                                            <img src={window.location.origin + '/images/icons/arrow-back.svg'} className="h-5 w-5" />
                                        </span>
                                }
                            </div>
                        </div>
                )
            }


            <ModalImageVariante
                show={showModalImageVariante}
                handleConfirm={handleConfirm}
                handleModalCancel={handleModalCancel}
                imageVariante={imageVariante}
                setImageVariante={setImageVariante}
            />
        </div >
    );
}

export default WithHandleSelectionList(OptionVariantesList);
