import React, { useState, useContext, useEffect } from "react";
import AppContext from '../contexts/AppContext';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';

const useStyles = makeStyles({
    main: {
        background: 'white',
        width: 'calc(100vw - 450px)',
        height: 'calc(100vh - 180px)',
        minHeight: '500px',
        minWidth: '300px',
        padding: '25px 25px 10px 25px',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: '5px',
        zindex: '20',
        gridColumnStart: 2,
        gridColumnEnd: 3,
    },
    bottom_panel: {
        width: '100%',
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flex: 1,
    },
    btnSubmit: {
        width: '150px',
        height: '50px',
        padding: '0 25px',
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(52, 115, 252)',
        color: 'white',
        fontSize: '20px',
        borderRadius: '5px',
        border: 'solid 1px rgb(220, 220, 220)',
        transition: 'ease-in-out 0.15s',
        '&:hover': {
            cursor: 'pointer',
            color: '#eeeeee',
        },
    },
    divFormat: {
        width: 'auto',
        marginLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
    },
    divBtnFormat: {
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flex: 1,
    },
    btnRatio: {
        width: '70px',
        height: '50px',
        margin: '10px 5px 10px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#222222',
        fontSize: '20px',
        borderRadius: '5px',
        border: 'solid 1px gray',
        transition: 'ease-in-out 0.15s',
        '&:hover': {
            cursor: 'pointer',
        },
    },
});


const CroppeImage = () => {

    const classes = useStyles();
    const [cropper, setCropper] = useState();
    const [imageData, setImageData] = useState();
    const { setImage, imagePath, followThisLink } = useContext(AppContext);
    var navigate = useNavigate();

    // useEffect(() => {
    //     setImageData(cropper);
    // }, [cropper]);

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob((blob) => {

                let imageName = imagePath.replace('/temporaryStorage/', '');

                saveInTemporaryStorage('tmp_imageCollection', blob, imageName);

                setImage(blob);
                navigate(followThisLink);
            });
        }
    };

    const handleRatio = (ratio) => {
        cropper.setAspectRatio(ratio);
        setImageData(cropper.cropBoxData.width)
        console.log('imageData.width  ', cropper.imageData.width)
    }

    const myEvent = () => {
        alert('event')
    }
   
// console.log('imageData  ', imageData)
    return (
        <>
            <section className={classes.main}>
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
                    checkOrientation={false}
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    guides={true}
                    onCropstart={myEvent}
                />
                <div className={classes.bottom_panel}>
                    <button
                        className={classes.btnSubmit}
                        onClick={() => {
                            getCropData();
                        }}>
                        Recadrer
                    </button>
                    <div className={classes.divFormat}>
                    <span style={{color: "black"}} className={classes.btnRatio}>{cropper && imageData}</span>
                        <span style={{ marginBottm: "15px", width: "100%", border: "none" }} className={classes.btnRatio}>Format -- what is the good ratio for image web ??</span>
                        <div className={classes.divBtnFormat}>
                            <button className={classes.btnRatio} onClick={() => handleRatio(1)}>
                                1:1
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(2 / 3)}>
                                2:3
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(4 / 3)}>
                                4:3
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(16 / 9)}>
                                16:9
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(NaN)}>
                                Free
                            </button>
                        </div>
                    </div>

                </div>

            </section>
        </>
    );
};

export default CroppeImage;











