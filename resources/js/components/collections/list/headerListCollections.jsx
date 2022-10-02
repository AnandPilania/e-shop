import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import ModalListOperations from './modalListOperations';
import CategoriesFilter from './categoriesFilter';


const HeaderListCollections = ({ confirmDeleteCollection, handleSearch, categoriesFilter }) => {

    const [isShowOperationDrop, setIsShowOperationDrop] = useState(false);
    const [sender, setSender] = useState('');

    const { setIs_Edit, initCollectionForm, listCollectionsChecked, showModalListOperations, setShowModalListOperations, searchValue, listCategories } = useContext(AppContext);


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
        <div className='w-full h-max flex flex-col justify-start items-start mt-12 mb-8'
        >
            <div className='w-full flex flex-row justify-between items-start'>
                <h1 className="text-xl font-bold caret-transparent">
                    Collection
                </h1>
                {/* add collection */}
                <button
                    className='w-52 h-10 p-0 flex flex-row justify-center items-center flex-nowrap border border-gray-300 rounded-md bg-indigo-500 text-white'
                    onClick={() => {
                        initCollectionForm();
                        setIs_Edit(false);
                    }}
                >
                    <Link to="/add-collection"
                        className='hover:text-white'>
                        Ajouter une collection
                    </Link>
                </button>
            </div>


            <div
                className='w-full h-auto flex flex-col justify-start items-center 500px:flex-row 500px:justify-between flex-wrap mt-6 500px:mt-10'
            >
                <div
                    className='w-full xl:w-[49%] h-auto flex flex-col justify-start items-center 500px:justify-between  500px:flex-row flex-nowrap'
                >
                    {/* search */}
                    <div
                        className="w-full 500px:max-w-[47%] h-12 500px:h-10 flex flex-nowrap rounded-md group"
                    >
                        <figure className="w-10 h-12 500px:h-10 pl-3 flex flex-row justify-center items-center bg-white caret-transparent border-y border-l border-gray-300 group-hover:border-gray-400 rounded-l-md">
                            <img className='w-5 h-5' src={window.location.origin + '/images/icons/search.png'} />
                        </figure>
                        <input className="w-full h-12 500px:h-10 px-3 outline-0 border-y border-r border-gray-300 group-hover:border-gray-400 rounded-r-md" type="text" value={searchValue} onChange={handleSearch} />
                    </div>

                    {/* filter */}
                    {listCategories &&
                        <CategoriesFilter
                            categoryList={listCategories}
                            categoriesFilter={categoriesFilter}
                        />
                    }
                </div>


                <div
                    className='w-full xl:w-[49%] h-auto flex flex-col justify-start items-center 500px:flex-row 500px:justify-between flex-wrap mt-4 xl:mt-0'
                >
                    {/* operations */}
                    {listCollectionsChecked.length > 0 &&
                        <div
                            id="operationsDropDown_Id"
                            className='w-full 500px:max-w-[47%] h-12 500px:h-10 relative bg-white rounded-md'
                        >
                            <button className='w-full h-full px-3 flex flex-row justify-start items-center border border-gray-300 hover:border-gray-400 rounded-md'
                                onClick={showHideOperationDrop}>
                                <img src='../images/icons/gear.svg' className="w-5 h-5 cursor-pointer mr-3" />
                                Opérations
                                <img src='../images/icons/chevron-expand.svg' className="w-5 h-5 cursor-pointer ml-auto" />
                            </button>
                            {!!isShowOperationDrop &&
                                <ul className='w-full md:min-w-[250px] h-auto flex flex-col justify-start items-start border border-gray-200 rounded-md absolute left-0 top-10 bg-white shadow-md z-50'>
                                    <li className='w-full h-12 flex flex-row justify-start items-center pl-2.5 border-b border-gray-200 cursor-pointer rounded-t-md' onClick={showModalConditions}>
                                        {/* <FontAwesomeIcon icon={faHashtag} className="m-r-5" /> */}
                                        <span>Modifier les conditions</span>
                                    </li>
                                    <li className='w-full h-12 flex flex-row justify-start items-center pl-2.5 border-b border-gray-200 cursor-pointer'>
                                        Supprimer un tag
                                    </li>
                                    <li className='w-full h-12 flex flex-row justify-start items-center pl-2.5 border-b border-gray-200 cursor-pointer rounded-b-md'>
                                        {/* <FontAwesomeIcon icon={faLayerGroup} className="m-r-5" /> */}
                                        Modifier une catégorie
                                    </li>
                                </ul>
                            }
                        </div>
                    }

                    {/* delete */}
                    {listCollectionsChecked.length > 0 &&
                        <span
                            className='w-full 500px:max-w-[47%] h-12 500px:h-10 flex flex-row justify-start items-center px-3 border border-gray-300 hover:border-gray-400 rounded-md bg-white cursor-pointer mt-4 500px:mt-0'
                            onClick={() => {
                                confirmDeleteCollection('from CheckboxListCollection', null);
                            }}
                        >
                            <img src='../images/icons/trash.svg' className="w-5 h-5 mr-3"
                            />
                            <span className="whitespace-nowrap">
                                Supprimer
                            </span>
                        </span>
                    }
                </div>
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
