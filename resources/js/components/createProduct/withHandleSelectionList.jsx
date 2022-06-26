import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';



const WithHandleSelectionList = (Component) => (props) => {

    const { variantes, setCheckedVariantesList, selectedVariantesList, setSelectedVariantesList, allOptionsVariantesNeeded } = useContext(AppContext);


    const selectAllOrOneNeededOptions = (tmpSelectedList) => {
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


    const handleChangeSelectionVariantesList = (value, name) => {

        let tmpSelectedList = [...selectedVariantesList];

        // si alloptionsNeeded on check s'il n'y a pas déjà le type d'option qu'on veut ajouter. si oui on retire dabord l'ancien avant d'ajouter le nouveau 
        if (allOptionsVariantesNeeded === 1) {
            tmpSelectedList.forEach(x => {
                let index = tmpSelectedList.findIndex(x => x.name == name && x.value != value);
                if (index > -1) {
                    tmpSelectedList.splice(index, 1);
                }
            });
        }

        // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox. isDelet évite que les variantes soient sélectionnées dans la liste pendant qu'on ajoute des options
        let index = tmpSelectedList.findIndex(x => x.name == name && x.value == value);
        if (index > -1) {
            tmpSelectedList.splice(index, 1);
            setSelectedVariantesList([...tmpSelectedList]);
            selectAllOrOneNeededOptions(tmpSelectedList);

        } else {
            // si value n'est pas null c'est qu'on a coché une option pour sélectionner les variantes qui ont cette option
            if (value != null) {
                tmpSelectedList = [...tmpSelectedList, { name: name, value: value }];
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
                {...props}
            />
        </div>
    );
};
export default WithHandleSelectionList;


