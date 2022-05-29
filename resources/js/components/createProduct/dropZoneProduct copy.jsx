import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ModalInput from '../elements/modalInput';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const DropZoneProduct = () => {

    const [showModal, setShowModal] = useState(false);
    const [urlValue, setUrlValue] = useState('');

    const { image, setImage } = useContext(AppContext);

    var dropRegion = null;
    var imagePreviewZone = null;
    var fakeInput = null;
    var mainImageProduct = null;
    var dropCard = null;
    var addImageProduct = null;

    function fakeInputTrigger() {
        fakeInput.click();
    }


    useEffect(() => {
        document.getElementById("drop-card").style.display = 'none';

        // open file selector when clicked on the drop region
        fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.accept = "image/*, video/*";
        fakeInput.multiple = true;

        fakeInput.addEventListener("change", function () {
            var files = fakeInput.files;
            handleFiles(files);
        });

        // change the message if doesn't support drag & drop
        var dragSupported = detectDragDrop();
        if (!dragSupported) {
            document.getElementsByClassName("drop-message")[0].innerHTML = 'Click to upload';
        }

        setDropRegion();

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

    function setDropRegion() {
        dropRegion = document.getElementById("drop-region");

        // open files exploratore when click on dropRegion
        dropRegion.addEventListener('click', fakeInputTrigger);

        // empèche le comportement par défault et la propagation
        dropRegion.addEventListener('dragenter', preventDefault, false);
        dropRegion.addEventListener('dragleave', preventDefault, false);
        dropRegion.addEventListener('dragover', preventDefault, false);
        dropRegion.addEventListener('drop', preventDefault, false);

        dropRegion.addEventListener('drop', handleDrop, false);

        dropRegion.addEventListener('dragenter', highlight, false);
        dropRegion.addEventListener('dragover', highlight, false);
        dropRegion.addEventListener('dragleave', unhighlight, false);
        dropRegion.addEventListener('drop', unhighlight, false);
    }


    // récupère les files quand on drop et les envoi à handleFiles
    function handleDrop(e) {
        var dt = e.dataTransfer,
            files = dt.files;
        if (files.length) {
            handleFiles(files);
        } else {
            alert('not files.length')
            // check for img
            var html = dt.getData('text/html'),
                match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
                url = match && match[1];
            if (url) {
                uploadImageFromURL(url);
                return;
            }
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
                var file = new File([blob], "myImageName", {
                    type: "image/*",
                });

                handleFiles([file]);
            }, 'image/*', 0.95);
        };
        img.onerror = function () {
            alert("Error in uploading");
        }
        img.crossOrigin = "";   // if from different origin
        img.src = url;
    }


    // affiche et sauvegarde les images
    function handleFiles(files) {
        let tmp_tab = image;
        Object.values(files).map(item => {
            if (validateImage(item)) {
                tmp_tab.push(item);
                previewImage(item);
            }
        });
        setImage(tmp_tab);
    }




    function validateImage(image) {
        // check the type
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
        if (validTypes.indexOf(image.type) === -1) {
            alert("Type d'image invalide");
            return false;
        }

        // check the size
        var maxSizeInBytesImage = 2e6; // 2MB
        if (image.type.includes('image')) {
            if (image.size > maxSizeInBytesImage) {
                alert("Votre image ne peut pas dépasser 2MB");
                return false;
            }
        }
        var maxSizeInBytesVideo = 10e6; // 2MB
        if (image.type.includes('video')) {
            if (image.size > maxSizeInBytesVideo) {
                alert("Votre vidéo ne peut pas dépasser 10MB");
                return false;
            }
        }

        return true;
    }

    function previewImage(imageFile) {
        imagePreviewZone = document.getElementById("image-preview-zone");
        setDropRegion();
        dropCard = document.getElementById("drop-card");
        mainImageProduct = document.getElementById("main-image-product");
        mainImageProduct.style.cursor = 'pointer';

        // div qui contient une image affichée dns la imagePreviewZone
        var imgView = document.createElement("div");
        imgView.className = "image-view flex flex-row justify-center items-center mb[20px] h-[120px] w-[120px] relative border border-slate-300 rounded group";

        // empèche le drag and drop des image qui sont dans la image-preview-zone
        imgView.addEventListener('dragstart', (e) => {
            e.preventDefault()
        })
        imgView.addEventListener('drop', (e) => {
            e.preventDefault()
        })
        imagePreviewZone.appendChild(imgView);

        // image
        var img = document.createElement("img");
        img.className = 'imgClass';
        imgView.appendChild(img);

        // button remove
        var removeImg = document.createElement("button");
        removeImg.className = "removeImg invisible group-hover:visible absolute top-[5px] right-[5px] w-[25px] h-[25px] bg-[#d23e44] rounded";
        removeImg.setAttribute('id', 'removeImg');
        removeImg.addEventListener('click', function () {
            // ici checker si isProductEdit pour choisir de remove image from DOM ou from DataBase !!!

            // suppression de l'image dans image "hook"
            let imgView_index = imgView.id.replace('imgView', '');
            if (imgView_index != undefined && imgView_index != null && imgView_index != '') {
                let tab = image;
                tab.splice(imgView_index, 1)
                setImage(tab);
            };

            imgView.remove();

            if (imagePreviewZone.childElementCount == 1) {
                dropCard.style.display = 'none';
                // setTimeout permet de ne pas déclencher fakeInputTrigger immédiatement après la suppression du dernier imgView
                setTimeout(() => {
                    fakeInput.value = '';
                    setDropRegion();
                    dropRegion.style.cursor = 'pointer';
                }, 10);
                dropRegion.className = "w-full h-full flex-col justify-start items-center bg-white rounded-md p-[40px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer";
            }
            handleImgViewIndex();
        });

        imgView.appendChild(removeImg);

        var svgCancel = document.createElement("img");
        svgCancel.className = 'w-[25px] h-[25px] rounded';
        svgCancel.src = '../images/icons/x-white.svg';
        removeImg.appendChild(svgCancel);


        // read the image...
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageFile);


        // cadrage de l'image
        img.onload = () => {
            // cancel --> open files explorator when click on dropRegion
            dropRegion.removeEventListener('click', fakeInputTrigger);
            dropCard.style.display = 'block';
            // open files exploratore when click on dropRegion
            addImageProduct = document.getElementById('drop-card');
            addImageProduct.addEventListener('click', fakeInputTrigger);

            let countImgClass = document.getElementsByClassName("imgClass");
            dropCard.style.order = countImgClass.length;

            mainImageProduct.style.cursor = 'default';

            // met en blanc la dashed border de la dropRegion pour simuler sa disparition
            dropRegion.className = "flex-col justify-start items-center bg-white rounded-md w-full p-[40px] border-2 border-slate-200  cursor-default";

            handleImgViewIndex();

            var width = img.clientWidth;
            var height = img.clientHeight;
            if (width > height) {
                img.style.width = '120px';
            } else {
                img.style.height = '120px';
            }
        }
    }

    // crée les ids des image-view à chaque ajout ou suppression d'images
    function handleImgViewIndex() {
        let allImgView = document.getElementsByClassName('image-view');
        for (let i = 0; i < allImgView.length; i++) {
            allImgView[i].id = 'imgView' + i;
        }
    }


    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }

    function ModalConfirm() {
        uploadImageFromURL(urlValue);
    }

    function hideModal() {
        setShowModal(false);
    }

    return (
        <div id="main-image-product" className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">
            <div id="drop-region" className="w-full h-full flex-col justify-start items-center bg-white rounded-md p-[40px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer">
                <div className="drop-message w100pct txt-c">
                    Déposez vos images ou cliquez pour télécharger
                </div>
                <div id="image-preview-zone"
                    className='grid gap-4 grid-cols-4'>

                    {/* ici sont injectés les images */}

                    <div id="drop-card"
                        className='flex-col justify-center items-center w-[120px] h-[120px] p-[20px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer rounded'>
                        {/* add button */}
                        <div className='w-[40px] h-[40px] m-auto  hover:bg-slate-100 hover:cursor-pointer'>
                            <img src='../images/icons/add-square-dotted.svg'
                                className='w-[60px] h-[60px]' />
                        </div>
                    </div>
                </div>
            </div>
            <ModalInput
                show={showModal}
                handleModalCancel={hideModal}
                setInputValue={setUrlValue}
                inputValue={urlValue}
                ModalConfirm={ModalConfirm}
            >
                <h2 className="childrenModal">Entrez l'URL de l'image</h2>
            </ModalInput>
        </div>
    )
}

export default DropZoneProduct;

