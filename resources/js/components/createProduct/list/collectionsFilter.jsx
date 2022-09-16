import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import CheckBox from '../../elements/checkBox';



const CollectionsFilter = ({ collectionList, collectionsFilter, collectionsSelected, setCollectionsSelected }) => {

    const [showCollectionSelect, setShowCollectionSelect] = useState(false);
    
    const { setSearchValue } = useContext(AppContext);

    // show hide select menu
    const showHideCollectionSelect = () => {
        setShowCollectionSelect(!showCollectionSelect);
    }

    useEffect(() => {
        // dropDown optimisation
        var filterCard = document.getElementById('collectionFilterCard12922');

        if (!showCollectionSelect) {
            filterCard.style.maxHeight = 0;
            filterCard.style.paddingBottom = '0';
            filterCard.classList.remove('shadow-md');

        } else {
            filterCard.style.maxHeight = "288px";
            filterCard.style.width = "100%";
            filterCard.classList.add('shadow-md');
        }
    }, [showCollectionSelect]);


    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeDropDownCollectionFilter);
        return () => {
            document.removeEventListener('click', closeDropDownCollectionFilter);
        };
    }, []);
    // ferme le select de category quand on click en dehors du select
    function closeDropDownCollectionFilter(evt) {
        const collectionSelectElement = document.getElementById("selectIdcollectionFilter12922");
        let targetElement = evt.target; // clicked element

        do {
            if (targetElement == collectionSelectElement) {
                // click inside
                return;
            }
            // Go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        // click outside.
        setShowCollectionSelect(false);
    }


    function handleCheckBox(e) {
        // clean input search name collection
        setSearchValue('');
        let target = '';
        if (e.target.textContent === '') {
            target = e.target.value;
        } else {
            target = e.target.textContent;
        }

        if (!collectionsSelected.includes(target)) {
            setCollectionsSelected([...collectionsSelected, target]);
            collectionsFilter([...collectionsSelected, target]);
        } else {
            setCollectionsSelected([...collectionsSelected.filter(e => e !== target)]);
            collectionsFilter([...collectionsSelected.filter(e => e !== target)]);
        }
    }



    return (
        <div className="w-full 500px:max-w-[47%] h-12 500px:h-10 relative caret-transparent mt-4 500px:mt-0" id="selectIdcollectionFilter12922">
            <button
                className='w-full h-full flex flex-row justify-start items-center border border-gray-300 rounded-md px-3 bg-white cursor-pointer hover:border-gray-400'
                onClick={showHideCollectionSelect}
            >
                <img
                    src="../images/icons/filter.svg"
                    className="w-5 h-5 mr-3 inline"
                />
                Collections
                <img src='../images/icons/chevron-expand.svg' className="w-5 h-5 cursor-pointer ml-auto" />
            </button>


            <ul
                id="collectionFilterCard12922"
                className={`w-full flex flex-col justify-start items-start max-h-0 h-auto overflow-hidden absolute top-10 left-0 bg-white z-50 overflow-y-auto overflow-x-hidden list-none border border-gray-200 rounded-l-md shadow-md ${showCollectionSelect ? "visible" : "invisible"}`}
            >
                {collectionList.length > 0 && collectionList.map((item, index) => (
                    <li
                        className="w-full min-h-[48px] flex flex-row justify-start items-center pl-2.5 border-b border-gray-200 cursor-pointer first:rounded-r-md last:rounded-b-md truncate"
                        key={index}
                    >
                        <CheckBox
                            unikId={item.name}
                            handleCheckBox={handleCheckBox}
                            checked={collectionsSelected}
                        />
                        <span
                            className='w-full cursor-pointer ml-2.5 h-full truncate'
                            // value={item.name} 
                            onClick={handleCheckBox}>
                            {item.name}
                        </span>
                    </li>))}
            </ul>
        </div>
    );
}

export default CollectionsFilter;
