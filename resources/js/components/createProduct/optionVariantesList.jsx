import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Tooltip from '../elements/tooltip';


const OptionVariantesList = () => {

    const [variantes, setVariantes] = useState([]);

    const { optionsObj, productPrice, previousProductPrice, productStock } = useContext(AppContext);

    useEffect(() => {
        let allValuesAsString = [];

        // renvoi toutes les combinaisons possible des différentes options
        for (let i = 0; i < optionsObj.length - 1; i++) {
            if (i === 0) {
                allValuesAsString = optionsObj[i].values.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            } else {
                allValuesAsString = allValuesAsString.flatMap(d => optionsObj[i + 1].values.map(v => d + ' / ' + v));
            }
        }

        // récupère tous les noms d'option pour les associer à leur values dans un objet
        let optionsName = optionsObj.map(x => x.name);

        let variantesAsString = [];
        for (let i = 0; i < allValuesAsString.length; i++) {

            // split les values de optionsObj pour les récupérer séparements et les associer à leur option Name dans un objet
            let tmp = allValuesAsString[i].split(',')
            let valuesSplited = tmp[0].split(' / ');

            let variantesOptions = {};
            for (let j = 0; j < optionsName.length; j++) {
                variantesOptions[optionsName[j]] = valuesSplited[j];
            }

            variantesAsString.push({
                id: i,
                variantesAsString: allValuesAsString[i],
                options: variantesOptions,
                price: productPrice,
                prev_price: previousProductPrice,
                stock: productStock
            })
        }

        setVariantes(variantesAsString);
    }, [optionsObj]);


    console.log('variantes  ', variantes)


    const handleVariantetPrice = (e) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == e.target.id);
        if (ndx > -1) {
            tmp_variantes[ndx].price = e.target.value
        }
        setVariantes([...tmp_variantes]);
    }

    // stock --------------------------
    const [unlimited2, setUnlimited2] = useState(true);
    const [placeholder2, setPlaceholder2] = useState(String.fromCharCode(0x221E));

    const handleProductStock2 = (e) => {
        let tmp_variantes = [...variantes];
        let ndx = tmp_variantes.findIndex(x => x.id == e.target.id);
        if (ndx > -1) {
            tmp_variantes[ndx].stock = e.target.value;
        }
        setVariantes([...tmp_variantes]);
    }

    const handleProductStockOnFocus2 = (e) => {
        let unlimitedStockCheckbox = document.getElementById('unlimitedStockCheckbox' + e.target.id);
        unlimitedStockCheckbox.checked = false;

        if (unlimited2) {
            setUnlimited2(!unlimited2);  
            
            // <-----------------------------------UNLIMITED ET PLACEHOLDER DOIVENT ÊTRE DNS LE STATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            setPlaceholder2('0');
            let inputStock = document.getElementById('inputStock' + e.target.id);
            inputStock.style.backgroundColor = 'white';
        }
    }

    const handleUnlimitedStock2 = (e, id) => {
        console.log('id  ', id)
        console.log('e.target  ', e.target)
        if (!unlimited2) {
            let inputStock = document.getElementById('inputStock' + id);
            inputStock.style.backgroundColor = '#f1f5f9';
            setUnlimited2(!unlimited2);

            let tmp_variantes = [...variantes];
            let ndx = tmp_variantes.findIndex(x => x.id == id);
            if (ndx > -1) {
                tmp_variantes[ndx].stock = '';
            }
            setVariantes([...tmp_variantes]);
            setPlaceholder2(String.fromCharCode(0x221E));
        } else {
            let inputStock = document.getElementById('inputStock' + id);
            inputStock.style.backgroundColor = 'white';
            setUnlimited2(!unlimited2);
            let tmp_variantes = [...variantes];
            let ndx = tmp_variantes.findIndex(x => x.id == id);
            if (ndx > -1) {
                tmp_variantes[ndx].stock = '';
            }
            setVariantes([...tmp_variantes]);
            setPlaceholder2('0');
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
            {variantes?.length > 0 && variantes.map((item, index) =>
                <div
                    key={index}
                    className="w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_50px_50px_150px_50px_30px] justify-start items-start mb-[10px] relative"
                >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis cursor-default group">
                        {item.variantesAsString}
                        <Tooltip top={15} left={5}>
                            {item.variantesAsString}
                        </Tooltip>
                    </span>

                    <input
                        id={item.id}
                        type="number"
                        step=".01"
                        onChange={handleVariantetPrice}
                        value={item.price != '' ? item.price : 0}
                        placeholder2="0.00"
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
                            value={item.stock}
                            placeholder2={placeholder2}
                            className="w-full h-[40px] border border-slate-400 rounded-4 pl-[10px] mb-[30px] mt-1 bg-slate-100"
                            id={`inputStock${item.id}`}
                            min="0" max="9999999999"
                            onClick={handleProductStockOnFocus2}
                        />
                        <span
                            className='flex flex-rox justify-start items-center h-[40px] border-y-[1px] border-r-[1px]  border-slate-400 rounded-4 px-[10px] mb-[30px] mt-1 cursor-pointer caret-transparent brd-red-2'
                            onClick={(e) => handleUnlimitedStock2(e, item.id)}>
                            <input
                                className='mr-[7px] caret-transparent'
                                id={`unlimitedStockCheckbox${item.id}`}
                                type="checkbox" checked={unlimited2} onChange={(e) => handleUnlimitedStock2(e, item.id)} />
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
