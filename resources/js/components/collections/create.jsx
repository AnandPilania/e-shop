import { React, useState, useEffect } from 'react';
import ConditionCollection from './conditionCollection';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios';
import DropZone from '../tools/dropZone';

const CreateCollection = () => {
    const [conditions, setConditions] = useState([{
        parameter: 'Titre du produit',
        operator: 'contient',
        value: ''
    }]);
    const [isToggleOn, setIsToggleOn] = useState(true);
    const [includePrevProduct, setIncludePrevProduct] = useState(true);
    const [categories, setCategories] = useState([]);
    const [datetimeField, setDatetimeField] = useState();


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
    }, []);

    // var lastCondition = conditions.slice(-1)[0];

    const addCondition = () => {
        setConditions([
            ...conditions, {
                parameter: 'Titre du produit',
                operator: 'contient',
                value: ''
            }
        ]);
    }

    console.log(conditions);

    const handleChangeParam = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].parameter = e.target.value;
        setConditions(tmp_conditions);
    }

    const handleChangeOperator = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].operator = e.target.value;
        setConditions(tmp_conditions);
    }
    console.log(conditions);
    const handleChangeValue = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].value = e.target.value;
        setConditions(tmp_conditions);
    }

    // const buildQuery = () => {
    //     conditions.forEach(obj => (

    //     ))
    // }


    const ckEditorOnChange = (sheet) => {
        // setTechnicalSheet(sheet);
    }
    // var obj = JSON.stringify(dataDetail);

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

    return (
        <div className="collection-main-container">
            <div className="collection-block-container">
                <div className="div-vert-align">
                    {/* nom */}
                    <div className="div-label-inputTxt">
                        <h2>Nom de la collection</h2>
                        <input type='text' id='titreCollection' placeholder='ex. Robes, Opération déstockage, Collection hiver' />
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
                        }}
                        onChange={(event, editor) => {
                            const sheet = editor.getData();
                            ckEditorOnChange(sheet);
                            console.log({ event, editor, sheet });
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
                    <h4>Définissez une ou plusieurs règles. Ex. Prix du produit est inférieur à 50 €, Titre du produit contient Robe, etc. Seuls les produits correspondants à vos règles seront intégrés dans cette collection. </h4>
                    <div className="sub-div-horiz-align">
                        <div className="div-radio-label">
                            <input type='radio' name="condition" id='allConditions' checked />
                            <label htmlFor='allConditions'>Les produits doivent répondre à toutes les conditions</label>
                        </div>
                        <div className="div-radio-label">
                            <input type='radio' name="condition" id='leastOnConditions' />
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
            </div>

            {/* side */}
            <div className='side-create-collection'>
                <div className="div-vert-align">
                    {/* Date d'activation */}
                    <div className="div-label-inputTxt">
                        <h2>Activation</h2>
                        <p>Date d'activation.</p>
                        <input id="activationDate" type="datetime-local" value={datetimeField} onChange={handleDateChange} />
                        <p><a href='#'>Plus d'informations sur l'activation des collections.</a></p>
                    </div>
                </div>
                <div className="div-vert-align">
                    {/* catégorie */}
                    <div className="div-label-inputTxt">
                        <h2>Catégorie</h2>
                        <p>Attribuer une catégorie à cette collection. (<strong>*optionnel</strong>)</p>
                        <select id='category' placeholder={'yes'}>
                            <option value="none">Aucune catégorie</option>
                            {categories.map((category, index) => (<option key={index} value={category.id}>{category.name}</option>))}
                        </select>
                        <p><a href='#'>Plus d'informations sur les catégories.</a></p>
                    </div>
                </div>
                <div className="div-vert-align">
                    {/* image */}
                    <div className="div-label-inputTxt">
                        <h2>Image</h2>
                        <p>Ajouter une image pour cette collection. (*optionnel)</p>
                        <DropZone multiple={false} />
                        <p><a href="#">Comment bien choisir son image ?</a></p>
                    </div>
                </div>
                <div className="div-vert-align">
                    {/* Référencement */}
                    <div className="div-label-inputTxt">
                        <h2>Référencement</h2>
                        <label>Ajouter une brève description de l'image ex. "Jeans noir avec fermeture éclair". Ceci améliorera l'accessibilité et le référencement de votre boutique. (*optionnel) </label><br></br>
                        <input type="text" name="alt" />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default CreateCollection;
