import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Flex_row_s_c from '../elements/container/flex_col_s_c';
import Toggle from '../elements/toggle/toggle';



const OptimisationProduct = () => {

    const [isShowOptimisationProduct, setIsShowOptimisationProduct] = useState(false);
    const [metaTitlebiggerThan50Product, setMetaTitleBiggerThan50Product] = useState(false);
    const [metaDescriptionbiggerThan130Product, setMetaDescriptionbiggerThan130Product] = useState(false);

    const {
        normalizUrl,
        metaTitleProduct, setMetaTitleProduct,
        metaDescriptionProduct, setMetaDescriptionProduct,
        metaUrlProduct, setMetaUrlProduct,
    } = useContext(AppContext);


    useEffect(() => {
        // détermine si on montre le block optimisation
        if (localStorage.getItem('isShowOptimisationProduct')) {
            if (localStorage.getItem('isShowOptimisationProduct') == 'false') {
                setIsShowOptimisationProduct(false);
            } else {
                setIsShowOptimisationProduct(true);
            }
        }

        // affiche en rouge un avertissement sur la longeur du méta title
        if (metaTitleProduct.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }


        // affiche en rouge un avertissement sur la longeur de la méta description
        if (metaDescriptionProduct.length > 130) {
            setMetaDescriptionbiggerThan130Product(true);
        } else {
            setMetaDescriptionbiggerThan130Product(false);
        }




    }, []);

    // show / hide optimisation title & description & url
    const showHideOptimisation = () => {
        localStorage.setItem("isShowOptimisationProduct", !isShowOptimisationProduct);
        setIsShowOptimisationProduct(!isShowOptimisationProduct);
        // clean fields
        setMetaTitleProduct('');
        setMetaDescriptionProduct('');
        setMetaUrlProduct(window.location.origin + '/');
    };

    useEffect(() => {
        // dropDown optimisation
        var dropable = document.getElementById('optimisation_collection');
        if (!isShowOptimisationProduct) {
            dropable.style.maxHeight = null;
            dropable.style.overflow = 'hidden';
        } else {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
            setTimeout(function () {
                dropable.style.overflow = 'unset';
            }, 250);
        }
    }, [isShowOptimisationProduct]);

    // réinitialise les champs de l'optimisation seo
    const initOptimisationForm = () => {
        setMetaTitleProduct('');
        setMetaDescriptionProduct('');
        setMetaUrlProduct(window.location.origin + '/');
    }


    const handleMetaUrl = (e) => {
        // limit la taille de l'url à 2047 caracères
        let urlLength = 2047 - window.location.origin.length;
        let urlName = normalizUrl(e.target.value.substring(window.location.origin.length, 2047));

        setMetaUrlProduct(window.location.origin + '/' + urlName.substring(0, urlLength));
    };

    const handleMetaTitle = (e) => {
        setMetaTitleProduct(e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescriptionProduct('');
        setMetaDescriptionProduct(e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 130) {
            setMetaDescriptionbiggerThan130Product(true);
        } else {
            setMetaDescriptionbiggerThan130Product(false);
        }
    };


    return (
        <Flex_col_s_s>
            <div className='w-full h-auto flex flex-row justify-start items-center'>
                <div className='w-full h-auto flex flex-row flex-wrap justify-start items-center mb-5'>
                    <Toggle
                        isChecked={isShowOptimisationProduct}
                        change={() => showHideOptimisation()}
                    />
                    <label className='m-0 ml-2 p-0'>
                        Optimisation SEO
                    </label>
                </div>

                {metaUrlProduct?.length > (window.location.origin.toString() + '/').length ?
                    (<button
                        style={{ marginBottom: "10px" }}
                        className='w-auto py-2 px-4 flex flex-row justify-center items-center text-white bg-indigo-700 rounded-md text-base cursor-pointer hover:bg-indigo-900'
                        onClick={initOptimisationForm}>
                        Annuler
                    </button>) :
                    metaTitleProduct?.length > 0 ?
                        (<button
                            style={{ marginBottom: "10px" }}
                            className='w-auto py-2 px-4 flex flex-row justify-center items-center text-white bg-indigo-700 rounded-md text-base cursor-pointer hover:bg-indigo-900'
                            onClick={initOptimisationForm}>
                            Annuler
                        </button>) :
                        metaDescriptionProduct?.length > 0 ?
                            (<button
                                style={{ marginBottom: "10px" }}
                                className='w-auto py-2 px-4 flex flex-row justify-center items-center text-white bg-indigo-700 rounded-md text-base cursor-pointer hover:bg-indigo-900'
                                onClick={initOptimisationForm}>
                                Annuler
                            </button>) : ''}
            </div>

            <div
                className="flex flex-col justify-start items-center w-full max-h-0 h-auto overflow-hidden transition ease-out delay-150"
                id="optimisation_collection">
                {/* meta-url */}
                <div className="w-full flex flex-col  justify-start items-start">
                    <div className="w-full my-2.5 flex flex-row justify-start items-center">
                        <label className='mr-2'>
                            Url de la page de cette collection
                        </label>
                        <span className="tooltip_"
                            onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                            <img src='../images/icons/question-circle.svg' className="w-4 h-4 cursor-pointer" />
                            <span className="tooltiptext">Utilisez des mots clés en rapport avec ce produit <br></br><a href="http://127.0.0.1:8000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="linkInTooltip">Mon lien</a></span>
                        </span>
                    </div>
                    <div>
                        <span
                            className="w-full h-12 mb-2.5 px-5 rounded-md border border-gray-300"
                        >
                            {metaUrlProduct}
                        </span>
                        <input type='text'
                            className="w-full h-12 mb-2.5 px-5 rounded-md border border-gray-300"
                            value={metaUrlProduct?.length > 0 ? metaUrlProduct : ''}
                            onChange={handleMetaUrl}
                            placeholder="Url de ce produit"
                            maxLength="2047"
                        />
                    </div>
                </div>

                {/* meta-titre */}
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="w-full my-2.5 flex flex-row">
                        <label className='mr-2'>
                            Méta-titre de la page de ce produit
                        </label>
                        <span className="tooltip_ break-words"
                            onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                            <img src='../images/icons/question-circle.svg' className="w-4 h-4 cursor" />
                            <span className="tooltiptext break-words">
                                Le méta-titre est important pour le référencement d'une page web. Sa longueur idéal se situe entre 30 et 60 caractères mais il peut être plus long pour donner plus d'informations sur le contenu de la page. Toutefois, seuls les 50 premiers caractères à peu près seront affichés dans les résultats des moteurs de recherche. C'est pourquoi il est important de commence par des mots clés, pertinants pour l'internaute, afin d'améliorer le taux de clics vers votre page.
                            </span>
                        </span>
                    </div>
                    <input type='text'
                        className="w-full h-12 mb-2.5 px-5 rounded-md border border-gray-300"
                        value={metaTitleProduct?.length > 0 ? metaTitleProduct : ''}
                        onChange={handleMetaTitle}
                    />
                    <div className='w-full'>
                        {metaTitlebiggerThan50Product &&
                            <span className="text-red-700 break-words">
                                Seuls les 50 à 60 premiers caractères seront affichés par les moteurs de recherche
                            </span>}
                        Nombre de caractères {metaTitleProduct?.length > 0 ? metaTitleProduct.length : 0}
                    </div>
                </div>

                {/* meta-description */}
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="w-full my-2.5 flex flex-row">
                        <label className='mr-2'>
                            Méta-déscription de ce produit
                        </label>
                        <span className="tooltip_ break-words"
                            onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                            <img src='../images/icons/question-circle.svg' className="w-4 h-4 cursor-pointer" />
                            <span className="tooltiptext break-words">Cette déscription sera utilisée pour décrire le contenu de cette page et donner des indications sur son contenu à l'internaute. Les moteurs de recherche affichent à peu près les 130 premiers caractères.</span>
                        </span>
                    </div>
                    <textarea
                        value={metaDescriptionProduct?.length > 0 ? metaDescriptionProduct : ''}
                        onChange={handleMetaDescription}
                        className="w-full h-auto min-h-[100px] border border-gray-300 rounded-md">
                    </textarea>
                    <div className='w-full'>
                        {metaDescriptionbiggerThan130Product &&
                            <span className="text-red-700 break-words">
                                Seuls les 120 à 130 premiers caractères seront affichés par les moteurs de recherche
                            </span>}
                        Nombre de caractères {metaDescriptionProduct?.length > 0 ? metaDescriptionProduct.length : 0}
                    </div>
                </div>
            </div>
        </Flex_col_s_s>
    );
}

export default OptimisationProduct;
