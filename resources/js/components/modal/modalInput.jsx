import React from 'react';

const ModalInput = ({ inputTextModify, setInputTextModify, updateCategory, handleModalCancel, show, children }) => {
    const handleinputTextModify = (e) => {
        setInputTextModify(e.target.value);
    }

    return (
        <div
            className={` ${show ? "block" : "hidden"} fixed top-0 left-0 bg-bg-modal z-40 w-full h-full  flex flex-col justify-start items-center`}>
            <section
                className="fixed w-auto max-h-[90vh] max-w-[650px] min-w-[350] px-8 pt-5 pb-8 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col justify-start items-start rounded-md bg-white z-50">
                <div
                    className="w-full flex flex-row justify-end items-center pr-2">
                    <img src='../images/icons/x-white.svg'
                        className="w-8 h-8 bg-red-600 rounded-md cursor-pointer"
                        onClick={handleModalCancel} />
                </div>

                <div
                    className="w-full h-auto flex flex-row justify-start items-start text-lg font-semibold"
                >
                    {children}
                </div>

                <input
                    type='text'
                    className="text-gray-700 bg-white text-base w-full h-12 border border-gray-300 rounded-md"
                    value={inputTextModify}
                    onChange={handleinputTextModify}
                />
                <div
                    className="w-full flex flex-row justify-start items-center mt-8">
                    <button
                        className="w-32 h-12 flex justify-center items-center border border-gray-300 rounded-md bg-green-700 text-white hover:font-semibold"
                        onClick={updateCategory}
                    >
                        Confirmer
                    </button>
                    <button
                        className="w-32 h-12 ml-5 flex justify-center items-center border border-gray-300 rounded-md bg-red-700 text-white hover:font-semibold"
                        onClick={handleModalCancel}
                    >
                        Annuler
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ModalInput;
