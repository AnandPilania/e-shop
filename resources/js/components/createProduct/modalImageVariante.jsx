import React, { useState, useEffect, useContext, useRef, createElement } from 'react';
import AppContext from '../contexts/AppContext';
import { makeStyles } from '@material-ui/styles';
import Axios from 'axios';

const useStyles = makeStyles({

    close: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '25px',
        paddingTop: '25px',
    },


    faTimes: {
        fontSize: '26px',
        transition: 'ease-in-out .15s',
        color: '#333333',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.15)',
        },
    },
});



const ModalImageVariante = ({ handleConfirm, handleModalCancel, show, imageVariante, setImageVariante }) => {

    const [countFile, setCountFile] = useState(0);
    const [selectedImage, setSelectedImage] = useState({});

    // const { imageVariantes, setImageVariantes } = useContext(AppContext);

    const inputModalImageVariante = useRef(null);

    const handleImportImage = () => {
        inputModalImageVariante.current.click();
    }

    const handleSelectImage = (item) => {

        // l'image que sera envoyée à handleConfirm
        setSelectedImage(item);

        // masque le checkedButton sélectionné, s'il y en a !
        imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).className = x.id != item.id && "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white");
        imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).parentNode.className = x.id != item.id && "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400");

        // check le checkedButton de l'image cliquée
        let checkedButton = document.getElementById('checkedButton' + item.id);
        checkedButton.className = "visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white";

        checkedButton.parentNode.className = "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border rounded cursor-pointer border-green-500 ";
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

    const scrollDown = () => {
        let toScroll = document.getElementById('idSectionModalImageVariante');
        toScroll.scrollTo(0, toScroll.scrollHeight || toScroll.documentElement.scrollHeight);
    }


    console.log('imageVariante modal -->  ', imageVariante)
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
                                onClick={() => handleSelectImage(item)}
                                onDoubleClick={() => {
                                    handleSelectImage(item);
                                    handleConfirm(selectedImage);
                                }}
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
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px]  bg-green-500 text-white"
                        onClick={() => {
                            handleConfirm(selectedImage);
                        }}>
                        Enregister
                    </button>

                    <button
                        className="flex flrex-row justify-center items-center h-[40px] px-[20px] ml-[15px] border border-gray-300"
                        onClick={() => {
                            removeImageFroTemprayStorage();
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
