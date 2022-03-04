import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import CheckBox from '../elements/checkBox';



const CategoriesFilter = ({ arrayList, categoriesFilter }) => {

    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const { categoriesChecked, setCategoriesChecked } = useContext(AppContext);

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
            document.getElementsByClassName('shadow-l')[0].style.boxShadow = "none";

            filterCard.style.maxHeight = null;
            filterCard.style.paddingBottom = '0';

            dropable.style.maxHeight = null;
            dropable.style.paddingTop = 0;

        } else {
            filterCard.style.maxHeight = "300px";
            filterCard.style.width = "300px";
            // filterCard.style.minWidth = "250px";

            dropable.style.maxHeight = "300px";
            // montre les borders quand ouvert seulement
            dropable.style.borderLeft = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderRight = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderBottom = 'rgb(220, 220, 220) solid 1px';
            document.getElementsByClassName('shadow-l')[0].style.boxShadow = "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px";
        }
    }, [showCategorySelect]);

    // // get id for back-end
    // const handleCategory = (cat_id) => {
    //     setCategoryId(cat_id);
    //     setShowCategorySelect(false);
    //     localStorage.setItem("categoryId", cat_id);
    // };

    // // nom affiché dans le select
    // const handleCategoryName = (cat_name) => {
    //     setCategoryName(cat_name);
    //     localStorage.setItem("categoryName", cat_name);
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
        let cat = '';
        if (e.target.textContent === '') {
            cat = e.target.value;
        } else {
            cat = e.target.textContent;
        }
console.log('cat   ', cat);
console.log('categoriesChecked   ', categoriesChecked);
        if (!categoriesChecked.includes(cat)) {
            setCategoriesChecked([...categoriesChecked, cat]);
        } else {
            setCategoriesChecked([...categoriesChecked.filter(e => e !== cat)]);
        }
    }

    useEffect(() => {
        categoriesFilter(categoriesChecked);
    }, [categoriesChecked]);


    return (
        <div className="w50 p0 bg-gray-light relative" id="selectId">
            <button
                className='flex-row brd-none bg-gray-light'
                onClick={showHideCategorySelect}>
                <figure className='h20 w20 m-r-20 cursor'>
                    <img src={window.location.origin + '/images/icons/filter.png'} />
                </figure>
                {/* <i className="fas fa-angle-down"></i> */}
            </button>

            <div id="cat-filter-card" className="w300 flex-col justify-s align-s dropable absolute t30 r0 bg-white shadow-l radius5 z5">
                <div className='w100pct h60 flex-row bg-gray-light p-l-20'>
                    <span className="w100pct">Filtrer par:</span>
                </div>

                <div id='category_select' className='w100pct flex-row'>
                    <ul className='ul-category scrolly scroll w100pct h200 bg-white'
                    >
                        {arrayList && arrayList.map((item, index) => (
                            <li className="w100pct h40 p-lr-10 flex-row"
                                key={index}>
                                <CheckBox unikId={item.name} handleCheckBox={handleCheckBox} 
                                />
                                {item.name && <span className='cursor p-lr-10 txt-limit' value={item.name} onClick={handleCheckBox}>{item.name}</span>}
                            </li>))}
                    </ul>
                </div>

            </div>

        </div>
    );
}

export default CategoriesFilter;
