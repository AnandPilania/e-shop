import React, { useState, useContext } from "react";
import AppContext from '../contexts/AppContext';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import CreateCollection from './index';


const CroppeImage = ({ setIsDirtyImageCollection, previewImage }) => {

    const [cropper, setCropper] = useState();
    const { setImage, imagePath, collectionForm, setCollectionForm, setWrapIndexcroppe, setIsNot_isEdit } = useContext(AppContext);


    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob((blob) => {
                setImage(blob);
                setIsNot_isEdit(true);
                setIsDirtyImageCollection(true);
                setWrapIndexcroppe(<CreateCollection />)
                previewImage(blob);
            });
        }
    };

    const handleCancel = () => { 
        if (typeof cropper !== "undefined") {
            cropper.reset();
            cropper.getCroppedCanvas().toBlob((blob) => {
                setImage(blob);
                setIsNot_isEdit(true);
                setIsDirtyImageCollection(true);
                setWrapIndexcroppe(<CreateCollection />)
                previewImage(blob);
            });
        }
    }

    const handleRatio = (ratio) => {
        cropper.setAspectRatio(ratio);
        // console.log(cropper.cropBoxData.width)
    }


    return (
        <>
            <section className="bg-white w-[calc(100vw_-_450px)] h-[calc(100vh_-_180px)] miin-h-[500px] min-w-[300px] p-6 my-5 flex flex-col justify-start items-center rounded-md z-20 col-start-2 col-end-3">
                <Cropper
                    style={{ height: "calc(100vh - 350px)", width: "100%", border: "solid 1px gray" }}
                    zoomTo={0}
                    initialAspectRatio={NaN}
                    // aspectRatio={aspRatio}
                    // preview=".img-preview"
                    src={imagePath}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkCrossOrigin={false}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                />
                <div className="w-full my-2.5 flex flex-row justify-start items-end flex-1">
                    <button
                        className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                        onClick={() => {
                            // permet à checkIfIsDirty dans index de bloquer la navigation lorsqu'on croppe sans sauvegarder
                            setCollectionForm({ ...collectionForm, hasBeenChanged: true });
                            getCropData();
                        }}>
                        Recadrer
                    </button>
                    <button
                        className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                        onClick={() => {
                            // empèche le rechargement des datas quand on annule le croppe. est utilisé dans inedx useeffect
                            setIsNot_isEdit(true);
                            handleCancel();
                        }}>
                        Annuler
                    </button>

                    <div className="w-auto ml-5 flex -flex-col justify-end items-center flex-1">
                        <span style={{ marginBottm: "15px", width: "auto", border: "none", fontSize: "22px" }}>Format</span>

                        <div className="w-auto flex flex-row justify-start items-end flex-1">
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold" onClick={() => handleRatio(1)}>
                                1:1
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(2 / 3)}>
                                2:3
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(3 / 2)}>
                                3:2
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(4 / 3)}>
                                4:3
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(9 / 16)}>
                                9:16
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(16 / 9)}>
                                16:9
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => handleRatio(NaN)}>
                                Free
                            </button>
                        </div>
                    </div>
                    <div className="w-auto ml-5 flex -flex-col justify-end items-center flex-1">
                        <span style={{ marginBottm: "15px", width: "auto", border: "none", fontSize: "22px" }}>Zoom</span>

                        <div className="w-auto flex flex-row justify-start items-end flex-1">
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => cropper.zoom(0.1)}>
                                <span style={{ fontSize: "40px" }}>+</span>
                            </button>
                            <button className="w-16 h-12 mt-2.5 mr-1.5 flex flex-row justify-center items-center bg-white text-gray-700 text-lg rounded-md border-2 border-gray-300 transition ease-in-out duration-150 cursor-pointer hover:font-semibold"
                                onClick={() => cropper.zoom(-0.1)}>
                                <span style={{ fontSize: "40px" }}>-</span>
                            </button>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

export default CroppeImage;











