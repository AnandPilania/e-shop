import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
import CategoriesFilter from './categoriesFilter';
import CheckBox from '../elements/checkBox';


const ListCollections = () => {

    const [listCollections, setListCollections] = useState([]);
    const [listCollectionsFiltered, setListCollectionsFiltered] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [toggleSort, setToggleSort] = useState({
        nameSens: true,
        categorySens: true,
        ceated_atSens: true
    });


    useEffect(() => {
        // chargement des collections
        Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
            .then(res => {
                // listCollections -> liste complète des collections pour handleSearch
                setListCollections(res.data[0]);
                setListCollectionsFiltered(res.data[0]);
                setListCategories(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    useEffect(() => {
        // add category name in the new property categoryName
        listCollections && listCollections.map((item, index) => {
            listCollections[index].categoryName = item.category ? item.category.name : '';
        })
    }, [listCollections]);

    // sort routing 
    function sortList(sender) { 
        switch (sender) {
            case 'name':
                toggleSort.nameSens === true ? sortList_AZ('name') : sortList_ZA('name');
                setToggleSort((prevState) => ({
                    ...prevState,
                    nameSens: !toggleSort.nameSens,
                    categorySens: true,
                    ceated_atSens: true
                }));
                break;
            case 'categoryName':
                toggleSort.categorySens === true ? sortList_AZ('categoryName') : sortList_ZA('categoryName');
                setToggleSort((prevState) => ({
                    ...prevState,
                    categorySens: !toggleSort.categorySens,
                    nameSens: true,
                    ceated_atSens: true
                }));
                break;
            case 'created_at':
                toggleSort.ceated_atSens === true ? sortList_AZ('created_at') : sortList_ZA('created_at');
                setToggleSort((prevState) => ({
                    ...prevState,
                    ceated_atSens: !toggleSort.ceated_atSens,
                    nameSens: true,
                    categorySens: true,
                }));
                break;
            default:
                toggleSort.nameSens === true ? sortList_AZ('name') : sortList_ZA('name');
                setToggleSort((prevState) => ({
                    ...prevState,
                    nameSens: !toggleSort.nameSens,
                    categorySens: true,
                    ceated_atSens: true
                }));
        }
    }
    // sort list
    function sortList_AZ(item) { 
        setListCollectionsFiltered([].concat(listCollectionsFiltered).sort((a, b) => a[item].localeCompare(b[item])));
    }
    function sortList_ZA(item) {
        setListCollectionsFiltered([].concat(listCollectionsFiltered).sort((b, a) => a[item].localeCompare(b[item])));
    }
console.log(listCollections)
    // renvoi les collection correspondantes à ce qui est tapé dans la barre de recherche dans List collection
    function handleSearch(e) {
        setSearchValue(e.target.value);
        setListCollectionsFiltered(listCollections.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }


    return (
        <section className='div-vert-align listCollections'>
            <div className='sub-div-horiz-align'>
                <input className="w50pct m-l-10 h50 m-b-10 p-lr-20 radius5 brd-gray-light-1" type="text" value={searchValue} onChange={handleSearch} />

                {listCategories && <CategoriesFilter arrayList={listCategories} />}

                <div>
                    <button type="button" className='btn'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <ul className='sub-div-vert-align'>
                <li className='sub-div-horiz-align bg-white p15 m10'>
                    <div className='w50 p5'><CheckBox unikId={'all'} /></div>
                    <div className='w20pct p5 flex-row'>
                        Nom
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('name')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                    <div className='w75'>
                        {/* collection.thumbnail */}
                    </div>
                    <div className="w30pct p5">
                        Conditions
                    </div>
                    <div className='w20pct p5 flex-row'>
                        Catégories
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('categoryName')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                    <div className='w20pct p5 flex-row'>
                        Date Création
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('created_at')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                    <div className='w150 p5 txt-c'>
                        {/* Supprimer */}
                    </div>
                </li>
                {!!listCollectionsFiltered && listCollectionsFiltered.map(item => 
                    <RowListCollections key={item.id} collection={item} category={item.category} />
                )}
            </ul>
        </section>
    );
}

export default ListCollections;

