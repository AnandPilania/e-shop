import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';
import ModalConfirmation from '../modal/modalConfirmation';

const Header = ({ initCreateProduct, isDirtyCreateProduct }) => {

    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const { setImageVariantes, setIsEditProduct, setIs_Edit, hasLeaveThisPage, setHasLeaveThisPage, setIsVisible, handleLocalStorageProduct, isEditProduct, checkIfCreateProductIsDirty } = useContext(AppContext);

    // confirm reinitialisatio form
    const confirmInitCollectionForm = () => {
        setMessage('Supprimer tout le contenu de ce formulaire ?')
        setShow(true);
    }

    const handleConfirmInitForm = () => {
        setShow(false);
        setIs_Edit(false);
        initCreateProduct();
        // nettoie images_products images temporaires
        Axios.post(`/clean_Images_product_table`);
        setIsEditProduct(false);
        setImageVariantes([[]]);
        localStorage.removeItem('productForm');
    }

    const handleCancelShow = () => {
        setMessage('');
        setShow(false);
    }

    const navigateTo = (url) => {
        // déclenche le localStorage du formulaire create product si on quitte le formulaire dirty
        if (hasLeaveThisPage == "createProductForm" && !isEditProduct) {
            if (checkIfCreateProductIsDirty()) {
                handleLocalStorageProduct();
                setHasLeaveThisPage('');
            }
        } else {
            setIsVisible(true);
        }
        navigate(url);
    }
    console.log('isDirtyCreateProduct  ', isDirtyCreateProduct)
    return (
        <div className="w-full h-10 flex justify-start items-center mb-5">
            {/* retour */}
            <button className="w-24 h-10 px-2 flex flex-row justify-center items-center border border-indigo-700 hover:border-2 rounded-md"
                onClick={() => {
                    navigateTo("/listProduct");
                }}>
                <img
                    src='../images/icons/arrow-left.svg'
                    className="w-4 h-4 inline" />
                <span className="ml-1.5 font-medium text-gray-700">
                    Retour
                </span>
            </button>

            {/* réinitialisation */}
            {isDirtyCreateProduct && !isEditProduct && (
                <button
                    id="resetButtonCollection4922"
                    className='w-auto h-10 px-4 flex flex-row justify-center items-center border border-indigo-700 bg-white text-gray-700 font-medium hover:border-2 rounded-md ml-auto'
                    onClick={() => {
                        confirmInitCollectionForm();
                    }}>
                    <span
                        id="img_resetButtonCollection4922"
                        className='w-full h-full flex items-center'>
                        <img
                            src='../images/icons/arrow-counterclockwise.svg'
                            className="w-5 h-5" />
                    </span>
                    <TooltipWithoutIcon id="resetButtonCollection4922" idimg="img_resetButtonCollection4922" widthTip={190} css="mb-8">
                        Réinitialiser le formulaire
                    </TooltipWithoutIcon>
                </button>)}
            <ModalConfirmation
                show={show}
                handleModalConfirm={handleConfirmInitForm}
                handleModalCancel={handleCancelShow}
            >
                <h2 className="childrenModal">{message}</h2>
            </ModalConfirmation>
        </div>
    );
}

export default Header;
