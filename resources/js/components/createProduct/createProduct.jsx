import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Options from './options/options';
import DropZoneProduct from './dropZoneProduct';
import Price from './price';
import Stock from './stock';
import Collection from './collection';
import OptimisationProduct from './optimisationProduct';
import Axios from "axios";
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import NameAndRibbon from './name';
import Description from './description';
import Supplier from './supplier';
import Tva from './tva';
import Shipping from './shipping';
import { v4 as uuidv4 } from 'uuid';
import Activation from './activation';
import Header from './header';
import { getNow } from '../functions/dateTools';
// import { usePromptProduct } from './usePromptProduct';
import ModalConfirmation from '../modal/modalConfirmation';
import moment from 'moment';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { isSet } from '../functions/isSet';


const CreateProduct = () => {
    const isVisiblePage = usePageVisibility()

    const navigate = useNavigate();

    const [isLocalStorage, setIsLocalStorage] = useState(false);
    const [showModalFromPrice, setShowModalFromPrice] = useState(false);
    const [showModalLeaveWithoutSave, setShowModalLeaveWithoutSave] = useState(false);
    const [leaveProductFormWithoutSaveChange, setLeaveProductFormWithoutSaveChange] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);


    const { descriptionProduct, setListSuppliers, supplier, collections, productPrice, productStock, productParcelWeight, transporter, productParcelWeightMeasureUnit, messageModal, setMessageModal, nameProduct, activeCalculTva, setTvaRateList, tva, imageVariantes, productCode, productCost, reducedProductPrice, metaTitleProduct, metaDescriptionProduct, metaUrlProduct, setListTransporters, ribbonProduct, screenSize, unlimited, isInAutoCollection, dateFieldProduct, promoApplied, promoType, setIsEditProduct, setIdProduct, initCreateProduct, setTvaComparation, isDirtyCreateProduct, productStatus, setShowOptions, setHooksComparation, setChangedVariantes, setProductStatus, setImageVariantes, setHasLeaveThisPage, handleLocalStorage, setIsVisible, productForm, setProductForm } = useContext(AppContext);

    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();
    const { productId, isEdit } = state !== null ? state : { productId: null, isEdit: false };


    // If the page is hidden, save in localStorage;
    useEffect(() => {
        if (!isVisiblePage) {
            handleLocalStorage();
            setIsVisible(true);
        }
    }, [isVisiblePage]);


    useEffect(() => {
        // charge la liste des fournisseurs
        Axios.get(`http://127.0.0.1:8000/suppliers-list`)
            .then(res => {
                setListSuppliers(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });

        // charge la liste des transporteurs
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setListTransporters(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });


        // récup la tva default pour comparaison if dirty
        Axios.get("http://127.0.0.1:8000/getTaxes")
            .then(res => {
                let tmpTva = res.data.filter(x => x.is_default == 1);
                setTvaComparation(tmpTva[0]);
            })
            .catch(error => {
                console.log('Error : ' + error.status);
            });


        // show back button only when page completly loaded
        const showBackButtonWhenPageLoaded = () => {
            setShowBackButton(true);
        }
        // Check if the page has already loaded
        if (document.readyState === "complete") {
            showBackButtonWhenPageLoaded();
        } else {
            window.addEventListener("load", showBackButtonWhenPageLoaded);
            return () => window.removeEventListener("load", showBackButtonWhenPageLoaded);
        }

        if (isEdit) {
            localStorage.removeItem('productForm');
            initCreateProduct();
            setIsLocalStorage(true);
            setIdProduct(productId);
            let idProd = new FormData;
            idProd.append('productId', productId);
            Axios.post(`http://127.0.0.1:8000/getProduct`, idProd)
                .then(res => {
                    console.log('res data   ', res.data)
                    let data = res.data[0];
                    setProductData(data);
                    loadImagesVariantes(data);
                });
            setIsEditProduct(true);
        } else {
            if (localStorage.getItem('productForm') != null) {
                initCreateProduct();
                let data = JSON.parse(localStorage.getItem('productForm'));
                setProductData(data);
                loadImagesVariantes(data);
                // setIsLocalStorage(true);
            } else {
                initCreateProduct();
            }
        }
        // indique la page qu'on quitte. Sert à gérer le stockage en local storage des formulaires dirty
        setHasLeaveThisPage('createProductForm');
    }, []);

    const loadImagesVariantes = (data) => {
        let tmp_data = [[]];
        let tmp = [];
        console.log('data   ', data)
        let imagesProduct = [];
        if ('images_products' in data) {
            imagesProduct = data.images_products;
        } else if ('imageVariantes' in data) {
            imagesProduct = data.imageVariantes[0];
        }
        if (imagesProduct.length > 0) {
            imagesProduct.sort(function (a, b) {
                return a.ordre - b.ordre;
            });
            for (let i = 0; i < imagesProduct.length; i++) {
                if (tmp.length < 4) {
                    tmp.push(imagesProduct[i]);
                    tmp_data.splice(-1, 1, tmp);
                } else {
                    tmp = [];
                    tmp.push(imagesProduct[i]);
                    tmp_data.push(tmp);
                }
            };
            setImageVariantes(tmp_data);
        }
    }


    console.log('productForm  ', productForm)
    // console.log('imageVariantes  ', imageVariantes)
    const setProductData = (data) => {
        let name = data.name == undefined ? data.nameProduct : data.name;
        let ribbon = data.ribbon == undefined ? data.ribbonProduct : data.ribbon;
        let description = data.description == undefined ? data.descriptionProduct : data.description;
        let price = data.price == undefined ? data.productPrice : data.price;
        let reduced_price = data.reduced_price == undefined ? data.reducedProductPrice : data.reduced_price;
        let reduction = data.reduction == undefined ? data.promoApplied : data.reduction;
        let reductionType = data.reductionType == undefined ? data.promoType : data.reductionType;
        let cost = data.cost == undefined ? data.productCost : data.cost;
        let stock = data.stock == undefined ? data.productStock : data.stock;
        let unlimitedStock = data.unlimitedStock == undefined ? data.unlimited : data.unlimitedStock;
        let status = data.status == undefined ? data.productStatus : data.status;
        let weight = data.weight == undefined ? data.productParcelWeight : data.weight;
        let weightMeasure = data.weightMeasure == undefined ? data.productParcelWeightMeasureUnit : data.weightMeasure;
        let sku = data.sku == undefined ? data.productCode : data.sku;
        let onlyTheseCarriers = data.onlyTheseCarriers == undefined ? data.transporter : JSON.parse(data.onlyTheseCarriers);
        let metaUrl = data.metaUrl == undefined ? data.metaUrlProduct : data.metaUrl;
        let metaTitle = data.metaTitle == undefined ? data.metaTitleProduct : data.metaTitle;
        let metaDescription = data.metaDescription == undefined ? data.metaDescriptionProduct : data.metaDescription;
        let dateActivation = data.dateActivation == undefined ? data.dateFieldProduct : moment(new Date(data.dateActivation)).format("DD-MM-YYYY HH:mm:ss");
        // sert à conserver les mini images dans optionsVariantesList quand on ajoute des options. A GARDER !
        let changed_variantes = [];
        if (isEdit) {
            changed_variantes = data.variantes.filter(x => x.image_path != "");
        } else {
            let hasImage_path = data.variantes.filter(x => x.image_path != "");
            if (hasImage_path.length > 0) {
                changed_variantes = hasImage_path;
            } else {
                let hasSelectedImage = data.variantes.filter(x => 'selectedImage' in x);
                if (hasSelectedImage.length > 0) {
                    changed_variantes = hasSelectedImage;
                }
            }
        }
        // affiche la partie promo dans price
        let isShow_PromoProduct = false;
        if (isSet(data.reduction) || isSet(data.reduced_price)) {
            isShow_PromoProduct = true;
        } else {
            isShow_PromoProduct = false;
        }

        setProductForm({
            nameProduct: name == null ? '' : name,
            isInAutoCollection: data.isInAutoCollection == 1 ? true : false,
            ribbonProduct: ribbon == null ? '' : ribbon,
            descriptionProduct: description,
            collections: [...data.collections],
            productStatus: status,
            productPrice: price,
            reducedProductPrice: reduced_price == null ? '' : reduced_price,
            promoApplied: reduction == null ? '' : reduction,
            promoType: reductionType,
            productCost: cost == null ? '' : cost,
            productStock: stock == 0 ? '' : stock,
            unlimited: unlimitedStock,
            productParcelWeight: weight == null ? '' : weight,
            productParcelWeightMeasureUnit: weightMeasure,
            productCode: sku == null ? '' : sku,
            transporter: onlyTheseCarriers != undefined ? onlyTheseCarriers : [],
            metaUrlProduct: metaUrl == null ? '' : metaUrl,
            metaTitleProduct: metaTitle == null ? '' : metaTitle,
            metaDescriptionProduct: metaDescription == null ? '' : metaDescription,
            dateFieldProduct: dateActivation,
            tva: data.taxe,
            supplier: data.supplier == null ? '' : data.supplier,
            variantes: data.variantes,
            optionsObj: Array.isArray(data.optionsObj) ? data.optionsObj : JSON.parse(data.optionsObj),
            isShowPromoProduct: isShow_PromoProduct,
            changedVariantes: changed_variantes,
        });



        // tableau de comparaison pour checker if isDirty
        let hooksCompar = [];
        hooksCompar.nameProduct = name == null ? '' : name;
        hooksCompar.isInAutoCollection = data.isInAutoCollection == 1 ? true : false;
        hooksCompar.ribbonProduct = ribbon == null ? '' : ribbon;
        hooksCompar.descriptionProduct = description;
        hooksCompar.collections = [...data.collections];
        hooksCompar.productPrice = price;
        hooksCompar.reducedProductPrice = reduced_price == null ? '' : reduced_price;
        hooksCompar.promoApplied = reduction == null ? '' : reduction;
        hooksCompar.promoType = reductionType;
        hooksCompar.productCost = cost == null ? '' : cost;
        hooksCompar.productStock = stock == null ? '' : stock;
        hooksCompar.unlimited = data.unlimitedStock;
        hooksCompar.productParcelWeight = weight == null ? '' : weight;
        hooksCompar.productParcelWeightMeasureUnit = weightMeasure;
        hooksCompar.productCode = sku == null ? '' : sku;
        hooksCompar.transporter = onlyTheseCarriers != undefined ? onlyTheseCarriers : [];
        hooksCompar.metaUrlProduct = metaUrl == null ? '' : metaUrl;
        hooksCompar.metaTitleProduct = metaTitle == null ? '' : metaTitle;
        hooksCompar.metaDescriptionProduct = metaDescription == null ? '' : metaDescription;
        hooksCompar.dateFieldProduct = dateActivation;
        hooksCompar.tva = data.taxe;
        hooksCompar.supplier = data.supplier == null ? '' : data.supplier;
        hooksCompar.variantes = data.variantes;
        hooksCompar.changedVariantes = productForm.changedVariantes;
        hooksCompar.imageVariantes = data.images_products == null ? imageVariantes : data.images_products;
        setHooksComparation(hooksCompar);

        if (Array.isArray(data.optionsObj)) {
            if (data.optionsObj[0]?.name.length > 0) setShowOptions(true);
        } else {
            if (typeof data.optionsObj === 'string' && JSON.parse(data.optionsObj)[0]?.name.length > 0) setShowOptions(true);
        }
    }


    console.log('productForm.variantes  ', productForm.variantes)

    const handleModalConfirm = () => {
        setShowModalLeaveWithoutSave(false)
        setLeaveProductFormWithoutSaveChange(true);
        initCreateProduct();
    }


    // récupère la liste des tva et setTva avec la tva par défaut
    useEffect(() => {
        activeCalculTva == 1 &&
            Axios.get("http://127.0.0.1:8000/getTaxes")
                .then(res => {
                    setTvaRateList(res.data);
                })
                .catch(error => {
                    console.log('Error : ' + error.status);
                });
    }, [activeCalculTva])


    const validation = () => {
        // name validation
        if (productForm.nameProduct.length == 0) {
            setMessageModal('Le champ nom est requis');
            setShowModalFromPrice(true);
            return false;
        }

        // price validation
        if (productForm.productPrice <= 0) {
            setMessageModal('Le champ prix est requis');
            setShowModalFromPrice(true);
            return false;
        }

        // options --> VOIR S IL FAUT VALIDER QUAND OPTION VARIANTE EST ACTIVE MAIS SANS OPTIONNAME ET/OU SANS OPTIONSVALUES !!!!!!!!!!!!!!!!!!!!
        // for (let i = 0; i < optionsObj.length; i++) {

        //     if (optionsObj[i].name == '') {
        //         let spanMessage = document.getElementById(`name${optionsObj[i].id}`);
        //         spanMessage.innerHTML = 'Le champ nom de l\'option ne peut pas être vide';

        //         let inputOptionError = document.getElementsByClassName(`name${optionsObj[i].id}`)[0];

        //         if (inputOptionError !== undefined) {
        //             inputOptionError.classList.remove('border-gray-300');
        //             inputOptionError.classList.add('border-red-500');
        //         }
        //     }

        //     if (optionsObj[i].values.length == 0) {
        //         let spanMessage = document.getElementById(`value${optionsObj[i].id}`);
        //         spanMessage.innerHTML = 'Le champ valeur de l\'option ne peut pas être vide';

        //         let inputOptionValueError = document.getElementsByClassName(`value${optionsObj[i].id}`)[0];
        //         if (inputOptionValueError !== undefined) {
        //             inputOptionValueError.classList.remove('border-gray-300');
        //             inputOptionValueError.classList.add('border-red-500');
        //         }
        //     }
        // }
        return true;
    }

    const closelModal = () => {
        setShowModalFromPrice(false);
        setShowModalLeaveWithoutSave(false);
    }

    // const consolelog = () => {
    //     console.log('nameProduct  ', nameProduct);
    //     console.log('ribbonProduct  ', ribbonProduct);
    //     console.log('descriptionProduct  ', descriptionProduct);
    //     console.log('imageVariantes', JSON.stringify(imageVariantes));
    //     console.log('collections  ', collections);
    //     console.log('isInAutoCollection  ', isInAutoCollection);
    //     console.log('productPrice  ', productPrice);
    //     console.log('reducedProductPrice  ', reducedProductPrice);
    //     console.log('productCost  ', productCost);
    //     console.log('productStock  ', productStock);
    //     console.log('productSKU  ', productCode);
    //     console.log('productParcelWeight  ', productParcelWeight);
    //     console.log('productParcelWeightMeasureUnit  ', productParcelWeightMeasureUnit);
    //     console.log('transporter  ', transporter);
    //     console.log('tva  ', JSON.stringify(tva));
    //     console.log('supplier  ', supplier);
    //     console.log('dateFieldProduct  ', dateFieldProduct);
    //     console.log('optionsObj  ', optionsObj);
    //     console.log('variantes  ', productForm.variantes);
    //     console.log('metaUrlProduct   ', metaUrlProduct);
    //     console.log('metaTitleProduct   ', metaTitleProduct);
    //     console.log('metaDescriptionProduct   ', metaDescriptionProduct);
    //     console.log('isDirtyCreateProduct   ', isDirtyCreateProduct);
    // }
    // consolelog();

    function handleSubmit(e) {
        e.preventDefault();

        if (validation()) {
            // delete removed tinyMCE images in folder and db
            handleTinyMceTemporary(descriptionProduct, null, 'product');

            var formData = new FormData;

            formData.append('isEdit', productForm.isEdit);
            formData.append('productId', productForm.productId);
            formData.append('nameProduct', productForm.nameProduct);
            formData.append('ribbonProduct', productForm.ribbonProduct);
            formData.append('descriptionProduct', productForm.descriptionProduct);
            var arrayOfImages = [];
            imageVariantes.forEach(imgArr => {
                imgArr.forEach(img => {
                    arrayOfImages.push(img);
                });
            });
            formData.append('imageVariantes', JSON.stringify(arrayOfImages));
            formData.append('collections', JSON.stringify(productForm.collections));
            formData.append('isInAutoCollection', productForm.isInAutoCollection);
            formData.append('productPrice', productForm.productPrice);
            formData.append('reducedProductPrice', productForm.reducedProductPrice);
            formData.append('promoApplied', productForm.promoApplied);
            formData.append('promoType', productForm.promoType);
            formData.append('productCost', productForm.productCost);
            formData.append('productStock', productForm.productStock == '' ? 0 : productForm.productStock);
            formData.append('unlimitedStock', productForm.unlimited);
            formData.append('productSKU', productForm.productCode == '' ? uuidv4() : productForm.productCode);
            formData.append('productParcelWeight', productForm.productParcelWeight);
            formData.append('WeightMeasureUnit', productForm.productParcelWeightMeasureUnit);
            formData.append('transporter', JSON.stringify(productForm.transporter));
            formData.append('tva', JSON.stringify(productForm.tva));
            formData.append('supplier', JSON.stringify(productForm.supplier));
            formData.append("dateActivation", productForm.dateFieldProduct);
            formData.append("productStatus", productForm.productStatus);
            formData.append('optionsObj', JSON.stringify(productForm.optionsObj));
            formData.append('variantes', JSON.stringify(productForm.variantes));
            formData.append('metaUrlProduct', productForm.metaUrlProduct);
            formData.append('metaTitleProduct', productForm.metaTitleProduct);
            formData.append('metaDescriptionProduct', productForm.metaDescriptionProduct);

            consolelog();

            Axios.post(`http://127.0.0.1:8000/storeProduct`, formData,
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(() => {
                    setIsEditProduct(false);
                    initCreateProduct();
                    navigate('/listProduct');
                });
        }
    }


    return (
        <div className="w-full px-2.5 lg:p-0">
            {/* {screenSize > 1023 ? */}

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_33.3333%] gap-4 justify-center items-start lg:w-[95%] xl:w-[90%] 2xl:w-[80%] 3xl:w-[70%] min-h-[100vh] mt-[50px] mx-auto  text-base">
                <div className="w-full grid grid-cols-1 gap-y-4">
                    <Flex_col_s_s>
                        {showBackButton &&
                            <Header
                                initCreateProduct={initCreateProduct}
                                isDirtyCreateProduct={isDirtyCreateProduct}
                                productId={productId}
                            />}
                        <h4 className="mb-5 font-semibold text-xl">
                            Ajouter un produit
                        </h4>
                        <NameAndRibbon />
                        <Description />
                    </Flex_col_s_s>

                    <DropZoneProduct
                        isLocalStorage={isLocalStorage}
                        setIsLocalStorage={setIsLocalStorage}
                        productId={productId}
                    />

                    {screenSize < 1024 &&
                        <div className='w-full grid grid-cols-1 gap-y-4'>
                            <Collection />
                            <Price />
                            <Stock />
                            <Shipping />
                            {activeCalculTva == 1 &&
                                <Tva />
                            }
                            <Supplier />
                        </div>
                    }

                    <Options />

                    <OptimisationProduct />
                </div>
                {/* ----------  side  ---------- */}
                <div className='w-full grid grid-cols-1 gap-y-4'>
                    {screenSize > 1023 &&
                        <div className='w-full grid grid-cols-1 gap-y-4'>
                            <Collection />
                            <Price />
                            <Stock />
                            <Shipping />
                            {activeCalculTva == 1 &&
                                <Tva />
                            }
                            <Supplier />
                            <Activation />
                        </div>}
                </div>
            </div>
            <div className='w-full flex justify-center md:justify-start md:w-[90%] lg:w-[95%] xl:w-[90%] 2xl:w-[80%] 3xl:w-[70%] mx-auto mt-5 mb-48'>
                <button
                    className="flex flex-row justify-center items-center w-44 md:w-32 px-3 py-2 rounded-md bg-green-600 text-white"
                    onClick={handleSubmit}
                >
                    Enregistrer
                </button>
            </div>

            {/* modal for simple message */}
            <ModalSimpleMessage
                show={showModalFromPrice} // true/false show modal
                handleModalCancel={closelModal}>
                <h2 className="text-lg font-bold mt-8">{messageModal}</h2>
            </ModalSimpleMessage>
            <ModalConfirmation
                show={showModalLeaveWithoutSave}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={closelModal}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>
        </div>
    )
}

export default CreateProduct;

