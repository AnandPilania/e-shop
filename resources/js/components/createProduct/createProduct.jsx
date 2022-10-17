import { React, useState, useEffect, useContext } from 'react';
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
import { usePromptProduct } from './usePromptProduct';
import ModalConfirmation from '../modal/modalConfirmation';


const CreateProduct = () => {

    const navigate = useNavigate();

    const [showModalFromPrice, setShowModalFromPrice] = useState(false);
    const [isDirtyCreateProduct, setIsDirtyCreateProduct] = useState(false);
    const [hooksComparation, setHooksComparation] = useState({});
    const [showModalLeaveWithoutSave, setShowModalLeaveWithoutSave] = useState(false);
    const [tvaComparation, setTvaComparation] = useState('');
    const [leaveProductFormWithoutSaveChange, setLeaveProductFormWithoutSaveChange] = useState(false);
    const [productStatus, setProductStatus] = useState(1);
    const [showBackButton, setShowBackButton] = useState(false);


    const { descriptionProduct, setListSuppliers, supplier, setSupplier, collections, productPrice, productStock, productParcelWeight, transporter, productParcelWeightMeasureUnit, messageModal, setMessageModal, nameProduct, setNameProduct, optionsObj, setOptionsData, activeCalculTva, setTvaRateList, tva, setTva, imageVariantes, productCode, productCost, reducedProductPrice, variantes, metaTitleProduct, metaDescriptionProduct, metaUrlProduct, setListTransporters, ribbonProduct, setRibbonProduct, screenSize, unlimited, isInAutoCollection, setIsInAutoCollection, dateFieldProduct, setDateFieldProduct, products, setProducts, listProductsFiltered, setListProductsFiltered, listProductsChecked, setListProductsChecked, setDescriptionProduct, setCollections, setProductPrice, promoApplied, promoType, setPromoType, setProductParcelWeight, setProductParcelWeightMeasureUnit, setPromoApplied, setReducedProductPrice, setProductCost, setProductStock, setProductCode, setOptionsObj, setUnlimited, setVariantes, setTransporter, setMetaTitleProduct, setMetaDescriptionProduct, setMetaUrlProduct, setImageVariantes, isEditProduct, setIsEditProduct, isShowPromoProduct, setIsShowPromoProduct, setShowOptions } = useContext(AppContext);

    // when click on edit in collection list it send collection id to db request for make edit collection
    const { state } = useLocation();
    const { productId, isEdit } = state !== null ? state : { productId: null, isEdit: false };


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

        // charge les données des types d'options et leurs valeurs ex. Couleurs, rouge, vert, ...
        // Axios.get(`http://127.0.0.1:8000/getOptionValues`)
        //     .then((res) => {
        //         setOptionsData(Object.values(res.data));
        //     });

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
        };
        // Check if the page has already loaded
        if (document.readyState === "complete") {
            showBackButtonWhenPageLoaded();
        } else {
            window.addEventListener("load", showBackButtonWhenPageLoaded);
            return () => window.removeEventListener("load", showBackButtonWhenPageLoaded);
        }


        if (isEdit) {
            let idProduct = new FormData;
            idProduct.append('productId', productId);
            Axios.post(`http://127.0.0.1:8000/getProduct`, idProduct)
                .then(res => {
                    let data = res.data[0];
                    setNameProduct(data.name == null ? '' : data.name);
                    setIsInAutoCollection(data.isInAutoCollection == 1 ? true : false);
                    setRibbonProduct(data.ribbon == null ? '' : data.ribbon);
                    setDescriptionProduct(data.description);
                    setCollections([...data.collections]);
                    setProductPrice(data.price);
                    setReducedProductPrice(data.reduced_price == null ? '' : data.reduced_price);
                    setPromoApplied(data.reduction == null ? '' : data.reduction);
                    setPromoType(data.reductionType);
                    setProductCost(data.cost == null ? '' : data.cost);
                    setProductStock(data.stock == 0 ? '' : data.stock);
                    setUnlimited(data.unlimitedStock);
                    setProductStatus(data.status);
                    setProductParcelWeight(data.weight == null ? '' : data.weight);
                    setProductParcelWeightMeasureUnit(data.weightMeasure);
                    setProductCode(data.sku == null ? '' : data.sku);
                    setTransporter(JSON.parse(data.onlyTheseCarriers));
                    setOptionsObj(JSON.parse(data.optionsObj));
                    setMetaUrlProduct(data.metaUrl == null ? '' : data.metaUrl);
                    setMetaTitleProduct(data.metaTitle == null ? '' : data.metaTitle);
                    setMetaDescriptionProduct(data.metaDescription == null ? '' : data.metaDescription);
                    setDateFieldProduct(data.dateActivation);
                    setTva(data.taxe_id);
                    setSupplier(data.supplier == null ? '' : data.supplier);
                    setVariantes(data.variantes);

                    // affiche la partie promo dans price
                    if (data.reduction != null || data.reduced_price != null) {
                        setIsShowPromoProduct(true);
                    }

                    // tableau de comparaison pour checker if isDirty
                    let hooksCompar = [];
                    hooksCompar.nameProduct = data.name == null ? '' : data.name;
                    hooksCompar.isInAutoCollection = data.isInAutoCollection == 1 ? true : false;
                    hooksCompar.ribbonProduct = data.ribbon == null ? '' : data.ribbon;
                    hooksCompar.descriptionProduct = data.description;
                    hooksCompar.collections = [...data.collections];
                    hooksCompar.productPrice = data.price;
                    hooksCompar.reducedProductPrice = data.reduced_price == null ? '' : data.reduced_price;
                    hooksCompar.promoApplied = data.reduction == null ? '' : data.reduction;
                    // hooksCompar.promoApplied = data.reduction == null ? '' : data.reduction;
                    hooksCompar.promoType = data.reductionType;
                    hooksCompar.productCost = data.cost == null ? '' : data.cost;
                    hooksCompar.productStock = data.stock == null ? '' : data.stock;
                    hooksCompar.unlimited = data.unlimitedStock;
                    hooksCompar.productParcelWeight = data.weight == null ? '' : data.weight;
                    hooksCompar.productParcelWeightMeasureUnit = data.weightMeasure;
                    hooksCompar.productCode = data.sku == null ? '' : data.sku;
                    hooksCompar.transporter = JSON.parse(data.onlyTheseCarriers);
                    hooksCompar.metaUrlProduct = data.metaUrl == null ? '' : data.metaUrl;
                    hooksCompar.metaTitleProduct = data.metaTitle == null ? '' : data.metaTitle;
                    hooksCompar.metaDescriptionProduct = data.metaDescription == null ? '' : data.metaDescription;
                    hooksCompar.dateFieldProduct = data.dateActivation;
                    hooksCompar.tva = data.taxe_id;
                    hooksCompar.supplier = data.supplier == null ? '' : data.supplier;
                    hooksCompar.variantes = data.variantes;
                    hooksCompar.imageVariantes = data.images_products;
                    // affiche la partie promo dans price
                    if (data.reduction != null || data.reduced_price != null) {
                        hooksCompar.isShowPromoProduct = true;
                    } else {
                        hooksCompar.isShowPromoProduct = false;
                    }
                    setHooksComparation(hooksCompar);

                    if (JSON.parse(data.optionsObj)[0].name.length > 0) setShowOptions(true);
                })

            setIsEditProduct(true);
        } else {
            initCreateProduct();
        }
    }, []);

    // console.log('variantes  ', variantes)
    // console.log('optionsObj  ', optionsObj)

    // console.log('showBackButton  ', showBackButton);

    const initCreateProduct = () => {
        setNameProduct('');
        setIsInAutoCollection(true);
        setRibbonProduct('');
        setDescriptionProduct('')
        setCollections([]);
        setProductPrice('');
        setReducedProductPrice('');
        setPromoApplied('');
        setPromoType('%');
        setProductCost('');
        setProductStock('');
        setUnlimited(false);
        setProductParcelWeight('');
        setProductParcelWeightMeasureUnit('gr');
        setProductCode('');
        setTransporter([]);
        setMetaUrlProduct('');
        setMetaTitleProduct('');
        setMetaDescriptionProduct('');
        setDateFieldProduct(getNow());
        setTva(tvaComparation);
        setSupplier('');
        setVariantes([]);
        setImageVariantes([[]]);
        setIsShowPromoProduct(false);
        setIsDirtyCreateProduct(false);
        checkIfCreateProductIsDirty();
        setIsEditProduct(false);
    }


    const checkIfCreateProductIsDirty = () => {
        if (isEditProduct) {
            // check collections
            let idsCollectionsPrev = hooksComparation.collections.map(x => x.id);
            let idsCollectionsCurr = collections.map(x => x.id);
            let isNotColectionsChanged = idsCollectionsPrev.every(id => idsCollectionsCurr.includes(id)) && idsCollectionsPrev.length === idsCollectionsCurr.length;

            let idsTransportersPrev = hooksComparation.transporter.map(x => x.modeId);
            let idsTransportersCurr = transporter.map(x => x.modeId);
            let isNotTransportersChanged = idsTransportersPrev.every(id => idsTransportersCurr.includes(id)) && idsTransportersPrev.length === idsTransportersCurr.length;

            let comparVariantesLibelle = hooksComparation.variantes.map(x => x.optionsString)
            let variantesLibelle = variantes.map(x => x.optionsString)
            let isNotVaraiantesChanged = variantesLibelle.every(x => comparVariantesLibelle.includes(x)) && comparVariantesLibelle.length === variantesLibelle.length;

            if (
                hooksComparation.nameProduct != nameProduct ||
                hooksComparation.isInAutoCollection != isInAutoCollection ||
                hooksComparation.ribbonProduct != ribbonProduct ||
                hooksComparation.descriptionProduct != descriptionProduct ||
                isNotColectionsChanged === false ||
                hooksComparation.productPrice != productPrice ||
                hooksComparation.reducedProductPrice != reducedProductPrice ||
                hooksComparation.promoApplied != promoApplied ||
                hooksComparation.promoType != promoType ||
                hooksComparation.productCost != productCost ||
                hooksComparation.productStock != productStock ||
                hooksComparation.unlimited != unlimited ||
                hooksComparation.productParcelWeight != productParcelWeight ||
                hooksComparation.productParcelWeightMeasureUnit != productParcelWeightMeasureUnit ||
                hooksComparation.productCode != productCode ||
                isNotTransportersChanged === false ||
                hooksComparation.metaUrlProduct != metaUrlProduct ||
                hooksComparation.metaTitleProduct != metaTitleProduct ||
                hooksComparation.metaDescriptionProduct != metaDescriptionProduct ||
                // // hooksComparation.// // dateFieldProduct
                hooksComparation.tva != tva.id ||
                hooksComparation.supplier != supplier ||
                isNotVaraiantesChanged == false ||
                hooksComparation.isShowPromoProduct != isShowPromoProduct
            ) {
                setIsDirtyCreateProduct(true);
                return true;
            } else {
                setIsDirtyCreateProduct(false);
                return false;
            }
        } else {
            if (
                nameProduct != '' ||
                isInAutoCollection != true ||
                ribbonProduct != '' ||
                descriptionProduct != '' ||
                collections.length > 0 ||
                productPrice != '' ||
                reducedProductPrice != '' ||
                promoApplied != '' ||
                promoType != '%' ||
                productCost != '' ||
                productStock != '' ||
                unlimited != false ||
                productParcelWeight != '' ||
                productParcelWeightMeasureUnit != 'gr' ||
                productCode != '' ||
                transporter.length > 0 ||
                metaUrlProduct != '' ||
                metaTitleProduct != '' ||
                metaDescriptionProduct != '' ||
                // // dateFieldProduct
                tva.id != tvaComparation.id ||
                supplier != '' ||
                variantes.length > 0 ||
                imageVariantes[0].length > 0 ||
                isShowPromoProduct != false
            ) {
                setIsDirtyCreateProduct(true);
                return true;
            } else {
                setIsDirtyCreateProduct(false);
                return false;
            }
        }
    }

    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptProduct('Quitter sans sauvegarder les changements ?', checkIfCreateProductIsDirty, setShowModalLeaveWithoutSave, setMessageModal, leaveProductFormWithoutSaveChange, setLeaveProductFormWithoutSaveChange);


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
        if (nameProduct.length == 0) {
            setMessageModal('Le champ nom est requis');
            setShowModalFromPrice(true);
            return false;
        }

        // price validation
        if (productPrice <= 0) {
            setMessageModal('Le champ prix est requis');
            setShowModalFromPrice(true);
            return false;
        }

        // options
        for (let i = 0; i < optionsObj.length; i++) {

            if (optionsObj[i].name == '') {
                let spanMessage = document.getElementById(`name${optionsObj[i].id}`);
                spanMessage.innerHTML = 'Le champ nom de l\'option ne peut pas être vide';

                let inputOptionError = document.getElementsByClassName(`name${optionsObj[i].id}`)[0];

                if (inputOptionError !== undefined) {
                    inputOptionError.classList.remove('border-gray-300');
                    inputOptionError.classList.add('border-red-500');
                }
            }

            if (optionsObj[i].values.length == 0) {
                let spanMessage = document.getElementById(`value${optionsObj[i].id}`);
                spanMessage.innerHTML = 'Le champ valeur de l\'option ne peut pas être vide';

                let inputOptionValueError = document.getElementsByClassName(`value${optionsObj[i].id}`)[0];
                if (inputOptionValueError !== undefined) {
                    inputOptionValueError.classList.remove('border-gray-300');
                    inputOptionValueError.classList.add('border-red-500');
                }
            }
        }
        return true;
    }

    const closelModal = () => {
        setShowModalFromPrice(false);
        setShowModalLeaveWithoutSave(false);
    }
    // console.log('optionsObj  ', optionsObj)
    const consolelog = () => {
        console.log('nameProduct  ', nameProduct);
        console.log('ribbonProduct  ', ribbonProduct);
        console.log('descriptionProduct  ', descriptionProduct);
        console.log('imageVariantes', JSON.stringify(imageVariantes));
        console.log('collections  ', collections);
        console.log('isInAutoCollection  ', isInAutoCollection);
        console.log('productPrice  ', productPrice);
        console.log('reducedProductPrice  ', reducedProductPrice);
        console.log('productCost  ', productCost);
        console.log('productStock  ', productStock);
        console.log('productSKU  ', productCode);
        console.log('productParcelWeight  ', productParcelWeight);
        console.log('productParcelWeightMeasureUnit  ', productParcelWeightMeasureUnit);
        console.log('transporter  ', transporter);
        console.log('tva  ', JSON.stringify(tva));
        console.log('supplier  ', supplier);
        console.log('dateFieldProduct  ', dateFieldProduct);
        console.log('optionsObj  ', optionsObj);
        console.log('variantes  ', variantes);
        console.log('metaUrlProduct   ', metaUrlProduct);
        console.log('metaTitleProduct   ', metaTitleProduct);
        console.log('metaDescriptionProduct   ', metaDescriptionProduct);
        console.log('isDirtyCreateProduct   ', isDirtyCreateProduct);
    }
    // consolelog();

    function handleSubmit(e) {
        e.preventDefault();

        if (validation()) {
            // delete removed tinyMCE images in folder and db
            handleTinyMceTemporary(descriptionProduct, null, 'product');

            var formData = new FormData;

            formData.append('isEdit', isEdit);
            formData.append('productId', productId);
            formData.append('nameProduct', nameProduct);
            formData.append('ribbonProduct', ribbonProduct);
            formData.append('descriptionProduct', descriptionProduct);
            var arrayOfImages = [];
            imageVariantes.forEach(imgArr => {
                imgArr.forEach(img => {
                    arrayOfImages.push(img);
                });
            });
            console.log('arrayOfImages  ', arrayOfImages)
            formData.append('imageVariantes', JSON.stringify(arrayOfImages));
            formData.append('collections', JSON.stringify(collections));
            formData.append('isInAutoCollection', isInAutoCollection);
            formData.append('productPrice', productPrice);
            formData.append('reducedProductPrice', reducedProductPrice);
            formData.append('promoApplied', promoApplied);
            formData.append('promoType', promoType);
            formData.append('productCost', productCost);
            formData.append('productStock', productStock == '' ? 0 : productStock);
            formData.append('unlimitedStock', unlimited);
            formData.append('productSKU', productCode == '' ? uuidv4() : productCode);
            formData.append('productParcelWeight', productParcelWeight);
            formData.append('WeightMeasureUnit', productParcelWeightMeasureUnit);
            formData.append('transporter', JSON.stringify(transporter));
            formData.append('tva', JSON.stringify(tva));
            formData.append('supplier', JSON.stringify(supplier));
            formData.append("dateActivation", dateFieldProduct);
            formData.append("productStatus", productStatus);
            formData.append('optionsObj', JSON.stringify(optionsObj));
            formData.append('variantes', JSON.stringify(variantes));
            formData.append('metaUrlProduct', metaUrlProduct);
            formData.append('metaTitleProduct', metaTitleProduct);
            formData.append('metaDescriptionProduct', metaDescriptionProduct);

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
                        isEditProduct={isEditProduct}
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

