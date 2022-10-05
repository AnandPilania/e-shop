import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import ModalInput from '../modal/modalInput';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import Label from '../form/label';
import InputText from '../form/inputText';

const Categories = () => {

    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [linkCreateCategory, setLinkCreateCategory] = useState('Créer une nouvelle catégorie.');
    const [newCategorySucces, setNewCategorySucces] = useState(false);
    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [newCategoryNameUseInMessage, setNewCategoryNameUseInMessage] = useState(''); // --> pour stocker le nom de la catégorie qui doit être afficher dans le message de confirmation de la creation de la catégorie


    const {
        setShowModalConfirm, showModalInput, setShowModalInput, messageModal, setMessageModal, showModalSimpleMessage, setShowModalSimpleMessage, setSender, inputTextModify, setInputTextModify, selectedColor, setSelectedColor, setTextButtonConfirm, setImageModal, deleteThisCategory, setDeleteThisCategory, categoryName, setCategoryName,
        categoryId, setCategoryId,
        setTmp_parameter,
        handleModalCancel, } = useContext(AppContext);


    useEffect(() => {
        if (deleteThisCategory !== null) {
            deleteCategory(deleteThisCategory);
            setDeleteThisCategory(null);
        }
        return () => {
            setDeleteThisCategory(null);
            setCategoriesList([]);
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
        return setCategoriesList([]);
    }, []);


    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

    useEffect(() => {
        var dropable = document.getElementById('category_select');
        if (!showCategorySelect) {
            // cache border sinon y a un bout qui reste visible
            dropable.classList.remove('border');
            dropable.style.maxHeight = null;
        } else {
            dropable.style.maxHeight = "335px";
            dropable.classList.add('border');
        }
    }, [showCategorySelect]);

    // get id for back-end
    const handleCategory = (cat_id) => {
        setCategoryId(cat_id);
        setShowCategorySelect(false);
    };

    // nom affiché dans le select
    const handleCategoryName = (cat_name) => {
        setCategoryName(cat_name);
    };

    // show/hide input create new category
    const handleShowCreateCategory = (e) => {
        e.preventDefault();
        // test du toggle avant le setShowCreateCategory pcq il faut se baser sur le précédent état de showCreateCategory qui a un temps de retard au moment où on exécute cette fonction
        if (showCreateCategory == false) { // au lieu de true
            setLinkCreateCategory('');
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
            console.log(categoriesList, newCategoryName)
            let exist = false;
            categoriesList.map(item => { if (item.name === newCategoryName) exist = true })
            if (exist) {
                setMessageModal('Ce nom de catégorie existe déjà !');
                setShowModalSimpleMessage(true); // show modalConfirm
            } else {
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
            }


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
                setShowModalSimpleMessage(true);
                // chargement des collections
                Axios.get(`http://127.0.0.1:8000/getCategories`)
                    .then(res => {
                        setCategoriesList(res.data);
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
                setCategoryName('Sans catégorie');

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

            // rechargement des catégories
            Axios.get(`http://127.0.0.1:8000/getCategories`)
                .then(res => {
                    setCategoriesList(res.data);
                }).catch(function (error) {
                    console.log('error:   ' + error);
                });

            setShowModalInput(false);
            setCategoryName('Sans catégorie');
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
        if (categorySelectElement !== null && targetElement !== null) {
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
    }


    // react-color
    // const handleClick = () => {
    //     setDisplayColorPicker(!displayColorPicker);
    // };
    // const handleClose = () => {
    //     setDisplayColorPicker(false);
    // };
    // const popover = {
    //     position: 'absolute',
    //     zIndex: '2',
    // }
    // const cover = {
    //     position: 'fixed',
    //     top: '0px',
    //     right: '0px',
    //     bottom: '0px',
    //     left: '-5px',
    // }

    // const handleChangeComplete = (color, event) => {
    //     setSelectedColor(color.hex);
    // };


    return (
        <div className='w-full'>
            <div className="flex flex-col justify-start items-start h-auto w-full bg-white mb-2.5 p-5 rounded-md shadow-sm">
                <div className="div-label-inputTxt">
                    <Label label="Catégorie" />
                    <div
                        className="w-full rounded-t-md relative"
                        id="categorySelect">
                        <button
                            className="w-full h-10 pl-5 m-0 flex justify-start items-center border border-gray-300 rounded-md cursor-pointer bg-white hover:border-gray-400  bg-no-repeat bg-right-center bg-chevron-expand caret-transparent"
                            onClick={showHideCategorySelect}>
                            <span className='inline truncate'>
                                {categoryName}
                            </span>
                        </button>

                        <ul className='absolute top-12 left-0 w-full bg-white overflow-x-hidden overflow-y-scroll list-none rounded-md max-h-0 h-auto border border-gray-300 shadow-md'
                            id='category_select'>
                            {/* {categoryName != 'Sans catégorie' &&
                                <li className="li-category txt-limit"
                                    onClick={() => {
                                        handleCategory(1),
                                            handleCategoryName('Sans catégorie')
                                    }}
                                >Sans catégorie
                                </li>} */}
                            {categoriesList && categoriesList.map((cat, index) => (
                                cat.name != categoryName &&
                                <li
                                    className="w-full h-12 pl-5 pr-2.5  hover:bg-indigo-700 border-b last:border-b-0 border-gray-300 first:rounded-t-md last:rounded-b-md grid grid-cols-[80%_1fr_5px] justify-start items-center cursor-pointer group"
                                    key={index}
                                >
                                    <span
                                        className='w-full truncate group-hover:text-white font-normal'
                                        onClick={() => {
                                            handleCategory(cat.id);
                                            handleCategoryName(cat.name);
                                        }}>
                                        {cat.name}
                                    </span>
                                    <div className="flex justify-start items-center">
                                        <span className="w-5 h-5 mr-4"
                                            onClick={() => {
                                                handleCategory(cat.id);
                                                handleShowModalInput();
                                            }}
                                        >
                                            <svg className="hover:scale-125 w-5 h-5 cursor-pointer fill-gray-700 group-hover:fill-white" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                            </svg>
                                        </span>
                                        <span className="w-5 h-5"
                                            onClick={() => confirmDeleteCategory(cat.id, cat.name)}>
                                            <svg className="hover:scale-125 w-5 h-5 cursor-pointer fill-gray-700 group-hover:fill-white" viewBox="0 0 16 16">
                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                            </svg>
                                        </span>
                                    </div>
                                    <span></span>
                                </li>))}
                        </ul>

                    </div>
                    {/* react-color */}
                    {/* <div className='p-t-10'>
                        <button className='btn-bcknd' onClick={handleClick}>Couleur<span style={{ height: "20px", width: "20px", backgroundColor: `${selectedColor}`, marginLeft: "15px" }}></span></button>
                        {displayColorPicker ?
                            <div style={popover}>
                                <div style={cover} onClick={handleClose} />
                                <SketchPicker
                                    color={selectedColor}
                                    disableAlpha={true}
                                    onChangeComplete={handleChangeComplete}
                                    width="90%"
                                    presetColors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4AEA4A', '#9E9B9B', '#FFFEFF', '#9E13FE', '#4AE0E2', '#5EE3C2', '#E8E986', '#000E00', '#4ACA4A', '#9E9C9B', '#FFEFFF']} />
                            </div> : null}
                    </div> */}
                    {newCategorySucces &&
                        <p className='block text-sm font-semibold text-green-600'>
                            La catégorie {newCategoryNameUseInMessage}
                        </p>}
                </div>
                <div className='ml-auto mt-5 text-base font-semibold'
                    onClick={handleShowCreateCategory}>
                    <a href='' className='text-base text-blue-500 underline underline-offset-1'>
                        {linkCreateCategory}
                    </a>
                </div>
                {showCreateCategory &&
                    <div
                        className='w-full flex flex-col justify-start items-start'
                    >
                        <Label label="Nom" />
                        <InputText
                            value={newCategoryName}
                            handleChange={handleNewCategoryName}
                            css="rounded-md hover:border-gray-400"
                            maxLength="255"
                            placeholder='Entrez un nom de catégorie'
                        />
                        <div className='w-full flex justify-start items-center mt-5'>
                            <button className='w-auto px-3 py-2 flex justify-center items-center text-base text-white bg-violet-900 rounded-md hover:bg-indigo-800'
                                onClick={saveNewCategory}>
                                Ajouter
                            </button>
                            <button className='w-auto px-3 py-2 ml-5 flex justify-center items-center text-base text-gray-700 bg-white border border-gray-700 rounded-md hover:bg-gray-50'
                                onClick={handleShowCreateCategory}>
                                Annuler
                            </button>
                        </div>
                    </div>}
            </div>
            {/* modal for modify category name */}
            <ModalInput
                show={showModalInput}
                updateCategory={updateCategory}
                handleModalCancel={handleModalCancel}
                setInputTextModify={setInputTextModify}
                inputTextModify={inputTextModify}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalInput>
            {/* message category name exist */}
            <ModalSimpleMessage
                show={showModalSimpleMessage} // true/false show modal
                handleModalCancel={handleModalCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalSimpleMessage>
        </div>
    );
}

export default Categories;
