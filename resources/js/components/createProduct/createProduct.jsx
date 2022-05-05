import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { makeStyles } from '@material-ui/styles';
import ContainerDetail from './containerDetail';
import SelectCollections from './selectCollections';
import DropZoneProduct from './dropZoneProduct';
import TinyeditorProduct from './tinyEditorProduct';
import Axios from "axios";



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
    const [collection, setCollection] = useState([]);

    const { image, descriptionProduct } = useContext(AppContext);

    useEffect(() => {
        // récupére les types de détails dans la table type_detail_products pour remplire le select id=selectdetails
        Axios.get(`http://127.0.0.1:8000/getCollections`)
            .then(res => {
                setCollectionsRelations(res.data.collections);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        // delete removed tinyMCE images in folder and db
        handleTinyMceTemporary(descriptionCollection, idCollection, 'product');

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



    const handleCollections = (value) => {
        setCollection(value);
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
                    <TinyeditorProduct />
                    {/* <p className={classes.label_text}><label htmlFor="description" >Déscription</label></p>
                    <input id="description" name="description" type="text" className={classes.input_text} /> */}
                </div>

                {/* dropZone */}
                <DropZoneProduct />

                {/* details */}
                <div className="div-vert-align">
                    <ContainerDetail setDataDetail={setDataDetail} />

                </div>
            </div>

            {/* ----------  side  ---------- */}
            <div className='form-side-container'>

                <div className="div-vert-align">

                    {/* collection */}
                    <SelectCollections collectionsRelations={collectionsRelations} handleCollections={handleCollections} />

                    {/* price */}
                    <p className={classes.label_text}><label htmlFor="price" >Prix</label></p>
                    <input id="price" type="number" step=".01" name="price" className={classes.input_text} />

                </div>


            </div>

            <button className="btn-backEnd" onClick={handleSubmit}>
                Envoyer
            </button>
        </div>
    )
}

export default CreateProduct;

