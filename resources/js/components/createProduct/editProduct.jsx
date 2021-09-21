import React, { useState, useEffect } from 'react';
import './createProduct_Js.scss';
import ContainerDetailEdit from './containerDetailEdit';
import SelectCollectionsEdit from '../selectInProduct/selectCollectionsEdit';
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


// props.id = detailx
const EditProduct = () => {
    const [dataDetail, setDataDetail] = useState([]);
    const [collection, setCollection] = React.useState([]);
    const [technicalSheet, setTechnicalSheet] = React.useState('');
    const [productName, setProductName] = React.useState('');
    const [productPrice, setProductPrice] = React.useState('');
    const [productDescription, setProductDescription] = React.useState('');
    const [sheet, setSheet] = React.useState('');

    var formData = new FormData();

    useEffect(() => {
        // récupére les types de détails de la table type_detail_products pour remplire le select id=selectdetails
        axios.get(`http://127.0.0.1:8000/editProduct/${productId}`)
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

        axios.post(`http://127.0.0.1:8000/updateProduct`, formData,
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
            // { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            // { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            // { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
            // { name: 'forms', groups: [ 'forms' ] },
            // '/',
            // { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            // { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            // { name: 'links', groups: [ 'links' ] },
            // { name: 'insert', groups: [ 'insert' ] },
            // '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
        ]
    };

    return (
        <div className="createProduct">

            <h4 className="card-title">Modifier un produit</h4>

            <form className="cmxform" id="newProductForm" method="post" action="/products" encType="multipart/form-data" onSubmit={handleSubmit}>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="name">Nom</label>
                        <input id="name" className="form-control" name="name" type="text" value={productName} onChange={handleName} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Prix</label>
                        <input id="price" className="form-control" type="number" step=".01" name="price" onChange={handlePrice} value={productPrice} />
                    </div>

                    <SelectCollectionsEdit
                        handleCollections={handleCollections}
                    />

                    <div className="form-group">
                        <label htmlFor="description">Déscription</label>
                        <input id="description" className="form-control" name="description" type="text" value={productDescription} onChange={handleDescription} />
                    </div>

                    <ContainerDetailEdit setDataDetail={setDataDetail} />

                    <br></br><br></br>
                    <h6>Fiche technique</h6>
                    <br></br>
                    <CKEditor
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
                    />

                    <br></br>
                    <input className="btn btn-primary" type="submit" value="Envoyer" />
                </fieldset>
            </form>


        </div>
    )
}

export default EditProduct;

