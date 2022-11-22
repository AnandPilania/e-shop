import React, { useEffect, useContext } from 'react';
import Axios from 'axios';
import AppContext from '../contexts/AppContext';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const DropZone = (props) => {

    const { setImage, imagePath, setImagePath, setShowModalSimpleMessage, setMessageModal, is_Edit, setIs_Edit, idCollection, wrapIndexcroppe, setWrapIndexcroppe, setImageHasBeenChanged, localStorageImage, setLocalStorageImage } = useContext(AppContext);


    var dropRegion = null;

    useEffect(() => {
        // open file selector when clicked on the drop region
        var fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*";
        fakeInput.multiple = props.multiple;
        fakeInput.addEventListener("click", function (e) {
            e.target.value = '';
        });
        fakeInput.addEventListener("change", function () {
            var files = fakeInput.files;
            handleFiles(files);
            setImageHasBeenChanged(true);
        });

        dropRegion = document.getElementById("drop-region-dropZone");
        // open files exploratore when click on dropRegion
        dropRegion.addEventListener('click', function () {
            fakeInput.click();
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
            document.getElementById("drop-message-dropZone").innerHTML = 'Cliquer pour télécharger';
        }
        if (wrapIndexcroppe.blob !== null) {
            previewImage(wrapIndexcroppe.blob);
            setWrapIndexcroppe({ component: 'CreateCollection', blob: null });
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
        }
    }, []);

    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }

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


    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

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


    function handleFiles(file) {
        file = file[0];
        if (validateImage(file)) {
            setImage(file);
            previewImage(file);
        }
    }

    function validateImage(image) {
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf(image.type) === -1) {
            setMessageModal('Ce type de fichier n\'est pas valide')
            setShowModalSimpleMessage(true);
            return false;
        }
        var maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            setMessageModal('Votre fichier est trop grand')
            setShowModalSimpleMessage(true);
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (localStorageImage != null) {
            console.log('new File([blob]  ', localStorageImage)
            previewImage(localStorageImage);
            setImage(localStorageImage);
            setLocalStorageImage(null);
        }
    }, [localStorageImage]);



    function previewImage(file) {

        // retire l'image de fond
        let containerDropZone = document.getElementById('drop-region-dropZone');
        if (containerDropZone !== null) {
            containerDropZone.style.backgroundColor = '#FFFFFF';
        }

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
            console.log('e.target.result  ', e.target.result);
        }
        reader.readAsDataURL(file);
    }


    function removeImagePreview() {
        let img = document.getElementById("imageZone");
        img.src = null;
        img.style.display = "none";
        setImagePath('');
        setImage('')
        setImageHasBeenChanged(true);

        // remet l'image de fond
        let containerDropZone = document.getElementById('drop-region-dropZone');
        if (containerDropZone !== null) {
            containerDropZone.style.backgroundColor = '#FFFFFF';
        }
        document.getElementById("drop-message-dropZone").style.display = 'block';
    }

    function goToCrop() {
        setWrapIndexcroppe({ component: 'CroppeImage', blob: null, setIsDirtyImageCollection: false });
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

