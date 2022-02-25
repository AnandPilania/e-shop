import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import CollectionContext from '../contexts/CollectionContext';
import DropZone from '../tools/dropZone';



const Image = () => {


    const {
        image, setImage
    } = useContext(AppContext);

    const {
        imageName, setImageName,
        alt, setAlt,
    } = useContext(CollectionContext);


    const handleAlt = (e) => {
        setAlt(e.target.value);
        localStorage.setItem("altCollection", e.target.value);
    };
    const handleImageName = (e) => {
        setImageName(e.target.value);
        localStorage.setItem("imageName", e.target.value);
    };



    return (
        <div>
            {/* image */}
            <div className="div-vert-align">
                <div className="div-label-inputTxt">
                    <h2>Image</h2>
                    <DropZone multiple={false} />
                </div>

                {/* Référencement */}
                <div className="sub-div-vert-align">
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align-m">
                            <label>Texte alternatif (*optionnel) </label>
                            <i className="fas fa-question-circle tooltip_">
                                <span className="tooltiptext">Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliore l'accessibilité et le référencement de votre boutique.</span>
                            </i>
                        </div>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type="text" name="alt" value={alt} maxLength="255" onChange={handleAlt} />
                    </div>
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align-m">
                            <label>Modifier le nom de l'image</label>
                            <i className="fas fa-question-circle tooltip_">
                                <span className="tooltiptext">Donnez un nom en rapport avec le contenu de l'image. Ceci améliore le référencement de votre boutique dans les recherches par image.</span>
                            </i>
                        </div>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type="text" name="imgColection" value={imageName} maxLength="255" onChange={handleImageName} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Image;

