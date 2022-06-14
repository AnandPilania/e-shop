import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Tooltip from '../elements/tooltip';


const OptionVariantesList = () => {

    const [variantes, setVariantes] = useState([]);

    const { optionsObj, productPrice, previousProductPrice, productStock, unlimited, placeholder } = useContext(AppContext);

    useEffect(() => {
        let allValuesAsString = [];

        // renvoi toutes les combinaisons possible des différentes options ex:
        // 0: "Bleu / S"
        // 1: "Bleu / M"
        // 2: "Rouge / S"
        // 3: "Rouge / M"
        for (let i = 0; i < optionsObj.length - 1; i++) {
            if (i === 0) {
                allValuesAsString = optionsObj[i].values.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            } else {
                allValuesAsString = allValuesAsString.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            }
        }
        console.log('allValuesAsString  ', allValuesAsString)
        console.log('optionsObj  ', optionsObj)
        // récupère tous les noms d'option pour les associer à leur values dans un objet
        let optionsName = optionsObj.map(x => x.name);

        let variantesAsString = [...variantes];
        for (let i = 0; i < allValuesAsString.length; i++) {

            // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet "destiné pour le back-end !" ex:
            // Couleur: "Rouge"
            // Taille: "M"
            let tmp = allValuesAsString[i].split(',')
            let valuesSplited = tmp[0].split(' / ');
            let variantesOptions = {};
            for (let j = 0; j < optionsName.length; j++) {
                variantesOptions[optionsName[j]] = valuesSplited[j];
            }
            console.log('allValuesAsString[i] splice  ', allValuesAsString[i].substring(0, allValuesAsString[i].lastIndexOf(' / ')));
            let mystring = allValuesAsString[i].substring(0, allValuesAsString[i].lastIndexOf(' / '));
            console.log(allValuesAsString[i].startsWith(mystring))

            console.log('variantesOptions  ', variantesOptions)
            // si il y a eu une modif alors persist = true
            // si persist = true alors ??
            // ou bien on récupère toutes les rows qui ont été modifiées et on applique leurs changements à toutes les nouvelles rows qui commence par les meêmes allValuesAsString[i] que celles qui les avaient avant l'ajout de la nouvelle option
            variantesAsString.push({
                id: i,
                persist: false,
                variantesAsString: allValuesAsString[i],
                options: variantesOptions,
                price: productPrice,
                prev_price: previousProductPrice,
                stock: productStock,
                unlimited: variantes[i]?.unlimited,
                placeholder: placeholder
            })
        }

        // si un des optionsObj.values est vide alors allValuesAsString sera vide aussi même si d'autres optionsObj.values ne le sont pas
        // évite la disparition de la liste des combinaisons d'options tant qu'un optionsObj.values est vide  
        let can_I_SetVariantes = optionsObj.findIndex(x => x.values.length == 0);
        if (can_I_SetVariantes == -1) {
            setVariantes(variantesAsString);
        }

    }, [optionsObj]);





    const handleVariantes = (id, field, data) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == id);
        if (ndx > -1) {
            tmp_variantes[ndx][field] = data;
        }
        setVariantes([...tmp_variantes]);
    }


    const handleVariantetPrice = (e) => {
        handleVariantes(e.target.id, 'price', e.target.value);
    }

    // stock --------------------------
    const handleProductStock2 = (e) => {
        handleVariantes(e.target.id, 'stock', e.target.value);
    }

    const handleProductStockOnFocus2 = (e, id) => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox' + id);
        unlimitedStockCheckbox.checked = false;

        if (unlimited) {

            handleVariantes(id, 'unlimited', !e.target.unlimited);

            handleVariantes(id, 'stock', '');

            handleVariantes(id, 'placeholder', '0');

            // setPlaceholder2('0');
            let inputStock = document.getElementById('inputStock' + id);
            inputStock.style.backgroundColor = 'white';
        }
    }

    const handleUnlimitedStock2 = (e, id) => {
        console.log('unlimited  ', unlimited)
        if (unlimited) {
            let inputStock = document.getElementById('inputStock' + id);
            inputStock.style.backgroundColor = 'white';

            handleVariantes(id, 'unlimited', !e.target.unlimited);

            handleVariantes(id, 'stock', '');

            handleVariantes(id, 'placeholder', '0');
        } else {
            let inputStock = document.getElementById('inputStock' + id);
            inputStock.style.backgroundColor = '#f1f5f9';

            handleVariantes(id, 'unlimited', !e.target.unlimited);

            handleVariantes(id, 'stock', '');

            handleVariantes(id, 'placeholder', String.fromCharCode(0x221E));
        }
    }

    // -------------------------- stock

    return (
        <div>
            {variantes?.length > 0 &&
                <div className="w-full h-auto grid gap-x-4 gap-y-4 grid-cols-[1fr_50px_50px_150px_50px_30px] justify-start items-center border-b-[1px] border-slate-200 mb-[15px]">
                    <span>Variante</span>
                    <span>Prix</span>
                    <span>Promo</span>
                    <span>Stock</span>
                    <span>img</span>
                    <span>del</span>
                </div>}
            {console.log('variantes --> ', variantes)}
            {variantes?.length > 0 && variantes.map((item, index) =>
                <div
                    key={index}
                    className="w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_50px_50px_150px_50px_30px] justify-start items-start mb-[10px] relative"
                >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis cursor-default group">
                        {item?.variantesAsString}
                        <Tooltip top={15} left={5}>
                            {item?.variantesAsString}
                        </Tooltip>
                    </span>

                    <input
                        id={item?.id}
                        type="number"
                        step=".01"
                        onChange={handleVariantetPrice}
                        value={item?.price != '' ? item?.price : 0}
                        placeholder="0.00"
                        min="0"
                        max="9999999999"
                        className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1"
                    />

                    <span>{previousProductPrice != '' ? previousProductPrice : 0}</span>

                    {/* stock */}
                    <div
                        className='flex flex-rox justify-start items-center'>
                        <input
                            type="number"
                            onChange={handleProductStock2}
                            value={item?.stock}
                            placeholder={item?.placeholder}
                            className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1 bg-slate-100"
                            id={`inputStock${item?.id}`}
                            min="0" max="9999999999"
                            onClick={((e) => handleProductStockOnFocus2(e, item?.id))}
                        />
                        <span
                            className='flex flex-rox justify-start items-center h-[40px] border-y-[1px] border-r-[1px]  border-slate-400 rounded-4 px-[10px] mb-[30px] mt-1 cursor-pointer caret-transparent brd-red-2'
                            onClick={(e) => handleUnlimitedStock2(e, item?.id)}>
                            <input
                                className='mr-[7px] caret-transparent'
                                id={`unlimitedStockCheckbox${item?.id}`}
                                type="checkbox" checked={item?.unlimited} onChange={(e) => handleUnlimitedStock2(e, item?.id)} />
                            <label
                                className='cursor-pointer caret-transparent'>
                                Illimité
                            </label>
                        </span>
                    </div>


                    <span>image</span>
                    <span>delete</span>
                </div>
            )}
        </div>
    );
}

export default OptionVariantesList;
