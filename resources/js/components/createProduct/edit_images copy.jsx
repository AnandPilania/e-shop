
import { React, useState, useCallback } from 'react';
import Dropzone from "./Dropzone";
// import "./App.css";
import { useParams } from "react-router-dom";
import axios from 'axios';

const EditImages = () => {

    const { product_id } = useParams();
    const [images_product, setImages_product] = useState();
    // chargement des images déjà enregistrées
    axios.get(`http://127.0.0.1:8000/getImagesProduct/${product_id}`)
        .then(res => {
            setImages_product(res.data);
        }).catch(function (error) {
            console.log('error:   ' + error);
        });


    // onDrop function  
    const onDrop = useCallback(acceptedFiles => {
        // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
        console.log(acceptedFiles);
    }, []);

    // const getClassName = (className, isActive) => {
    //     if (!isActive) return className;
    //     return `${className} ${className}-active`;
    //   };
      
     
    //   <div className={getClassName("dropzone", isDragActive)} {...getRootProps()}>
    


    return (
        // We pass onDrop function and accept prop to the component. It will be used as initial params for useDropzone hook
        <main className="App">
            <h1 className="text-center">Drag and Drop Example</h1>
            <Dropzone onDrop={onDrop} accept={"image/*"} />
        </main>

    );




}

export default EditImages;













