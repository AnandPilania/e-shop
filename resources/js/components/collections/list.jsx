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
    const [imgSort, setImgSort] = useState({
        imgName: 'az.png',
        imgDate: '1-2.png',
        imgCat: 'az.png',
    });
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
        setImgSort((prevState) => ({
            ...prevState,
            imgName: 'za.png',
            imgDate: '2-1.png',
            imgCat: 'za.png',
        }));
    }
    function sortList_ZA(item) {
        setListCollectionsFiltered([].concat(listCollectionsFiltered).sort((b, a) => a[item].localeCompare(b[item])));
        setImgSort((prevState) => ({
            ...prevState,
            imgName: 'az.png',
            imgDate: '1-2.png',
            imgCat: 'az.png',
        }));
    }

    // renvoi les collection correspondantes à ce qui est tapé dans la barre de recherche dans List collection
    function handleSearch(e) {
        setSearchValue(e.target.value);
        setListCollectionsFiltered(listCollections.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    function categoriesFilter(categories) {
        categories.length > 0 ? setListCollectionsFiltered(listCollections.filter(item => categories.includes(item.categoryName))) : setListCollectionsFiltered(listCollections);
    }

    return (
        <section className='div-vert-align listCollections min-h100pct'>
            <div className='sub-div-horiz-align'>
                <div>
                    <button type="button" className='btn'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <ul className='sub-div-vert-align'>
                <li className='sub-div-horiz-align bg-white p15 m10'>
                    <div className='w50 p5 m-r-10'><CheckBox unikId={'all'} /></div>

                    <div className='flex-row h50' style={{width: "calc(25% + 120px", padding: "5px 0 5px 5px"}}>

                        <span className='cursor noshrink' onClick={() => sortList('name')}>Nom</span>

                        <figure className='h25 w25 m-lr-5 cursor noshrink' onClick={() => sortList('name')}>
                            <img src={window.location.origin + '/images/icons/' + imgSort.imgName} />
                        </figure>

                        <div className="flex-row noWrap m-l-auto">

                            <input className="w80pct h50 p-lr-10 radius5-l brd-gray-light-1 input-foc" type="text" value={searchValue} onChange={handleSearch} />

                            <figure className="w20pct h50 p17 flex-row-c brd-t-gray-light-1 brd-b-gray-light-1 brd-r-gray-light-1 radius5-r">
                                <img className='w100pct' src={window.location.origin + '/images/icons/search.png'} />
                            </figure>

                        </div>
                    </div>


                    {/* <div className='w100 m-r-20 h50'>
                        // collection.thumbnail
                    </div> */}
                    <div className="w30pct h50 p15 p-r-50 noshrink">
                        Condition
                    </div>


                    <div className='w20pct h50 p5 flex-row'>
                        <span className='cursor noshrink' onClick={() => sortList('categoryName')}>Catégorie</span>
                        <figure className='h25 w25 m-l-5 cursor noshrink' onClick={() => sortList('categoryName')}>
                            <img src={window.location.origin + '/images/icons/' + imgSort.imgCat} />
                        </figure>
                        {listCategories && <CategoriesFilter arrayList={listCategories} categoriesFilter={categoriesFilter} />}
                    </div>


                    <div className='w20pct h50 p5 flex-row'>
                        <span className='cursor noshrink' onClick={() => sortList('created_at')}>Date Création</span>
                        <figure className='h25 w25 m-l-5 cursor noshrink' onClick={() => sortList('created_at')}>
                            <img src={window.location.origin + '/images/icons/' + imgSort.imgDate} />
                        </figure>
                    </div>
                    <div className='w150 h50 txt-c'>
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

