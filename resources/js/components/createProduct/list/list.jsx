import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import InputText from '../../InputText/Input_text';

import RowListProducts from './rowListProducts';
import CheckboxListProducts from './checkboxListProducts';
import HeaderListProducts from './headerListProducts';
import ModalConfirmation from '../../modal/modalConfirmation';

const List = () => {

    const [isChecked, setIsChecked] = useState(false);

    const [imgSort, setImgSort] = useState({
        imgName: 'az.svg',
        imgDate: '1-2.svg',
        imgCat: 'az.svg',
    });
    const [allChecked, setAllChecked] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [gridCols, setGridCols] = useState('');
    const [productToDelete, setProductToDelete] = useState('');
    const [toggleSort, setToggleSort] = useState({
        nameSens: true,
        categorySens: true,
        created_atSens: true
    });

    const { setCategoriesChecked, setSearchValue, is, setIs, messageModal, textButtonConfirm, imageModal, setMessageModal, setSender, setTextButtonConfirm, setImageModal, screenSize, products, setProducts, listProductsFiltered, setListProductsFiltered, listProductsChecked, setListProductsChecked, listCollections, setListCollections } = useContext(AppContext);


    useEffect(() => {
        Axios.get(`http://127.0.0.1:8000/getProducts`)
            .then(res => {
                // procuts permet de garder la liste complète des products pour certaines fonctions qui ont besoin que toutes les products soit parcourues ce qui n'est pas toujours le cas avec listProductsFiltered qui est principalement utilisé pour afficher les products avec ou sans filtre
                setProducts(res.data[0]);
                setListProductsFiltered(res.data[0]);
                setListCollections(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    // confirm delete one product
    const confirmDeleteProduct = (id, name) => {
        if (id === 'from CheckboxListProducts') {
            var tmp_arr = '';
            listProductsChecked.map(checkedId => {
                // if "all" is in listProductsChecked then dont take it 
                if (checkedId !== 'all') {
                    let collName = products.filter(item => item.id == checkedId);
                    tmp_arr += (collName[0].name) + ', ';
                }
            });
            let names = tmp_arr.toString();
            names = names.slice(0, (names.length - 2)).replace(/(\,)(?!.*\1)/g, ' et '); // remove last "," and replace last occurence of "," by " et "
            let article = listProductsChecked.length > 1 ? 'les collections' : 'la collection';
            setMessageModal('Supprimer ' + article + ' ' + names + ' ?');
            setProductToDelete(listProductsChecked);
        } else {
            setMessageModal('Supprimer le produit ' + name + ' ?');
            setProductToDelete(id);
        }
        setTextButtonConfirm('Confirmer');
        setSender('deleteCollection');
        setShowModalConfirm(true);
    }

    const deleteProduct = () => {
        let idToDelete = new FormData;
        if (Array.isArray(productToDelete)) {
            var ids_arr = JSON.stringify(productToDelete);
            idToDelete.append('id', ids_arr);
        } else {
            idToDelete.append('id', productToDelete);
        }

        Axios.post(`http://127.0.0.1:8000/deleteProducts`, idToDelete)
            .then(res => {
                setShowModalConfirm(false);
                setProducts(res.data);
                // setIdCollection(null);
                // setIs({ ...is, collectionDeleted: true });
                setListProductsChecked([]);
            });
    }

    const handleModalCancel = () => {
        setShowModalConfirm(false);
    };


    // gère listProductsChecked -> quand on check les checkBox de la list collections
    const handleCheckboxListProduct = (id) => {
        var tmp_arr = [];
        if (id === 'allProducts12922') {
            if (!allChecked) {
                setAllChecked(true);
                tmp_arr.push('allProducts12922');
                listProductsFiltered.forEach(item => tmp_arr.push(item.id));
                setListProductsChecked(tmp_arr);
            } else {
                setAllChecked(false);
                tmp_arr = [];
                setListProductsChecked(tmp_arr);
            }
        }
        else {
            // remove "all" from listProductsChecked if uncheck any checkBox 
            tmp_arr = listProductsChecked;
            let index = tmp_arr.indexOf('allProducts12922');
            if (index !== -1) {
                tmp_arr.splice(index, 1);
            }
            setListProductsChecked(tmp_arr);
            setAllChecked(false);
            // add or remove checked id from listProductsChecked
            if (!listProductsChecked.includes(id)) {
                setListProductsChecked([...listProductsChecked, id]);
            } else {
                setListProductsChecked([...listProductsChecked.filter(item => item !== id)]);
            }
        }
    }

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
        setListProductsFiltered([].concat(listProductsFiltered).sort((a, b) => a[item].localeCompare(b[item])));
    }
    function sortList_ZA(item) {
        setListProductsFiltered([].concat(listProductsFiltered).sort((b, a) => a[item].localeCompare(b[item])));
    }

    // renvoi les collection correspondantes à ce qui est tapé dans la barre de recherche dans List collection
    function handleSearch(e) {
        // uncheck all categoies filter when handleSearch
        // setCategoriesChecked([]);

        setSearchValue(e.target.value);
        setListProductsFiltered(products.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    function collectionsFilter(collections) {
        collections.length > 0 ? setListProductsFiltered(products.filter(x => collections.some(y => x.collections.indexOf(y) >= 0))) : setListProductsFiltered(products);
    }


    useEffect(() => {
        handleGridCols();
    }, [screenSize]);

    const handleGridCols = () => {
        let tmp_grid_cols = '';
        if (screenSize > 0) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_1fr]';
        }
        if (screenSize > 559) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_1fr_1fr]';
        }
        if (screenSize > 639) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_100px_1fr_1fr]';
        }
        if (screenSize > 700) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_145px_1fr_1fr]';
        }
        if (screenSize > 839) {
            tmp_grid_cols = 'grid-cols-[48px_70px_170px_65px_22%_1fr_80px]';
        }
        if (screenSize > 890) {
            tmp_grid_cols = 'grid-cols-[48px_70px_170px_65px_26%_1fr_100px]';
        }
        if (screenSize > 974) {
            tmp_grid_cols = 'grid-cols-[48px_70px_170px_65px_29%_1fr_140px]';
        }
        if (screenSize > 1024) {
            tmp_grid_cols = 'grid-cols-[48px_70px_140px_65px_22%_1fr_100px]';
        }
        if (screenSize > 1070) {
            tmp_grid_cols = 'grid-cols-[48px_70px_140px_65px_24%_1fr_90px]';
        }
        if (screenSize > 1149) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_65px_17%_1fr_92px_80px]';
        }
        if (screenSize > 1279) {
            tmp_grid_cols = 'grid-cols-[48px_70px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_80px]';
        }
        setGridCols(tmp_grid_cols);
    }


    console.log('listProductsFiltered  ', listProductsFiltered)
    console.log('listProductsChecked  ', listProductsChecked)
    return (

        <div className='mt-10 mx-auto w-[96%] lg:w-[94%] 2xl:w-11/12 3xl:w-10/12 h-auto min-h-[100vh] pb-48 flex flex-col justify-start items-center'>

            <HeaderListProducts
                confirmDeleteProduct={confirmDeleteProduct}
                handleSearch={handleSearch}
                collectionsFilter={collectionsFilter}
            />

            <ul className='w-full flex flex-col justify-start items-start mb-2.5 bg-gray-50 min-h-full shadow-sm rounded-md caret-transparent'>

                <li className={`w-full py-4 grid ${gridCols} gap-2 bg-gray-50 rounded-t-md`}>

                    <div className='flex justify-center items-center h-12 min-w-[48px]'>
                        <CheckboxListProducts
                            unikId={'allProducts12922'}
                            handleCheckboxListProduct={handleCheckboxListProduct}
                            listProductsChecked={listProductsChecked} />
                    </div>
                    <span className="flex flex-row justify-center items-center min-h[48px] w-full">{/* thumbnail */}</span>

                    {/* name */}
                    <div className='h-12 w-full min-w-[130px] flex flex-row justify-start items-center'>
                        <span
                            className='cursor-pointer font-medium'
                            onClick={() => sortList('name')}>
                            Nom
                        </span>
                        <figure className='h-6 w-6 cursor-pointer' onClick={() => sortList('name')}>
                            <img src={window.location.origin + '/images/icons/' + imgSort.imgName} className="h-6 w-6" />
                        </figure>
                    </div>

                    {/* variantes */}
                    {screenSize > 639 &&
                        <div className="w-full h-12 flex flex-row justify-center items-center flex-wrap font-medium">
                            Variantes
                        </div>}

                    {/* price */}
                    {screenSize > 639 &&
                        <div className="w-full h-12 flex flex-row justify-center items-center flex-wrap font-medium">
                            Prix
                        </div>}

                    {/* stock */}
                    {screenSize > 639 &&
                        <div className="w-full h-12 flex flex-row justify-center items-center flex-wrap font-medium">
                            Stock
                        </div>}

                    {/* collections */}
                    {screenSize > 1279
                        && <div className='w-full h12 flex flex-row justify-start items-center'>
                            <span
                                className='cursor-pointer shrink-0 font-medium'>
                                Collections
                            </span>
                        </div>}

                    {/* status */}
                    {screenSize > 559 &&
                        <div className='shrink-0 w-32 h-12 flex-row'>
                            <span className='shrink-0 font-medium'>Statut</span>
                        </div>}

                    {/* created at */}
                    {screenSize > 1149 &&
                        <div className='w-full h-12 flex flex-row justify-start items-center pl-2 xl:pl-0'>
                            <span className='cursor-pointer shrink-0 font-medium' onClick={() => sortList('created_at')}>Crée le</span>
                            <figure className='h-6 w-6 ml-1.5 cursor-pointer shrink-0' onClick={() => sortList('created_at')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgDate} className="h-6 w-6" />
                            </figure>
                        </div>}

                    {/* empty */}
                    <div className='w-auto'>{/* edit & delete */}</div>
                </li>
                {console.log('listProductsFiltered  --> ', listProductsFiltered)}
                {/* RowListProducts */}
                {!!listProductsFiltered && listProductsFiltered.map(item =>
                    <RowListProducts
                        key={item.id}
                        productsFiltered={item}
                        collections={item.collections}
                        handleCheckboxListProduct={handleCheckboxListProduct}
                        listProductsChecked={listProductsChecked} confirmDeleteProduct={confirmDeleteProduct}
                        gridCols={gridCols}
                        handleGridCols={handleGridCols}
                    />
                )}
            </ul>

            <ModalConfirmation
                show={showModalConfirm}
                handleModalConfirm={deleteProduct}
                handleModalCancel={handleModalCancel}
                textButtonConfirm={textButtonConfirm}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>
        </div>
    );
}

export default List;






