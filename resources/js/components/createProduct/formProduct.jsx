import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
// import './createProduct_Js.scss';
import ContainerDetail from './containerDetail';
import SelectCollections from '../selectInProduct/selectCollections';
import Axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


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
const FormProduct = (props) => {
    const classes = useStyles();
    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [collection, setCollection] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [technicalSheet, setTechnicalSheet] = useState('');

    var dropRegion = null;
    var imagePreviewRegion = null;
    var formData = new FormData();
    var tab = [];

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

        // on boucle sur imageFiles pour récupérer toutes les images
        if (imageFiles) {
            for (var i = 0, len = imageFiles.length; i < len; i++) {
                if (validateImage(imageFiles[i])) {
                    formData.append('image[]', imageFiles[i]);
                }
            }
        }

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


    useEffect(() => {
        dropRegion = document.getElementById("drop-region");
        imagePreviewRegion = document.getElementById("image-preview");


        // open file selector when clicked on the drop region
        var fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*";
        fakeInput.multiple = true;
        // open files exploratore when click on dropRegion
        dropRegion.addEventListener('click', function () {
            fakeInput.click();
        });

        fakeInput.addEventListener("change", function () {
            var files = fakeInput.files;
            handleFiles(files);
        });

        // empèche le comportement par défault et la propagation
        dropRegion.addEventListener('dragenter', preventDefault, false);
        dropRegion.addEventListener('dragleave', preventDefault, false);
        dropRegion.addEventListener('dragover', preventDefault, false);
        dropRegion.addEventListener('drop', preventDefault, false);

        dropRegion.addEventListener('drop', handleDrop, false);

        // change the message if doesn't support drag & drop
        var dragSupported = detectDragDrop();
        if (!dragSupported) {
            document.getElementsByClassName("drop-message")[0].innerHTML = 'Click to upload';
        }

        dropRegion.addEventListener('dragenter', highlight, false);
        dropRegion.addEventListener('dragover', highlight, false);
        dropRegion.addEventListener('dragleave', unhighlight, false);
        dropRegion.addEventListener('drop', unhighlight, false);

    }, []);

    function highlight() {
        dropRegion.classList.add('highlighted');
    }
    function unhighlight() {
        dropRegion.classList.remove("highlighted");
    }

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    // récupère les files quand on drop et les envoi à handleFiles
    function handleDrop(e) {
        var dt = e.dataTransfer,
            files = dt.files;

        if (files.length) {

            handleFiles(files);

        } else {

            // check for img
            var html = dt.getData('text/html'),
                match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
                url = match && match[1];


            if (url) {
                uploadImageFromURL(url);
                return;
            }
        }

        function uploadImageFromURL(url) {
            var img = new Image;
            var c = document.createElement("canvas");
            var ctx = c.getContext("2d");

            img.onload = function () {
                c.width = this.naturalWidth;  // update canvas size to match image
                c.height = this.naturalHeight;
                ctx.drawImage(this, 0, 0);   // draw in image

                c.toBlob(function (blob) {   // get content as blob
                    handleFiles([blob]);
                }, 'image/png', 0.95);
            };
            img.onerror = function () {
                alert("Error in uploading");
            }
            img.crossOrigin = "";   // if from different origin
            img.src = url;
        }
    }


    // affiche et sauvegarde les images
    function handleFiles(files) {
        tab.push(...files);
        for (var i = 0; i < files.length; i++) {
            if (validateImage(files[i])) {
                setImageFiles(tab);
                previewImage(files[i]);
            }
        }
    }


    function validateImage(image) {
        // check the type
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf(image.type) === -1) {
            alert("Invalid File Type");
            return false;
        }

        // check the size
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            alert("File too large");
            return false;
        }

        return true;
    }

    function previewImage(image) {

        // container
        var imgView = document.createElement("div");
        imgView.className = "image-view";
        imagePreviewRegion.appendChild(imgView);

        // previewing image
        var img = document.createElement("img");
        imgView.appendChild(img);

        // progress overlay
        var overlay = document.createElement("div");
        overlay.className = "overlay";
        imgView.appendChild(overlay);


        // read the image...
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(image);
    }


    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }


    const ckEditorOnChange = (sheet) => {
        setTechnicalSheet(sheet);
        sheet && console.log('sheet  ' + sheet);
    }


    return (
        <div className={classes.wrapperForm}>

            <h4 className={classes.title}>Ajouter un produit</h4>

            <form method="post" action="/products" encType="multipart/form-data">

                <p className={classes.label_text}><label htmlFor="name" >Nom</label></p>
                <input id="name" name="name" type="text" className={classes.input_text} />

                <p className={classes.label_text}><label htmlFor="price" >Prix</label></p>
                <input id="price" type="number" step=".01" name="price" className={classes.input_text} />

                <SelectCollections collectionsRelations={collectionsRelations} handleCollections={handleCollections} />

                <div id="drop-region" className={classes.drop_region}>
                    <div className="drop-message">
                        Drag & Drop images or click to upload
                    </div>
                    <div id="image-preview"></div>
                </div>

                <p className={classes.label_text}><label htmlFor="description" >Déscription</label></p>
                <input id="description" name="description" type="text" className={classes.input_text} />

                <ContainerDetail setDataDetail={setDataDetail} />

                <br></br><br></br>
                <h6>Fiche technique</h6>
                <br></br>
                <CKEditor
                    editor={ClassicEditor}
                    data=""
                    onReady={editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                        const sheet = editor.getData();
                        ckEditorOnChange(sheet);
                        console.log({ event, editor, sheet });
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                />

                <br></br>
                <button className="btn-backEnd" onClick={handleSubmit}>
                    Envoyer
                </button>
            </form>
        </div>
    )
}

export default FormProduct;

