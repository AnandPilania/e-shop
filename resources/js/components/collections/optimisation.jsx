import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Toggle from '../elements/toggle/toggle';
import Tooltip from '../elements/tooltip';
import Label from '../form/label';
import InputText from '../form/inputText';
import TextArea from '../form/textarea';



const OptimisationProduct = () => {

    const [isShowOptimisationProduct, setIsShowOptimisationProduct] = useState(false);
    const [metaTitlebiggerThan50Product, setMetaTitleBiggerThan50Product] = useState(false);
    const [metaDescriptionbiggerThan130Product, setMetaDescriptionbiggerThan130Product] = useState(false);

    const size = useWindowSize();

    const {
        normalizUrl,
        metaTitle, setMetaTitle,
        metaDescription, setMetaDescription,
        metaUrl, setMetaUrl,
    } = useContext(AppContext);


    useEffect(() => {
        // détermine si on montre le block optimisation au chergement
        if (localStorage.getItem('isShowOptimisationProduct')) {
            if (localStorage.getItem('isShowOptimisationProduct') == 'false') {
                setIsShowOptimisationProduct(false);
            } else {
                setIsShowOptimisationProduct(true);
            }
        }

        // affiche en rouge un avertissement sur la longeur du méta title
        if (metaTitle.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }

        // affiche en rouge un avertissement sur la longeur de la méta description
        if (metaDescription.length > 130) {
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
        setMetaTitle('');
        setMetaDescription('');
        setMetaUrl('');
    };

    useEffect(() => {
        showOptimisationProduct();
    }, [isShowOptimisationProduct]);

    const showOptimisationProduct = () => {
        // dropDown optimisation
        var dropable = document.getElementById('optimisation_product');
        if (!isShowOptimisationProduct) {
            dropable.style.maxHeight = null;
            dropable.style.overflow = 'hidden';
        } else {
            dropable.style.maxHeight = dropable.scrollHeight + "px";
            setTimeout(function () {
                dropable.style.overflow = 'unset';
            }, 250);
        }
    }


    const handleMetaUrl = (e) => {
        let urlName = normalizUrl(e.target.value);
        setMetaUrl(urlName.substring(0, 2047));
    };

    const handleMetaTitle = (e) => {
        setMetaTitle(e.target.value);

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescription('');
        setMetaDescription(e.target.value);

        // affiche en rouge un avertissement sur la longeur de la méta description
        if (e.target.value.length > 130) {
            setMetaDescriptionbiggerThan130Product(true);
        } else {
            setMetaDescriptionbiggerThan130Product(false);
        }
    };

    // ajuste le heigth du block entier en fonction des messages warning
    // size est un hook qui fourni le width et le height de la fenêtre 
    useEffect(() => {
        showOptimisationProduct();
    }, [metaTitlebiggerThan50Product, metaDescriptionbiggerThan130Product, size]);


    return (
        <Flex_col_s_s>
            <div className='w-full h-auto flex flex-row justify-start items-center'>
                <div className='w-full h-auto flex flex-row flex-nowrap justify-start items-center mb-5'>
                    <Toggle
                        id="toggleOptimisationSeoCollection4922"
                        isChecked={isShowOptimisationProduct}
                        change={() => showHideOptimisation()}
                        label="Optimisation SEO"
                        labelCss="font-semibold"
                    />
                </div>
            </div>

            <div
                className="flex flex-col justify-start items-center w-full max-h-0 overflow-hidden"
                id="optimisation_product"
            >
                {/* meta-url */}
                <div className="w-full flex flex-col justify-start items-start mb-5">
                    <div
                        id="urlOptimisationCollection3922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Url" css="shrink-0" />
                        <Tooltip id="urlOptimisationCollection3922" widthTip={300}>
                            Utilisez des mots clés en rapport avec cette collection.<br></br>
                            <a href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <div
                        className='w-full flex flex-row justify-start items-center'
                    >
                        <span
                            className='w-auto h-10 px-3 flex justify-start items-center border-y border-l border-gray-300 bg-gray-50 text-gray-500 text-sm font-semibold rounded-l-md'
                        >
                            {window.location.origin + '/'}
                        </span>
                        <InputText
                            value={metaUrl?.length > 0 ? metaUrl : ''}
                            handleChange={handleMetaUrl}
                            css="rounded-r-md hover:border-gray-400"
                            maxLength="2047"
                        />
                    </div>
                </div>

                {/* meta-titre */}
                <div className="w-full flex flex-col justify-start items-start mb-3">
                    <div
                        id="titleOptimisationCollection3922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Méta-titre" css="shrink-0" />
                        <Tooltip id="titleOptimisationCollection3922" widthTip={300}>
                            Le méta-titre est important pour le référencement d'une page web. Sa longueur idéal se situe entre 30 et 60 caractères mais il peut être plus long pour donner plus d'informations sur le contenu de la page. <br></br>
                            <a href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <InputText
                        value={metaTitle?.length > 0 ? metaTitle : ''}
                        handleChange={handleMetaTitle}
                        css="rounded-md mb-0 hover:border-gray-400"
                        maxLength="255"
                    />
                    <div className='w-full'>
                        <span className='text-blue-800 text-xs font-normal'>
                            Nombre de caractères {metaTitle?.length > 0 ? metaTitle.length : 0}
                        </span>
                        {metaTitlebiggerThan50Product &&
                            <span className="text-red-700 break-words ml-2 text-sm font-normal">
                                Seuls les 50 à 60 premiers caractères seront affichés par les moteurs de recherche
                            </span>}
                    </div>
                </div>

                {/* meta-description */}
                <div className="w-full flex flex-col justify-start items-start mb-4">
                    <div
                        id="metadescriptiontitleOptimisationCollection3922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Méta-déscription de cette collection" css="shrink-0" />
                        <Tooltip id="metadescriptiontitleOptimisationCollection3922" widthTip={300}>
                            Une méta-déscription est utilisée pour donner des informations plus précies sur le contenu d'une page. Les moteurs de recherche affichent à peu près les 130 premiers caractères. <br></br>
                            <a href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <TextArea
                        value={metaDescription?.length > 0 ? metaDescription : ''}
                        handleChange={handleMetaDescription}
                        maxLength="2047"
                        css="hover:border-gray-400"
                    />
                    <div className='w-full h-auto'>
                        <span className='text-blue-800 text-xs font-normal'>
                            Nombre de caractères {metaDescription?.length > 0 ? metaDescription.length : 0}
                        </span>
                        {metaDescriptionbiggerThan130Product &&
                            <span className="text-red-700 break-words ml-2 text-sm font-normal">
                                Seuls les 120 à 130 premiers caractères seront affichés par les moteurs de recherche
                            </span>}
                    </div>
                </div>
            </div>
        </Flex_col_s_s>
    );
}

export default OptimisationProduct;
