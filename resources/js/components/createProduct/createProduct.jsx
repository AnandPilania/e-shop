import { React, useState, useEffect, useContext } from 'react';
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


// props.id = detailx
const CreateProduct = () => {

    const [showModalFromPrice, setShowModalFromPrice] = useState(false);

    const { descriptionProduct, setListSuppliers, supplier, collections, productPrice, productStock, productParcelWeight, transporter, productParcelWeightMeasureUnit, messageModal, setMessageModal, nameProduct, optionsObj, setOptionsData, activeCalculTva, setTvaRateList, tva, imageVariantes, productCode, productCost, reducedProductPrice, variantes, metaTitleProduct, metaDescriptionProduct, metaUrlProduct, setListTransporters, ribbonProduct, screenSize, unlimited, isInAutoCollection } = useContext(AppContext);

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
        Axios.get(`http://127.0.0.1:8000/getOptionValues`)
            .then((res) => {
                setOptionsData(Object.values(res.data));
            });

    }, []);


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
            setMessageModal('Le champ nom est obligatoir');
            setShowModalFromPrice(true);
            return false;
        }

        // price validation
        if (productPrice <= 0) {
            setMessageModal('Le champ prix est obligatoir');
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

    }

    const closelModal = () => {
        setShowModalFromPrice(false);
    }

    // console.log('uuidv4  ', uuidv4());

    function handleSubmit(e) {
        e.preventDefault();

        validation();

        // delete removed tinyMCE images in folder and db
        handleTinyMceTemporary(descriptionProduct, null, 'product');

        var formData = new FormData;

        formData.append('nameProduct', nameProduct);
        formData.append('ribbonProduct', ribbonProduct);
        formData.append('descriptionProduct', descriptionProduct);
        formData.append('imageVariantes', JSON.stringify(imageVariantes));
        formData.append('collections', JSON.stringify(collections));
        formData.append('isInAutoCollection', isInAutoCollection);
        formData.append('productPrice', productPrice);
        formData.append('reducedProductPrice', reducedProductPrice);
        formData.append('productCost', productCost);
        formData.append('productStock', productStock);
        formData.append('unlimitedStock', unlimited);
        formData.append('productSKU', productCode == '' ? uuidv4() : productCode);
        formData.append('productParcelWeight', productParcelWeight);
        formData.append('WeightMeasureUnit', productParcelWeightMeasureUnit);
        formData.append('transporter', JSON.stringify(transporter));
        formData.append('tva', JSON.stringify(tva));
        formData.append('supplier', JSON.stringify(supplier));
        formData.append('optionsObj', JSON.stringify(optionsObj));
        formData.append('variantes', JSON.stringify(variantes));
        formData.append('metaUrlProduct', metaUrlProduct);
        formData.append('metaTitleProduct', metaTitleProduct);
        formData.append('metaDescriptionProduct', metaDescriptionProduct);

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
        console.log('productSKU  ', productCode == '' ? uuidv4() : productCode);
        console.log('productParcelWeight  ', productParcelWeight);
        console.log('productParcelWeightMeasureUnit  ', productParcelWeightMeasureUnit);
        console.log('transporter  ', transporter);
        console.log('tva  ', JSON.stringify(tva));
        console.log('supplier  ', supplier);
        console.log('optionsObj  ', optionsObj);
        console.log('variantes  ', variantes);
        console.log('metaUrlProduct   ', metaUrlProduct);
        console.log('metaTitleProduct   ', metaTitleProduct);
        console.log('metaDescriptionProduct   ', metaDescriptionProduct);

        Axios.post(`http://127.0.0.1:8000/products`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('res.data  --->  ok');

            });
    }


    return (
        <div className="w-full px-2.5 lg:p-0">
            {/* {screenSize > 1023 ? */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_33.3333%] gap-4 justify-center items-start lg:w-[95%] xl:w-[90%] 2xl:w-[80%] 3xl:w-[70%] min-h-[100vh] mt-[50px] mx-auto  text-base">
                <div className="w-full grid grid-cols-1 gap-y-4">
                    <Flex_col_s_s>
                        <h4 className="mb-5 font-semibold text-xl">
                            Ajouter un produit
                        </h4>
                        <NameAndRibbon />
                        <Description />
                    </Flex_col_s_s>

                    <DropZoneProduct />

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
        </div>
    )
}

export default CreateProduct;

