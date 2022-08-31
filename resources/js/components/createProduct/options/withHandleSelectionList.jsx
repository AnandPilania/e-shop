import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';



const WithHandleSelectionList = (Component) => (props) => {

    const [isAllSelectedCheckbox, setIsAllSelectedCheckbox] = useState(false);

    const { variantes, setCheckedVariantesList, selectedVariantesList, setSelectedVariantesList, allOptionsVariantesNeeded } = useContext(AppContext);


    const selectAllOrOneNeededOptions = (tmpSelectedList) => {
        // si on coche toute les checkbox alors il faut setCheckedVariantesList avec toute les variantes pour que lorsqu'on delete une variantes de la lite toute les checkbox restent cochées
        if (isAllSelectedCheckbox) {
            let tmp_tab = [];
            for (let i = 0; i < variantes.length; i++) {
                tmp_tab.push(variantes[i].id);
            }
            setCheckedVariantesList([...tmp_tab]);
        } else {
            // select at least One needed
            if (allOptionsVariantesNeeded == 0) {
                let tmp_tab = [];
                for (let i = 0; i < variantes.length; i++) {
                    for (let j = 0; j < tmpSelectedList.length; j++) {
                        if (variantes[i].options[tmpSelectedList[j].name] == tmpSelectedList[j].value) {

                            if (tmp_tab.indexOf(variantes[i].id) == -1) {
                                tmp_tab.push(variantes[i].id);
                            }
                        }
                    }
                }
                setCheckedVariantesList([...tmp_tab]);

            } else {
                // select ALL needed
                let tmp_tab = [];
                for (let i = 0; i < variantes.length; i++) {
                    let count = 0;
                    for (let j = 0; j < tmpSelectedList.length; j++) {

                        if (variantes[i].options[tmpSelectedList[j].name] == tmpSelectedList[j].value) {
                            count++;
                            if (count == tmpSelectedList.length) {

                                if (tmp_tab.indexOf(variantes[i].id) == -1) {
                                    tmp_tab.push(variantes[i].id);
                                }
                            }
                        }
                    }
                }
                setCheckedVariantesList([...tmp_tab]);
            }
        }

    }


    const handleChangeSelectionVariantesList = (value, idValues_Names) => {
        let tmpSelectedList = [...selectedVariantesList];
        // si alloptionsNeeded est true alors on check s'il le type d'option qu'on veut ajouter n'est pas déjà présent dans selectedVariantesList. si oui on retire dabord l'ancien avant d'ajouter le nouveau 
        if (allOptionsVariantesNeeded === 1) {
            tmpSelectedList.forEach(x => {
                let index = tmpSelectedList.findIndex(x => x.name == idValues_Names && x.value != value);
                if (index > -1) {
                    tmpSelectedList.splice(index, 1);
                }
            });
        }

        // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox. 
        let index = tmpSelectedList.findIndex(x => x.name == idValues_Names && x.value == value);
        if (index > -1) {
            tmpSelectedList.splice(index, 1);
            setSelectedVariantesList([...tmpSelectedList]);
            selectAllOrOneNeededOptions(tmpSelectedList);

        } else {
            // si value n'est pas null c'est qu'on a coché une option pour sélectionner les variantes qui ont cette option
            if (value != null) {
                tmpSelectedList = [...tmpSelectedList, { name: idValues_Names, value: value }];
                setSelectedVariantesList([...tmpSelectedList]);
            }
            // si value est null c'est qu'on a ajouté une option sans changer la sélection. Donc on a juste besoin de mettre à jour checkedVariantesList après un setVariantes dans optionVariontesList.jsx
            if (value == null) {
                tmpSelectedList = [...tmpSelectedList];
            }
            selectAllOrOneNeededOptions(tmpSelectedList);
        }
    };


    return (
        <div>
            <Component
                handleChangeSelectionVariantesList={handleChangeSelectionVariantesList}
                isAllSelectedCheckbox={isAllSelectedCheckbox}
                setIsAllSelectedCheckbox={setIsAllSelectedCheckbox}
                {...props}
            />
        </div>
    );
};
export default WithHandleSelectionList;


