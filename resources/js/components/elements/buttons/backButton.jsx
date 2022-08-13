import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = ({ handleClick, link }) => {
    return (
        <button
            className="w-24 h-10 flex flex-row justify-center items-center  border border-gray-200 rounded-md"
            onClick={handleClick}
        >
            {link ?
                <Link to={link}>
                    <img
                        src='../../images/icons/arrow-left.svg'
                        className="w-4 h-4 inline"
                    />
                    <span
                        className="ml-1"
                    >
                        Retour
                    </span>
                </Link>
                :
                <div>
                    <img
                        src='../../images/icons/arrow-left.svg'
                        className="w-4 h-4 inline"
                    />
                    <span
                        className="ml-1"
                    >
                        Retour
                    </span>
                </div>
            }
        </button>
    );
}

export default BackButton;

// how tu use
// example in deliveryZoneForm

{/* 
    const handleBackButton = () => {
        setActivePanelShipping(1)
    }

    <BackButton
        handleClick={() => handleBackButton()}
        or
        link="/my-link"
    /> 
*/}