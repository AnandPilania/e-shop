import { React, useState, useEffect } from 'react';
import ConditionCollection from './conditionCollection';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const CreateCollection = () => {
    const [conditions, setConditions] = useState([{
        parameter: 'Titre du produit',
        operator: 'contient',
        value: ''
    }]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        // chargement des collections
        axios.get(`http://127.0.0.1:8000/getCategories`)
            .then(res => {
                setCategories(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
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

    const handleChangeValue = (e, index) => {
        let tmp_conditions = [...conditions];
        tmp_conditions[index].value = e.target.value;
        setConditions(tmp_conditions);
    }


    const ckEditorOnChange = (sheet) => {
        // setTechnicalSheet(sheet);
    }
    // var obj = JSON.stringify(dataDetail);

    return (
        <div className="collection-main-container">
            <div className="collection-block-container">
                <div className="div-vert-align">
                    <div className="div-label-inputTxt">
                        <label htmlFor='titreCollection'>Nom de la collection</label>
                        <input type='text' id='titreCollection' placeholder='ex. Robes, Opération déstockage, Collection hiver' />
                    </div>
                    <div className="div-label-inputTxt">
                        <label htmlFor='descriptionCollection'>Description (optionnel)</label>

                    </div>
                    <CKEditor
                            editor={ClassicEditor}
                            data=""
                            onReady={editor => {
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

                    <div className="div-label-inputTxt">
                        <label htmlFor='category'>Catégorie</label>
                        <select id='category'>
                            <option>Attribuer une catégorie à cette collection. (optionnel)</option>
                            {categories.map((category, index) => (<option key={index} value={category.id}>{category.name}</option>))}
                        </select>
                        <p><a href='#'>Plus d'informations sur les catégories.</a></p>
                    </div>



                </div>
                <div className="div-vert-align">
                    <h2>Type de collection</h2>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio' name="typeCondition" id='manuel' checked />
                            <label htmlFor='manuel'>Manuel</label>
                        </div>
                        <p>Ajouter un produit à la fois dans cette collection. <a href='#'>Plus d'informations sur les collections manuelles.</a></p>
                    </div>
                    <div className="sub-div-vert-align">
                        <div className="div-radio-label">
                            <input type='radio' name="typeCondition" id='Automatise' />
                            <label htmlFor='Automatise'>Automatisé</label>
                        </div>
                        <p>Ajouter automatiquement les produits lorsqu'ils correspondent aux règles définies. Y compris les produits déjà ajoutés. <a href='#'>Plus d'informations sur les collections automatisées.</a></p>
                    </div>
                </div>
                <div className="div-vert-align">
                    <h2>Critères</h2>
                    <h4>Définissez une ou plusieurs règles. Seuls les produits correspondants à vos règles seront intégrés dans cette collection. ex. Prix du produit est inférieur à 50 €, Titre du produit contient Robe.</h4>
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
            </div>
        </div>
    );
}


export default CreateCollection;
