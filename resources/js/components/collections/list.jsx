import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
import CategoriesFilter from './categoriesFilter';
import CheckboxListCollection from '../elements/Checkbox_listCollection';
import HeaderListCollections from './headerListCollections';
import ModalConfirm from '../modal/modalConfirm';



const ListCollections = () => {

    const [listCollectionsFiltered, setListCollectionsFiltered] = useState([]);
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

    const { listCollections, setListCollections, listCategories, setListCategories, setCategoriesChecked, searchValue, setSearchValue, is, setIs, messageModal, textButtonConfirm, imageModal, showModalConfirm, handleModalConfirm, handleModalCancel } = useContext(AppContext);

    useEffect(() => {
        if (listCollectionsFiltered.length === 0) {
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
        }
    }, []);

    useEffect(() => {
        // re-chargement des collections quand on delete une collection
        Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
            .then(res => {
                // listCollections -> liste complète des collections pour handleSearch
                setListCollections(res.data[0]);
                setListCollectionsFiltered(res.data[0]);
                setListCategories(res.data[1]);
                setIs({ ...is, collectionDeleted: false });
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, [is.collectionDeleted]);


    useEffect(() => {
        // add category name in the new property categoryName
        listCollections && listCollections.map((item, index) => {
            listCollections[index].categoryName = item.category ? item.category.name : '';
        })

    }, [listCollections]);

    // sort router 
    function sortList(sender) {
        switch (sender) {
            case 'name':
                if (toggleSort.nameSens === true) {
                    sortList_AZ('name')
                    setImgSort((prevState) => ({ ...prevState, imgName: 'za.png', imgCat: 'az.png', imgDate: '1-2.png' }));
                } else {
                    sortList_ZA('name');
                    setImgSort((prevState) => ({ ...prevState, imgName: 'az.png', imgCat: 'az.png', imgDate: '1-2.png' }));
                }
                setToggleSort((prevState) => ({
                    ...prevState,
                    nameSens: !toggleSort.nameSens,
                    categorySens: true,
                    ceated_atSens: true
                }));
                break;
            case 'categoryName':
                if (toggleSort.categorySens === true) {
                    sortList_AZ('categoryName');
                    setImgSort((prevState) => ({ ...prevState, imgCat: 'za.png', imgName: 'az.png', imgDate: '1-2.png' }));
                } else {
                    sortList_ZA('categoryName');
                    setImgSort((prevState) => ({ ...prevState, imgCat: 'az.png', imgName: 'az.png', imgDate: '1-2.png' }));
                }
                setToggleSort((prevState) => ({
                    ...prevState,
                    categorySens: !toggleSort.categorySens,
                    nameSens: true,
                    ceated_atSens: true
                }));
                break;
            case 'created_at':
                if (toggleSort.ceated_atSens === true) {
                    sortList_AZ('created_at');
                    setImgSort((prevState) => ({ ...prevState, imgDate: '2-1.png', imgName: 'az.png', imgCat: 'az.png' }));
                } else {
                    sortList_ZA('created_at');
                    setImgSort((prevState) => ({ ...prevState, imgDate: '1-2.png', imgName: 'az.png', imgCat: 'az.png' }));
                }
                setToggleSort((prevState) => ({
                    ...prevState,
                    ceated_atSens: !toggleSort.ceated_atSens,
                    nameSens: true,
                    categorySens: true,
                }));
                break;
            default:
                if (toggleSort.nameSens === true) {
                    sortList_AZ('name')
                    setImgSort((prevState) => ({ ...prevState, imgName: 'za.png', imgCat: 'az.png', imgDate: '1-2.png' }));
                } else {
                    sortList_ZA('name');
                    setImgSort((prevState) => ({ ...prevState, imgName: 'az.png', imgCat: 'az.png', imgDate: '1-2.png' }));
                }
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

    // renvoi les collection correspondantes à ce qui est tapé dans la barre de recherche dans List collection
    function handleSearch(e) {
        // uncheck all categoies filter when handleSearch
        setCategoriesChecked([]);

        setSearchValue(e.target.value);
        setListCollectionsFiltered(listCollections.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    function categoriesFilter(categories) {
        categories.length > 0 ? setListCollectionsFiltered(listCollections.filter(item => categories.includes(item.categoryName))) : setListCollectionsFiltered(listCollections);
    }



    return (
        <div className='flex-col-s-c'>
            <HeaderListCollections />
            <section className='flex-col justify-s align-s m-b-10 bg-gray-cool min-h100pct w90pct'>
                <ul className='sub-div-vert-align shadow-md'>

                    <li className='grid grid-col-list1 w100pct p15 bg-gray-light radius10-t'>

                        <div className='flex-row h50 p5'><CheckboxListCollection unikId={'all'} /></div>

                        <div className='flex-row h50 p5'>

                            <span className='cursor noshrink b' onClick={() => sortList('name')}>Nom</span>

                            <figure className='h20 w20 m-lr-5 cursor noshrink' onClick={() => sortList('name')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgName} />
                            </figure>

                            <div className="flex-row w80pct noWrap m-l-10">

                                <input className="w80pct h40 p-lr-10 radius5-l brd-gray-light-1 input-foc" type="text" value={searchValue} onChange={handleSearch} />

                                <figure className="w40 h40 flex-row-c-c brd-t-gray-light-1 brd-b-gray-light-1 brd-r-gray-light-1 radius5-r">
                                    <img className='w15 h-auto' src={window.location.origin + '/images/icons/search.png'} />
                                </figure>

                            </div>
                        </div>

                        {/* <div className='w100 m-r-20 h50'>
                        // collection.thumbnail
                    </div> */}
                        <div className="h50 p5 flex-row-c-c wrap b">
                            Produit
                        </div>

                        <div className="h50 p5 flex-row noshrink b">
                            Condition
                        </div>

                        <div className='h50 p5 flex-row'>
                            <span className='cursor noshrink b' onClick={() => sortList('categoryName')}>Catégorie</span>
                            <figure className='h20 w20 m-l-5 cursor noshrink' onClick={() => sortList('categoryName')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgCat} />
                            </figure>
                            {listCategories && <CategoriesFilter arrayList={listCategories} categoriesFilter={categoriesFilter} />}
                        </div>

                        <div className='h50 p5 flex-row'>
                            <span className='noshrink b'>Statut</span>
                        </div>

                        <div className='h50 p5 flex-row'>
                            <span className='cursor noshrink b' onClick={() => sortList('created_at')}>Date Création</span>
                            <figure className='h20 w20 m-l-5 cursor noshrink' onClick={() => sortList('created_at')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgDate} />
                            </figure>
                        </div>
                        <div className='flex-row min-h50 p5 b'>
                            Opérations
                        </div>
                    </li>
                    {!!listCollectionsFiltered && listCollectionsFiltered.map(item =>
                        <RowListCollections key={item.id} collection={item} category={item.category} />
                    )}
                </ul>
            </section>
            {/* modal for confirmation */}
            <ModalConfirm
                show={showModalConfirm} // true/false show modal
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
                textButtonConfirm={textButtonConfirm}
                image={imageModal}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirm>
        </div>
    );
}

export default ListCollections;

