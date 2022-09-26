import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const Header = ({ initCreateProduct, isDirtyCreateProduct }) => {

    const { setShowModalConfirm, setMessageModal, setSender, setTextButtonConfirm, setConditions, setTmp_parameter } = useContext(AppContext);

    // confirm reinitialisatio form
    const confirmInitCollectionForm = () => {
        setMessageModal('Supprimer tout le contenu de ce formulaire ?')
        setTextButtonConfirm('Confirmer');
        setSender('initCollectionForm');
        setTmp_parameter('');
        setShowModalConfirm(true);
    }


    return (
        <div className="w-full h-10 flex justify-start items-center mb-5">
            {/* retour */}
            <button className="w-24 h-10 px-2 flex flex-row justify-center items-center border border-indigo-700 hover:border-2 rounded-md"
                onClick={() => {
                    setConditions([{
                        id: 0,
                        parameter: '1',
                        operator: '1',
                        value: ''
                    }]);
                    initCreateProduct();
                }}>
                <Link to="/listProduct">
                    <img
                        src='../images/icons/arrow-left.svg'
                        className="w-4 h-4 inline"
                    />
                    <span className="ml-1.5 font-medium text-gray-700">
                        Retour
                    </span>
                </Link>
            </button>

            {/* réinitialisation */}
            {isDirtyCreateProduct && (
                <button
                    id="resetButtonCollection4922"
                    className='w-auto h-10 px-4 flex flex-row justify-center items-center border border-indigo-700 bg-white text-gray-700 font-medium hover:border-2 rounded-md ml-auto'
                    onClick={() => {
                        initCreateProduct();
                    }}
                >
                    <span
                        id="img_resetButtonCollection4922"
                        className='w-full h-full flex items-center'
                    >
                        <img
                            src='../images/icons/arrow-counterclockwise.svg'
                            className="w-5 h-5"
                        />
                    </span>
                    <TooltipWithoutIcon id="resetButtonCollection4922" idimg="img_resetButtonCollection4922" widthTip={190} css="mb-8">
                        Réinitialiser le formulaire
                    </TooltipWithoutIcon>
                </button>)}
        </div>
    );
}

export default Header;
