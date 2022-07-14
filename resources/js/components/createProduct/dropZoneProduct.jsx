import React, { useEffect, useRef, useCallback, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ModalInput from '../elements/modalInput';
import Flex_col_s_s_nowrap from '../elements/blocks/flex_col_s_s_nowrap';
import Axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const DropZoneProduct = () => {

    const dropRegionRef = useRef();

    const { imageVariantes, setImageVariantes } = useContext(AppContext);


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
            handleFiles(files);
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

    }, []);


    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    function setDropRegion() {
        dropRegionRef.current.className = "w-full h-auto flex-col justify-start items-center bg-white rounded-md py-[40px] px-[10px] border-dashed border-4 border-gray-300 hover:bg-gray-50 cursor-pointer";
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


    // affiche et sauvegarde les images dans temporaryStorage
    function handleFiles(files) {
        let tmp_tab = imageVariantes;
        let four_items_tab = [];
        Object.values(files).map((item, index, arr) => {
            // crée des tableaux de 4 images
            if (validateImage(item)) {
                if ([tmp_tab.length - 1].length < 4) {
                    four_items_tab = [tmp_tab.length - 1];
                    four_items_tab.push(item);
                    tmp_tab.splice(-1, 1, four_items_tab);
                } else {
                    four_items_tab = [];
                    four_items_tab.push(item);
                    tmp_tab.push(four_items_tab);
                }


                // save images in temporayStorage
                var tmp_Data = new FormData;
                tmp_Data.append('key', 'tmp_productImage');

                let name = item.name;
                tmp_Data.append('value', item, name);

                Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, tmp_Data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(() => {
                        console.log('ok');
                        // cancel --> open files explorator when click on dropRegion
                        dropRegionRef.current.removeEventListener('click', runFakeInputClick);

                        if ((arr.length - 1) == index) {
                            Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
                                .then(res => {
                                    let tmp_data = [[]];
                                    let tmp = [];
                                    for (let i = 0; i < res.data.length; i++) {
                                        if (tmp.length < 4) {
                                            tmp.push(res.data[i]);
                                            tmp_data.splice(-1, 1, tmp);
                                        } else {
                                            tmp_data.splice(-1, 1, tmp);
                                            tmp = [];
                                            tmp.push(res.data[i]);
                                            tmp_data.push(tmp);
                                        }
                                    };
                                    setImageVariantes(tmp_data);
                                })
                                .catch(error => {
                                    console.log('Error get Product Images failed : ' + error.status);
                                });
                        }
                    })
                    .catch(error => {
                        console.log('Error Image upload failed : ' + error.status);
                    });
            }
        });
    }


    useEffect(() => {
        if (imageVariantes[0]?.length > 0) {
            // cancel --> open files explorator when click on dropRegion
            dropRegionRef.current.removeEventListener('click', runFakeInputClick);
            // met en blanc la dashed border de la dropRegion pour simuler sa disparition
            dropRegionRef.current.className = "flex-col justify-start items-center bg-white rounded-md w-full h-auto py-[40px] cursor-default";

            dropCard = document.getElementById("drop-card");
            // affiche le bouton add
            dropCard.style.display = 'block';

            mainImageProduct = document.getElementById("main-image-product");
            mainImageProduct.style.cursor = 'default';

            firstImage = document.getElementById("firstImage");
            firstImage.className = 'w-full h-full flex flex-row justify-center items-center p-0 border border-gray-300 rounded';

            txtImgPrincipale = document.getElementById("txtImgPrincipale");
            txtImgPrincipale.className = 'w-full text-center text-[12px] pb-[5px]';

            fakeInput === null && createFakeInput();

            dropHeader = document.getElementById("drop-header");
            dropHeader.className = "w-full h-auto grid gap-[10px] grid-cols-2 justify-center items-center pb-[10px] mb-[10px]";

        } else {
            firstImage = document.getElementById("firstImage");
            firstImage.className = 'hidden';

            document.getElementById("drop-card").style.display = 'none';

            fakeInput === null && createFakeInput();

            dropRegionRef.current.className = "w-full h-auto flex-col justify-start items-center bg-white rounded-md py-[40px] px-[10px] border-dashed border-4 border-gray-300 hover:bg-gray-50 cursor-pointer";
            // open files exploratore when click on dropRegion
            dropRegionRef.current.addEventListener('click', runFakeInputClick);

            dropHeader = document.getElementById("drop-header");
            dropHeader.className = "w-full h-auto flex flex-row  justify-center items-center pb-[10px] mb-[10px]";

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


    function removeOneImage(id, droppableIndex, draggableIndex) {

        const newState = [...imageVariantes];
        newState[droppableIndex].splice(draggableIndex, 1);

        let tmp_data = [[]];
        let tmp = [];

        let newImage = [].concat.apply([], newState.filter(group => group.length));

        for (let i = 0; i < newImage.length; i++) {
            if (tmp.length < 4) {
                tmp.push(newImage[i]);
                tmp_data.splice(-1, 1, tmp);
            } else {
                tmp_data.splice(-1, 1, tmp);
                tmp = [];
                tmp.push(newImage[i]);
                tmp_data.push(tmp);
            }
        };
        setImageVariantes(tmp_data);

        Axios.get(`http://127.0.0.1:8000/deleteOneElementById/${id}`)
            .then(res => {
                console.log('res.data  --->  ok');
            })
            .catch(error => {
                console.log('Error delete Product Image failed : ' + error.status);
            });

        handleReOrderInTemporaryStorage(tmp_data);

    }


    function detectDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }

    // function ModalConfirm() {
    //     uploadImageFromURL(urlValue);
    // }

    // function hideModal() {
    //     setShowModal(false);
    // }



    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        color: isDragging ? "#00C8FF" : "white",

        // styles we need to apply on draggables
        ...draggableStyle,
    });


    // change order of images in db temporary_storage when drag and drop images products on create product form
    const handleReOrderInTemporaryStorage = (imagesToReOrder) => {
        var im = new FormData;
        im.append('image', JSON.stringify(imagesToReOrder));

        Axios.post(`http://127.0.0.1:8000/reOrderImagesProducts`, im,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                console.log('ok');
            })
            .catch(error => {
                console.log('Error Image upload failed : ' + error.status);
            });
    };

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
                    tmp_data.splice(-1, 1, tmp);
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


            // crée un tableau contenant des tableaux de 4 images
            let newImage = [].concat.apply([], newState.filter(group => group.length));
            for (let i = 0; i < newImage.length; i++) {
                if (tmp.length < 4) {
                    tmp.push(newImage[i]);
                    tmp_data.splice(-1, 1, tmp);
                } else {
                    tmp_data.splice(-1, 1, tmp);
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
        <Flex_col_s_s_nowrap id="main-image-product">
            <h4 className='mb-[10px]'>Images</h4>
            <div id="drop-region_product"
                className="w-full h-auto flex-col justify-start items-center bg-white rounded-md py-[40px] px-[10px] border-dashed border-4 border-gray-300 hover:bg-gray-50 cursor-pointer"
                ref={dropRegionRef}>
                <div id="drop-header"
                    className="w-full h-auto flex flex-row  justify-center items-center pb-[10px] mb-[10px]">
                    <div id="firstImage"
                        className='hidden'>
                        {imageVariantes[0]?.length > 0 &&
                            <div className='flex flex-col justify-start items-center flex-nowrap'>
                                <span id="txtImgPrincipale"
                                    className='w-full text-center text-[12px] mt-0 pb-[10px]'>Image principale</span>
                                <img
                                    className='m-0 object-contain max-h-[200px]'
                                    src={window.location.origin + '/' + imageVariantes[0][0]?.value}
                                />
                            </div>
                        }
                    </div>
                    <div className='w-full h-full flex flex-col justify-center items-arround'>
                        <span className='text-center'>
                            Déposez vos images ou cliquez pour télécharger
                        </span>
                        {/* dropCard button add images */}
                        <div id="drop-card"
                            className='w-full h-auto mt-[25px]'
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
                                    className='grid gap-[10px] grid-cols-4 justify-center my-[5px] w-full h-[120px]'
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
                                                    className="image-view flex flex-row justify-center items-center mb[20px]  relative border border-gray-300 rounded group"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <img className='imgClass max-w-[(calc(100% / 4) - 10px] max-h-[120px]'
                                                        src={window.location.origin + '/' + item.value}
                                                    />
                                                    <button id="removeImg"
                                                        className="invisible group-hover:visible absolute top-[5px] right-[5px] w-[25px] h-[25px] bg-[#d23e44] rounded"
                                                        onClick={() => {
                                                            removeOneImage(item.id, ndx, index);
                                                        }}
                                                    >
                                                        <img className='w-[25px] h-[25px] rounded'
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
            {/* <ModalInput
                show={showModal}
                handleModalCancel={hideModal}
                setInputValue={setUrlValue}
                inputValue={urlValue}
                ModalConfirm={ModalConfirm}
              >
                <h2 className="childrenModal">Entrez l'URL de l'image</h2>
            </ModalInput> */}
        </Flex_col_s_s_nowrap>
    )
}

export default DropZoneProduct;

