import React from 'react';
import { Link } from 'react-router-dom';


const HeaderListCollections = () => {

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

        <div className='flex-col w100pct bg-white shadow-sm'>

            <div className="Panel h150">
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
            </div>


            <div className='w100pct h50 brd-b-gray-light-1 flex-row-c-c'>
                <span>my  HeaderListCollections</span>
            </div>
            <div className='w100pct p20 flex-row bg-gray-light'>
                <button type="button" className='btn-bcknd'><Link to="/add-collection">Ajouter une collection</Link></button>
            </div>
        </div>
    );
}

export default HeaderListCollections;
