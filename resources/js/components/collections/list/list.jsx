import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
import CheckboxListCollection from './checkBox_listCollection';
import HeaderListCollections from './headerListCollections';
import ModalConfirm from '../../modal/modalConfirm';



const ListCollections = () => {



    const [imgSort, setImgSort] = useState({
        imgName: 'az.svg',
        imgDate: '1-2.svg',
        imgCat: 'az.svg',
    });
    const [allChecked, setAllChecked] = useState(false);

    const [toggleSort, setToggleSort] = useState({
        nameSens: true,
        categorySens: true,
        created_atSens: true
    });

    const { listCollections, setListCollections, listCollectionsFiltered, setListCollectionsFiltered, setListCategories, setCategoriesChecked, setSearchValue, is, setIs, messageModal, textButtonConfirm, imageModal, showModalConfirm, handleModalConfirm, handleModalCancel, setShowModalConfirm, setMessageModal, setSender, setTextButtonConfirm, setImageModal, setTmp_parameter, screenSize, listCollectionsChecked, setListCollectionsChecked } = useContext(AppContext);

    useEffect(() => {
        if (listCollectionsFiltered.length === 0) {
            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
                .then(res => {
                    // listCollections permet de garder la liste complète des collections pour certaines fonctions qui ont besoin que toutes les collections soit parcourues ce qui n'est pas toujours le cas avec listCollectionsFiltered qui est principalement utilisé pour afficher les collections avec ou sans filtre
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
        });
    }, [listCollections]);

    // sort router 
    function sortList(sender) {
        switch (sender) {
            case 'name':
                if (toggleSort.nameSens === true) {
                    sortList_AZ('name')
                    setImgSort((prevState) => ({ ...prevState, imgName: 'za.svg', imgCat: 'az.svg', imgDate: '1-2.svg' }));
                } else {
                    sortList_ZA('name');
                    setImgSort((prevState) => ({ ...prevState, imgName: 'az.svg', imgCat: 'az.svg', imgDate: '1-2.svg' }));
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
                    setImgSort((prevState) => ({ ...prevState, imgCat: 'za.svg', imgName: 'az.svg', imgDate: '1-2.svg' }));
                } else {
                    sortList_ZA('categoryName');
                    setImgSort((prevState) => ({ ...prevState, imgCat: 'az.svg', imgName: 'az.svg', imgDate: '1-2.svg' }));
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
                    setImgSort((prevState) => ({ ...prevState, imgDate: '2-1.svg', imgName: 'az.svg', imgCat: 'az.svg' }));
                } else {
                    sortList_ZA('created_at');
                    setImgSort((prevState) => ({ ...prevState, imgDate: '1-2.svg', imgName: 'az.svg', imgCat: 'az.svg' }));
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
                    setImgSort((prevState) => ({ ...prevState, imgName: 'za.svg', imgCat: 'az.svg', imgDate: '1-2.svg' }));
                } else {
                    sortList_ZA('name');
                    setImgSort((prevState) => ({ ...prevState, imgName: 'az.svg', imgCat: 'az.svg', imgDate: '1-2.svg' }));
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

    // gère listCollectionsChecked -> quand on check les checkBox de la list collections
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
            // add or remove checked id from listCollectionsChecked
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

        <div className='w-full mx-auto md:w-[98%] lg:w-[96%] 2xl:w-11/12 3xl:w-10/12 min-h-[100vh] flex flex-col justify-start items-center'>

            <HeaderListCollections
                confirmDeleteCollection={confirmDeleteCollection}
                handleSearch={handleSearch}
                categoriesFilter={categoriesFilter}
            />

            <ul className='w-full flex flex-col justify-start items-start mb-2.5 bg-gray-50 min-h-full w-[90% shadow-sm rounded-md caret-transparent'>

                <li className='w-full p-4 bg-gray-50 rounded-t-md grid  grid-cols-[48px_70px_120px_65px_1fr_80px] sm:grid-cols-[48px_70px_140px_65px_22%_1fr_80px] md:grid-cols-[48px_70px_1fr_65px_17%_1fr_1fr_80px] xl:grid-cols-[48px_70px_1fr_65px_17%_1fr_1fr_1fr_80px] gap-3'>

                    <div className='flex justify-start items-center h-12 p-1.5 min-w-[48px]'>
                        <CheckboxListCollection unikId={'all'} handleCheckboxListCollection={handleCheckboxListCollection} listCollectionsChecked={listCollectionsChecked} />
                    </div>
                    <span></span>

                    <div className='h-12 w-auto sm:min-w-[140px] md:w-auto flex flex-row justify-start items-center brd-blue-1'>
                        <span
                            className='cursor-pointer font-semibold'
                            onClick={() => sortList('name')}>
                            Nom
                        </span>
                        <figure className='h-6 w-6 cursor-pointer' onClick={() => sortList('name')}>
                            <img src={window.location.origin + '/images/icons/' + imgSort.imgName} className="h-6 w-6" />
                        </figure>
                    </div>

                    {screenSize > 559 &&
                        <div className="w-full h-12 flex flex-row justify-center items-center flex-wrap font-semibold brd-red-1">
                            Stock
                        </div>}

                    {screenSize > 639 &&
                        <div className="w-full h-12 flex flex-row justify-start items-center font-semibold">
                            Conditions
                        </div>}

                    {/* categories */}
                    {screenSize > 1279
                        && <div className='w-full h12 flex flex-row justify-start items-center'>
                            <span
                                className='cursor-pointer shrink-0 font-semibold'
                                onClick={() => sortList('categoryName')}>Catégories
                            </span>
                            <figure
                                className='h-6 w-6 ml-1.5 cursor-pointer shrink-0'
                                onClick={() => sortList('categoryName')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgCat} className="h-6 w-6" />
                            </figure>
                        </div>}

                    {/* status */}
                    <div className='h-12 flex-row'>
                        <span className='shrink-0 font-semibold'>Statut</span>
                    </div>

                    {/* created at */}
                    {screenSize > 767 &&
                        <div className='w-full h-12 flex flex-row justify-start items-center pl-2 xl:pl-0'>
                            <span className='cursor-pointer shrink-0 font-semibold' onClick={() => sortList('created_at')}>Crée le</span>
                            <figure className='h-6 w-6 ml-1.5 cursor-pointer shrink-0' onClick={() => sortList('created_at')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgDate} className="h-6 w-6" />
                            </figure>
                        </div>}

                    {/* empty */}
                    <div className='w-full'></div>
                </li>

                {/* RowListCollections */}
                {!!listCollectionsFiltered && listCollectionsFiltered.map(item =>
                    <RowListCollections
                        key={item.id}
                        collectionFiltered={item}
                        category={item.category}
                        handleCheckboxListCollection={handleCheckboxListCollection}
                        listCollectionsChecked={listCollectionsChecked} confirmDeleteCollection={confirmDeleteCollection} />
                )}
            </ul>

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

