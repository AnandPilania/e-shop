import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Options from './options/options';
import SelectWithCheckbox from '../elements/selectWithCheckbox';
import Select from '../elements/select';
import DropZoneProduct from './dropZoneProduct';
import Price from './price';
import Stock from './stock';
import OptimisationProduct from './optimisationProduct';
import TinyeditorProduct from './tinyEditorProduct';
import Axios from "axios";
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import ModalSimpleMessage from '../modal/modalSimpleMessage';



// props.id = detailx
const CreateProduct = () => {

    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [showModalFromPrice, setShowModalFromPrice] = useState(false);
    const [toggleSelectSupplier, setToggleSelectSupplier] = useState(false);
    const [toggleSelectTva, setToggleSelectTva] = useState(false);
    const [selectValueColorTva, setSelectValueColorTva] = useState('');
    const [selectValueColorSupplier, setSelectValueColorSupplier] = useState('');
    const [toggleSelectWithCheckboxCollection, setToggleSelectWithCheckboxCollection] = useState(false);
    const [toggleSelectWithCheckboxTransporter, setToggleSelectWithCheckboxTransporter] = useState(false);


    const { image, descriptionProduct, listSuppliers, setListSuppliers, supplier, setSupplier, collection, setCollection, productPrice, productStock, messageModal, setMessageModal, nameProduct, setNameProduct, optionsObj, setOptionsData, activeCalculTva, tvaRateList, setTvaRateList, tva, setTva, imageVariantes, productCode, productCost, previousProductPrice, variantes, metaTitleProduct, metaDescriptionProduct, metaUrlProduct, listTransporters, setListTransporters, transporter, setTransporter } = useContext(AppContext);

    useEffect(() => {
        // récupére les collections
        Axios.get(`http://127.0.0.1:8000/getCollections`)
            .then(res => {
                setCollectionsRelations(res.data.collections);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });


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

    const removeCollection = (item) => {
        let index = collection.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...collection];
            tmp_arr.splice(index, 1);
            setCollection([...tmp_arr]);
        }
    }

    const removeTransporter = (item) => {
        let index = transporter.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...transporter];
            tmp_arr.splice(index, 1);
            setTransporter([...tmp_arr]);
        }
    }

    const handleName = (e) => {
        setNameProduct(e.target.value);
    }

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


    function handleSubmit(e) {
        e.preventDefault();

        validation();

        // delete removed tinyMCE images in folder and db
        handleTinyMceTemporary(descriptionProduct, null, 'product');

        var formData = new FormData;

        // on boucle sur imageFiles pour récupérer toutes les images
        if (image) {
            for (var i = 0; i < image.length; i++) {
                formData.append('image[]', image[i]);
            }
        }

        formData.append("name", nameProduct);
        formData.append("price", productPrice);
        formData.append("collection", collection);
        formData.append("description", descriptionProduct);

        // supprime listTypes de dataDetail car inutile côté controlleur
        dataDetail.forEach(obj => delete obj.listTypes);
        // C EST QUOI CE dataDetail ?? ?? ?? <------------------ !!!

        // transformation de l'objet en string JSON
        var obj = JSON.stringify(dataDetail);
        formData.append("obj", obj);

        console.log('nameProduct  ', nameProduct);
        console.log('productPrice  ', productPrice);
        console.log('collection  ', collection);
        console.log('descriptionProduct  ', descriptionProduct);
        console.log('obj  ', obj);
        console.log('tva  ', tva);
        console.log('supplier  ', supplier);
        console.log('imageVariantes  ', imageVariantes);
        console.log('previousProductPrice  ', previousProductPrice);
        console.log('productCost  ', productCost);
        console.log('productStock  ', productStock);
        console.log('productCode  ', productCode);
        console.log('optionsObj  ', optionsObj);
        console.log('variantes  ', variantes);
        console.log('metaTitleProduct   ', metaTitleProduct);
        console.log('metaDescriptionProduct   ', metaDescriptionProduct);
        console.log('metaUrlProduct   ', metaUrlProduct);

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

    // console.log('listTransporters  ', listTransporters[0]);
    // console.log('transporter  ', transporter);
    // console.log('collection  ', collection);

    return (
        <div className="min-w-[750px] w-[70%] min-h-[100vh] my-[50px] mx-auto pb-80 grid grid-cols-mainContainer gap-2.5 text-base">
            <div className="w-full">
                <div className="div-vert-align">
                    <h4 className="mb-[18px] font-semibold text-[20]">Ajouter un produit</h4>

                    {/* name */}
                    <label>Nom<span className='text-red-600 caret-transparent'>*</span></label>
                    <input className="w-full h-10 border border-gray-300 rounded-md pl-2.5 mb-4 mt-1"
                        type="text"
                        onChange={handleName}
                        value={nameProduct}
                    />

                    {/* description */}
                    <label className='caret-transparent'>Déscription</label>
                    <TinyeditorProduct />
                </div>

                {/* dropZone */}
                <DropZoneProduct />


                {/* options */}
                <Flex_col_s_s>
                    <Options />
                </Flex_col_s_s>

                {/* Optimisation */}
                <OptimisationProduct />

            </div>



            {/* ----------  side  ---------- */}
            <div className='form-side-container'>
                {/* collection */}
                <Flex_col_s_s>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto caret-transparent">
                        Collections
                    </h3>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_collection"
                        unikId="SelectWithCheckbox_collection"
                        list={collectionsRelations}
                        selected={collection}
                        setSelected={setCollection}
                        toggleSelectWithCheckbox={toggleSelectWithCheckboxCollection}
                        setToggleSelectWithCheckbox={setToggleSelectWithCheckboxCollection}
                    />
                    <div className={`flex flex-wrap ${collection.length > 0 && "pt-4"} w-full`}>
                        {collection.map(item =>
                            <div key={item.id}
                                className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                                <span
                                    className="h-full text-gray-500 mr-2 rounded-md">
                                    {item.name}
                                </span>
                                <span
                                    className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                                    onClick={() => removeCollection(item)}>
                                    <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                                </span>
                            </div>
                        )}
                    </div>
                </Flex_col_s_s>

                {/* Price */}
                <Price />

                {/* Stock */}
                <Stock />

                {/* supplier */}
                <Flex_col_s_s id="supplierSelectId">
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                        Fournisseur
                    </h3>
                    <Select
                        list={listSuppliers}
                        itemSelected={supplier}
                        setItemSelected={setSupplier}
                        toggleSelect={toggleSelectSupplier}
                        setToggleSelect={setToggleSelectSupplier}
                        selectValueColor={selectValueColorSupplier}
                        setSelectValueColor={setSelectValueColorSupplier}
                        ulUnikId="ulSupplierSelectUniqueId"
                        buttonUnikId="buttonSupplierSelectUniqueId"
                    />
                </Flex_col_s_s>

                {/* Tva */}
                {activeCalculTva == 1 &&
                    <Flex_col_s_s id="tvaSelectId">
                        <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                            Tva {tva != '' && tva.tva_rate + '%'} {tva?.is_default == 1 &&
                                <span className='text-sm  italic'>
                                    (Par défaut)
                                </span>}
                        </h3>
                        <Select
                            list={tvaRateList}
                            itemSelected={tva}
                            setItemSelected={setTva}
                            toggleSelect={toggleSelectTva}
                            setToggleSelect={setToggleSelectTva}
                            selectValueColor={selectValueColorTva}
                            setSelectValueColor={setSelectValueColorTva}
                            ulUnikId="ulTvaSelectUniqueId"
                            buttonUnikId="buttonTvaSelectUniqueId"
                        />
                    </Flex_col_s_s>
                }
                {/* Transporteurs */}
                <Flex_col_s_s>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                        Transporteurs
                    </h3>
                    <SelectWithCheckbox
                        key="SelectWithCheckbox_transporter"
                        unikId="SelectWithCheckbox_transporter"
                        list={listTransporters[0]}
                        selected={transporter}
                        setSelected={setTransporter}
                        toggleSelectWithCheckbox={toggleSelectWithCheckboxTransporter}
                        setToggleSelectWithCheckbox={setToggleSelectWithCheckboxTransporter}
                    />
                    <div className={`flex flex-wrap ${transporter.length > 0 && "pt-4"} w-full`}>
                        {transporter.map(item =>
                            <div key={item.id}
                                className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                                <span
                                    className="h-full text-gray-500 mr-2 rounded-md">
                                    {item.name}
                                </span>
                                <span
                                    className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                                    onClick={() => removeTransporter(item)}>
                                    <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                                </span>
                            </div>
                        )}
                    </div>
                </Flex_col_s_s>
            </div>

            <button
                className="flex flex-row justify-center items-center w-32 px-3 py-2 rounded-md bg-green-600 text-white"
                onClick={handleSubmit}
            >
                Enregistrer
            </button>

            {/* modal for simple message */}
            <ModalSimpleMessage
                show={showModalFromPrice} // true/false show modal
                handleModalCancel={closelModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage>
        </div>
    )
}

export default CreateProduct;

