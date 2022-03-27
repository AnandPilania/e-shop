import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';


const HeaderListCollections = ({ confirmDeleteCollection, listCollectionsChecked }) => {

    const { setIs_Edit, is, setIs, initCollectionForm } = useContext(AppContext);


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

    return (

        <div className='flex-col w100pct'>

            {/* !!! tabs slide !!! */}
            {/* <div className="Panel h150">
                <nav>
                    <ul className="Tabs">
                        <li className="Tabs__tab active Tab"><a href="#">Tab item</a></li>
                        <li className="Tabs__tab Tab"><a href="#">Mega</a></li>
                        <li className="Tabs__tab Tab"><a href="#">Pane name</a></li>
                        <li className="Tabs__presentation-slider" role="presentation"></li>
                    </ul>
                </nav>
                <div className="Panel__body">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis sint, facere aut, mollitia nihil tenetur sed vitae alias dolorum delectus.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, earum.</p>
                </div>
            </div> */}


            <div className='w100pct h50 brd-b-gray-light-1 bg-white flex-row-c-c'>
                <span>my HeaderListCollections</span>
            </div>
            <div className='w100pct p-lr-5pct h100 flex-row-s-c'>
                <h1 className="fs20 b p-l-5">Collection</h1>
                <button type="button" className='w200 h40 flex-row-c-c brd-gray-light-1 radius5 m-l-20'
                    onClick={() => {
                        initCollectionForm();
                        setIs_Edit(false);
                        setIs({ ...is, newCollection: true });
                    }}>
                    <Link to="/add-collection">Ajouter une collection</Link>
                </button>

                {!!listCollectionsChecked.length > 0 && <button type="button" className='btn-submit m-l-auto'
                    onClick={() => {
                        confirmDeleteCollection('from CheckboxListCollection', null);
                    }}>
                    Supprimer les collections
                </button>}
            </div>
        </div>
    );
}

export default HeaderListCollections;
