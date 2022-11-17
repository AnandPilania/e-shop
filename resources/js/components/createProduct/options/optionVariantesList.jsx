import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import AnimateCheckbox from '../../elements/animate_checkbox.jsx/animateCheckbox';
import ModalImageVariante from './modalImageVariante';
import SelectionVariantesInList from './selectionVariantesInList';
import WithHandleSelectionList from './withHandleSelectionList';
import { v4 as uuidv4 } from 'uuid';


const OptionVariantesList = ({ handleChangeSelectionVariantesList, isAllSelectedCheckbox, setIsAllSelectedCheckbox }) => {

    const [idVariante, setIdVariante] = useState(null);
    const [imageVariante, setImageVariante] = useState({});
    const [showModalImageVariante, setShowModalImageVariante] = useState(false);
    const [visiblesFields, setVisiblesFields] = useState([]);
    const [indexOfVisiblesFields, setIndexOfVisiblesFields] = useState(0);
    const [animateSlideLeftIsActived, setAnimateSlideLeftIsActived] = useState(false);
    const [animateSlideRightIsActived, setAnimateSlideRightIsActived] = useState(false);
    const [maxIdValues_Names, setMaxIdValues_Names] = useState('');


    const { optionsObj, productPrice, reducedProductPrice, productStock, productCost, productParcelWeight, productParcelWeightMeasureUnit, productCode, variantes, setVariantes, checkedVariantesList, setCheckedVariantesList, selectedVariantesList, setSelectedVariantesList, isHideDeletedVariantes, variante, setVariante, setImageVariantes, changedVariantes, setChangedVariantes, screenSize, setShowOptions, isEditProduct, setIsEditProduct, IdProduct } = useContext(AppContext);

    useEffect(() => {
        let abortController;
        (async () => {
            abortController = new AbortController();
            let signal = abortController.signal;
            try {
                // the signal is passed into the request(s) we want to abort using this controller
                const { data } = await Axios.get(
                    'http://127.0.0.1:8000/getMaxIdValues_Names',
                    { signal: signal }
                );
                setMaxIdValues_Names(data + 1);
            } catch (e) {
                console.error(e);
            }
        })();

        return () => abortController.abort();
    }, []);


    useEffect(() => {
        selectedVariantesList.length > 0 && handleChangeSelectionVariantesList(null, null);
    }, [variantes]);


    useEffect(() => {
        console.log('USEd-EFFECT')
        console.log('optionsObj   ', optionsObj)
        if (!isEditProduct) {
            let libelles = [];
            // renvoi un tableau contenant les tableaux des VALEURS des différentes options. Sert à récupérer toutes les combinaisons possible entre les différentes options 
            let optionsCombinations = optionsObj.map(x => x.values);

            // crée un tableau avec les index des optionsObj dont les VALUES ne sont pas vides pour que getCombinaisons parcoure uniquement les values non vides dans optionsCombinations
            let indexOfNotEmpty_optionsObj_values = [];
            for (let i = 0; i < optionsObj.length; i++) {
                if (optionsObj[i].values.length > 0) {
                    indexOfNotEmpty_optionsObj_values.push(i);
                }
            }
            function getCombinaisons(ndxTab, comb) {
                if (!ndxTab.length) {
                    libelles.push(comb);
                    return;
                }
                for (var i = 0; i < optionsCombinations[ndxTab[0]]?.length; i++) {
                    let separator = comb.length > 0 ? " - " : "";
                    getCombinaisons(ndxTab.slice(1), comb + separator + optionsCombinations[ndxTab[0]][i]);
                }
            }
            optionsCombinations.length > 0 && getCombinaisons(indexOfNotEmpty_optionsObj_values, "");

            // si idValues_Names == null lui attribu un id
            if (optionsObj.findIndex(x => x.idValues_Names == null) > -1) {
                let newId = maxIdValues_Names;
                for (let i = 0; i < optionsObj.length; i++) {
                    if (optionsObj[i].idValues_Names == null) {
                        optionsObj[i].idValues_Names = newId;
                        newId = newId + 1;
                    }
                }
            }

            // get les id des noms d'options pour les associer à leur values dans un objet
            let optionsIdValuesNames = optionsObj.map(x => x.idValues_Names);
            let tmp_variantesAsString = [];

            for (let i = 0; i < libelles.length; i++) {
                // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet "destiné au back-end !" 
                let tmp = libelles[i].split(',')
                let valuesSplited = tmp[0].split(' - ');
                let variantesOptions = {};
                for (let j = 0; j < optionsObj.length; j++) {
                    if (optionsObj[j].values.length > 0) {
                        variantesOptions[optionsIdValuesNames[j]] = valuesSplited[j];
                    }
                }

                // crée des variantes vides. le nombre de variantes crées est = à libelles.length
                if (libelles[i] != '') {
                    tmp_variantesAsString.push({
                        id: 'optionVarianteList' + i,
                        optionsString: libelles[i],
                        options: variantesOptions,
                        price: productPrice,
                        reducedPrice: reducedProductPrice,
                        stock: '',
                        productCode: productCode == '' ? uuidv4() : productCode,
                        cost: productCost,
                        parcelWeight: productParcelWeight,
                        parcelWeightMeasureUnit: productParcelWeightMeasureUnit,
                        unlimited: false,
                        placeholderStock: '0',
                        deleted: false,
                        selectedImage: {},
                        image_path: '',
                    })
                }
            }

            // quand on modifie les params d'une variantes on la copie ici pour conserver ses modifications
            let tmp_changedVariantes = [...changedVariantes];
            // remplace les variantes de tmp_variantesAsString par celles qui ont été modifiées et qui leur correspondent
            if (tmp_variantesAsString.length > 0 && tmp_changedVariantes.length > 0) {
                for (let i = 0; i < tmp_variantesAsString.length; i++) {
                    let newOptions = Object.values(tmp_variantesAsString[i].options);
                    for (let j = 0; j < tmp_changedVariantes.length; j++) {
                        let changedOptions = {};
                        if (typeof (tmp_changedVariantes[j].options) == "string") {
                            changedOptions = Object.values(JSON.parse(tmp_changedVariantes[j].options));
                        } else {
                            changedOptions = Object.values(tmp_changedVariantes[j].options);
                        }
                        if (changedOptions.every(x => newOptions.includes(x))) {
                            let tmp_id = tmp_variantesAsString[i].id;
                            let tmp_optionsString = tmp_variantesAsString[i].optionsString;
                            tmp_variantesAsString[i] = tmp_changedVariantes[j];
                            tmp_variantesAsString[i].id = tmp_id;
                            tmp_variantesAsString[i].optionsString = tmp_optionsString;
                            tmp_changedVariantes.splice(j, 1);
                        }
                    }
                }
                console.log('tmp_changedVariantes  ', tmp_changedVariantes)
            }
            setVariantes(tmp_variantesAsString);
        }
        isEditProduct && setIsEditProduct(false);
        // ferme "ajouter des options quand on supprime toutes les options"
        // optionsObj.name != '' && setShowOptions(false);

    }, [optionsObj]);

    console.log('-> variantes <-', variantes)

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
        console.log('tmp_changedVariantes !!! <-', tmp_changedVariantes)
        setChangedVariantes([...tmp_changedVariantes]);
        setVariantes([...tmp_variantes]);
    }


    const handleVariantePrice = (e) => {
        handleVariantes(e.target.id, 'price', e.target.value);
    }

    const handleVarianteReducedPrice = (e, item) => {
        handleVariantes(item.id, 'reducedPrice', e.target.value);
    }

    const handleStockProduct = (e, item) => {
        handleVariantes(item.id, 'stock', e.target.value);
    }

    const handleVarianteCost = (e, item) => {
        handleVariantes(item.id, 'cost', e.target.value);
    }

    const handleVarianteParcelWeight = (e, item) => {
        handleVariantes(item.id, 'parcelWeight', e.target.value);
    }

    const handleVarianteWeightMeasureUnit = (e, item) => {
        handleVariantes(item.id, 'parcelWeightMeasureUnit', e.target.value);
    }

    const handleVarianteProductCode = (e, item) => {
        handleVariantes(item.id, 'productCode', e.target.value);
    }

    const handleStockProductOnFocus = (item) => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox' + item.id);
        unlimitedStockCheckbox.checked = false;

        if (item.unlimited) {
            handleVariantes(item.id, 'unlimited', false);
            handleVariantes(item.id, 'stock', '');
            handleVariantes(item.id, 'placeholderStock', '0');
        }
    }

    const handleUnlimitedStockProduct = (item) => {
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


    // click mini image variante
    const loadImagesVariantes = (item) => {
        setVariante(item);
        Axios.get(`http://127.0.0.1:8000/getTemporaryImagesProduct/${IdProduct}`)
            .then(res => {
                if (res.data != "empty") {
                    setImageVariante(res.data);
                } else {
                    setImageVariante({});
                }
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
        Axios.get(`http://127.0.0.1:8000/getTemporaryImagesProduct/${selectedImage.product_id}`)
            .then(res => {
                let tmp_data = [[]];
                let tmp = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (tmp.length < 4) {
                        tmp.push(res.data[i]);
                        tmp_data.splice(-1, 1, tmp);
                    } else {
                        tmp = [];
                        tmp.push(res.data[i]);
                        tmp_data.push(tmp);
                    }
                };
                console.log('tmp_data  ', tmp_data)
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
            if (tmp_variantes[ndx].deleted == false) {
                tmp_variantes[ndx].deleted = true;
            } else if (tmp_variantes[ndx].deleted == true) {
                tmp_variantes[ndx].deleted = false;
            }
        }
        setVariantes([...tmp_variantes]);
    }


    // gère les boutons prev et next des champs de la liste des variantes
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
        if (screenSize < 768) {
            tmp_arr = [['price', 'reducedPrice'], ['stock', 'cost'], ['sku', 'weight']];
        } else {
            tmp_arr = [['price', 'reducedPrice', 'stock'], ['cost', 'sku', 'weight']];
        }
        setVisiblesFields(tmp_arr);
        // evite un bug sur l'affichage des colonnes
        screenSize < 768 && handleChangeShowedFields('previous');
    }, [screenSize]);


    return (
        <div
            className={`w-full ${variantes?.length > 0 && "border-t border-gray-200 mt-5"}`}
        >
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
                <div
                    className="w-full h-auto grid gap-x-2 grid-cols-[25px_100px_1fr_1fr_82px] md:grid-cols-[25px_100px_1fr_1fr_1fr_82px] xl:grid-cols-[25px_140px_1fr_1fr_1fr_82px] justify-start items-center border-b border-gray-200 mb-5"
                >
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
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            Prix
                        </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('reducedPrice') &&
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            Prix réduit
                        </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('stock') &&
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            Stock
                        </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('cost') &&
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            Prix d'achat
                        </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('sku') &&
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            SKU
                        </span>}
                    {visiblesFields[indexOfVisiblesFields]?.includes('weight') &&
                        <span className={`w-full overflow-hidden font-semibold text-base ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}>
                            Poids Colis
                        </span>}

                    <div className='w-full flex justify-start items-center bg-white z-10'>
                        {/* button previous */}
                        <span
                            className={`w-6 h-6 mr-2 flex justify-center items-center rounded-md border ${indexOfVisiblesFields == 0 ? "bg-gray-100 border-gray-300" : "bg-white border-gray-800 hover:border-2"}`}
                            onClick={() => handleChangeShowedFields('previous')}>
                            <svg className={`h-4 w-4 ${indexOfVisiblesFields == 0 ? "fill-gray-300 cursor-not-allowed" : "fill-gray-900 cursor-pointer"} bi bi-caret-left-fill" viewBox="0 0 16 16`}>
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                            </svg>
                        </span>
                        {/* button next */}
                        <span
                            className={`w-6 h-6 flex justify-center items-center rounded-md bg-white border ${indexOfVisiblesFields == visiblesFields.length - 1 ? "bg-gray-100 border-gray-300" : "bg-white border-gray-800 hover:border-2"}`}
                            onClick={() => handleChangeShowedFields('next')}>
                            <svg className={`h-4 w-4 ${indexOfVisiblesFields == visiblesFields.length - 1 ? "fill-gray-300 cursor-not-allowed" : "fill-gray-900 cursor-pointer"} bi bi-caret-right-fill" viewBox="0 0 16 1`}>
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                            </svg>
                        </span>
                    </div>
                </div>
            }

            {/* isHideDeletedVariantes cache les variantes deleted -> toggle */}
            {
                variantes?.length > 0 && variantes.map((item, index) =>
                    (isHideDeletedVariantes && item.deleted === true) ? '' :
                        <div
                            id={`${index}options_String_Variantes_17922`}
                            key={index}
                            className={`w-full h-auto grid gap-x-2 grid-cols-[25px_100px_1fr_1fr_50px_32px] md:grid-cols-[25px_80px_1fr_1fr_1fr_50px_32px] xl:grid-cols-[25px_140px_1fr_1fr_1fr_50px_32px] justify-start items-center py-2 relative bg-white  hover:bg-gray-50 ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
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
                                className={`w-auto h-8 pt-1 rounded-md truncate cursor-default group ${item.deleted ? "text-gray-400" : "text-gray-500"} ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                            >
                                {item?.optionsString}
                                <span
                                    className="absolute top-[-40px] left-0  h-auto truncate invisible group-hover:visible w-auto flex justify-start max-w-[370px] p-3 text-sm text-gray-700 bg-white z-[100] rounded-md shadow-md cursor-default border border-gray-300"
                                >
                                    {item?.optionsString}
                                </span>
                            </span>

                            {/* price */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('price') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={item?.id}
                                        type="number"
                                        step=".01"
                                        onChange={handleVariantePrice}
                                        value={item?.price}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* reduced_price */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('reducedPrice') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputReducedPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVarianteReducedPrice(e, item)}
                                        value={item?.reducedPrice == null ? '' : item?.reducedPrice}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* stock */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('stock') &&
                                <div className='w-full relative'>
                                    <div
                                        className='w-full flex flex-rox justify-start items-center'
                                    >
                                        <input
                                            type="number"
                                            id={`inputStock${item?.id}`}
                                            onChange={(e) => handleStockProduct(e, item)}
                                            value={item?.stock == null ? '' : item?.stock}
                                            placeholder={screenSize > 1350 ? item?.placeholderStock : String.fromCharCode(0x221E)}
                                            min="0" max="9999999999"
                                            onClick={(() => handleStockProductOnFocus(item))}
                                            className={`w-full h-8 border border-gray-300 rounded-l-md pl-2 text-sm leading-6 bg-white ${item?.deleted && "bg-red-100"} ${checkedVariantesList.includes(item?.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                        />
                                        <span
                                            className={`flex flex-rox justify-start items-center h-8 border-y border-r border-gray-300 rounded-r-md xl:px-2.5 cursor-pointer caret-transparent group ${item?.deleted && "bg-red-100"} ${checkedVariantesList.includes(item?.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                            onClick={() => handleUnlimitedStockProduct(item)}>
                                            <input
                                                className='caret-transparent cursor-pointer bg-red-500'
                                                id={`unlimitedStockCheckbox${item?.id}`}
                                                type="checkbox"
                                                // placeholder="Illimité"
                                                checked={item?.stock != undefined ? false : item?.unlimited}
                                                // pour pas avoir de warning "input checkbox non controlé"
                                                onChange={() => { }}
                                            />
                                            <span
                                                className="absolute top-[-50px] left-0 h-auto truncate  invisible group-hover:visible w-auto flex justify-start p-3 text-sm text-gray-700 bg-white z-[100] rounded-md shadow-md cursor-default border border-gray-300"
                                            >
                                                {item?.unlimited ? 'Stock illimité' : 'Entrer une quantité'}
                                            </span>
                                        </span>
                                    </div>
                                </div>}

                            {/* cost -- */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('cost') &&
                                <div className='w-full overflow-hidden'>
                                    <input
                                        id={`inputCostPrice${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVarianteCost(e, item)}
                                        value={item?.cost == null ? '' : item?.cost}
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
                                        id={`inputSku${item?.id}`}
                                        type="text"
                                        onChange={(e) => handleVarianteProductCode(e, item)}
                                        value={item?.sku == null ? '' : item?.sku}
                                        placeholder=""
                                        className={`w-full h-8 border border-gray-300 rounded-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                </div>}

                            {/* parcelWeight */}
                            {visiblesFields[indexOfVisiblesFields]?.includes('weight') &&
                                <div className='w-full overflow-hidden flex flex-row justify-start items-center'>
                                    <input
                                        id={`inputWeight${item?.id}`}
                                        type="number"
                                        step=".01"
                                        onChange={(e) => handleVarianteParcelWeight(e, item)}
                                        value={item?.weight == null ? '' : item?.weight}
                                        placeholder="0.00"
                                        min="0"
                                        max="9999999999"
                                        className={`w-full h-8 border border-gray-300 rounded-l-md pl-2 text-sm leading-6 bg-white ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                    />
                                    <select id="ulVarianteParcelWeightMeasureUnit28822"
                                        className={`w-16 h-8 flex justify-center items-center border-y border-r border-gray-300 bg-white text-gray-500 text-sm font-semibold rounded-r-md ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"} ${animateSlideLeftIsActived && "animate-slideLeft"} ${animateSlideRightIsActived && "animate-slideRight"}`}
                                        value={item?.weightMeasure}
                                        onChange={(e) => handleVarianteWeightMeasureUnit(e, item)}
                                    >
                                        <option value="gr">gr</option>
                                        <option value="kg">kg</option>
                                    </select>
                                </div>}

                            {/* image variante */}
                            <span
                                className={`w-full h-8 border border-gray-300 flex justify-center items-center cursor-pointer ${item.deleted && "bg-red-100"} ${checkedVariantesList.includes(item.id) && "bg-blue-50"}`}
                                onClick={() => loadImagesVariantes(item)}
                            >
                                {
                                    item.image_path != undefined && item.image_path != null && Object.keys(item.image_path).length != 0 ?
                                        <img className='w-auto max-h-[28px]'
                                            src={'/storage/' + item.image_path}
                                        />
                                        :
                                        item.selectedImage?.path != undefined && item.selectedImage?.path != null && Object.keys(item.selectedImage?.path).length != 0 ?
                                            <img className='w-auto max-h-[28px]'
                                                src={'/storage/' + item.selectedImage.path}
                                            />

                                            :

                                            <img className='w-6 h-auto'
                                                src='../images/icons/image.svg'
                                            />
                                }
                            </span>

                            {/* delete */}
                            <div className='group flex justify-center items-center w-full h-8 p-0 m-0 cursor-pointer'>
                                {
                                    !item.deleted ?
                                        <span
                                            onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                            className='flex justify-center items-center w-8 h-8 p-0 m-0 cursor-pointer hover:bg-red-500 rounded-md'>
                                            <img src={'/images/icons/trash.svg'} className="h-5 w-5 group-hover:hidden" />
                                            <img src={'/images/icons/x-white.svg'} className="h-6 w-6 hidden group-hover:block" />
                                        </span>
                                        :
                                        <span
                                            onClick={() => toggleDeleteUndeleteVariante(item.id)}
                                            className='flex justify-center items-center w-8 h-8 p-0 m-0 cursor-pointer hover:bg-blue-200 rounded-md'>
                                            <img src={'/images/icons/arrow-back.svg'} className="h-5 w-5" />
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
        </div>
    );
}

export default WithHandleSelectionList(OptionVariantesList);
