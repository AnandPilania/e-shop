import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import './createProduct_Js.scss';
import ContainerDetailEdit from './containerDetailEdit';
import SelectCollectionsEdit from '../selectInProduct/selectCollectionsEdit';
import Axios from "axios";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from "react-router-dom";
import EditImages from './edit_images';



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
        color:'#111fff',
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
    drop_region: {
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 0 35px rgba(0, 0, 0, 0.05)',
        width: '100%',
        padding: '60px 40px',
        marginTop: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.3s',
    },
  });


// props.id = detailx
const EditProduct = () => {
    const classes = useStyles();
    const [dataDetail, setDataDetail] = useState([]);
    const [collection, setCollection] = useState([]);
    const [technicalSheet, setTechnicalSheet] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [sheet, setSheet] = useState('');
    const { productId } = useParams();
   
    var formData = new FormData();

    useEffect(() => {
        // récupére toutes les données d'un produit pour être éditées
        Axios.get(`http://127.0.0.1:8000/editProduct/${productId}`)
            .then(res => {
                setProductName(res.data.product.name);
                setProductPrice(res.data.product.price);
                setProductDescription(res.data.product.description);
                setSheet(res.data.sheet);

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    function handleSubmit(e) {
        e.preventDefault();

        formData.append("id", productId);
        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("collection", collection);
        formData.append("description", document.getElementById("description").value);
        formData.append("technicalSheet", technicalSheet);

        // supprime listTypes de dataDetail car inutile côté controlleur
        dataDetail.forEach(obj => delete obj.listTypes);

        // transformation de l'objet en string JSON
        var obj = JSON.stringify(dataDetail);
        formData.append("obj", obj);

        Axios.post(`http://127.0.0.1:8000/updateProduct`, formData,
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

    const handleName = (e) => {
        setProductName(e.target.value);
    }

    const handlePrice = (e) => {
        setProductPrice(e.target.value);
    }

    const handleDescription = (e) => {
        setProductDescription(e.target.value);
    }

    const ckEditorOnChange = (sheet) => {
        setTechnicalSheet(sheet);
    }


    const editorConfiguration = {
        toolbar: [
            { name: 'styles', groups: ['styles'] },
            { name: 'colors', groups: ['colors'] },
            { name: 'tools', groups: ['tools'] },
            { name: 'others', groups: ['others'] },
        ]
    };

    return (
        <div className={classes.wrapperForm}>

            <h4 className={classes.title}>Modifier un produit</h4>

            <form className="cmxform" id="newProductForm" method="post" action="/products" encType="multipart/form-data" onSubmit={handleSubmit}>

                <fieldset>
                    <div className={classes.label_text}>
                        <label htmlFor="name">Nom</label>
                        <input id="name" name="name" type="text" value={productName} onChange={handleName} className={classes.input_text} />
                    </div>

                    <div className={classes.label_text}>
                        <label htmlFor="price">Prix</label>
                        <input id="price" type="number" step=".01" name="price" onChange={handlePrice} value={productPrice} className={classes.input_text} />
                    </div>

                    <SelectCollectionsEdit
                        handleCollections={handleCollections}
                        productId={productId}
                    />

                    <div className={classes.label_text}>
                        <label htmlFor="description">Déscription</label>
                        <input id="description" name="description" type="text" value={productDescription} onChange={handleDescription} className={classes.input_text} />
                    </div>

                    <EditImages 
                    productId={productId} 
                    />

                    <ContainerDetailEdit 
                    setDataDetail={setDataDetail} 
                    productId={productId}
                    />

                    <br></br><br></br>
                    <h6>Fiche technique</h6>
                    <br></br>
                    {/* <CKEditor
                        editor={ClassicEditor}
                        // config={ editorConfiguration }
                        data={sheet}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const sheet = editor.getData();
                            ckEditorOnChange(sheet);
                        }}
                        onBlur={(event, editor) => {
                        }}
                        onFocus={(event, editor) => {
                        }}
                    /> */}

                    <br></br>
                    <input className="btn btn-primary" type="submit" value="Envoyer" />
                </fieldset>
            </form>


        </div>
    )
}

export default EditProduct;

