import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';


const OptionVariantesList = () => {

    const [variantes, setVariantes] = useState([]);

    const { optionsObj, productPrice, previousProductPrice, productStock } = useContext(AppContext);

    useEffect(() => {
        let allValuesAsString = [];

        // renvoi toutes les combinaisons possible des différentes options
        for (let i = 0; i < optionsObj.length - 1; i++) {
            if (i === 0) {
                allValuesAsString = optionsObj[i].values.flatMap(d => optionsObj[i + 1].values.map(v => d + '-' + v));
            } else {
                allValuesAsString = allValuesAsString.flatMap(d => optionsObj[i + 1].values.map(v => d + '-' + v));
            }
        }

        // récupère tous les noms d'option pour les associer à leur values dans un objet
        let optionsName = optionsObj.map(x => x.name);

        let tmp_variantes = [];
        for (let i = 0; i < allValuesAsString.length; i++) {

            // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet
            let tmp = allValuesAsString[i].split(',')
            let valuesSplited = tmp[0].split('-');

            let variantesOptions = {};
            for (let j = 0; j < optionsName.length; j++) {
                variantesOptions[optionsName[j]] = valuesSplited[j];
            }

            tmp_variantes.push({
                tmp_variantes: allValuesAsString[i],
                options: variantesOptions,
            })

            // console.log('tmp_variantes  ', tmp_variantes);
        }

        setVariantes(tmp_variantes);
    }, [optionsObj]);


console.log('variantes  ', variantes)

    // const getAllVariantes = () => {

    //     var allValuesAsString = [];

    //     for (let i = 0; i < optionsObj.length - 1; i++) {
    //         if(i === 0) {
    //             allValuesAsString = optionsObj[i].values.flatMap(d => optionsObj[i + 1].values.map(v => d + '/' + v));
    //         } else {
    //             allValuesAsString = allValuesAsString.flatMap(d => optionsObj[i + 1].values.map(v => d + '/' + v));
    //         }
    //     }

    //     console.log('allValuesAsString   ', allValuesAsString);
    // }

    return (
        <div>
            {variantes && variantes.map((item, index) =>
                <div
                key={index}
                className="w-full h-auto grid gap-x-4 gap-y-2 grid-cols-6 justify-start items-center">
                    <span>{item.tmp_variantes}</span>
                    <span>{productPrice != '' ? productPrice : 0}</span>
                    <span>{previousProductPrice != '' ? previousProductPrice : 0}</span>
                    <span>{productStock}</span>
                    <span>image</span>
                    <span>delete</span>
                </div>
        )}


            <button
                // onClick={getAllVariantes}
                className="h-[40px] px-[10px] border border-slate-200">
                show variantes
            </button>

        </div>
    );
}

export default OptionVariantesList;
