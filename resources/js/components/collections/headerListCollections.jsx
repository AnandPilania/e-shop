import React, { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCaretDown, faGear, faHashtag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ModalListOperations from './modalListOperations';

const HeaderListCollections = ({ confirmDeleteCollection }) => {

    const [isShowOperationDrop, setIsShowOperationDrop] = useState(false);
    const [showModalListOperations, setShowModalListOperations] = useState(false);

    const { setIs_Edit, is, setIs, initCollectionForm, setShowModalConfirm, showModalInput, setShowModalInput, messageModal, setMessageModal, showModalSimpleMessage, setShowModalSimpleMessage, setSender, inputTextModify, setInputTextModify, selectedColor, setSelectedColor, setTextButtonConfirm, setImageModal, deleteThisCategory, setDeleteThisCategory, categoryName, setCategoryName, categoryId, setCategoryId, setTmp_parameter, handleModalCancel, listCollectionsChecked, conditions } = useContext(AppContext);

    

    var tabs = document.getElementsByClassName('Tab');

    Array.prototype.forEach.call(tabs, function (tab) {
        tab.addEventListener('click', setActiveClass);
    });

    function setActiveClass(evt) {
        Array.prototype.forEach.call(tabs, function (tab) {
            tab.classList.remove('active');
        });

        evt.currentTarget.classList.add('active');
    }

    function showHideOperationDrop() {
        setIsShowOperationDrop(!isShowOperationDrop);
    }

    function handleAddTag () {
        setShowModalListOperations(true);
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


                {!listCollectionsChecked.length > 0 &&

                    <div className="w500 h40 flex-row-s-c m-l-auto">

                        <div className='w250 h40 relative bg-white'>
                            <button className='w250 h40 flex-row-s-c brd-gray-light-1 dius-t-round5-b-square'
                            onClick={showHideOperationDrop}>
                                <FontAwesomeIcon icon={faGear} className="m-l-10 m-r-10" />
                                Opérations
                                <FontAwesomeIcon icon={faCaretDown} className="m-l-auto m-r-10" />
                            </button>
                            {!!isShowOperationDrop &&
                                <ul className='w250 h-auto flex-col-s-s brd-gray-light-1 absolute l0 b20 bg-white shadow-s'>
                                    <li className='w100pct h40 flex-row-s-c p-l-10 brd-b-gray-light-1' onClick={handleAddTag}>
                                        {/* <FontAwesomeIcon icon={faHashtag} className="m-r-5" /> */}
                                        <span>Ajouter un tag</span>
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
                setInputTextModify={setInputTextModify}
                inputTextModify={inputTextModify}
                image={'../images/icons/changeCategory.png'}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalListOperations>
        </div>
    );
}

export default HeaderListCollections;
