import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    wrapperForm: {
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
        overflow: 'auto',
        padding: '10px',
        border: '#DCDCDB dashed 5px',
        borderRadius: '5px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        backgroundColor: '#f6f6f7',
    },
    drop_region: {
        backgroundColor: '#fff',
        background: 'no-repeat url("../images/icons/backgroundDropZone.png")',
        backgroundPosition: 'center 90%',
        borderRadius: '5px',
        boxShadow: '0 0 35px rgba(0, 0, 0, 0.05)',
        width: '100%',
        minHeight: '200px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.3s',
    },
});


const DropZone = (props) => {
    const classes = useStyles();
    const [collectionsRelations, setCollectionsRelations] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    var dropRegion = null;
    var imagePreviewRegion = null;
    var tab = [];

    useEffect(() => {
        dropRegion = document.getElementById("drop-region");
        imagePreviewRegion = document.getElementById("image-preview");


        // open file selector when clicked on the drop region
        var fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*";
        fakeInput.multiple = props.multiple;
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
        if (props.multiple === false) {
            tab = files;
            console.log(tab);
        }
        if (props.multiple === true) {
            tab.push(...files);
            console.log(tab);
        }
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
            alert("Fichier non valide");
            return false;
        }

        // check the size
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            alert("Votre fichier est trop grand");
            return false;
        }

        return true;
    }

    function previewImage(image) {

        document.getElementById('drop-region').style.background = 'none';
        document.getElementById('drop-region').style.backgroundColor = '#FFFFFF';

        let checkImgViewExist = document.getElementsByClassName('image-view');
        // if multiple == true or is first preview
        if (props.multiple === true || (props.multiple === false && checkImgViewExist.length == 0)) {
            // container
            var imgView = document.createElement("div");
            imgView.className = "image-view";
            imagePreviewRegion.appendChild(imgView);

            // previewing image
            var img = document.createElement("img");
            img.className = 'imagesPreview';
            imgView.appendChild(img);

            // progress overlay
            var overlay = document.createElement("div");
            overlay.className = "overlay";
            imgView.appendChild(overlay);
        }

        // if multiple == false
        if (props.multiple === false) {
            // container
            var imgView = document.getElementsByClassName('image-view')[0];

            // previewing image
            var img = document.getElementsByClassName('imagesPreview')[0];
            imgView.appendChild(img);

            // progress overlay
            var overlay = document.getElementsByClassName('overlay')[0];
            imgView.appendChild(overlay);
        }

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


    return (
        <div className={classes.wrapperForm}>
            <div id="drop-region" className={classes.drop_region}>
                <div className="drop-message">
                    Déposer ici une image <br></br>ou cliquer pour charger une image
                </div>
                <div id="image-preview"></div>
            </div>
        </div>
    )
}

export default DropZone;

