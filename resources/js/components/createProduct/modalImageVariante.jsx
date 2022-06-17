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



const ModalImageVariante = ({ handleConfirm, handleModalCancel, show }) => {

    const [imageVariante, setImageVariante] = useState({});
    const [imageFile, setImageFile] = useState([]);

    const { imageVariantes, setImageVariantes } = useContext(AppContext);

    useEffect(() => {
        Axios.get('http://127.0.0.1:8000/getTemporaryImages/tmp_productImage')
            .then(res => {
                setImageVariante(res.data);
            })
            .catch(error => {
                console.log('Error get Product Images failed : ' + error.status);
            });
    }, []);

    const inputModalImageVariante = useRef(null);

    const handleImportImage = () => {
        inputModalImageVariante.current.click();
    }

    const handleSelectImage = (item) => {
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


    function handleFiles(e) {
        console.log('files   ', e.target.files[0])
        let file = e.target.files[0];

        // setImageVariante([...imageVariante, e.target.files[0]])



        if (validateImage(file)) {
            let imageZone = document.getElementById('idSectionModalImageVariante');

            let thisImage = {id: '100000'};
            let imageDiv = document.createElement("div");
            imageDiv.setAttribute('key', '100000');
            imageDiv.className = "flex flex-row justify-center items-center mb[20px] w-full h-[100px] relative border border-slate-300 rounded cursor-pointer hover:border-slate-400";
            imageDiv.addEventListener('click', () => handleSelectImage(thisImage));
            imageZone.appendChild(imageDiv);

            let img = document.createElement("img");
            img.className = 'max-w-[(calc(100% / 4) - 12px] max-h-[98px]';
            let reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
            imageDiv.appendChild(img);

            let imageButtonSelect = document.createElement('button');
            imageButtonSelect.id = `checkedButton100000`;
            imageButtonSelect.className = "invisible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded-[50%] bg-white";

            let imgButton = document.createElement("img");
            imgButton.className = 'w-[25px] h-[25px] rounded';
            imgButton.src = '../images/icons/check-green-fill.svg';
            imageButtonSelect.appendChild(imgButton);


            setImageFile([file]);
        }
    }

    const saveImage = () => {
        // save image in temporayStorage
        var tmp_Data = new FormData;
        tmp_Data.append('key', 'tmp_productImage');

        let name = imageFile.name;
        tmp_Data.append('value', imageFile, name);

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


    console.log('imageVariante modal -->  ', imageVariante)
    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-center`}>
            <div className="fixed w-[40%] max-h-[90vh] max-x-[650px] min-x-[350] p-[20px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
            >
                <div className='w-full flex flex-row justify-between mb-[20px]'
                    onClick={handleModalCancel}
                >
                    <h3 className='h-[30px] ml-[10px] font-semibold text-lg'>
                        Sélectionner une immage
                    </h3>
                    <span className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer bg-red-500 rounded-[5px]'>
                        <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[20px] w-[20px]" />
                    </span>
                </div>

                <section
                    id="idSectionModalImageVariante"
                    className="w-full max-h-[70%] grid grid-cols-4 gap-[10px] justify-center items-center overflow-y-auto"
                >
                    {imageVariante.length > 0 &&
                        imageVariante.map((item, index) =>

                            <div
                                key={index}
                                onClick={() => handleSelectImage(item)}
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

                <button
                    className='flex flex-row justify-center items-center min-h-[40px] px-[20px] my-[20px] border border-slate-400'
                    onClick={handleImportImage}
                >
                    {/* cet input est hidden et remplacé par un button pour le design */}
                    <input
                        ref={inputModalImageVariante}
                        type='file'
                        onChange={handleFiles}
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
                            saveImage();
                            handleConfirm();
                        }}>
                        Enregister
                    </button>

                    <button className="flex flrex-row justify-center items-center h-[40px] px-[20px] ml-[15px] border border-slate-400" onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalImageVariante;
