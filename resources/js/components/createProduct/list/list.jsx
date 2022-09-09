import { React, useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import InputText from '../../InputText/Input_text';

import RowListCollections from './RowListCollections';
import CheckboxListCollection from './checkBox_listCollection';
import HeaderListCollections from './headerListCollections';
import ModalConfirm from '../../modal/modalConfirm';

const List = () => {
    const [products, setProducts] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const [imgSort, setImgSort] = useState({
        imgName: 'az.svg',
        imgDate: '1-2.svg',
        imgCat: 'az.svg',
    });
    const [allChecked, setAllChecked] = useState(false);
    const [gridCols, setGridCols] = useState('');
    const [toggleSort, setToggleSort] = useState({
        nameSens: true,
        categorySens: true,
        created_atSens: true
    });

    const { listCollections, setListCollections, listCollectionsFiltered, setListCollectionsFiltered, setListCategories, setCategoriesChecked, setSearchValue, is, setIs, messageModal, textButtonConfirm, imageModal, showModalConfirm, handleModalConfirm, handleModalCancel, setShowModalConfirm, setMessageModal, setSender, setTextButtonConfirm, setImageModal, setTmp_parameter, screenSize, listCollectionsChecked, setListCollectionsChecked } = useContext(AppContext);


    useEffect(() => {
        Axios.get(`http://127.0.0.1:8000/getProducts`)
            .then(res => {
                console.log(res.data);
                setProducts(Object.values(res.data));

                // Object.values(res.data).map(element => {
                //     console.log(element);
                // });

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


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
            tmp_grid_cols = 'grid-cols-[48px_70px_2fr_65px_15%_2fr_1fr_1fr_80px]';
        }
        setGridCols(tmp_grid_cols);
    }


    // return (
    //     <div className='flex-col justify-s align-s m-b-10 bg-gray-cool w90pct min-h-[100vh]'>
    //         <h4 className="card-title">Produits</h4>
    //         <button className="btn btn_ajouter"><a href="/products/create">Ajouter un article</a></button>
    //         <table className="table">

    //             <thead>
    //                 <tr className="tr_thead">
    //                     <th>Image</th>
    //                     <th>Nom</th>
    //                     <th>Collection</th>
    //                     <th>Catégorie</th>
    //                     <th>Ajouté le</th>
    //                     <th>--Actions--</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {products.map((product, index) => (
    //                     <tr key={index}>
    //                         <td>
    //                             <img src={window.location.origin + "/" + product.image_path} />
    //                         </td>
    //                         <td>
    //                             {product.name}
    //                         </td>
    //                         <td>
    //                             {product.collection}
    //                         </td>
    //                         <td>
    //                             {product.category}
    //                         </td>
    //                         <td>
    //                             {product.created_at}
    //                         </td>
    //                         <td className="td_buton">
    //                             <button className="btn btn_img">
    //                                 <Link className="link" to={`/editImagesProduct/${product.id}`}>Image</Link>
    //                             </button>



    //                             <button className="btn btn_edit"><Link className="link" to={`/editProduct/${product.id}`}>Modifier</Link></button>

    //                         </td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </div>
    // );

    return (

        <div className='mx-auto w-[96%] lg:w-[94%] 2xl:w-11/12 3xl:w-10/12 h-auto min-h-[100vh] pb-48 flex flex-col justify-start items-center brd-red-1'>

            {/* <HeaderListCollections
                confirmDeleteCollection={confirmDeleteCollection}
                handleSearch={handleSearch}
                categoriesFilter={categoriesFilter}
            /> */}

            <ul className='w-full flex flex-col justify-start items-start mb-2.5 bg-gray-50 min-h-full shadow-sm rounded-md caret-transparent brd-green-1'>

                <li className={`w-full py-4 grid ${gridCols} gap-2 bg-gray-50 rounded-t-md`}>

                    <div className='flex justify-center items-center h-12 min-w-[48px]'>
                        <CheckboxListCollection unikId={'allProducts'} handleCheckboxListCollection={handleCheckboxListCollection} listCollectionsChecked={listCollectionsChecked} />
                    </div>
                    <span className="flex flex-row justify-center items-center min-h[48px] w-full">{/* thumbnail */}</span>

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

                    {screenSize > 639 &&
                        <div className="w-full h-12 flex flex-row justify-center items-center flex-wrap font-medium">
                            Stock
                        </div>}

                    {/* type physique ou numérique */}
                    {screenSize > 839 &&
                        <div className="w-full h-12 flex flex-row justify-start items-center font-medium">
                            Type
                        </div>}

                    {/* collections */}
                    {screenSize > 1279
                        && <div className='w-full h12 flex flex-row justify-start items-center'>
                            <span
                                className='cursor-pointer shrink-0 font-medium'
                                onClick={() => sortList('categoryName')}>Collections
                            </span>
                            <figure
                                className='h-6 w-6 ml-1.5 cursor-pointer shrink-0'
                                onClick={() => sortList('categoryName')}>
                                <img src={window.location.origin + '/images/icons/' + imgSort.imgCat} className="h-6 w-6" />
                            </figure>
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

                {/* RowListCollections */}
                {!!listCollectionsFiltered && listCollectionsFiltered.map(item =>
                    <RowListCollections
                        key={item.id}
                        collectionFiltered={item}
                        category={item.category}
                        handleCheckboxListCollection={handleCheckboxListCollection}
                        listCollectionsChecked={listCollectionsChecked} confirmDeleteCollection={confirmDeleteCollection}
                        gridCols={gridCols}
                        handleGridCols={handleGridCols}
                    />
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

export default List;






