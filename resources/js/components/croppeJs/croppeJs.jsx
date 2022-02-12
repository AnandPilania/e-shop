import React, { useState, useContext } from "react";
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
        margin: '10px 10px 0 0',
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
            fontWeight: 'bold'
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
        margin: '10px 5px 0 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#222222',
        fontSize: '20px',
        borderRadius: '5px',
        border: 'solid 2px rgb(52, 115, 252)',
        transition: 'ease-in-out 0.15s',
        '&:hover': {
            cursor: 'pointer',
            fontWeight: 'bold'
        },
    },
});


const CroppeImage = () => {

    const classes = useStyles();
    const [cropper, setCropper] = useState();
    const { setImage, imagePath, followThisLink } = useContext(AppContext);
    var navigate = useNavigate();

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
        // console.log(cropper.cropBoxData.width)
    }


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
                />
                <div className={classes.bottom_panel}>
                    <button
                        className={classes.btnSubmit}
                        onClick={() => {
                            getCropData();
                        }}>
                        Recadrer
                    </button>
                    <button
                        className={classes.btnSubmit}
                        onClick={() => {
                            navigate(followThisLink);
                        }}>
                        Annuler
                    </button>
                    <div className={classes.divFormat}>
                        <span style={{ marginBottm: "15px", width: "auto", border: "none", fontSize: "22px" }}>Format</span>

                        <div className={classes.divBtnFormat}>
                            <button className={classes.btnRatio} onClick={() => handleRatio(1)}>
                                1:1
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(2 / 3)}>
                                2:3
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(3 / 2)}>
                                3:2
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(4 / 3)}>
                                4:3
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(9 / 16)}>
                                9:16
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(16 / 9)}>
                                16:9
                            </button>
                            <button className={classes.btnRatio} onClick={() => handleRatio(NaN)}>
                                Free
                            </button>
                        </div>
                    </div>
                    <div className={classes.divFormat}>
                        <span style={{ marginBottm: "15px", width: "auto", border: "none", fontSize: "22px" }}>Zoom</span>

                        <div className={classes.divBtnFormat}>
                            <button className={classes.btnRatio} onClick={() => cropper.zoom(0.1)}>
                                <span style={{ fontSize: "40px" }}>+</span>
                            </button>
                            <button className={classes.btnRatio} onClick={() => cropper.zoom(-0.1)}>
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











