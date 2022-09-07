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
        var dropable = document.getElementById('category_select');
        var filterCard = document.getElementById('cat-filter-card');

        if (!showCategorySelect) {
            // cache borders sinon y a un bout qui reste visible
            dropable.style.borderLeft = 'none';
            dropable.style.borderRight = 'none';
            dropable.style.borderBottom = 'none';

            filterCard.style.maxHeight = null;
            filterCard.style.paddingBottom = '0';
            filterCard.classList.remove('shadow-lg');

            dropable.style.maxHeight = null;
            dropable.style.paddingTop = 0;

        } else {
            filterCard.style.maxHeight = "352px";
            filterCard.style.width = "352px";
            filterCard.classList.add('shadow-lg');
            // filterCard.style.minWidth = "250px";

            dropable.style.maxHeight = "288px";
            // montre les borders quand ouvert seulement
            dropable.style.borderLeft = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderRight = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderBottom = 'rgb(220, 220, 220) solid 1px';
        }
    }, [showCategorySelect]);

    // // get id for back-end
    // const handleCategory = (cat_id) => {
    //     setCategoryId(cat_id);
    //     setShowCategorySelect(false);
    // };

    // // nom affiché dans le select
    // const handleCategoryName = (cat_name) => {
    //     setCategoryName(cat_name);
    // };

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
        <div className="w-48 p-0 bg-gray-50 relative caret-transparent" id="selectId">
            <button
                className='w-48 h-10 flex flex-row justify-center items-center border border-indigo-700 rounded-md p-1 bg-gray-50 cursor-pointer hover:bg-indigo-50'
                onClick={showHideCategorySelect}
            >
                <span className="w-full text-base font-medium text-gray-700 ">Catégorie  <img
                        src="../images/icons/filter.svg"
                        className="w-5 h-5 ml-2 inline"
                    /></span>
            </button>

            <div id="cat-filter-card" className="w-[352px] flex flex-col justify-start items-start max-h-0 h-auto overflow-hidden absolute top-11 right-[-80px] bg-white shadow-lg rounded-md z-50">
                <div className='w-full h-16 flex justify-start items-center bg-gray-50 pl-5'>
                    <span className="w-full text-base font-medium text-gray-700 ">{arrayList.length} catégorie{arrayList.length > 1 && "s"} 
                    </span>
                </div>

                <div id='category_select' className='w-full'>
                    <ul className='overflow-y-auto overflow-x-hidden list-none rounded-b-md w-full max-h-72 bg-white scroll'
                    >
                        {arrayList && arrayList.map((item, index) => (
                            <li
                                className="w-full h-12 px-2.5 flex justify-start items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                key={index}
                            >
                                <CheckBox unikId={item.name} handleCheckBox={handleCheckBox}
                                />
                                {item.name && <span className='cursor-pointer ml-2.5 truncate h-full grow flex justify-start items-center' value={item.name} onClick={handleCheckBox}>{item.name}</span>}
                            </li>))}
                    </ul>
                </div>

            </div>

        </div>
    );
}

export default CategoriesFilter;
