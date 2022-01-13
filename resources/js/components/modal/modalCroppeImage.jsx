import React, { useState } from "react";
import Cropper from "react-cropper";
import "./Demo.css";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';



const useStyles = makeStyles({
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: ' 100%',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: '10000000',
  },
  modalMain: {
    position: 'fixed',
    background: 'white',
    width: '50%',
    height: 'auto',
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
    zIndex: '10000000',
  },
  BlockButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: '30px',
    backgroundColor: 'blue',
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
  box: {
    width: '50%',
    maxHeight: '250px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    border: 'dashed 3px blue',
  },
  imgToPreview: {
    width: '100%',
    height: '400px',

    border: "solid red 5px",
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
  displayBlock: {
    display: 'block',
  },
  displayNone: {
    display: 'none',
  }
});




const ModalCroppeImage = ({ handleModalCroppeImageCancel, textButtonModalcrop, textButtonModalcrop2, show, imagePath, children }) => {

  const classes = useStyles();

  const showHideClassName = show ? classes.displayBlock : classes.displayNone;
  var navigate = useNavigate();

  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  // fetch(imagePath)
  //   .then(function (response) {
  //     return response.blob();
  //   })
  //   .then(function (BlobImage) {
  //     const reader = new FileReader();
  //     // reader.onload = () => {
  //     //   setImage(reader.result);
  //     // };
  //     reader.readAsDataURL(BlobImage);
  //   });



  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <>
      <div className={classes.modal + ' ' + showHideClassName}>

        <section className={classes.modalMain}>

          <div className={classes.close}><i className={classes.faTimes + " fas fa-times"} onClick={handleModalCroppeImageCancel}></i></div>

          {children}

          <button onClick={getCropData}>
            Crop Image
          </button>

          <Cropper
            style={{ height: 400, width: "100%", border: "dashed 2px yellow" }}
            zoomTo={1}
            initialAspectRatio={1}
            preview=".img-preview"
            src={imagePath}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={true}
          />
<div>
        <div className="box" style={{ width: "50%", float: "right" }}>
          <h1>Preview</h1>
          <div
            className="img-preview"
            style={{ width: "100%", float: "left", height: "300px" }}
          />
        </div>
        <div
          className="box"
          style={{ width: "50%", float: "right", height: "300px" }}
        >
          <h1>
            <span>Crop</span>
            <button style={{ float: "right" }} onClick={getCropData}>
              Crop Image
            </button>
          </h1>
          <img style={{ width: "100%" }} src={cropData} alt="cropped" />
        </div>
      </div>
      <br style={{ clear: "both" }} />

          {/* <div style={{ display: "flex" }} >
            <div className={classes.box}>
              <h1>Preview</h1>
              <div
                className="img-preview"
                style={{ width: "100%", float: "left", height: "300px" }}>
              </div>
            </div>
            <div
              className={classes.box}>
              <img style={{ display: "block", maxWidth: "100%" }} src={cropData} alt="cropped" />
            </div>
          </div> */}

          <button
            className={classes.btnModal}
            onClick={() => {
              navigate(followThisLink);
            }}>
            Recadrer
          </button>
        </section>
      </div>
    </>
  );
};

export default ModalCroppeImage;











