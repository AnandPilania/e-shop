import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { makeStyles } from '@material-ui/styles';
import MainBlock from '../elements/blocks/mainBlock';
import Options from './options';
import ContainerDetail from './containerDetail';
import SelectWithCheckbox from '../elements/selectWithCheckbox';
import Select from '../elements/select';
import DropZoneProduct from './dropZoneProduct';
import Price from './price';
import Stock from './stock';
import TinyeditorProduct from './tinyEditorProduct';
import Axios from "axios";
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import ModalSimpleMessage from '../modal/modalSimpleMessage';



const useStyles = makeStyles({
    wrapperForm: {
        marginTop: '50px',
        width: '80%',
        overflow: 'auto',
        padding: '50px',
        // border: '#e0e0e0 dashed 1px',
        border: 'red dashed 2px',
        borderRadius: '5px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        backgroundColor: '#f6f6f7',
    },
    title: {
        fontSize: '20px',
    },
    label_text: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0',
        marginLeft: '5px',
        marginBottom: 10,
        marginTop: '20px',
        color: '#111fff',
        width: 'auto',
    },
    input_text: {
        margin: '0',
        paddingLeft: '10px',
        width: '100%',
        height: '55px',
        border: '#e1e1e1 solid 1px',
        borderRadius: '5px',
        color: '#111fff',
    },
    textarea: {
        color: '#111fff',
        minHeight: '100px',
    },
    submit_btn: {
        height: '45px',
        width: '150px',
        marginTop: '50px',
        borderRadius: '5px',
        backgroundColor: '#eeefff',
        color: '#111fff',
        fontSize: '16px',
        letterSpacing: '1px',
    },

});


// props.id = detailx
const CreateProduct = (props) => {
    const classes = useStyles();
    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [showModalFromPrice, setShowModalFromPrice] = useState(false);

    const { image, descriptionProduct, listSuppliers, setListSuppliers, supplier, setSupplier, collection, setCollection, productPrice, productStock, messageModal, setMessageModal, nameProduct, setNameProduct } = useContext(AppContext);

    useEffect(() => {
        // récupére les types de détails dans la table type_detail_products pour remplire le select id=selectdetails
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

                {/* details */}
                <MainBlock>
                    <ContainerDetail setDataDetail={setDataDetail} />
                </MainBlock>

                {/* options */}
                <MainBlock>
                    <Options />
                </MainBlock>
            </div>

            {/* ----------  side  ---------- */}
            <div className='form-side-container'>
                {/* collection */}
                <div className="div-vert-align">
                    <h3 className={classes.label_text}>Collections</h3>
                    <SelectWithCheckbox
                        unikId="SelectWithCheckbox_collection"
                        list={collectionsRelations}
                        selected={collection}
                        setSelected={setCollection}
                    />
                    <div className="flex flex-wrap pt-[20px] w-full">
                        {collection.map(item =>
                            <div key={item} className="flex justify-between align-center h-[24px] rounded-full bg-sky-500 pl-3 mb-1 mr-2 ">
                                <span className="h-full text-white mr-2 rounded-full">
                                    {item}
                                </span>
                                <span className="h-full w-[24px] flex justify-center align-center hover:cursor-pointer hover:bg-white rounded-r-[50%] bg-amber-400" onClick={() => removeCollection(item)}>
                                    <img src='../images/icons/x.svg' className="w-[20px] h-[24px]" />
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* supplier */}
                <div className="div-vert-align">
                    <h3 className={classes.label_text}>Fournisseur</h3>
                    <Select
                        list={listSuppliers}
                        itemSelected={supplier}
                        setItemSelected={setSupplier}
                    />
                </div>
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

