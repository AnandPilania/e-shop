import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import DropZone from '../tools/dropZone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';


const Image = () => {


    const {
        imageName, setImageName,
        alt, setAlt,
    } = useContext(AppContext);


    const handleAlt = (e) => {
        setAlt(e.target.value);
    };
    const handleImageName = (e) => {
        setImageName(e.target.value);
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
                            <span className="faCircleQuestion tooltip_"
                                onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                                <FontAwesomeIcon icon={faCircleQuestion} className="faCircleQuestionIcon" />
                                <span className="tooltiptext">Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliore l'accessibilité et le référencement de votre boutique.</span>
                            </span>
                        </div>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type="text" name="alt" value={alt?.length > 0 ? alt : ''} maxLength="255" onChange={handleAlt} />
                    </div>
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align-m">
                            <label>Modifier le nom de l'image</label>
                            <span className="faCircleQuestion tooltip_"
                                onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                                <FontAwesomeIcon icon={faCircleQuestion} className="faCircleQuestionIcon" />
                                <span className="tooltiptext">Donnez un nom en rapport avec le contenu de l'image. Ceci améliore le référencement de votre boutique dans les recherches par image.</span>
                            </span>
                        </div>
                        <input className="w100pct h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type="text" name="imgColection" value={imageName?.length > 0 ? imageName : ''} maxLength="255" onChange={handleImageName} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Image;

