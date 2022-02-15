import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import CollectionContext from '../contexts/CollectionContext';
import Axios from 'axios';
import ModalInput from '../modal/modalInput';

const Categories = () => {

    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [linkCreateCategory, setLinkCreateCategory] = useState('Créer une nouvelle catégorie.');
    const [newCategorySucces, setNewCategorySucces] = useState(false);
    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const [newCategoryNameUseInMessage, setNewCategoryNameUseInMessage] = useState(''); // pour stocker le nom de la catégorie qui doit être afficher dans le message de confirmation de la creation de la catégorie


    const {
        setShowModalConfirm, showModalInput, setShowModalInput, messageModal, setMessageModal, setSender, inputTextModify, setInputTextModify,
        setTextButtonConfirm, setImageModal } = useContext(AppContext);

    const {
        categoryName, setCategoryName,
        categoryId, setCategoryId,
        setTmp_parameter,
        handleModalCancel,
        deleteThisCategory, setDeleteThisCategory,
    } = useContext(CollectionContext);

    useEffect(() => {
        if (deleteThisCategory !== null) {
            deleteCategory(deleteThisCategory);
            setDeleteThisCategory(null);
        }
    }, [deleteThisCategory]);

    useEffect(() => {
        // chargement des Categories
        Axios.get(`http://127.0.0.1:8000/getCategories`)
            .then(res => {
                setCategoriesList(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


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

    // show/hide input create new category
    const handleShowCreateCategory = (e) => {
        e.preventDefault();
        // test du toggle avant le setShowCreateCategory pcq il faut se baser sur le précédent état de showCreateCategory qui a un temps de retard au moment où on exécute cette fonction
        if (showCreateCategory == false) { // au lieu de true
            setLinkCreateCategory('Annuler');
        }

        if (showCreateCategory == true) { // au lieu de false
            setLinkCreateCategory('Créer une nouvelle catégorie.');
        }

        setShowCreateCategory(!showCreateCategory);
    }

    // show modalInput
    const handleShowModalInput = () => {
        setMessageModal('Entrez le nouveau nom de la catégorie')
        setShowModalInput(!showModalInput);
    }

    const handleNewCategoryName = (e) => {
        setNewCategoryName(e.target.value);
    }



    // add one category
    const saveNewCategory = () => {
        if (newCategoryName != '' && newCategoryName.length >= 3) { // au cas où le nouveau nom est vide ou < 3
            Axios.post(`http://127.0.0.1:8000/categories`, { name: newCategoryName })
                .then(res => {
                    setNewCategoryNameUseInMessage(newCategoryName + ' à été ajoutée'); // message affiché après création de la category
                    setShowCreateCategory(false) // hide input create new category
                    setLinkCreateCategory('Créer une nouvelle catégorie.'); // text link create new category
                    setNewCategoryName(''); // reset newCategoryName
                    setNewCategorySucces(true); // show succes message
                    setTimeout(hideMessageSucces, 4000); // during 4 secondes

                    console.log('res.data  --->  ok');
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/getCategories`)
                .then(res => {
                    setCategoriesList(res.data);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

        } else { // warning new category name is empty

            setMessageModal('Le nom de catégorie doit contenir au moins trois caractères');
            setShowModalConfirm(true); // show modalConfirm
        }
    }

    // hide les méssages de succes apès 4 secondes
    const hideMessageSucces = () => {
        setNewCategorySucces(false);
    }

    // confirm delete one category
    const confirmDeleteCategory = (cat_id, cat_name) => {
        setMessageModal('Supprimer la catégorie "' + cat_name + '" ?')
        setTextButtonConfirm('Confirmer');
        setImageModal('../images/icons/trash_dirty.png');
        setSender('deleteCategory');
        setTmp_parameter(cat_id);
        setShowModalConfirm(true);
    }

    // delete one category
    const deleteCategory = (cat_id) => {
        Axios.delete(`http://127.0.0.1:8000/categories/${cat_id}`)
            .then(res => {
                setShowCategorySelect(false);
                setMessageModal('Suppression réussie')
                setTextButtonConfirm('Fermer');
                setImageModal('../images/icons/trash.png');
                setShowModalConfirm(true);


                // chargement des collections
                Axios.get(`http://127.0.0.1:8000/getCategories`)
                    .then(res => {
                        setCategoriesList(res.data);
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
                setCategoryName('Aucune catégorie');

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    // update one category
    const updateCategory = () => {
        if (inputTextModify != '' && inputTextModify.length >= 3) { // au cas où le nouveau nom est vide ou < 3
            Axios.put(`http://127.0.0.1:8000/categories/${categoryId}`, { name: inputTextModify })
                .then(res => {
                    setNewCategoryNameUseInMessage(inputTextModify + ' à été enregistrée'); // message affiché après modification de la category
                    setNewCategorySucces(true);
                    setTimeout(hideMessageSucces, 4000);

                    console.log('res.data  --->  ok');
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            // chargement des collections
            Axios.get(`http://127.0.0.1:8000/getCategories`)
                .then(res => {
                    setCategoriesList(res.data);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            setShowModalInput(false);
            setCategoryName('Aucune catégorie');
            setInputTextModify('');

        } else { // warning new modified category name is empty

            setMessageModal('Le nouveau nom de catégorie doit contenir au moins trois caractères');
        }
    }


    useEffect(() => {
        // empèche l'erreur-> Warning: Can't perform a React state update on an unmounted
        document.addEventListener('click', closeDropDownCategory);
        return () => {
            document.removeEventListener('click', closeDropDownCategory);
        };
    }, []);
    // ferme le select de category quand on click en dehors du select
    function closeDropDownCategory(evt) {
        const categorySelectElement = document.getElementById("categorySelect");
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
        <div>
            <div className="div-vert-align">
                <div className="div-label-inputTxt">
                    <h2>Catégorie parente</h2>
                    <p>Attribuer une catégorie à cette collection.
                        (<strong>*optionnel</strong>)
                    </p>
                    <div className="categorySelect" id="categorySelect">
                        <button
                            className='btn-select-category'
                            onClick={showHideCategorySelect}>
                            {categoryName.length > 25 ? categoryName.substring(0, 25) + '...' : categoryName}
                            <i className="fas fa-angle-down"></i>
                        </button>
                        {/* {showCategorySelect && */}
                        <ul className='ul-category dropable'
                            id='category_select'>
                            {categoryName != 'Aucune catégorie' &&
                                <li className="li-category"
                                    onClick={() => {
                                        handleCategory(0),
                                            handleCategoryName('Aucune catégorie')
                                    }}
                                >Aucune catégorie
                                </li>}
                            {categoriesList && categoriesList.map((cat, index) => (
                                cat.name != categoryName &&
                                <li className="li-category"
                                    key={index}
                                    onClick={() => {
                                        handleCategory(cat.id);
                                        handleCategoryName(cat.name);
                                    }} >
                                    {cat.name.length > 25 ? <span>{cat.name.substring(0, 25) + '...'}</span> : <span>{cat.name}</span>}
                                    <div>
                                        <i className="fas fa-recycle"
                                            onClick={() => {
                                                handleCategory(cat.id);
                                                handleShowModalInput();
                                            }}>
                                        </i>
                                        <i className="far fa-trash-alt"
                                            onClick={() => confirmDeleteCategory(cat.id, cat.name)}></i>
                                    </div>
                                </li>))}
                        </ul>
                        {/* } */}
                    </div>
                    <p>
                        <a href='#'>Plus d'informations sur les catégories.</a>
                    </p>
                    {newCategorySucces &&
                        <p className='succesMessage'>
                            La catégorie {newCategoryNameUseInMessage}
                        </p>}
                </div>
                <p className='pos-abs-bot-rig-15'
                    onClick={(e) => {
                        handleShowCreateCategory(e);
                    }
                    }>
                    <a href=''>{linkCreateCategory}</a>
                </p>
                {showCreateCategory && <div className='sub-div-vert-alogn'>
                    <label>Nom de la catégorie</label>
                    <input type='text'
                        value={newCategoryName}
                        onChange={handleNewCategoryName}
                        maxLength="255"
                        placeholder='Entrez un nom'
                    />
                    <button className='btn-bcknd' onClick={saveNewCategory}>
                        Sauvegarder
                    </button>
                </div>}
            </div>
            {/* modal for modify category name */}
            <ModalInput
                show={showModalInput}
                updateCategory={updateCategory}
                handleModalCancel={handleModalCancel}
                setInputTextModify={setInputTextModify}
                inputTextModify={inputTextModify}
                image={'../images/icons/changeCategory.png'}>
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalInput>
        </div>
    );
}

export default Categories;
