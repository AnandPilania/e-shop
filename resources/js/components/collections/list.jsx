import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
import CategoriesFilter from './categoriesFilter';
import CheckboxListCollection from '../elements/Checkbox_listCollection';
import HeaderListCollections from './headerListCollections';
import ModalConfirm from '../modal/modalConfirm';



const ListCollections = () => {



    const [imgSort, setImgSort] = useState({
        imgName: 'az.png',
        imgDate: '1-2.png',
        imgCat: 'az.png',
    });
    const [allChecked, setAllChecked] = useState(false);

    const [toggleSort, setToggleSort] = useState({
        nameSens: true,
        categorySens: true,
        created_atSens: true
    });

    const { listCollections, setListCollections, listCollectionsFiltered, setListCollectionsFiltered, listCategories, setListCategories, setCategoriesChecked, searchValue, setSearchValue, is, setIs, messageModal, textButtonConfirm, imageModal, showModalConfirm, handleModalConfirm, handleModalCancel, setShowModalConfirm, setMessageModal, setSender, setTextButtonConfirm, setImageModal, setTmp_parameter, listCollectionsChecked, setListCollectionsChecked } = useContext(AppContext);

    useEffect(() => {
        if (listCollectionsFiltered.length === 0) {
            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
                .then(res => {
                    // listCollections permet de garder la liste complète des collections pour certaines fonctions qui ont besoin que toutes les collections soit parcourues ce qui n'est pas toujours le cas avec listCollectionsFiltered qui est principalement utilisé pour afficher les collections
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
                    created_atSens: true
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
                    created_atSens: true
                }));
                break;
            case 'created_at':
                if (toggleSort.created_atSens === true) {
                    sortList_AZ('created_at');
                    setImgSort((prevState) => ({ ...prevState, imgDate: '2-1.png', imgName: 'az.png', imgCat: 'az.png' }));
                } else {
                    sortList_ZA('created_at');
                    setImgSort((prevState) => ({ ...prevState, imgDate: '1-2.png', imgName: 'az.png', imgCat: 'az.png' }));
                }
                setToggleSort((prevState) => ({
                    ...prevState,
                    created_atSens: !toggleSort.created_atSens,
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
                    created_atSens: true
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

    // gère listCollectionsChecked -> les checkBox de la list collections
    const handleCheckboxListCollection = (id) => { 
        var tmp_arr = [];
        if (id === 'all') {
            if (!allChecked) {
                setAllChecked(true);
                tmp_arr.push('all');
                listCollectionsFiltered.forEach(item => tmp_arr.push(item.id));
                setListCollectionsChecked(tmp_arr);
            } else {
                setAllChecked(false);
                tmp_arr = [];
                setListCollectionsChecked(tmp_arr);
            }
        }
        else {
            // remove "all" from listCollectionsChecked if uncheck any checkBox 
            tmp_arr = listCollectionsChecked;
            let index = tmp_arr.indexOf('all');
            if (index !== -1) {
                tmp_arr.splice(index, 1);
            }
            setListCollectionsChecked(tmp_arr);
            setAllChecked(false);
            // add to listCollectionsChecked id checked
            if (!listCollectionsChecked.includes(id)) {
                setListCollectionsChecked([...listCollectionsChecked, id]);
            } else {
                setListCollectionsChecked([...listCollectionsChecked.filter(item => item !== id)]);
            }
        }
    }



    // confirm delete one collection
    const confirmDeleteCollection = (id, name) => {
        if (id === 'from CheckboxListCollection') {
            var tmp_arr = '';
            listCollectionsChecked.map(checkedId => {
                // if "all" is in listCollectionsChecked then dont take it 
                if (checkedId !== 'all') {
                    let collName = listCollections.filter(item => item.id == checkedId);
                    tmp_arr += (collName[0].name) + ', ';
                }
            })
            let names = tmp_arr.toString();
            names = names.slice(0, (names.length - 2)).replace(/(\,)(?!.*\1)/g, ' et '); // remove last "," and replace last occurence of "," by " et "
            let article = listCollectionsChecked.length > 1 ? 'les collections' : 'la collection';
            setMessageModal('Supprimer ' + article + ' ' + names + ' ?');
            setTmp_parameter(listCollectionsChecked);
        } else {
            setMessageModal('Supprimer la collection ' + name + ' ?');
            setTmp_parameter(id);
        }
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('deleteCollection');
        setShowModalConfirm(true);
    }

    return (
        <div className='flex-col-s-c'>
            <HeaderListCollections confirmDeleteCollection={confirmDeleteCollection} />
            <section className='flex-col justify-s align-s m-b-10 bg-gray-cool min-h100pct w90pct'>
                <ul className='sub-div-vert-align shadow-md'>

                    <li className='grid grid-col-list1 w100pct p15 bg-gray-light radius10-t'>

                        <div className='flex-row h50 p5'><CheckboxListCollection unikId={'all'} handleCheckboxListCollection={handleCheckboxListCollection} listCollectionsChecked={listCollectionsChecked} /></div>

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
                        <RowListCollections
                            key={item.id}
                            collectionFiltered={item}
                            category={item.category}
                            handleCheckboxListCollection={handleCheckboxListCollection}
                            listCollectionsChecked={listCollectionsChecked} confirmDeleteCollection={confirmDeleteCollection} />
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

