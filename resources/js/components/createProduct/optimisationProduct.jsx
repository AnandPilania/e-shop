import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Toggle from '../elements/toggle/toggle';
import Label from '../form/label';
import InputText from '../form/inputText';
import Tooltip from '../elements/tooltip';
import TextArea from '../form/textarea';



const OptimisationProduct = () => {

    const [isShowOptimisationProduct, setIsShowOptimisationProduct] = useState(false);
    const [metaTitlebiggerThan50Product, setMetaTitleBiggerThan50Product] = useState(false);
    const [metaDescriptionbiggerThan130Product, setMetaDescriptionbiggerThan130Product] = useState(false);

    const size = useWindowSize();


    const { normalizUrl, productForm, setProductForm } = useContext(AppContext);


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
        if (productForm.metaTitleProduct?.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }

        // affiche en rouge un avertissement sur la longeur de la méta description
        if (productForm.metaDescriptionProduct?.length > 130) {
            setMetaDescriptionbiggerThan130Product(true);
        } else {
            setMetaDescriptionbiggerThan130Product(false);
        }
    }, []);


    // show / hide optimisation title & description & url
    const showHideOptimisationProduct = () => {
        localStorage.setItem("isShowOptimisationProduct", !isShowOptimisationProduct);
        setIsShowOptimisationProduct(!isShowOptimisationProduct);
        // clean fields
        setProductForm({
            ...productForm,
            metaTitleProduct: '',
            metaDescriptionProduct: '',
            metaUrlProduct: ''
        });
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
        setProductForm({ ...productForm, metaUrlProduct: urlName.substring(0, 2047) });
    };

    const handleMetaTitle = (e) => {
        setProductForm({ ...productForm, metaTitleProduct: e.target.value });

        // affiche en rouge un avertissement sur la longeur du méta title
        if (e.target.value.length > 50) {
            setMetaTitleBiggerThan50Product(true);
        } else {
            setMetaTitleBiggerThan50Product(false);
        }
    };

    const handleMetaDescription = (e) => {
        setProductForm({ ...productForm, metaDescriptionProduct: e.target.value });

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
            <Label label="SEO" />
            <div
                className='w-full h-auto flex flex-row justify-start items-center mb-5 mt-2.5'
            >
                <div className='w-full h-auto'>
                    <Toggle
                        id="optimisation_create_product_15822"
                        isChecked={isShowOptimisationProduct}
                        change={() => showHideOptimisationProduct()}
                        label="Optimisation SEO"
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
                        id="urlOptimisationProduct2922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Url de la page de cet article" css="shrink-0" />
                        <Tooltip id="urlOptimisationProduct2922" widthTip={300}>
                            Utilisez des mots clés en rapport avec cet article <br></br>
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
                            value={productForm.metaUrlProduct?.length > 0 ? productForm.metaUrlProduct : ''}
                            handleChange={handleMetaUrl}
                            maxLength="2047"
                            css="rounded-r-md"
                        />
                    </div>
                </div>
                {/* meta-titre */}
                <div className="w-full flex flex-col justify-start items-start mb-5">
                    <div
                        id="metaTitleOptimisationProduct2922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Méta-titre de la page de cet article" css="shrink-0" />
                        <Tooltip id="metaTitleOptimisationProduct2922" widthTip={300}>
                            La longueur idéal pour un méta-titre se situe entre 30 et 60 caractères. <br></br>
                            <a href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <InputText
                        value={productForm.metaTitleProduct?.length > 0 ? productForm.metaTitleProduct : ''}
                        handleChange={handleMetaTitle}
                        css="rounded-md"
                        maxLength="2047"
                    />
                    <div className='w-full'>
                        <span className='text-blue-700 text-xs font-normal mb-2'>
                            Nombre de caractères {productForm.metaTitleProduct?.length > 0 ? productForm.metaTitleProduct?.length : 0}
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
                        id="metaDescrriptionOptimisationProduct2922"
                        className="w-full flex flex-row justify-start items-center"
                    >
                        <Label label="Méta-déscription de cet article" css="shrink-0" />
                        <Tooltip id="metaDescrriptionOptimisationProduct2922" widthTip={300}>
                            La longueur idéal pour une méta-description se situe entre 120 et 130 caractères. <br></br>
                            <a href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                        </Tooltip>
                    </div>
                    <TextArea
                        value={productForm.metaDescriptionProduct?.length > 0 ? productForm.metaDescriptionProduct : ''}
                        handleChange={handleMetaDescription}
                        maxLength="2047"
                    />
                    <div className='w-full h-auto'>
                        <span className='text-blue-700 text-xs font-normal'>
                            Nombre de caractères {productForm.metaDescriptionProduct?.length > 0 ? productForm.metaDescriptionProduct?.length : 0}
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
