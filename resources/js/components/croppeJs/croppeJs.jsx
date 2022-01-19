import React, { useState, useContext } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import { saveInTemporaryStorage } from '../functions/temporaryStorage/saveInTemporaryStorage';

const useStyles = makeStyles({
    modalMain: {
        position: 'fixed',
        background: 'white',
        width: '80%',
        height: 'auto',
        maxHeight: '80vh',
        minWidth: '300px',
        padding: '50px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: '5px',
        zindex: '20',
    },
    btnModal: {
        width: '150px',
        height: '50px',
        padding: '0 25px',
        margin: '20px 0',
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
    close: {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100%',
        height: '60px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: '5px 5px 0 0',
    },
    faTimes: {
        marginRight: '25px',
        fontSize: '26px',
        transition: 'ease-in-out .15s',
        color: '#333333',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.15)',
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

                // need blob inside arrays for avoid error
                let tab = [];
                tab.push(blob);
                saveInTemporaryStorage('tmp_imageCollection', tab);

                setImage(blob);
                navigate(followThisLink);
            });
        }
    };

    return (
        <>
            <section className={classes.modalMain}>
                <Cropper
                    style={{ height: 400, width: "100%", border: "dashed 2px yellow" }}
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











