import React from 'react';
import parse from 'html-react-parser';


const ModalConfirmation = ({ show, messageModal, children, handleModalConfirm, handleModalCancel }) => {

    return (
        <div className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-[100%]  flex flex-col justify-start items-center`}>
            <section className="fixed w-[40%] max-h-[90vh] max-x-[650px] min-x-[350] px-[20px] pt-[20px] pb-[30px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50"
            >
                <div className="w-full h-12 flex flex-row justify-end items-center pr-2">
                    <img src='../images/icons/x-white.svg' className="w30 h30 bg-red-500 rounded cursor-pointer" onClick={handleModalCancel} />
                </div>


                {/* conversion d'un message en html pour affichage structuré */}
                <div className="textMessage">{messageModal?.length > 0 && parse(messageModal)}</div>

                {/* children affiche les méssages passés en children quand il y en a */}
                {children}

                <div className="w-full flex flex-row justify-start items-center mt-10">
                    <button
                        className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-500 text-white hover:font-semibold"
                        onClick={handleModalConfirm}>
                        Confirmer
                    </button>
                    <button
                        className="w-32 h-12 ml-5 flex justify-center items-center border border-gray-300 rounded-md bg-red-500 text-white hover:font-semibold"
                        onClick={handleModalCancel}>
                        Annuler
                    </button>
                </div>

            </section>
        </div>
    );
};

export default ModalConfirmation;