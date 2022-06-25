import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';



const WithHandleSelectionList = (Component) => (props) => {

    const { variantes, setCheckedVariantesList, selectedVariantesList, setSelectedVariantesList, allOptionsVariantesNeeded } = useContext(AppContext);


    const selectWithAtLeastOneOption = (tmpSelectedList) => {
        console.log('allOptionsVariantesNeeded  ', allOptionsVariantesNeeded)
        if (allOptionsVariantesNeeded == 1) {
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
            tmpSelectedList = [...selectedVariantesList];
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

    // si l'élément a déjà été sélectionné on le retir sinon on l'ajout, ceci coche ou décoche la checkbox. isDelet évite que les variantes soient sélectionnées dans la liste pendant qu'on ajoute des options
    const handleChangeSelectionVariantesList = (value, name) => {
        let index = selectedVariantesList.findIndex(x => x.name == name && x.value == value);
        if (index > -1) {
            let tmpSelectedList = [...selectedVariantesList];
            tmpSelectedList.splice(index, 1);
            setSelectedVariantesList([...tmpSelectedList]);
            selectWithAtLeastOneOption(tmpSelectedList);

        } else {
            let tmpSelectedList = [];

            // si value n'est pas null c'est qu'on a coché une option pour sélectionner les variantes qui ont cette option
            if (value != null) {
                setSelectedVariantesList([...selectedVariantesList, { name: name, value: value }]);
                tmpSelectedList = [...selectedVariantesList, { name: name, value: value }];
            }
            // si value est null c'est qu'on a ajouté une option sans changer la sélection. Donc on a juste besoin de mettre à jour checkedVariantesList après un setVariantes dans optionVariontesList.jsx
            if (value == null) {
                tmpSelectedList = [...selectedVariantesList];
            }
            selectWithAtLeastOneOption(tmpSelectedList);
        }
    };

    console.log('selectedVariantesList   ', selectedVariantesList)
    console.log('variantes   ', variantes)

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


