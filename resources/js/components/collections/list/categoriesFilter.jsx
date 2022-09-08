import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import CheckBox from '../../elements/checkBox';



const CategoriesFilter = ({ arrayList, categoriesFilter }) => {

    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const { categoriesChecked, setCategoriesChecked, searchValue, setSearchValue } = useContext(AppContext);

    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

    useEffect(() => {
        // dropDown optimisation
        var filterCard = document.getElementById('cat-filter-card');

        if (!showCategorySelect) {
            filterCard.style.maxHeight = null;
            filterCard.style.paddingBottom = '0';
            filterCard.classList.remove('shadow');

        } else {
            filterCard.style.maxHeight = "248px";
            filterCard.style.width = "248px";
            filterCard.classList.add('shadow');
        }
    }, [showCategorySelect]);


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
        setShowCategorySelect(false);
    }


    function handleCheckBox(e) {
        // clean input search name collection
        setSearchValue('');

        let cat = '';
        if (e.target.textContent === '') {
            cat = e.target.value;
        } else {
            cat = e.target.textContent;
        }
        if (!categoriesChecked.includes(cat)) {
            setCategoriesChecked([...categoriesChecked, cat]);
        } else {
            setCategoriesChecked([...categoriesChecked.filter(e => e !== cat)]);
        }
    }

    useEffect(() => {
        // on vérifie que searchValue est vide pour raffraichir categoriesFilter sinon cela empèche la collection list name search bar de fonctionner
        searchValue.length === 0 && categoriesFilter(categoriesChecked);
    }, [categoriesChecked]);


    return (
        <div className="w-full 500px:w-[48%] md:w-auto h-12 500px:h-10 p-0 relative caret-transparent mt-2 500px:mt-0" id="selectId">
            <button
                className='w-full h-full flex flex-row justify-start items-center border border-gray-300 rounded-md px-3 bg-white cursor-pointer hover:border-gray-400'
                onClick={showHideCategorySelect}
            >
                    <img
                        src="../images/icons/filter.svg"
                        className="w-5 h-5 mr-3 inline"
                    />
                    Catégorie
                    <img src='../images/icons/chevron-expand.svg' className="w-5 h-5 cursor-pointer ml-auto mr-3" />
            </button>

            <div id="cat-filter-card"
                className="w-full 500px:w-[248px] flex flex-col justify-start items-start max-h-0 h-auto overflow-hidden absolute top-10 left-0 bg-white rounded-l-md z-50"
            >
                    <ul className='overflow-y-auto overflow-x-hidden list-none border border-gray-200 rounded-l-md w-full max-h-72 bg-white shadow'
                    >
                        {arrayList && arrayList.map((item, index) => (
                            <li
                                className="w-full h-12 px-2.5 flex justify-start items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer first:rounded-r-md last:rounded-b-md"
                                key={index}
                            >
                                <CheckBox unikId={item.name} handleCheckBox={handleCheckBox}
                                />
                                {item.name && <span className='cursor-pointer ml-2.5 truncate h-full grow flex justify-start items-center' value={item.name} onClick={handleCheckBox}>{item.name}</span>}
                            </li>))}
                    </ul>
            </div>

        </div>
    );
}

export default CategoriesFilter;
