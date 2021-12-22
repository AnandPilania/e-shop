import { React, useState, useEffect } from 'react';
import ConditionCollection from './conditionCollection';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios';
import DropZone from '../tools/dropZone';

const CreateCollection = () => {
    const [conditions, setConditions] = useState([{
        parameter: '1',
        operator: '=',
        value: ''
    }]);
    const [isToggleOn, setIsToggleOn] = useState(true);
    const [isShowOptimisation, setIsShowOptimisation] = useState(true);
    const [includePrevProduct, setIncludePrevProduct] = useState(true);
    const [categories, setCategories] = useState([]);
    const [datetimeField, setDatetimeField] = useState(new Date());
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [nameCollection, setNameCollection] = useState('');
    const [descriptionCollection, setDescriptionCollection] = useState('');
    const [category, setCategory] = useState();
    const [categoryName, setCategoryName] = useState('Aucune catégorie');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [linkCreateCategory, setLinkCreateCategory] = useState('Créer une nouvelle catégorie.');
    const [alt, setAlt] = useState('');
    const [image, setImage] = useState([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [apercuMetaTitle, setApercuMetaTitle] = useState('');
    const [apercuMetaTitle2, setApercuMetaTitle2] = useState('');
    const [biggerThan60, setBiggerThan60] = useState(false);
    const [metaDescription, setMetaDescription] = useState('');
    const [apercuMetaDescription, setApercuMetaDescription] = useState('');
    const [metaUrl, setMetaUrl] = useState(window.location.origin + '/');
    const [apercuMetaUrl, setApercuMetaUrl] = useState(window.location.origin);
    const [isEmptyMetaDescription, setIsEmptyMetaDescription] = useState(true);
    const [isEmptyMetaTitle, setIsEmptyMetaTitle] = useState(true);
    const [showCategorySelect, setShowCategorySelect] = useState(false);

    var isEmptyMetaUrl = true;


    useEffect(() => {
        // chargement des collections
        Axios.get(`http://127.0.0.1:8000/getCategories`)
            .then(res => {
                setCategories(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });


        // current date & time
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var localDatetime = year + "-" +
            (month < 10 ? "0" + month.toString() : month) + "-" +
            (day < 10 ? "0" + day.toString() : day) + "T" +
            (hour < 10 ? "0" + hour.toString() : hour) + ":" +
            (minute < 10 ? "0" + minute.toString() : minute);
        setDatetimeField(localDatetime);
        ;

        // pour autoriser handleNameCollection à setMetaTitle
        // let tmp_metaTitle = [...metaTitle];
        // tmp_metaTitle[0] = '';
        // tmp_metaTitle[1] = 'can_touch';
        // setMetaTitle(...tmp_metaTitle);
    }, []);

    // var lastCondition = conditions.slice(-1)[0];

    const addCondition = () => {
        setConditions([
            ...conditions, {
                parameter: '1',
                operator: '=',
                value: ''
            }
        ]);
    };

    const handleChangeParam = (param, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].parameter = param;
        setConditions(tmp_conditions);
    };

    const handleChangeOperator = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].operator = e.target.value;
        setConditions(tmp_conditions);
    };

    const handleChangeValue = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].value = e.target.value;
        setConditions(tmp_conditions);
    };

    const showHideConditions = (auto) => {
        if (auto) {
            setIsToggleOn(true);
        } else {
            setIsToggleOn(false);
        }
    };

    const showHideOptimisation = () => {
        setIsShowOptimisation(!isShowOptimisation);
    };

    const includePrevProducts = (includ) => {
        setIncludePrevProduct(includ);
    };

    const handleDateChange = (e) => {
        setDatetimeField(e.target.value);
    };

    const handleNameCollection = (e) => {
        let name = e.target.value;
        let urlName = normalizUrl(e.target.value);
        // limit la taille de l'url à 255 caracères
        let urlLength = 254 - window.location.origin.length;

        setNameCollection(name);
        // if metaTitle field is not used then we can 
        // fill apercuMetaTitle with the name field 
        if (isEmptyMetaTitle == true) {
            // affiche en rouge un avertissement sur la longeur du title
            if (name.length > 60) {
                setBiggerThan60(true);
            } else {
                setBiggerThan60(false);
            }
            setApercuMetaTitle(name.substring(0, 60));
            setApercuMetaTitle2(name.substring(61, 5000));
        }

        if (metaUrl.length == 0) {
            setApercuMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
        }
    };

    const normalizUrl = (str) => {
        // remove caracteres unauthorized for url
        let urlName = str.replaceAll(' ', '-').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        urlName = urlName.replaceAll(/-{2,}/g, '-');
        urlName = urlName.replace(/[<>\?\.\[\]'"°@\|\\§.,\/#\!\$%\^&\*;:\{\}=\+_`~\(\)]/g, "").replaceAll(/-{2,}/g, '-'); // <-- all ist ok 

        return urlName;
    };

    const handleMetaTitle = (e) => {
        let name = e.target.value;
        setMetaTitle(name);

        setIsEmptyMetaTitle(false);
        setApercuMetaTitle(name.substring(0, 60));
        setApercuMetaTitle2(name.substring(61, 5000));

        // affiche en rouge un avertissement sur la longeur du title
        if (name.length > 60) {
            setBiggerThan60(true);
        } else {
            setBiggerThan60(false);
        }

        if (e.target.value == '') {
            setIsEmptyMetaTitle(true);
            setApercuMetaTitle(nameCollection.substring(0, 60));
            setApercuMetaTitle2(nameCollection.substring(61, 5000));
        }
    };

    function strip(htmlText) {
        let doc = new DOMParser().parseFromString(htmlText, 'text/html');
        return doc.body.textContent || "";
    };

    const handleDescriptionCollection = (description) => {
        // descriptionCollection est seté dans le componot ckeditor donc pas besoin ici
        // if metaDescription field is not used then we can fill apercuMetaDescription with the description field 
        if (isEmptyMetaDescription == true) {
            // on remplace les balises de ckeditor par un espace pour que les mots ne soient pas collés dans l'apérçu
            let htmlDescriptionText = description.replaceAll(/<[a-zA-Z0-9]*>/gi, " ");
            setApercuMetaDescription(strip(htmlDescriptionText));
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescription('');
        setMetaDescription(e.target.value);
        setIsEmptyMetaDescription(false);
        setApercuMetaDescription(e.target.value);

        if (e.target.value == '') {
            setIsEmptyMetaDescription(true);
            // on remplace les balises de ckeditor par un espace pour que les mots ne soient pas collés dans l'apérçu lorsqu'on efface la meta description !!! 2eme nettoyage 
            let htmlDescriptionText = descriptionCollection.replaceAll(/<[\/a-zA-Z0-9]*>/gi, " ");
            setApercuMetaDescription(htmlDescriptionText);
        }
    };

    const handleMetaUrl = (e) => {
        // limit la taille de l'url à 255 caracères
        let urlLength = 254 - window.location.origin.length;
        let urlName = normalizUrl(e.target.value.substring(window.location.origin.length, 255));

        setMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
        isEmptyMetaUrl = false;
        setApercuMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));

        if (e.target.value == window.location.origin + '/') {
            isEmptyMetaUrl = true;
            let urlName = normalizUrl(nameCollection);
            setMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
            setApercuMetaUrl(window.location.origin + '/' + urlName.substring(0, urlLength));
        }
    };


    // CATEGORY ----------------------------------------------------------------
    // show hide select menu
    const showHideCategorySelect = () => {
        setShowCategorySelect(!showCategorySelect);
    }

    // get id for back-end
    const handleCategory = (cat_id) => {
        setCategory(cat_id);
        setShowCategorySelect(false);
    };

    // nom affiché dans le select
    const handleCategoryName = (cat_name) => {
        setCategoryName(cat_name);
    };

    const handleAlt = (e) => {
        setAlt(e.target.value);
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

    const handleNewCategoryName = (e) => {
        setNewCategoryName(e.target.value);
    }

    // add one category
    const saveNewCategory = () => {
        Axios.post(`http://127.0.0.1:8000/categories`, { name: newCategoryName })
            .then(res => {
                setShowCreateCategory(false)
                setLinkCreateCategory('Créer une nouvelle catégorie.');
                setNewCategoryName('');
                console.log('res.data  --->  ok');
            }).catch(function (error) {
                console.log('error:   ' + error);
            });

        // chargement des collections
        Axios.get(`http://127.0.0.1:8000/getCategories`)
            .then(res => {
                setCategories(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    // delete one category
    const deleteCategory = (cat_id) => {
        Axios.delete(`http://127.0.0.1:8000/categories/${cat_id}`)
            .then(res => {

                console.log('res.data  --->  ok');
                setShowCategorySelect(false);
                // chargement des collections
                Axios.get(`http://127.0.0.1:8000/getCategories`)
                    .then(res => {
                        setCategories(res.data);
                    }).catch(function (error) {
                        console.log('error:   ' + error);
                    });
                setCategoryName('Aucune catégorie');

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    document.addEventListener("click", (evt) => {
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
    });
    //------------------------------------------------------------------Category

    var formData = new FormData;
    var objConditions = JSON.stringify(conditions);

    if (image) {
        formData.append('image[]', image[0]);
    };

    formData.append("name", nameCollection);
    formData.append("description", descriptionCollection);
    formData.append("automatise", isToggleOn);
    formData.append("includePrevProduct", includePrevProduct);
    formData.append("allConditionsNeeded", allConditionsNeeded);
    formData.append("objConditions", objConditions);
    formData.append("dateActivation", datetimeField);
    formData.append("category", category);
    formData.append("alt", alt);

    const handleSubmit = () => {
        Axios.post(`http://127.0.0.1:8000/save-collection`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                console.log('res.data  --->  ok');

            });
    }


    return (
        <div className="collection-main-container">
            <div className="collection-block-container">

                {/* nom */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Nom de la collection</h2>
                        <input type='text' id='titreCollection'
                            value={nameCollection}
                            onChange={handleNameCollection}
                            placeholder='ex. Robes, Opération déstockage, Collection hiver' />
                    </div>

                    {/* description */}
                    <div className="div-label-inputTxt">
                        <h2>Description (optionnel)</h2>
                    </div>
                    <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onReady={editor => {
                            editor.ui.view.element.style.marginBottom = "20px";
                            editor.ui.view.element.style.width = "100%";
                            editor.ui.view.editable.element.style.minHeight = "150px";
                            editor.ui.view.editable.element.style.borderRadius = "0 0 5px 5px";
                        }}
                        onChange={(event, editor) => {
                            setDescriptionCollection(editor.getData());
                            handleDescriptionCollection(editor.getData());
                        }}
                        onBlur={(event, editor) => {
                            editor.ui.view.editable.element.style.minHeight = "150px";
                        }}
                        onFocus={(event, editor) => {
                            editor.ui.view.editable.element.style.minHeight = "150px";
                        }}
                    />
                </div>

                {/* type de collection */}
                <div className="div-vert-align">
                    <h2>Type de collection</h2>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio'
                                checked={isToggleOn == false}
                                onChange={() => showHideConditions(false)} />
                            <label
                                onClick={() => showHideConditions(false)}>
                                Manuel
                            </label>
                        </div>
                        <p>Ajouter un produit à la fois dans cette collection. <a href='#'>Plus d'informations sur les collections manuelles.</a></p>
                    </div>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio'
                                checked={isToggleOn == true}
                                onChange={() => showHideConditions(true)} />
                            <label
                                onClick={() => showHideConditions(true)}>
                                Automatisé
                            </label>
                        </div>
                        <p>Ajouter automatiquement les produits lorsqu'ils correspondent aux règles définies. <a href='#'>Plus d'informations sur les collections automatisées.</a></p>
                        {isToggleOn && <div className="sub-div-horiz-align">
                            <div className="div-radio-label">
                                <input type='radio'
                                    checked={includePrevProduct == true}
                                    onChange={() => includePrevProducts(true)} />
                                <label onClick={() => includePrevProducts(true)}>Inclure les produits déjà enregistrés</label>
                            </div>
                            <div className="div-radio-label">
                                <input type='radio'
                                    checked={includePrevProduct == false}
                                    onChange={() => includePrevProducts(false)} />
                                <label onClick={() => includePrevProducts(false)}>Ne pas inclure les produits déjà enregistrés</label>
                            </div>
                        </div>}
                    </div>
                    {/* conditions */}
                    {isToggleOn &&
                        <div className="sub-div-vert-align-border-top" id="conditions_collection">
                            <h2>Condition(s)</h2>
                            <h4>Définissez une ou plusieurs règles. Ex. Prix du produit est inférieur à 50 €, Nom du produit contient Robe, etc. Seuls les produits correspondants à vos règles seront intégrés dans cette collection. </h4>
                            <div className="sub-div-horiz-align">
                                <div className="div-radio-label">
                                    <input type='radio' name="condition" id='allConditions'
                                        checked={allConditionsNeeded == true}
                                        onChange={() => setAllConditionsNeeded(true)} />
                                    <label htmlFor='allConditions'>Les produits doivent répondre à toutes les conditions</label>
                                </div>
                                <div className="div-radio-label">
                                    <input type='radio' name="condition" id='leastOnConditions'
                                        checked={allConditionsNeeded == false}
                                        onChange={() => setAllConditionsNeeded(false)}
                                    />
                                    <label htmlFor='leastOnConditions'>Les produits doivent répondre à au moins une condition</label>
                                </div>
                            </div>

                            {/* inputs conditions */}
                            <div className="sub-div-vert-align">
                                {conditions.map((item, i) => (
                                    <ConditionCollection
                                        key={i}
                                        index={i}
                                        handleChangeParam={handleChangeParam}
                                        handleChangeOperator={handleChangeOperator} handleChangeValue={handleChangeValue}
                                        condition={item}
                                    />))}
                                <button className="btn-bcknd" onClick={addCondition}>Ajouter une condition</button>
                            </div>
                        </div>
                    }
                </div>

                {/* résultat sur les moteurs de recherche */}
                <div className="div-vert-align">
                    <div className="sub-div-horiz-align">
                        <h2>Optimiser pour les moteurs de reherche.</h2>
                        <input type='checkbox'
                            className="cm-toggle"
                            checked={isShowOptimisation == true}
                            onChange={showHideOptimisation} />
                    </div>
                    {isShowOptimisation &&
                        <div className="sub-div-vert-align-border-top">
                            <h3>Coup d'oeil sur le résultat affiché par les moteurs de recherche</h3>
                            <div>
                                <span>{apercuMetaUrl}</span>
                                <div className="sub-div-horiz-align">
                                    <h3>{apercuMetaTitle}<span className="apercuMetaTitle2">{apercuMetaTitle2}</span> {biggerThan60 && <span className="inRed">Seul les 60 premiers caractères seront visibles</span>}</h3>
                                </div>
                                <p>{apercuMetaDescription}</p>
                            </div>

                            {/* meta-titre */}
                            <div className="div-label-inputTxt">
                                <div className="sub-div-horiz-align">
                                    <label>
                                        Méta-titre de la page de cette collection
                                    </label>
                                    <i className="fas fa-question-circle tooltip">
                                        <span className="tooltiptext">Le méta-titre est important pour le référencement d'une page web. Sa longueur idéal se situe entre 30 et 60 caractères mais il peut être plus long pour donner plus d'informations sur le contenu de la page. Toutefois, les moteurs de recherche n'afficheront pas plus de 70 caractères, c'est pourquoi il est important de commence par des mots clés pertinants pour l'internaute afin d'améliorer le taux de clics vers votre page.</span>
                                    </i>
                                </div>
                                <input type='text'
                                    value={metaTitle}
                                    onChange={handleMetaTitle}
                                    placeholder="Ce titre sera affiché dans les résultats des moteurs de recherche."
                                    maxLength="255"
                                />
                            </div>

                            {/* meta-description */}
                            <div className="div-label-inputTxt">
                                <label>Méta-déscription de cette collection:</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={handleMetaDescription}
                                    placeholder="Cette déscription sera utilisée pour décrire le contenu de cette page. Elle s’affichera sous le titre et l’URL de votre page dans les résultats des moteurs de recherche. Veillez à ne pas dépasser les 140-160 caractères pour qu'elle soit entièrement visibles dans les résultats de Google"
                                    maxLength="320">
                                </textarea>
                            </div>

                            {/* meta-url */}
                            <div className="div-label-inputTxt">
                                <div className="sub-div-horiz-align">
                                    <label>
                                        Url de la page de cette collection
                                    </label>
                                    <i className="fas fa-question-circle tooltip">
                                        <span className="tooltiptext">Utilisez des mots clés en rapport avec le contenu de cette collection</span>
                                    </i>
                                </div>
                                <input type='text'
                                    value={metaUrl}
                                    onChange={handleMetaUrl}
                                    placeholder="Url de cette collection"
                                    maxLength="255"
                                />
                            </div>
                        </div>
                    }
                </div>


                {/* submit */}
                <div className="div-label-inputTxt">
                    <button className="btn-submit" onClick={handleSubmit}>
                        Enregistrer
                    </button>
                </div>
            </div>

            {/* ----------  side  ---------- */}
            <div className='side-create-collection'>

                {/* image */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Image</h2>
                        <p>Ajouter une image pour cette collection. (*optionnel)</p>
                        <DropZone multiple={false} setImage={setImage} />
                        <p><a href="#">Comment bien choisir son image ?</a></p>
                    </div>

                    {/* Référencement */}
                    <div className="sub-div-vert-align">
                        <div className="div-label-inputTxt">
                            <div className="sub-div-horiz-align">
                                <label>Texte alternatif (*optionnel) </label>
                                <i className="fas fa-question-circle tooltip">
                                    <span className="tooltiptext">Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliorera l'accessibilité et le référencement de votre boutique.</span>
                                </i>
                            </div>
                            <input type="text" name="alt" value={alt} onChange={handleAlt} />
                        </div>
                    </div>
                </div>

                {/* catégorie */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Catégorie</h2>
                        <p>Attribuer une catégorie à cette collection.
                            (<strong>*optionnel</strong>)</p>


                        <div className="categorySelect" id="categorySelect">
                            <button className='btn-select-category' onClick={showHideCategorySelect}>
                                {categoryName}<i class="fas fa-angle-down"></i>
                            </button>
                            {showCategorySelect && <ul className='ul-category'>
                                {categoryName != 'Aucune catégorie' && <li className="li-category"
                                    onClick={() => {
                                        handleCategory(0),
                                            handleCategoryName('Aucune catégorie')
                                    }}
                                >Aucune catégorie
                                </li>}
                                {categories.map((cat, index) => (
                                    <li className="li-category"
                                        key={index}
                                        onClick={() => {
                                            handleCategory(cat.id),
                                                handleCategoryName(cat.name)
                                        }} >
                                        <span>{cat.name}</span>
                                        <div>
                                            <i class="fas fa-recycle"></i>
                                            <i className="far fa-trash-alt"
                                                onClick={() => deleteCategory(cat.id)}></i>
                                        </div>
                                    </li>))}
                            </ul>}
                        </div>
                        <p><a href='#'>Plus d'informations sur les catégories.</a></p>
                    </div>
                    <p className='pos-abs-bot-rig-15' onClick={handleShowCreateCategory}><a href=''>{linkCreateCategory}</a></p>
                    {showCreateCategory && <div className='sub-div-vert-alogn'>
                        <label>Nom de la catégorie</label>
                        <input type='text'
                            value={newCategoryName}
                            onChange={handleNewCategoryName}
                            maxLength="255"
                        />
                        <button className='btn-bcknd' onClick={saveNewCategory}>
                            Sauvegarder
                        </button>
                    </div>}
                </div>



                {/* Date d'activation */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Activation</h2>
                        <p>Date d'activation.</p>
                        <input id="activationDate" type="datetime-local" value={datetimeField} min={datetimeField} onChange={handleDateChange} />
                        <p><a href='#'>Plus d'informations sur l'activation des collections.</a></p>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default CreateCollection;
