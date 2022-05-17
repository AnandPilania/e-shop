import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { makeStyles } from '@material-ui/styles';
import ContainerDetail from './containerDetail';
import SelectCollections from './selectCollections';
import DropZoneProduct from './dropZoneProduct';
import TinyeditorProduct from './tinyEditorProduct';
import Axios from "axios";
import { handleTinyMceTemporary } from '../functions/temporaryStorage/handleTinyMceTemporary';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



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

    const { image, descriptionProduct, listSuppliers, setListSuppliers, supplier, setSupplier, collection, setCollection } = useContext(AppContext);

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

    const handleChangeSupplier = (e) => {
        setSupplier(e.target.value);
    };


    const removeCollection = (item) => {
        let index = collection.indexOf(item);
        if (index > -1) {
            let tmp_arr = [...collection];
            tmp_arr.splice(index, 1);
            setCollection([...tmp_arr]);
        }
    }


    function handleSubmit(e) {
        e.preventDefault();

        // delete removed tinyMCE images in folder and db
        handleTinyMceTemporary(descriptionProduct, null, 'product');

        var formData = new FormData();

        // on boucle sur imageFiles pour récupérer toutes les images
        if (image) {
            for (var i = 0; i < image.length; i++) {
                formData.append('image[]', image[i]);
            }
        }

        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("collection", collection);
        formData.append("description", descriptionProduct);
        console.log('descriptionProduct  ', descriptionProduct)
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
        <div className="form-main-container">
            <div className="form-block-container">
                <div className="div-vert-align">
                    <h4 className={classes.title}>Ajouter un produit</h4>

                    {/* name */}
                    <p className={classes.label_text}><label htmlFor="name" >Nom</label></p>
                    <input id="name" name="name" type="text" className={classes.input_text} />

                    {/* description */}
                    <p className={classes.label_text}><label htmlFor="description" >Déscription</label></p>
                    <TinyeditorProduct />
                </div>

                {/* dropZone */}
                <DropZoneProduct />

                {/* details */}
                <div className="div-vert-align">
                    <ContainerDetail setDataDetail={setDataDetail} />

                </div>

                {/* price */}
                <p className={classes.label_text}><label htmlFor="price" >Prix</label></p>
                <input id="price" type="number" step=".01" name="price" className={classes.input_text} />
            </div>

            {/* ----------  side  ---------- */}
            <div className='form-side-container'>

                {/* collection */}
                <div className="div-vert-align">
                    <h3 className={classes.label_text}>Collections</h3>
                    <SelectCollections collectionsRelations={collectionsRelations} />
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
                    <p className={classes.label_text}><label htmlFor="supplier">Fournisseur</label></p>
                    <Select
                        value={supplier}
                        onChange={handleChangeSupplier}
                        variant="standard"
                        className="w100pct h50 radius5 brd-gray-light-1 bg-white p10  m-b-20"
                    >
                        {listSuppliers.length > 0 &&
                            listSuppliers.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                    </Select>
                </div>

            </div>
            <button className="btn bg-amber-300" onClick={handleSubmit}>
                Envoyer
            </button>
        </div>
    )
}

export default CreateProduct;

