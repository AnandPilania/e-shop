import React, { useState, useEffect } from 'react';
import CheckBox from '../elements/checkBox';
const CategoriesFilter = ({ arrayList }) => {

    const [showCategorySelect, setShowCategorySelect] = useState(false);
    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

    useEffect(() => {
        // dropDown optimisation
        var dropable = document.getElementById('category_select');
        if (!showCategorySelect) {
            // cache borders sinon y a un bout qui reste visible
            setTimeout(function () {
                dropable.style.borderLeft = 'none';
                dropable.style.borderRight = 'none';
                dropable.style.borderBottom = 'none';
            }, 250);
            dropable.style.maxHeight = null;
            dropable.style.paddingTop = 0;

        } else {
            dropable.style.maxHeight = "250px";
            dropable.style.paddingTop = "5px";
            // montre les borders quand ouvert seulement
            dropable.style.borderLeft = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderRight = 'rgb(220, 220, 220) solid 1px';
            dropable.style.borderBottom = 'rgb(220, 220, 220) solid 1px';
        }
    }, [showCategorySelect]);

    // get id for back-end
    const handleCategory = (cat_id) => {
        setCategoryId(cat_id);
        setShowCategorySelect(false);
        localStorage.setItem("categoryId", cat_id);
    };

    // nom affiché dans le select
    const handleCategoryName = (cat_name) => {
        setCategoryName(cat_name);
        localStorage.setItem("categoryName", cat_name);
    };

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

    return (
        <div className="min-w250 relative">
            <div className="bg-white radius5 absolute tr0" id="selectId">
                <button
                    className='btn-select-category'
                    onClick={showHideCategorySelect}>
                    Filtre
                    <i className="fas fa-angle-down"></i>
                </button>

                <ul className='ul-category dropable'
                    id='category_select'>
                    {arrayList && arrayList.map((item, index) => (
                        <li className="li-category"
                            key={index}>
                            <CheckBox unikId={item.name} />
                            {item.name.length > 25 ? <span>{item.name.substring(0, 25) + '...'}</span> : <span>{item.name}</span>}
                        </li>))}
                </ul>

            </div>

        </div>



    );
}

export default CategoriesFilter;
