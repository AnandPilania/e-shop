import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import MainBlock from '../elements/blocks/mainBlock';
import Options from './options/options';
import SelectWithCheckbox from '../elements/selectWithCheckbox';
import Select from '../elements/select';
import DropZoneProduct from './dropZoneProduct';
import Price from './price';
import Stock from './stock';
import TinyeditorProduct from './tinyEditorProduct';
import Axios from "axios";
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import ModalSimpleMessage from '../modal/modalSimpleMessage';



// props.id = detailx
const CreateProduct = () => {

    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [showModalFromPrice, setShowModalFromPrice] = useState(false);

    const { image, descriptionProduct, listSuppliers, setListSuppliers, supplier, setSupplier, collection, setCollection, productPrice, productStock, messageModal, setMessageModal, nameProduct, setNameProduct, optionsObj, setOptionsData } = useContext(AppContext);

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


        // charge les données des types d'options et leurs valeurs ex. Couleurs, rouge, vert, ...
        Axios.get(`http://127.0.0.1:8000/getOptionValues`)
            .then((res) => {
                setOptionsData(Object.values(res.data));
            });

    }, []);




    const removeCollection = (item) => {
        let index = collection.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...collection];
            tmp_arr.splice(index, 1);
            setCollection([...tmp_arr]);
        }
    }

    const handleName = (e) => {
        setNameProduct(e.target.value);
    }



    console.log('optionsObj  ', optionsObj)
    const validation = () => {

        // // name validation
        // if (nameProduct.length == 0) {
        //     setMessageModal('Le champ nom est obligatoir');
        //     setShowModalFromPrice(true);
        //     return false;
        // }

        // // price validation
        // if (productPrice <= 0) {
        //     setMessageModal('Le champ prix est obligatoir');
        //     setShowModalFromPrice(true);
        //     return false;
        // }

        // options
        for (let i = 0; i < optionsObj.length; i++) {
            console.log('name${optionsObj[i].id}   ', `name${optionsObj[i].id}`)

            if (optionsObj[i].name == '') {
                let spanMessage = document.getElementById(`name${optionsObj[i].id}`);
                spanMessage.innerHTML = 'Le champ nom de l\'option ne peut pas être vide';

                let inputOptionError = document.getElementsByClassName(`name${optionsObj[i].id}`)[0];
                
                console.log('i   ', i)

                if (inputOptionError !== undefined) {
                    inputOptionError.classList.remove('border-gray-300');
                    inputOptionError.classList.add('border-red-500');

                    console.log('inputOptionError.classList   ', inputOptionError.classList)
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

        var formData = new FormData();

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

        // transformation de l'objet en string JSON
        var obj = JSON.stringify(dataDetail);
        formData.append("obj", obj);


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
        <div className="min-w-[750px] w-[60%] min-h-[130vh] my-[50px] mx-auto pb-[300px] grid grid-cols-mainContainer gap-[10px] text-[15px]">
            <div className="w-full">
                <div className="div-vert-align">
                    <h4 className="mb-[18px] font-semibold text-[20]">Ajouter un produit</h4>

                    {/* name */}
                    <label>Nom*</label>
                    <input className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[15px] mt-1"
                        type="text"
                        onChange={handleName}
                        value={nameProduct}
                    />

                    {/* description */}
                    <label>Déscription</label>
                    <TinyeditorProduct />
                </div>

                {/* dropZone */}
                <DropZoneProduct />

                {/* Price */}
                <Price />

                {/* Stock */}
                <Stock />

                {/* options */}
                <MainBlock>
                    <Options />
                </MainBlock>
            </div>



            {/* ----------  side  ---------- */}
            <div className='form-side-container'>
                {/* collection */}
                <MainBlock>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">Collections</h3>
                    <SelectWithCheckbox
                        unikId="SelectWithCheckbox_collection"
                        list={collectionsRelations}
                        selected={collection}
                        setSelected={setCollection}
                    />
                    <div className={`flex flex-wrap ${collection.length > 0 && "pt-[15px]"} w-full`}>
                        {collection.map(item =>
                            <div key={item}
                                className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-[8px] pr-[6px] py-[3px] mb-1 mr-2">
                                <span
                                    className="h-full text-gray-500 mr-2 rounded-md">
                                    {item}
                                </span>
                                <span
                                    className="h-[20px] w-[20px] flex justify-center items-center hover:cursor-pointer bg-gray-600  hover:bg-red-500 rounded-md"
                                    onClick={() => removeCollection(item)}>
                                    <img src='../images/icons/x-white.svg' className="w-[20px] h-[20px] hover:scale-125" />
                                </span>
                            </div>
                        )}
                    </div>
                </MainBlock>

                {/* supplier */}
                <MainBlock>
                    <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">Fournisseur</h3>
                    <Select
                        list={listSuppliers}
                        itemSelected={supplier}
                        setItemSelected={setSupplier}
                    />
                </MainBlock>
            </div>

            <button className="btn bg-amber-300" onClick={handleSubmit}>
                Envoyer
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

