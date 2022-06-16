import React, { useState, useEffect, useRef } from 'react';
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
        imageVariante.forEach(x => document.getElementById('checkedButton' + x.id).className = x.id != item.id && "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded")


        // toggle le checkedButton de l'image cliquée
        let checkedButton = document.getElementById('checkedButton' + item.id);
        if (checkedButton.className.includes("visible")) {
            checkedButton.className = "invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded";
            return;
        } else {
            checkedButton.className = "visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded"
            return;
        }
    }

    console.log('imageVariante modal -->  ', imageVariante)
    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-center `}>
            <div className="fixed w-[40%] max-x-[650px] min-x-[350] p-[20px]
            top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
            >
                <div className='w-full flex flex-row justify-end mb-[20px]'
                    onClick={handleModalCancel}
                >
                    <span className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer bg-red-500 rounded-[5px]'>
                        <img src={window.location.origin + '/images/icons/x-white.svg'} className="h-[20px] w-[20px]" />
                    </span>
                </div>

                <section
                    className="w-full grid grid-cols-4 gap-[10px] justify-center items-center"
                >
                    {imageVariante.length > 0 &&
                        imageVariante.map((item, index) =>

                            <div
                                key={index}
                                onClick={() => handleSelectImage(item)}
                                className="flex flex-row justify-center items-center mb[20px] w-[(calc(100% / 4) - 10px] h-[100px] relative border border-slate-300 rounded cursor-pointer group"
                            >
                                <img className='max-w-[(calc(100% / 4) - 10px] max-h-[100px]'
                                    src={window.location.origin + '/' + item.value}
                                />
                                <button
                                    id={`checkedButton${item.id}`}
                                    className="invisible group-hover:visible absolute top-[5px] left-[5px] w-[25px] h-[25px] rounded"
                                >
                                    <img className='w-[25px] h-[25px] rounded'
                                        src='../images/icons/check-green.svg'
                                    />
                                </button>
                            </div>
                        )}
                </section>

                <input
                    ref={inputModalImageVariante}
                    type='file'
                    className="invisible"
                // onChange={handleinputTextModify}
                />
                <button
                    className='w-[250px] h-[40px]'
                    onClick={handleImportImage}>
                    Importer une image
                </button>

                <div className="w-full flex flex-row ">
                    <button className="w-[150px] h-[40px]" onClick={handleConfirm}>
                        Confirmer
                    </button>

                    <button className="w-[150px] h-[40px] ml-[15px]" onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ModalImageVariante;
