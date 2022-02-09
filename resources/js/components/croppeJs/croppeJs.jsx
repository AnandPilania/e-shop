import React, { useState, useContext } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import AppContext from '../contexts/AppContext';
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
    btnModal: {
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
});


const CroppeImage = () => {
    const { setImage, imagePath, followThisLink } = useContext(AppContext);
    const classes = useStyles();
    var navigate = useNavigate();
    const [cropper, setCropper] = useState();

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            cropper.getCroppedCanvas().toBlob((blob) => {

                saveInTemporaryStorage('tmp_imageCollection', blob);

                setImage(blob);
                navigate(followThisLink);
            });
        }
    };


    return (
        <>
            <section className={classes.main}>
                <Cropper
                    style={{ height: "calc(100vh - 350px)", width: "100%", border: "solid 1px gray" }}
                    zoomTo={0}
                    // initialAspectRatio={1 / 1}
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
                <button
                    className={classes.btnModal}
                    onClick={() => {
                        getCropData();
                    }}>
                    Recadrer
                </button>
            </section>
        </>
    );
};

export default CroppeImage;











