import { React, useState } from 'react';
import ConditionCollection from './conditionCollection';


const CreateCollection = () => {

    const [conditions, setConditions] = useState([{
        parameter: 'first',
        operator: 'first',
        value: 'first'
    }]);

    var lastCondition = conditions.slice(-1)[0];
    // console.log(lastCondition);
    // console.log(conditions);

    const addCondition = () => {
        setConditions([
            ...conditions, {
                id: 0,
                parameter: 'Type du produit',
                operator: 'op',
                value: 'val'
            }
        ]);
    }



    return (
        <div className="main-container">
            <div className="div-vert-align">
                <label htmlFor='titreCollection'>Titre</label>
                <input type='text' id='titreCollection' placeholder='ex. Robes, Opération déstockage, Collection hiver' />

                <label htmlFor='descriptionCollection'>Description (facultatif)</label>
                <input type='text' id='descriptionCollection' placeholder='ex. Robes, Opération déstockage, Collection hiver' />
            </div>
            <div className="div-vert-align">
                <h2>Type de collection</h2>
                <div className="sub-div-vert-align">
                    <div className="div-radio-label">
                        <input type='radio' name="typeCondition" id='manuel' />
                        <label htmlFor='manuel'>Manuel</label>
                    </div>
                    <p>Insertion des produits dans cette collection un à la fois. <a>Plus d'infos sur les collections manuelles.</a></p>
                </div>
                <div className="sub-div-vert-align">
                    <div className="div-radio-label">
                        <input type='radio' name="typeCondition" id='Automatise' />
                        <label htmlFor='Automatise'>Automatisé</label>
                    </div>
                    <p>Ajout automatique dans la collection de tous les produits, présents et à venir, lorsqu'ils correspondent aux critères définis. <a>Plus d'infos sur les collections automatisées.</a></p>
                </div>
            </div>
            <div className="div-vert-align">
                <h2>Critères</h2>
                <h4>Les produits doivent correspondre à :</h4>
                <div className="sub-div-horiz-align">
                    <div className="div-radio-label">
                        <input type='radio' name="condition" id='allConditions' />
                        <label htmlFor='allConditions'>Touts les conditions</label>
                    </div>
                    <div className="div-radio-label">
                        <input type='radio' name="condition" id='leastOnConditions' />
                        <label htmlFor='leastOnConditions'>au moins une condition</label>
                    </div>
                </div>
                <div className="sub-div-vert-align">
                    {conditions.map((item, i) => (<ConditionCollection condition={item} key={i} />))}
                    <button onClick={addCondition}>Ajouter un condition</button>
                </div>
            </div>
        </div>
    );
}


export default CreateCollection;
