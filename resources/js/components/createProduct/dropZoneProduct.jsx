import React, { useEffect, useRef, useCallback, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Label from '../form/label';


const DropZoneProduct = ({ isEditProduct, productId }) => {

    const dropRegionRef = useRef();

    const { imageVariantes, setImageVariantes, variantes, setVariantes } = useContext(AppContext);

    var fakeInput = null;
    var mainImageProduct = null;
    var dropCard = null;
    var firstImage = null;
    var dropHeader = null;
    var txtImgPrincipale = null;

    function fakeInputClick() {
        fakeInput.click();
    }

    // permet de toujours faire référence à la même fonction fakeInputClick dans un eventListener. // empèche l'ouverture de la fenêtre explorateur quand on click sur la dropregion après avoir chargé une image via modalImageVariante
    const runFakeInputClick = useCallback((event) => { fakeInputClick() }, []);


    function createFakeInput() {
        // open file selector when clicked on the drop region
        fakeInput = document.createElement("input");
        fakeInput.type = "file";
        fakeInput.id = "fakeInput";
        fakeInput.accept = "image/*, video/*";
        fakeInput.multiple = true;

        fakeInput.addEventListener("change", function () {
            var files = fakeInput.files;
            handleFiles(files)
        });
    }


    useEffect(() => {

        document.getElementById("drop-card").style.display = 'none';

        fakeInput === null && createFakeInput();

        // change the message if doesn't support drag & drop
        var dragSupported = detectDragDrop();
        if (!dragSupported) {
            document.getElementsByClassName("drop-header")[0].innerHTML = 'Click to upload';
        }

        setDropRegion();

        // nettoie la table images_products des images temporaires
        Axios.post(`http://127.0.0.1:8000/clean_Images_product_table`);
    }, []);


    useEffect(() => {
        if (isEditProduct) {
            let idProduct = new FormData;
            idProduct.append('productId', productId);
            Axios.post(`http://127.0.0.1:8000/getProduct`, idProduct)
                .then(res => {
                    let tmp_data = [[]];
                    let tmp = [];
                    let imagesProduct = res.data[0].images_products;
                    imagesProduct.sort(function (a, b) {
                        return a.ordre - b.ordre;
                    });
                    for (let i = 0; i < imagesProduct.length; i++) {
                        if (tmp.length < 4) {
                            tmp.push(imagesProduct[i]);
                            tmp_data.splice(-1, 1, tmp);
                        } else {
                            tmp = [];
                            tmp.push(imagesProduct[i]);
                            tmp_data.push(tmp);
                        }
                    };
                    setImageVariantes(tmp_data);
                })
                .catch(error => {
                    console.log('Error get Product Images failed : ' + error.status);
                });
        }
    }, [isEditProduct])


    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    function setDropRegion() {
        dropRegionRef.current.className = "w-full h-auto flex-col justify-start items-center bg-white rounded-md py-10 px-2.5 border-dashed border-2 border-gray-300 hover:bg-gray-50 cursor-pointer";
        // open files exploratore when click on dropRegion
        dropRegionRef.current.addEventListener('click', runFakeInputClick);
        // empèche le comportement par défault et la propagation
        dropRegionRef.current.addEventListener('dragenter', preventDefault, false);
        dropRegionRef.current.addEventListener('dragleave', preventDefault, false);
        dropRegionRef.current.addEventListener('dragover', preventDefault, false);
        dropRegionRef.current.addEventListener('drop', preventDefault, false);
        dropRegionRef.current.addEventListener('drop', handleDrop, false);
    }


    // récupère les files quand on drop puis les envoi à handleFiles
    function handleDrop(e) {
        var dt = e.dataTransfer,
            files = dt.files;
        if (files.length) {
            handleFiles(files)
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
                handleFiles(files)
            }, 'image/*', 0.95);
        };
        img.onerror = function () {
            alert("Error in uploading");
        }
        img.crossOrigin = "";   // if from different origin
        img.src = url;
    }


    // affiche et sauvegarde les images dans temporaryStorage
    function handleFiles(files) {
        let count_files = [];
        let images_tab = [];
        let form_Data = new FormData;

        Object.values(files).forEach((file, index) => {
            if (validateImage(file)) {
                count_files.push(index);
                form_Data.append('files[]', file);
            }
        });

        form_Data.append('productId', productId);
        if (count_files.length > 0) {
            Axios.post(`http://127.0.0.1:8000/storeTmpImages`, form_Data,
                { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((res) => {
                    if (res.data.length > 0) {
                        images_tab = res.data;
                        // cancel --> open files explorator when click on dropRegion
                        dropRegionRef.current.removeEventListener('click', runFakeInputClick);
                        // crée des tableaux de 4 images 
                        if (images_tab.length > 0) {
                            let tmp_data = [[]];
                            let tmp = [];
                            for (let i = 0; i < images_tab.length; i++) {
                                if (tmp.length < 4) {
                                    tmp.push(images_tab[i]);
                                    tmp_data.splice(-1, 1, tmp);
                                } else {
                                    tmp = [];
                                    tmp.push(images_tab[i]);
                                    tmp_data.push(tmp);
                                }
                            };
                            setImageVariantes(tmp_data);
                        }
                    }
                })
                .catch((error) => console.log('error: ', error));
        }
    }

    // enlève la mini image des variantes quand on supprime l'image dans la dropZone 
    const removeOneMiniVarianteImage = (data) => {
        let idImages = data.map(x => x.id);
        let tmp_variantes = [...variantes];
        tmp_variantes.forEach(x => {
            if (!idImages.includes(x.selectedImage.id)) {
                return x.selectedImage = {};
            }
        });
        setVariantes([...tmp_variantes]);
    }


    const removeOneImage = (id) => {
        let form_Data = new FormData;
        form_Data.append('id', id);
        form_Data.append('productId', productId);
        Axios.post(`http://127.0.0.1:8000/deleteImageProduct`, form_Data)
            .then(res => {
                if (res.data == 'empty') {
                    setImageVariantes([]);
                    removeOneMiniVarianteImage([]);
                    dropRegionRef.current.addEventListener('click', runFakeInputClick);
                } else {
                    removeOneMiniVarianteImage(res.data);
                    // crée des tableaux de 4 images 
                    if (res.data.length > 0) {
                        let tmp_data = [[]];
                        let tmp = [];
                        for (let i = 0; i < res.data.length; i++) {
                            if (tmp.length < 4) {
                                tmp.push(res.data[i]);
                                tmp_data.splice(-1, 1, tmp);
                            } else {
                                tmp = [];
                                tmp.push(res.data[i]);
                                tmp_data.push(tmp);
                            }
                        };
                        setImageVariantes(tmp_data);
                        // handleReOrderInTemporaryStorage(tmp_data);
                    }
                }
            })
            .catch(error => {
                console.log('Error -> Delete Image Product failed : ' + error.status);
            });
    }


    // change order of images in db images_product when drag and drop images products in drop zone
    const handleReOrderInTemporaryStorage = (images_ReOrdered) => {
        var imagesToReOrder = new FormData;
        imagesToReOrder.append('images', JSON.stringify(images_ReOrdered));

        Axios.post(`http://127.0.0.1:8000/reOrderImagesProducts`, imagesToReOrder)
            .catch(error => {
                console.log('Error Image upload failed : ' + error.status);
            });
    };


    useEffect(() => {
        if (imageVariantes[0]?.length > 0) {
            // cancel --> open files explorator when click on dropRegion
            dropRegionRef.current.removeEventListener('click', runFakeInputClick);
            // met en blanc la dashed border de la dropRegion pour simuler sa disparition
            dropRegionRef.current.className = "flex-col justify-start items-center bg-white rounded-md w-full h-auto py-10 cursor-default";

            dropCard = document.getElementById("drop-card");
            // affiche le bouton add
            dropCard.style.display = 'block';

            mainImageProduct = document.getElementById("main-image-product");
            mainImageProduct.style.cursor = 'default';

            firstImage = document.getElementById("firstImage");
            firstImage.className = 'w-full h-full flex flex-row justify-center items-center pb-4 border border-gray-300 rounded-md';

            txtImgPrincipale = document.getElementById("txtImgPrincipale");
            txtImgPrincipale.className = 'w-full text-center text-[12px] pb-[5px]';

            fakeInput === null && createFakeInput();

            dropHeader = document.getElementById("drop-header");
            dropHeader.className = "w-full h-auto grid gap-2.5 grid-cols-2 justify-center items-center pb-2.5 mb-2.5";

        } else {
            firstImage = document.getElementById("firstImage");
            firstImage.className = 'hidden';

            document.getElementById("drop-card").style.display = 'none';

            fakeInput === null && createFakeInput();

            dropRegionRef.current.className = "w-full h-auto flex-col justify-start items-center bg-white rounded-md py-10 px-2.5 border-dashed border-2 border-gray-300 hover:bg-gray-50 cursor-pointer";
            // open files exploratore when click on dropRegion
            dropRegionRef.current.addEventListener('click', runFakeInputClick);

            dropHeader = document.getElementById("drop-header");
            dropHeader.className = "w-full h-auto flex flex-row justify-center items-center pb-2.5 mb-2.5";

        }
    }, [imageVariantes])


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

    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        color: isDragging ? "#00C8FF" : "white",

        // styles we need to apply on draggables
        ...draggableStyle,
    });


    // handle move image in drop region
    const move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        // le + sert à transformer la variable en nombre
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(imageVariantes[sInd], source.index, destination.index);
            const newState = [...imageVariantes];
            newState[sInd] = items;

            let tmp_data = [[]];
            let tmp = [];
            let newImage = [].concat.apply([], newState);
            for (let i = 0; i < newImage.length; i++) {
                if (tmp.length < 4) {
                    tmp.push(newImage[i]);
                    tmp_data.splice(-1, 1, tmp);
                } else {
                    tmp = [];
                    tmp.push(newImage[i]);
                    tmp_data.push(tmp);
                }
            };
            setImageVariantes(tmp_data);
            handleReOrderInTemporaryStorage(tmp_data);

        } else {
            const result = move(imageVariantes[sInd], imageVariantes[dInd], source, destination);
            const newState = [...imageVariantes];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            let tmp_data = [[]];
            let tmp = [];
            let newImage = [].concat.apply([], newState.filter(group => group.length));
            for (let i = 0; i < newImage.length; i++) {
                if (tmp.length < 4) {
                    tmp.push(newImage[i]);
                    tmp_data.splice(-1, 1, tmp);
                } else {
                    tmp = [];
                    tmp.push(newImage[i]);
                    tmp_data.push(tmp);
                }
            };
            setImageVariantes(tmp_data);
            handleReOrderInTemporaryStorage(tmp_data);
        }
    };


    return (
        <Flex_col_s_s id="main-image-product">
            <Label label="Images" />
            <div id="drop-region_product"
                className="w-full h-auto flex-col justify-start items-center bg-white rounded-md py-10 px-2.5 border-dashed border-2 border-gray-300 hover:bg-gray-50 cursor-pointer"
                ref={dropRegionRef}>
                <div id="drop-header"
                    className="w-full h-auto flex flex-row justify-center items-center pb-2.5 mb-2.5">
                    <div id="firstImage"
                        className='hidden'>
                        {imageVariantes[0]?.length > 0 &&
                            <div className='flex flex-col justify-start items-center flex-nowrap'>
                                <span id="txtImgPrincipale"
                                    className='w-full text-center text-xs mt-0 pb-2.5'>Image principale</span>
                                <img
                                    className='m-0 object-contain max-h-[200px]'
                                    src={'/storage/' + imageVariantes[0][0].path}
                                />
                            </div>
                        }
                    </div>
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <span className='text-center'>
                            Déposez vos images ou cliquez pour télécharger
                        </span>
                        {/* dropCard button add images */}
                        <div id="drop-card"
                            className='w-full h-auto mt-4'
                        >
                            <img
                                id="addImageDropZoneProduct"
                                src='../images/icons/add-square-dotted.svg'
                                className='w-[50px] h-[50px] mx-auto hover:bg-gray-50 cursor-pointer'
                                onClick={() => runFakeInputClick()}
                            />
                        </div>
                    </div>
                </div>

                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    {imageVariantes[0]?.length > 0 && imageVariantes.map((item_tab, ndx) => (
                        <Droppable droppableId={`${ndx}`}
                            direction="horizontal"
                            key={ndx}>
                            {(provided, snapshot) => (
                                <div
                                    className='grid gap-2.5 grid-cols-4 justify-center my-1.5 w-full h-32'
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {item_tab.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={`${item.id}`}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className="image-view flex flex-row justify-center items-center mb-5 relative border border-gray-300 rounded bg-white group z-[100]"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <img className='imgClass max-w-3/12 max-h-32'
                                                        src={'/storage/' + item.path}
                                                    />
                                                    <button id="removeImg"
                                                        className="invisible group-hover:visible absolute top-1.5 right-1.5 w-6 h-6 bg-[#d23e44] rounded"
                                                        onClick={() => {
                                                            removeOneImage(item.id);
                                                        }}
                                                    >
                                                        <img className='w-6 h-6 rounded'
                                                            src='../images/icons/x-white.svg'
                                                        />
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )
                    )}

                </DragDropContext>



            </div>
        </Flex_col_s_s>
    )
}

export default DropZoneProduct;

