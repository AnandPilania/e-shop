import React, { useState, useRef } from 'react';
import Axios from 'axios';


const ModalImageVariante = ({ handleConfirm, handleModalCancel, show, imageVariante, setImageVariante }) => {

    const [countFile, setCountFile] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    const inputModalImageVariante = useRef(null);

    const handleImportImage = () => {
        inputModalImageVariante.current.click();
    }

    // toggle entre l'affichage et le masquage de l'icon de sélection quand on click sur une image + setSelectedImage qui doit être envoyée à optionVariantesList
    const handleSelectImage = (item) => {
        // masque l'icon si déjà coché
        if (selectedImage !== null && item.id === selectedImage.id) {
            document.getElementById('checkedButton' + selectedImage.id).className = "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white";
            document.getElementById('checkedButton' + selectedImage.id).parentNode.className = "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400";

            setSelectedImage(null);

        } else {
            // set l'image qui sera envoyée à handleConfirm
            setSelectedImage(item);

            // décoche l'image sélectionnée, s'il y en a !
            imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).className = x.id != item.id && "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white");
            imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).parentNode.className = x.id != item.id && "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400");

            // coche l'image cliquée
            let checkedButton = document.getElementById('checkedButton' + item.id);
            checkedButton.className = "visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white";

            checkedButton.parentNode.className = "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border rounded cursor-pointer border-green-500 ";
        }
    }


    function validateImage(image) {
        // check the type
        var validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
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
        return true;
    }


    const handleFiles = (e) => {
        let files = e.target.files;
        setCountFile(countFile + e.target.files.length);
        Object.values(files).map(file => {
            if (validateImage(file)) {
                saveImage(file);
            }
        });
    }


    const saveImage = (file) => {
        // save image in temporayStorage
        var tmp_Data = new FormData;
        tmp_Data.append('key', 'tmp_productImage');
        let name = file.name;
        tmp_Data.append('value', file, name);

        Axios.post(`http://127.0.0.1:8000/temporaryStoreImages`, tmp_Data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
                    .then(res => {
                        setImageVariante(res.data);
                    })
                    .catch(error => {
                        console.log('Error get Product Images failed : ' + error.status);
                    });
            })
            .catch(error => {
                console.log('Error Image upload failed : ' + error.status);
            });
    }


    // suprime les images chargées si on annule
    const removeImageFroTemprayStorage = () => {
        var tmp_Data = new FormData;
        tmp_Data.append('key', 'tmp_productImage');
        tmp_Data.append('countFile', countFile);

        Axios.post(`http://127.0.0.1:8000/deleteModalImageVariantes`, tmp_Data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => {
                setCountFile(0);
                Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
                    .then(res => {
                        setImageVariante(res.data);
                    })
                    .catch(error => {
                        console.log('Error get Product Images failed : ' + error.status);
                    });
            })
            .catch(error => {
                console.log('Error Image upload failed : ' + error.status);
            });
    }

    const cancelSelection = () => {
        setSelectedImage(null);

        // masque le checkedButton sélectionné, s'il y en a !
        imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).className = "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white");
        imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).parentNode.className = "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400");


    }

    const scrollDown = () => {
        let toScroll = document.getElementById('idSectionModalImageVariante');
        toScroll.scrollTo(0, toScroll.scrollHeight || toScroll.documentElement.scrollHeight);
    }

    const handleDoubleClick = (item) => {
        setSelectedImage(item);
        handleConfirm(selectedImage);
        handleSelectImage(item);
        cancelSelection();
    }


    const [waitingClick, setWaitingClick] = useState(null);
    const [lastClick, setLastClick] = useState(0);
    const handleClick = (e, item) => {
        if (lastClick && e.timeStamp - lastClick < 250 &&
            waitingClick) {
            setLastClick(0);
            clearTimeout(waitingClick);
            setWaitingClick(null);
            handleDoubleClick(item);
        }
        else {
            setLastClick(e.timeStamp);
            setWaitingClick(setTimeout(() => {
                setWaitingClick(null);
            }, 251));
            handleSelectImage(item);
        }
    }


    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-center`}>
            <div className="fixed w-[40%] max-h-[90vh] max-x-[650px] min-x-[350] p-[20px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
            >
                <div className='w-full flex flex-row justify-between mb-[20px]'>
                    <h3 className='h-[30px] ml-[10px] font-semibold text-lg'>
                        Sélectionner une immage
                    </h3>
                    <span
                        onClick={handleModalCancel}
                        className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer bg-red-500 rounded-[5px]'>
                        <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[20px] w-[20px]" />
                    </span>
                </div>

                <section
                    id="idSectionModalImageVariante"
                    className="classSectionModalImageVariante w-full max-h-[70%] grid grid-cols-4 gap-[10px] justify-center items-center overflow-y-auto scroll-smooth"
                >
                    {imageVariante.length > 0 &&
                        imageVariante.map((item, index) =>
                            <div
                                key={index}
                                onClick={(e) => handleClick(e, item)}
                                className="flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400 "
                            >
                                <img className='max-w-[(calc(100% / 4) - 12px] max-h-[98px]'
                                    src={window.location.origin + '/' + item.value}
                                />
                                <button
                                    id={`checkedButton${item.id}`}
                                    className="invisible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white"
                                >
                                    <img className='w-[25px] h-[25px] rounded'
                                        src='../images/icons/check-green-fill.svg'
                                    />
                                </button>
                            </div>
                        )}
                </section>
                {/* scroll down button */}
                <div className='w-full mt-[25px] mb-[5px] flex justify-center'>
                    <img
                        onClick={scrollDown}
                        className='w-[25px] h-[25px] rounded hover:scale-125 animate-bounce cursor-pointer'
                        src='../images/icons/arrow-down-circle.svg'
                    />
                </div>
                <button
                    className='flex flex-row justify-center items-center min-h-[40px] px-[20px] my-[20px] border border-gray-300'
                    onClick={handleImportImage}
                >
                    {/* cet input est hidden et remplacé par un button pour le design */}
                    <input
                        ref={inputModalImageVariante}
                        type='file'
                        onChange={handleFiles}
                        multiple={true}
                        className="hidden"
                    // onChange={handleinputTextModify}
                    />
                    <img className='w-[15px] h-[15px] mr-[10px]'
                        src='../images/icons/download.svg'
                    />
                    Importer une image
                </button>

                <div className="w-full flex flex-row justify-center items-center">
                    <button
                        className={`flex flrex-row justify-center items-center h-[40px] px-[20px] ${selectedImage == null ? "bg-gray-100 text-gray-400" : "bg-green-500 text-white"}`}
                        onClick={() => {
                            selectedImage != null &&
                                handleConfirm(selectedImage);
                            cancelSelection();
                        }}
                    >
                        Enregister
                    </button>

                    <button
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px] ml-[15px] border border-gray-300"
                        onClick={() => {
                            removeImageFroTemprayStorage();
                            cancelSelection();
                            handleModalCancel();
                        }}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalImageVariante;
