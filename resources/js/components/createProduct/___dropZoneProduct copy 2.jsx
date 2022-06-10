import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ModalInput from '../elements/modalInput';
import Axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const DropZoneProduct = () => {

    const [showModal, setShowModal] = useState(false);
    const [urlValue, setUrlValue] = useState('');

    const { image, setImage } = useContext(AppContext);

    var dropRegion = null;
    var fakeInput = null;
    var mainImageProduct = null;
    var dropCard = null;


    function fakeInputClick() {
        fakeInput.click();
    }

    function createFakeInput() {
        // open file selector when clicked on the drop region
        fakeInput = document.createElement("input");
        fakeInput.type = "file";
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
            document.getElementsByClassName("drop-message")[0].innerHTML = 'Click to upload';
        }

        setDropRegion();

    }, []);


    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function setDropRegion() {
        dropRegion = document.getElementById("drop-region");

        // open files exploratore when click on dropRegion
        dropRegion.addEventListener('click', fakeInputClick);

        // empèche le comportement par défault et la propagation
        dropRegion.addEventListener('dragenter', preventDefault, false);
        dropRegion.addEventListener('dragleave', preventDefault, false);
        dropRegion.addEventListener('dragover', preventDefault, false);
        dropRegion.addEventListener('drop', preventDefault, false);

        dropRegion.addEventListener('drop', handleDrop, false);
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

    // mesPoissons.splice(2, 0, "tambour");
    // affiche et sauvegarde les images
    function handleFiles(files) {
        let tmp_tab = image;
        let four_items_tab = [];
        Object.values(files).map(item => {
            if (validateImage(item)) {
                // if ([tmp_tab.length - 1].length < 4) {
                //     four_items_tab = [tmp_tab.length - 1];
                //     four_items_tab.push(item);
                //     tmp_tab.splice(-1, 1, four_items_tab);
                // } else {
                //     four_items_tab = [];
                //     four_items_tab.push(item);
                //     tmp_tab.push(four_items_tab);
                // }

                tmp_tab.push(item);

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
                        dropRegion.removeEventListener('click', fakeInputClick);
                    })
                    .catch(error => {
                        console.log('Error Image upload failed : ' + error.status);
                    });
            }
        });

        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                // let tmp_data = [[]];
                // let tmp = [];

                // res.data.forEach(item => {
                //     if (tmp.length < 4) {
                //         tmp.push(item);
                //         tmp_data.splice(-1, 1, tmp);
                //     } else {
                //         tmp_data.splice(-1, 1, tmp);
                //         tmp = [];
                //         tmp.push(item);
                //         tmp_data.push(tmp);
                //     }
                // })
                // setImage(tmp_data);
                setImage(res.data);
                console.log(tmp_data)
            })
            .catch(error => {
                console.log('Error get Product Images failed : ' + error.status);
            });
    }


    useEffect(() => {
        console.log('image  ', image)
        if (image.length > 0) {
            dropRegion = document.getElementById("drop-region");
            dropCard = document.getElementById("drop-card");
            mainImageProduct = document.getElementById("main-image-product");
            fakeInput === null && createFakeInput();

            // cancel --> open files explorator when click on dropRegion
            dropRegion.removeEventListener('click', fakeInputClick);

            // affiche le bouton add
            dropCard.style.display = 'block';

            mainImageProduct.style.cursor = 'default';

            // met en blanc la dashed border de la dropRegion pour simuler sa disparition
            dropRegion.className = "flex-col justify-start items-center bg-white rounded-md w-full p-[40px] border-2 border-slate-200  cursor-default";
        }
    }, [image])




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


    function removeOneImage(id) {
        console.log('fakeInput  ', fakeInput)
        Axios.get(`http://127.0.0.1:8000/deleteOneElementById/${id}`)
            .then(res => {
                console.log('res.data  --->  ok');
            })
            .catch(error => {
                console.log('Error delete Product Image failed : ' + error.status);
            });

        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                if (res.data.length === 0) {
                    dropCard.style.display = 'none';

                    // open files exploratore when click on dropRegion
                    fakeInput === null && createFakeInput();
                    dropRegion.addEventListener('click', fakeInputClick);

                    dropRegion.className = "w-full h-full flex-col justify-start items-center bg-white rounded-md p-[40px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer";
                }

                // let tmp_data = [[]];
                // let tmp = [];

                // res.data.forEach(item => {
                //     if (tmp.length < 4) {
                //         tmp.push(item);
                //         tmp_data.splice(-1, 1, tmp);
                //     } else {
                //         tmp_data.splice(-1, 1, tmp);
                //         tmp = [];
                //         tmp.push(item);
                //         tmp_data.push(tmp);
                //     }
                // })
                // setImage(tmp_data);
                setImage(res.data);
            })
            .catch(error => {
                console.log('Error get Product Images failed : ' + error.status);
            });
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



    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        color: isDragging ? "#00C8FF" : "white",

        // styles we need to apply on draggables
        ...draggableStyle,
    });

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

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(image[sInd], source.index, destination.index);
            const newState = [...image];
            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(image[sInd], image[dInd], source, destination);
            const newState = [...image];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setImage(newState.filter(group => group.length));
        }
    };

    return (
        <div id="main-image-product" className="flex-col justify-start items-start bg-white rounded-md w-full p-[20px] mb-[10px] shadow-md">
            <div id="drop-region" className="w-full h-full flex-col justify-start items-center bg-white rounded-md p-[40px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer">
                <div className="drop-message w100pct txt-c">
                    Déposez vos images ou cliquez pour télécharger
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    {image.length > 0 && image.map((item_tab, ndx) => (
                        <Droppable droppableId={`${ndx}`}
                            key={ndx}>
                            {(provided, snapshot) => (
                                <div
                                    className='grid gap-4 grid-cols-4'
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
                                                    className="image-view flex flex-row justify-center items-center mb[20px] h-[120px] w-[120px] relative border border-slate-300 rounded group"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >

                                                    <img className='imgClass max-w-[120px] max-h-[120px]'
                                                        src={window.location.origin + '/' + item.value} />

                                                    <button id="removeImg"
                                                        className="removeImg invisible group-hover:visible absolute top-[5px] right-[5px] w-[25px] h-[25px] bg-[#d23e44] rounded"
                                                        onClick={() => removeOneImage(item.id)}>

                                                        <img className='w-[25px] h-[25px] rounded'
                                                            src='../images/icons/x-white.svg' />
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
                    {/* dropCard add images */}
                    <div id="drop-card"
                        className='flex-col justify-center items-center w-[120px] h-[120px] p-[20px] border-dashed border-4 border-slate-300 hover:bg-slate-50 cursor-pointer rounded'
                        onClick={() => fakeInputClick()}>
                        {/* add button */}
                        <div className='w-[40px] h-[40px] m-auto  hover:bg-slate-100 hover:cursor-pointer'>
                            <img src='../images/icons/add-square-dotted.svg'
                                className='w-[60px] h-[60px]' />
                        </div>
                    </div>
                </DragDropContext>



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

