import React, { useEffect, useContext } from 'react';
import Axios from 'axios';
import AppContext from '../contexts/AppContext';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';
import CroppeImage from './croppeJs';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const DropZone = (props) => {

    const { image, setImage, imagePath, setImagePath, setImageModal, setShowModalSimpleMessage, setMessageModal, is_Edit, setIs_Edit, idCollection, setWrapIndexcroppe, setIsNot_isEdit, collectionForm, setCollectionForm } = useContext(AppContext);


    var dropRegion = null;
    var imagePreviewRegion = null;
    var tab = [];

    useEffect(() => {
        dropRegion = document.getElementById("drop-region-dropZone");

        // open file selector when clicked on the drop region
        var fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*";
        fakeInput.multiple = props.multiple;
        // open files exploratore when click on dropRegion
        dropRegion.addEventListener('click', function () {
            fakeInput.click();
        });

        fakeInput.addEventListener("click", function (e) {
            e.target.value = '';
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
            document.getElementById("drop-message-dropZone").innerHTML = 'Click to upload';
        }

        dropRegion.addEventListener('dragenter', highlight, false);
        dropRegion.addEventListener('dragover', highlight, false);
        dropRegion.addEventListener('dragleave', unhighlight, false);
        dropRegion.addEventListener('drop', unhighlight, false);


        // init preview image !!! à GARDER !!! permet de recharger l'image collection quand on crop ou qu'on annulle le crop 
        if (!is_Edit) {
            try {
                Axios.get(`http://127.0.0.1:8000/getSingleTemporaryImage/${"pas_besoin_de_id"}`)
                    .then(res => {
                        if (res.data !== undefined && res.data != '') {
                            // get --> image path <-- for croppe
                            setImagePath('/' + res.data);
                            // get --> image <-- for preview
                            fetch('/' + res.data)
                                .then(function (response) {
                                    return response.blob();
                                })
                                .then(function (BlobImage) {
                                    previewImage(BlobImage);
                                    setImage(BlobImage);
                                })
                        }
                    });
            } catch (error) {
                console.error('error  ' + error);
            }
        }
    }, []);

    // when collection is edited
    useEffect(() => {
        if (is_Edit) {
            try {
                Axios.get(`http://127.0.0.1:8000/getSingleTemporaryImage/${idCollection}`)
                    .then(res => {
                        if (res.data !== undefined && res.data != '') {
                            // get --> image path <-- for croppe
                            setImagePath('/' + res.data);
                            // get --> image <-- for preview
                            fetch('/' + res.data)
                                .then(function (response) {
                                    return response.blob();
                                })
                                .then(function (BlobImage) {
                                    previewImage(BlobImage);
                                    setImage(BlobImage);
                                    handleChangeImage(BlobImage);
                                })
                        }
                    });
            } catch (error) {
                console.error('error  ' + error);
            }
            setIs_Edit(false);
        }
    }, [is_Edit]);

    // when image is changed, save it in temporaryStorage before load it and setImagePath with  
    const handleChangeImage = (imageFile) => {
        let response = async () => {
            return saveInTemporaryStorage('tmp_imageCollection', imageFile)
        }
        response().then(() => {
            try {
                Axios.get(`http://127.0.0.1:8000/getSingleTemporaryImage/${idCollection}`)
                    .then(res => {
                        if (res.data !== undefined) {
                            // get --> image path <-- for croppe
                            setImagePath('/' + res.data);
                        }
                    });
            } catch (error) {
                console.error('error  ' + error);
            }
        });
    }


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
        }
        if (props.multiple === true) {
            tab.push(...files);
        }

        for (var i = 0; i < files.length; i++) {
            if (validateImage(files[i])) {
                setImage(tab);
                handleChangeImage(files[i]);
                previewImage(files[i]);
            }
        }
        // permet à checkIfIsDirty dans index de bloquer la navigation lorsqu'on ajoute ou change une image sans sauvegarder
        setCollectionForm({ ...collectionForm, hasBeenChanged: true });
    }


    function validateImage(image) {
        // check the type
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf(image.type) === -1) {
            setMessageModal('Ce type de fichier est non valide')
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        // check the size
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            setMessageModal('Votre fichier est trop grand')
            setImageModal('../images/icons/trash_dirty.png');
            setShowModalSimpleMessage(true);
            return false;
        }

        return true;
    }


    function previewImage(image) {

        imagePreviewRegion = document.getElementById("image-preview-dropZone");

        // retire l'image de fond
        document.getElementById('drop-region-dropZone').style.background = 'none';
        document.getElementById('drop-region-dropZone').style.backgroundColor = '#FFFFFF';

        let checkImgViewExist = document.getElementsByClassName('image-view-dropZone');
        // if multiple == true or is first preview
        if (props.multiple === true || (props.multiple === false && checkImgViewExist.length == 0)) {
            // container
            var imgView = document.createElement("div");
            imgView.className = "image-view-dropZone";
            imagePreviewRegion.appendChild(imgView);

            // previewing image
            var img = document.createElement("img");
            img.className = 'imagesPreview-dropZone';
            imgView.appendChild(img);

        }

        // if multiple == false
        if (props.multiple === false) {
            // container
            var imgView = document.getElementsByClassName('image-view-dropZone')[0];

            // previewing image
            var img = document.getElementsByClassName('imagesPreview-dropZone')[0];
            imgView.appendChild(img);


            document.getElementById("drop-message-dropZone").style.display = 'none';
        }

        // cadrage de l'image
        img.onload = () => {
            var width = img.clientWidth;
            var height = img.clientHeight;
            img.style.margin = 'auto';
            if (width > height) {
                img.style.width = '100%';
                img.style.maxWidth = '270px';
            } else {
                img.style.height = '100%';
                img.style.maxHeight = '200px';
            }
        }

        // read the image...
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(image);

    }

    function removeImagePreview() {
        var imagesToRemove = document.getElementsByClassName('image-view-dropZone') && document.getElementsByClassName('image-view-dropZone');

        if (imagesToRemove.length > 0) {
            for (let i = 0; i < imagesToRemove.length; i++) {
                imagesToRemove[i].remove();
            }

            setImage([]);
            setImagePath('');
            props.setIsDirtyImageCollection(true);

            // remet l'image de fond
            document.getElementById('drop-region-dropZone').style.backgroundColor = 'none';
            document.getElementById('drop-region-dropZone').style.background = 'no-repeat url("../images/icons/backgroundDropZone.png")';
            document.getElementById('drop-region-dropZone').style.backgroundPosition = 'center 90%';

            document.getElementById("drop-message-dropZone").style.display = 'block';

            // supprime l'image temporaire dans la db et dans le dossier temporaire OU DANS LE DOSSIER IMAGE ET DANS LA DB COLLECTION CHAMP -> IMAGE
            var formData = new FormData;
            formData.append('key', 'tmp_imageCollection');
            formData.append('idCollection', idCollection);
            Axios.post(`http://127.0.0.1:8000/deleteTemporayStoredElements`, formData)
                .then(res => {
                    console.log('res.data  --->  ok');
                });
        }
    }

    function goToCrop() {
        // check if there is image
        var imageExist = document.getElementsByClassName('image-view-dropZone') && document.getElementsByClassName('image-view-dropZone');

        if (imageExist.length > 0) {
            setIsNot_isEdit(true);
            setWrapIndexcroppe(<CroppeImage setIsDirtyImageCollection={props.setIsDirtyImageCollection} />)
        }
    }

    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }


    return (
        <>
            <div className="w-full overflow-hidden border-4 border-dashed border-gray-300 rounded-md h-auto flex flex-col justify-center items-center flex-nowrap bg-white hover:border-gray-500">
                <div
                    id="drop-region-dropZone"
                    className="bg-white bg-dropZonCollection bg-no-repeat   rounded-md shadow-sm w-full min-h-[200px] max-h-[200px] h-auto flex flex-col justify-center items-center cursor-pointer transition ease-out duration-300">
                    <div
                        className="mt-6 mb-auto text-center text-sm font-semibold text-gray-400"
                        id='drop-message-dropZone'>
                        Déposez ici une image <br></br>ou cliquez pour charger une image
                    </div>
                    <div id="image-preview-dropZone"></div>
                </div>
            </div>

            <span className="w-full h-9 flex justify-end items-center cursor-pointer">
                {!!imagePath &&
                    <span
                        id="cropImageCollection3922"
                        className="flex justify-center"
                        onClick={() => goToCrop()}>
                        <img
                            id={"img_cropImageCollection3922"}
                            src='../images/icons/crop.svg'
                            className="w-5 h-5 hover:scale-110"
                        />
                        <TooltipWithoutIcon id="cropImageCollection3922" idimg="img_cropImageCollection3922" widthTip={184}>
                            Redimensionner l'image
                        </TooltipWithoutIcon>
                    </span>
                }
                {!!imagePath &&
                    <span
                        id="deleteImageCollection3922"
                        className="flex justify-center ml-3"
                        onClick={() => removeImagePreview()}>
                        <img
                            id={"img_deleteImageCollection3922"}
                            src='../images/icons/trash.svg' className="w-5 h-5 block hover:scale-110"
                        />
                        <TooltipWithoutIcon id="deleteImageCollection3922" idimg="img_deleteImageCollection3922" widthTip={145}>
                            Supprimer l'image
                        </TooltipWithoutIcon>
                    </span>
                }
            </span>
        </>
    )
}

export default DropZone;

