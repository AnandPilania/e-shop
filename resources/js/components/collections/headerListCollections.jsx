import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import ModalListOperations from './modalListOperations';

const HeaderListCollections = ({ confirmDeleteCollection }) => {

    const [isShowOperationDrop, setIsShowOperationDrop] = useState(false);
    const [sender, setSender] = useState('');

    const { setIs_Edit, is, setIs, initCollectionForm, listCollectionsChecked, showModalListOperations, setShowModalListOperations } = useContext(AppContext);


    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeDropDownOperations);
        return () => {
            document.removeEventListener('click', closeDropDownOperations);
        };
    }, []);
    // ferme le select de category quand on click en dehors du select
    function closeDropDownOperations(evt) { 
        const operationsElement = document.getElementById("operationsDropDown_Id");
        let targetElement = evt.target; // clicked element

        do {
            if (targetElement == operationsElement) {
                // click inside
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside.
        setIsShowOperationDrop(false);
    }



    function showHideOperationDrop() {
        setIsShowOperationDrop(!isShowOperationDrop);
    }

    function showModalConditions() {
        // sender doit être = à conditions pour afficher <ConditionsForm /> dans ModalListOperations
        setSender('conditions');
        setShowModalListOperations(true);
        setIsShowOperationDrop(false);
    }


    return (

        <div className='flex-col w100pct'>

            <div className='w-full h12 border-b border-gray-300 bg-white flex flex-row justify-center items-center'>
                <span>my HeaderListCollections</span>
            </div>



            <div className='w100pct p-lr-5pct flex-row-s-c m-t-50 m-b-30'>
                <h1 className="fs20 b p-l-5">Collection</h1>
                <button type="button" className='w200 h40 flex-row-c-c brd-gray-light-1 radius5 m-l-20 bg-white'
                    onClick={() => {
                        initCollectionForm();
                        setIs_Edit(false);
                        setIs({ ...is, newCollection: true });
                    }}>
                    <Link to="/add-collection">Ajouter une collection</Link>
                </button>


                {listCollectionsChecked.length > 0 &&

                    <div className="w500 h40 flex-row-s-c m-l-auto">
                        <div id="operationsDropDown_Id" className='w250 h40 relative bg-white'>
                            <button className='w250 h40 flex-row-s-c brd-gray-light-1 dius-t-round5-b-square'
                                onClick={showHideOperationDrop}>
                                <img src='../images/icons/gear.svg' className="w20 h20 cursor m-l-10 m-r-10" />
                                Opérations
                                <img src='../images/icons/caret-down.svg' className="w20 h20 cursor m-l-auto m-r-10" />
                            </button>
                            {!!isShowOperationDrop &&
                                <ul className='w250 h-auto flex-col-s-s brd-gray-light-1 absolute l0 b20 bg-white shadow-s'>
                                    <li className='w100pct h40 flex-row-s-c p-l-10 brd-b-gray-light-1 cursor' onClick={showModalConditions}>
                                        {/* <FontAwesomeIcon icon={faHashtag} className="m-r-5" /> */}
                                        <span>Modifier les conditions</span>
                                    </li>
                                    <li className='w100pct h40 flex-row-s-c p-l-10 brd-b-gray-light-1'>
                                        Supprimer un tag
                                    </li>
                                    <li className='w100pct h40 flex-row-s-c p-l-10 brd-b-gray-light-1'>
                                        {/* <FontAwesomeIcon icon={faLayerGroup} className="m-r-5" /> */}
                                        Modifier une catégorie
                                    </li>
                                </ul>
                            }
                        </div>

                        <button type="button" className='w250 h40 flex-row-s-c brd-gray-light-1 radius5 m-l-auto bg-white'
                            onClick={() => {
                                confirmDeleteCollection('from CheckboxListCollection', null);
                            }}>
                            <img src='../images/icons/trash.svg' className="w20 h20 cursor m-l-10" />
                            <span className="m-l-10">
                                Supprimer les collections
                            </span>
                        </button>


                    </div>

                }
            </div>

            <ModalListOperations
                show={showModalListOperations}
                setShowModalListOperations={setShowModalListOperations}
                sender={sender}
            />

        </div>
    );
}

export default HeaderListCollections;
