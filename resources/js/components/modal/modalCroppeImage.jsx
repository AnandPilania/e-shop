import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Demo.css";
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
    zindex: '10',
  },

  modalMain: {
    position: 'fixed',
    background: 'white',
    width: '50%',
    height: '80%',
    minWidth: '300px',
    margin: 'auto',
    padding: '50px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: '5px',
    zindex: '10',
  },

  BlockButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
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

  image: {
    margin: '20px 0',
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

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

const ModalCroppeImage = ({ handleModalApp, handleModalAppCancel, textButtonModalApp, textButtonModalApp2, show, imageToCrop, children }) => {

  const classes = useStyles();

  const showHideClassName = show ? classes.displayBlock : classes.displayNone;
  var navigate = useNavigate();

  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <div>

      <div className={classes.modal + ' ' + showHideClassName}>
        <section className={classes.modalMain}>

          <div className={classes.close}><i className={classes.faTimes + " fas fa-times"} onClick={handleModalAppCancel}></i></div>


          {children}

          <div style={{ width: "100%" }}>
            <input type="file" onChange={onChange} />
            <br />
            <br />
            <Cropper
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
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
          </div>
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

          <div className={classes.BlockButtons}>
            <button
              className={classes.btnModal}
              onClick={() => {
                handleModalApp();
                navigate(followThisLink);
              }}>
              {textButtonModalApp}
            </button>
            <button className={classes.btnModal} onClick={handleModalAppCancel}>
              {textButtonModalApp2}
            </button>
          </div>

        </section>
      </div>
    </div>
  );
};

export default ModalCroppeImage;











