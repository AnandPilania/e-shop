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
    const [includePrevProduct, setIncludePrevProduct] = useState(true);
    const [categories, setCategories] = useState([]);
    const [datetimeField, setDatetimeField] = useState(new Date());
    const [allConditionsNeeded, setAllConditionsNeeded] = useState(true);
    const [nameCollection, setNameCollection] = useState('');
    const [descriptionCollection, setDescriptionCollection] = useState('');
    const [category, setCategory] = useState('');
    const [alt, setAlt] = useState('');
    const [image, setImage] = useState([]);
    const [metaTitle, setMetaTitle] = useState('');
    const [apercuMetaTitle, setApercuMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [apercuMetaDescription, setApercuMetaDescription] = useState('');
    const [metaUrl, setMetaUrl] = useState('');
    var isEmptyMetaTitle = true;
    var isEmptyMetaDescription = true;


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
    }

    const handleChangeParam = (param, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].parameter = param;
        setConditions(tmp_conditions);
    }

    const handleChangeOperator = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].operator = e.target.value;
        setConditions(tmp_conditions);
    }

    const handleChangeValue = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].value = e.target.value;
        setConditions(tmp_conditions);
    }

    const showHideConditions = (auto) => {
        if (auto) {
            setIsToggleOn(true);
        } else {
            setIsToggleOn(false);
        }
    }

    const includePrevProducts = (includ) => {
        setIncludePrevProduct(includ);
    }

    const handleDateChange = (e) => {
        setDatetimeField(e.target.value);
    };

    const handleNameCollection = (e) => {
        setNameCollection(e.target.value);
        // if metaTitle field is not used then we can 
        // fill apercuMetaTitle with the name field 
        if (isEmptyMetaTitle == true) {
            setApercuMetaTitle(e.target.value);
        }
    };

    function strip(htmlText) {
        let doc = new DOMParser().parseFromString(htmlText, 'text/html');
        return doc.body.textContent || "";
    }

    const handleDescriptionCollection = (description) => {
        // console.log(description);
        // if metaDescription field is not used then we can 
        // fill apercuMetaDescription with the description field 
        if (isEmptyMetaDescription == true) {
            // on remplace les balises de ckeditor par un espace pour que les mots ne soient pas collés dans l'apérçu
            let htmlDescriptionText = description.replaceAll(/<[a-zA-Z0-9]*>/gi, " ");
            setApercuMetaDescription(strip(htmlDescriptionText));
        }
    };

    const handleMetaDescription = (e) => {
        setMetaDescription('');
        setMetaDescription(e.target.value);
        isEmptyMetaDescription = false;
        setApercuMetaDescription(e.target.value);

        if (e.target.value == '') {
            isEmptyMetaDescription = true;
            // on remplace les balises de ckeditor par un espace pour que les mots ne soient pas collés dans l'apérçu lorsqu'on efface la meta description !!! 2eme nettoyage 
            let htmlDescriptionText = descriptionCollection.replaceAll(/<[\/a-zA-Z0-9]*>/gi, " ");
            console.log(htmlDescriptionText);
            setApercuMetaDescription(htmlDescriptionText);
        }
    };
    
    const handleCategory = (e) => {
        setCategory(e.target.value);
    };

    const handleAlt = (e) => {
        setAlt(e.target.value);
    };

    const handleMetaTitle = (e) => {
        setMetaTitle(e.target.value);
        isEmptyMetaTitle = false;
        setApercuMetaTitle(e.target.value);

        if (e.target.value == '') {
            isEmptyMetaTitle = true;
            setApercuMetaTitle(nameCollection);
        }
    };

    const handleMetaUrl = (e) => {
        setMetaUrl(e.target.value);
    };

    var formData = new FormData;
    var objConditions = JSON.stringify(conditions);

    if (image) {
        formData.append('image[]', image[0]);
    }

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
                            console.log({ event, editor, descriptionCollection });
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
                            <label onClick={() => showHideConditions(false)}>Manuel</label>
                        </div>
                        <p>Ajouter un produit à la fois dans cette collection. <a href='#'>Plus d'informations sur les collections manuelles.</a></p>
                    </div>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio'
                                checked={isToggleOn == true}
                                onChange={() => showHideConditions(true)} />
                            <label onClick={() => showHideConditions(true)}>Automatisé</label>
                        </div>
                        <p>Ajouter automatiquement les produits lorsqu'ils correspondent aux règles définies. Y compris les produits déjà enregistrés. <a href='#'>Plus d'informations sur les collections automatisées.</a></p>
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
                </div>

                {/* conditions */}
                {isToggleOn && <div className="div-vert-align" id="conditions_collection">
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
                </div>}

                {/* résultat sur les moteurs de recherche */}
                <div className="div-vert-align">
                    <h2>Optimisation pour les moteurs de reherche.</h2>
                    <h4>Coup d'oeil sur le résultat affiché par les moteurs de recherche</h4>
                    <div>
                        <h3>{apercuMetaTitle}</h3>
                        <span>{metaUrl}</span>
                        <p>{apercuMetaDescription}</p>
                    </div>
                    <div className="div-label-inputTxt">
                        <div className="sub-div-horiz-align">
                            <label>
                                Méta-titre de la page de cette collection
                            </label>
                            <i className="fas fa-question-circle tooltip">
                                <span className="tooltiptext">Le méta-titre est très important pour le référencement d'une page web et peut contenir jusqu'à 255 caractères. Toutefois, les moteurs de recherche n'afficheront que les 70 premiers. Veillez à ce que votre titre commence par des mots clés pertinants pour l'internaute afin d'améliorer le taux de clics vers votre page.</span>
                            </i>
                        </div>
                        <input type='text'
                            value={metaTitle}
                            onChange={handleMetaTitle}
                            placeholder="Ce titre sera affiché dans les résultats des moteurs de recherche."
                            maxLength="255"
                        />
                    </div>

                    <div className="div-label-inputTxt">
                        <label>Méta-déscription de cette collection:</label>
                        <textarea
                            value={metaDescription}
                            onChange={handleMetaDescription}
                            placeholder="Cette déscription sera utilisée pour décrire le contenu de cette page. Elle s’affichera sous le titre et l’URL de votre page dans les résultats des moteurs de recherche. Veillez à ne pas dépasser les 140-160 caractères pour qu'elle soit entièrement visibles dans les résultats de Google"
                            maxLength="320">
                        </textarea>
                    </div>
                </div>

                {/* submit */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <button className="btn-bcknd" onClick={handleSubmit}>
                            Enregistrer
                        </button>
                    </div>
                </div>

            </div>

            {/* ----------  side  ---------- */}
            <div className='side-create-collection'>

                {/* Date d'activation */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Activation</h2>
                        <p>Date d'activation.</p>
                        <input id="activationDate" type="datetime-local" value={datetimeField} min={datetimeField} onChange={handleDateChange} />
                        <p><a href='#'>Plus d'informations sur l'activation des collections.</a></p>
                    </div>
                </div>

                {/* catégorie */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Catégorie</h2>
                        <p>Attribuer une catégorie à cette collection. (<strong>*optionnel</strong>)</p>
                        <select id='category' value={category} onChange={handleCategory} >
                            <option value="none">Aucune catégorie</option>
                            {categories.map((category, index) => (<option key={index} value={category.id}>{category.name}</option>))}
                        </select>
                        <p><a href='#'>Plus d'informations sur les catégories.</a></p>
                    </div>
                </div>

                {/* image */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Image</h2>
                        <p>Ajouter une image pour cette collection. (*optionnel)</p>
                        <DropZone multiple={false} setImage={setImage} />
                        <p><a href="#">Comment bien choisir son image ?</a></p>
                    </div>
                </div>

                {/* Référencement */}
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <h2>Référencement</h2>
                        <label>Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliorera l'accessibilité et le référencement de votre boutique. (*optionnel) </label><br></br>
                        <input type="text" name="alt" value={alt} onChange={handleAlt} />
                    </div>
                </div>

            </div>
        </div>
    );
}


export default CreateCollection;
