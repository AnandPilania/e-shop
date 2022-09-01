import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import DropZone from '../tools/dropZone';
import Label from '../form/label';
import Tooltip from '../elements/tooltip';
import InputText from '../form/inputText';

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
            <div className="flex flex-col justify-start items-start h-auto w-full bg-white mb-2.5 p-5 shadow-sm">
                <div className="w-full flex flex-col justify-start items-start">
                <Label label="Image" />
                    <DropZone multiple={false} />
                </div>

                {/* Référencement */}
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="w-full flex flex-col justify-start items-start">
                        <div
                            className="w-full flex flex-row justify-start items-center my-2.5 group relative"
                        >
                            <Label label="Texte alternatif (optionnel)" />
                                <Tooltip>
                                    Ajouter une brève description de l'image de votre collection. Ceci optimise l'accessibilité et le référencement de votre page de collection. <br></br>
                                    <a href="http://127.0.0.1:8000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm underline underline-offset-1 text-blue-500 font-semibold">Mon lien</a>
                                </Tooltip>
                            </div>
                  
                        <InputText
                            value={alt?.length > 0 ? alt : ''}
                            handleChange={handleAlt}
                            css="rounded-md"
                            maxLength="255"
                        />
                    </div>
                    <div className="w-full flex flex-col justify-start items-start">
                        <div className="w-full flex flex-row justify-start items-center my-2.5 group relative">
                            <Label label="Modifier le nom de l'image" />
                            <Tooltip>
                                Donnez un nom en rapport avec le contenu de l'image. Ceci améliore le référencement de votre boutique dans les recherches par image. <br></br>
                                <a href="http://127.0.0.1:8000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline underline-offset-1 text-blue-500 font-semibold">Mon lien</a>
                            </Tooltip>
                        </div>
                        <InputText
                            value={imageName?.length > 0 ? imageName : ''}
                            handleChange={handleImageName}
                            css="rounded-md"
                            maxLength="255"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Image;

