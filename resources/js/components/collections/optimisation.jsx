import React, { useEffect, useState, useContext } from 'react';
import CollectionContext from '../contexts/CollectionContext';


const Optimisation = () => {

    const [isShowOptimisation, setIsShowOptimisation] = useState(false);
    const [metaTitlebiggerThan50, setMetaTitleBiggerThan50] = useState(false);
    const [metaDescriptionbiggerThan130, setMetaDescriptionbiggerThan130] = useState(false);

    const {
        normalizUrl,
        metaTitle, setMetaTitle,
        metaDescription, setMetaDescription,
        metaUrl, setMetaUrl,
    } = useContext(CollectionContext);


    useEffect(() => {
        // détermine si on montre le block optimisation
        if (localStorage.getItem('isShowOptimisation')) {
            if (localStorage.getItem('isShowOptimisation') == 'false') {
                setIsShowOptimisation(false);
            } else {
                setIsShowOptimisation(true);
            }
        }

        // affiche en rouge un avertissement sur la longeur du méta title
        if (localStorage.getItem('metaDescription') !== null && localStorage.getItem('metaDescription') !== undefined) {
            if (localStorage.getItem('metaTitle').length > 50) {
                setMetaTitleBiggerThan50(true);
            } else {
                setMetaTitleBiggerThan50(false);
            }
        }

        // affiche en rouge un avertissement sur la longeur de la méta description
        if (localStorage.getItem('metaDescription') !== null && localStorage.getItem('metaDescription') !== undefined) {
            if (localStorage.getItem('metaDescription').length > 130) {
                setMetaDescriptionbiggerThan130(true);
            } else {
                setMetaDescriptionbiggerThan130(false);
            }
        }



    }, []);

    // show / hide optimisation title & description & url
    const showHideOptimisation = () => {
        localStorage.setItem("isShowOptimisation", !isShowOptimisation);
        setIsShowOptimisation(!isShowOptimisation);
        // clean fields
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');
    };

    useEffect(() => {
        // dropDown optimisation
        var dropable = document.getElementById('optimisation_collection');
        if (!isShowOptimisation) {
            dropable.style.maxHeight = null;
            dropable.style.overflow = 'hidden';
        } else {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
            setTimeout(function () {
                dropable.style.overflow = 'unset';
            }, 250);
        }
    }, [isShowOptimisation]);

    // réinitialise les champs de l'optimisation seo
    const initOptimisationForm = () => {
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl(window.location.origin + '/');

        localStorage.removeItem('metaTitle');
        localStorage.removeItem('metaDescription');
        localStorage.removeItem('metaUrl');
    }


    const handleMetaUrl = (e) => {
        // limit la taille de l'url à 2047 caracères
        let urlLength = 2047 - window.location.origin.length;
        let urlName = normalizUrl(e.target.value.substring(window.location.origin.length, 2047));

        setMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
        localStorage.setItem("metaUrl", window.location.origin + '/' + urlName.substring(0, urlLength));
    };

    const handleMetaTitle = (e) => {
        setMetaTitle(e.target.value);
        localStorage.setItem("metaTitle", e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 50) {
            setMetaTitleBiggerThan50(true);
        } else {
            setMetaTitleBiggerThan50(false);
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescription('');
        setMetaDescription(e.target.value);
        localStorage.setItem("metaDescription", e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 130) {
            setMetaDescriptionbiggerThan130(true);
        } else {
            setMetaDescriptionbiggerThan130(false);
        }
    };


    return (
        <div>
            <div className="div-vert-align">
                <div className="sub-div-horiz-align">
                    <div className="sub-div-horiz-align">
                        <h2>Optimisation SEO</h2>
                        <input type='checkbox'
                            className="cm-toggle"
                            checked={isShowOptimisation}
                            onChange={showHideOptimisation} />
                    </div>
                    {metaUrl.length > (window.location.origin.toString() + '/').length ?
                        (<button
                            style={{ marginBottom: "10px" }}
                            className='btn-bcknd'
                            onClick={initOptimisationForm}>
                            Annuler L'optimisation
                        </button>) :
                        metaTitle.length > 0 ?
                            (<button
                                style={{ marginBottom: "10px" }}
                                className='btn-bcknd'
                                onClick={initOptimisationForm}>
                                Annuler
                            </button>) :
                            metaDescription.length > 0 ?
                                (<button
                                    style={{ marginBottom: "10px" }}
                                    className='btn-bcknd'
                                    onClick={initOptimisationForm}>
                                    Annuler
                                </button>) : ''}
                </div>
                <div className="sub-div-vert-align dropable"
                    id="optimisation_collection">
                    {/* meta-url */}
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align">
                            <label>
                                Url de la page de cette collection
                            </label>
                            <i className="fas fa-question-circle tooltip_">
                                <span className="tooltiptext">Utilisez des mots clés en rapport avec le contenu de cette collection <br></br><a href="http://127.0.0.1:8000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="linkInTooltip">Mon lien</a></span>
                            </i>
                        </div>
                        <input type='text'
                            value={metaUrl}
                            onChange={handleMetaUrl}
                            placeholder="Url de cette collection"
                            maxLength="2047"
                        />
                    </div>

                    {/* meta-titre */}
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align">
                            <label>
                                Méta-titre de la page de cette collection
                            </label>
                            <i className="fas fa-question-circle tooltip_">
                                <span className="tooltiptext">Le méta-titre est important pour le référencement d'une page web. Sa longueur idéal se situe entre 30 et 60 caractères mais il peut être plus long pour donner plus d'informations sur le contenu de la page. Toutefois, seuls les 50 premiers caractères à peu près seront affichés dans les résultats des moteurs de recherche. C'est pourquoi il est important de commence par des mots clés pertinants pour l'internaute afin d'améliorer le taux de clics vers votre page.</span>
                            </i>
                        </div>
                        <input type='text'
                            value={metaTitle}
                            onChange={handleMetaTitle}
                        />
                        <div className='sub-div-vert-align'>
                            {metaTitlebiggerThan50 &&
                                <span className="inRed"> Seuls les 50 à 60 premiers caractères seront affichés par les moteurs de recherche
                                </span>}
                            Nombre de caractères: {metaTitle.length}
                        </div>
                    </div>

                    {/* meta-description */}
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align">
                            <label>Méta-déscription de cette collection:</label>
                            <i className="fas fa-question-circle tooltip_">
                                <span className="tooltiptext">Cette déscription sera utilisée pour décrire le contenu de cette page et donner des indications sur son contenu à l'internaute. Les moteurs de recherche affichent à peu près les 130 premiers caractères.</span>
                            </i>
                        </div>
                        <textarea
                            // style={{ opacity: "0.6" }}
                            value={metaDescription}
                            onChange={handleMetaDescription}>
                        </textarea>
                        <div className='sub-div-vert-align'>
                            {metaDescriptionbiggerThan130 &&
                                <span className="inRed"> Seuls les 120 à 130 premiers caractères seront affichés par les moteurs de recherche
                                </span>}
                            Nombre de caractères: {metaDescription.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Optimisation;
