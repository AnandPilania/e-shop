import React, { useEffect, useContext } from 'react';
import Axios from 'axios';
import AppContext from '../contexts/AppContext';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';
import CroppeImage from '../croppeJs/croppeJs';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const DropZone = (props) => {

    const { image, setImage, imagePath, setImagePath, setImageModal, setShowModalSimpleMessage, setMessageModal, is_Edit, setIs_Edit, idCollection, wrapIndexcroppe, setWrapIndexcroppe, setIsNot_isEdit, collectionForm, setCollectionForm } = useContext(AppContext);


    var dropRegion = null;

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
            // try {
            //     Axios.get(`http://127.0.0.1:8000/getCollectionTmpImage`)
            //         .then(res => {
            //             if (res.data !== undefined && res.data != '') {
            //                 // get --> image path <-- for croppe
            //                 setImagePath('/' + res.data);
            //                 // get --> image <-- for preview
            //                 fetch('/' + res.data)
            //                     .then(function (response) {
            //                         return response.blob();
            //                     })
            //                     .then(function (BlobImage) {
            //                         previewImage(BlobImage);
            //                         setImage(BlobImage);
            //                     })
            //             }
            //         });
            // } catch (error) {
            //     console.error('error  ' + error);
            // }
        }

        if (wrapIndexcroppe.blob !== null) {
            previewImage(wrapIndexcroppe.blob);
        }

        return () => {
            dropRegion.removeEventListener('click', function () {
                fakeInput.click();
            });
    
            fakeInput.removeEventListener("click", function (e) {
                e.target.value = '';
            });
    
            fakeInput.removeEventListener("change", function () {
                var files = fakeInput.files;
                handleFiles(files);
            });
            dropRegion.removeEventListener('dragenter', preventDefault, false);
            dropRegion.removeEventListener('dragleave', preventDefault, false);
            dropRegion.removeEventListener('dragover', preventDefault, false);
            dropRegion.removeEventListener('drop', preventDefault, false);
            dropRegion.removeEventListener('drop', handleDrop, false);   
            dropRegion.removeEventListener('dragenter', highlight, false);
            dropRegion.removeEventListener('dragover', highlight, false);
            dropRegion.removeEventListener('dragleave', unhighlight, false);
            dropRegion.removeEventListener('drop', unhighlight, false);
        }
 
    }, []);

    // when collection is edited
    useEffect(() => {
        if (is_Edit) {
            console.log('idCollection  ' + idCollection);
            try {
                Axios.get(`http://127.0.0.1:8000/getCollectionById/${idCollection}`)
                    .then(res => {
                        if (res.data !== undefined && res.data != '' && res.data !== null) {
                            // get --> image path <-- for croppe
                            console.log('res.data--->  ', res.data.image)
                            setImagePath('/' + res.data.image);
                            // get --> image <-- for preview
                            fetch('/' + res.data.image)
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
        return setIs_Edit(false);
    }, [is_Edit]);


    const handleChangeImage = (imageFile) => {
        // var tmp_Data = new FormData;
        // tmp_Data.append('key', 'tmp');

        // let name = value.name !== undefined ? value.name : blobImageName;

        // if (Array.isArray(value)) {
        //     tmp_Data.append('value', imageFile[0], name);
        // } else {
        //     tmp_Data.append('value', imageFile, name);
        // }

        // Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, tmp_Data,
        //     { headers: { 'Content-Type': 'multipart/form-data' } })
        //     .then(
        //         Axios.get(`http://127.0.0.1:8000/getCollectionTmpImage`)
        //             .then(res => {
        //                 if (res.data !== undefined) {
        //                     // get --> image path <-- for croppe
        //                     setImagePath('/' + res.data);
        //                 }
        //             })
        //     )
        //     .catch(error => {
        //         console.log('Error Image upload failed : ' + error.status);
        //     });




        let response = async () => {
            return saveInTemporaryStorage('tmp_imageCollection', imageFile)
        }
        response().then(() => {
            try {
                Axios.get(`http://127.0.0.1:8000/getCollectionById/${idCollection}`)
                    .then(res => {
                        if (res.data !== undefined) {
                            // get --> image path <-- for croppe
                            setImagePath('/' + res.data.image);
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
    function handleFiles(file) {
        file = file[0];
        if (validateImage(file)) {
            setImage(file);
            // handleChangeImage(file);
            previewImage(file);
        }
        // permet à checkIfIsDirty dans index de bloquer la navigation lorsqu'on ajoute ou change une image sans sauvegarder
        setCollectionForm({ ...collectionForm, hasBeenChanged: true });
    }


    function validateImage(image) {
        // check the type
        console.log('validateImage  ', image)
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf(image.type) === -1) {
            setMessageModal('Ce type de fichier n\'est pas valide')
            setShowModalSimpleMessage(true);
            return false;
        }

        // check the size
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            setMessageModal('Votre fichier est trop grand')
            setShowModalSimpleMessage(true);
            return false;
        }

        return true;
    }


    function previewImage(image) {

        // retire l'image de fond
        let containerDropZone = document.getElementById('drop-region-dropZone');
        containerDropZone.style.backgroundColor = '#FFFFFF';

        // previewing image
        let img = document.getElementById("imageZone");
        img.style.display = "block";
        document.getElementById("drop-message-dropZone").style.display = 'none';

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

        // read image
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            setImagePath(e.target.result);
        }
        reader.readAsDataURL(image);
    }


    function removeImagePreview() {
        let img = document.getElementById("imageZone");
        img.src = null;
        img.style.display = "none";
        setImagePath('');

        // remet l'image de fond
        let containerDropZone = document.getElementById('drop-region-dropZone');
        containerDropZone.style.backgroundColor = '#FFFFFF';
        document.getElementById("drop-message-dropZone").style.display = 'block';
    }

    function goToCrop() {
        setIsNot_isEdit(true);
        setWrapIndexcroppe({ component: 'CroppeImage', blob: null, setIsDirtyImageCollection: true });
        // setWrapIndexcroppe(
        //     <CroppeImage
        //         setIsDirtyImageCollection={props.setIsDirtyImageCollection}
        //         previewImage={previewImage}
        //     />
        // )
    }

    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }


    return (
        <>
            <div className="w-full overflow-hidden border-4 border-dashed border-gray-300 rounded-md h-auto flex flex-col justify-center items-center flex-nowrap bg-white hover:border-gray-500"
            >
                <div
                    id="drop-region-dropZone"
                    className="rounded-md shadow-sm w-full min-h-[200px] max-h-[200px] h-auto flex flex-col justify-center items-center cursor-pointer transition ease-out duration-300"
                >
                    <div
                        className="mt-6 mb-auto text-center text-sm font-semibold text-gray-400"
                        id='drop-message-dropZone'
                    >
                        Déposez une image <br></br>ou cliquez pour charger une image
                        <img
                            src='../images/icons/image.svg'
                            className="w-24 h-auto mt-5 mx-auto"
                        />
                    </div>
                    <img id="imageZone" className='hidden' />
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

