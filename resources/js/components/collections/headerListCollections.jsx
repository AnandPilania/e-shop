import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCaretDown, faGear, faHashtag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ModalListOperations from './modalListOperations';

const HeaderListCollections = ({ confirmDeleteCollection }) => {

    const [isShowOperationDrop, setIsShowOperationDrop] = useState(false);
    const [sender, setSender] = useState('');

    const { setIs_Edit, is, setIs, initCollectionForm, messageModal, inputTextModify, setInputTextModify, listCollectionsChecked, showModalListOperations, setShowModalListOperations } = useContext(AppContext);


    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeDropDownCategory);
        return () => {
            document.removeEventListener('click', closeDropDownCategory);
        };
    }, []);
    // ferme le select de category quand on click en dehors du select
    function closeDropDownCategory(evt) {
        const categorySelectElement = document.getElementById("selectId");
        let targetElement = evt.target; // clicked element

        do {
            if (targetElement == categorySelectElement) {
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
        setSender('conditions');
        setShowModalListOperations(true);
        setIsShowOperationDrop(false);
    }


    return (

        <div className='flex-col w100pct'>

            <div className='w100pct h50 brd-b-gray-light-1 bg-white flex-row-c-c'>
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
                        <div id="selectId" className='w250 h40 relative bg-white'>
                            <button className='w250 h40 flex-row-s-c brd-gray-light-1 dius-t-round5-b-square'
                                onClick={showHideOperationDrop}>
                                <FontAwesomeIcon icon={faGear} className="m-l-10 m-r-10" />
                                Opérations
                                <FontAwesomeIcon icon={faCaretDown} className="m-l-auto m-r-10" />
                            </button>
                            {!!isShowOperationDrop &&
                                <ul className='w250 h-auto flex-col-s-s brd-gray-light-1 absolute l0 b20 bg-white shadow-s'>
                                    <li className='w100pct h40 flex-row-s-c p-l-10 brd-b-gray-light-1 cursor' onClick={showModalConditions}>
                                        {/* <FontAwesomeIcon icon={faHashtag} className="m-r-5" /> */}
                                        <span>Gérer les conditions</span>
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
                            <FontAwesomeIcon icon={faTrash} className="m-l-10" />
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
