import React, { useState, useEffect } from 'react';
// import './createProduct_Js.scss';
import GetTypeDetailProduct from './getTypeDetailsProduct';
import Axios from "axios";



const ContainerDetail = (props) => {
    const [listType, setListType] = useState([]);
    const [firstType, setFirstType] = useState();
    const [i, setI] = useState(0);
    const [blockDetail, setBlockDetail] = useState([]);
    const [select0, setSelect0] = useState([]);
    const [select1, setSelect1] = useState([]);
    const [select2, setSelect2] = useState([]);
    const [select3, setSelect3] = useState([]);
    const [select4, setSelect4] = useState([]);
    const [tempcurrentType, setTempCurrentType] = useState('');
    var currentListType = [];
    var selectedTyp = [];
    var selectedTypes = [];


    useEffect(() => {
        // récupére les types de détails de la table type_detail_products pour remplire le select id=selectdetails
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
                setFirstType(res.data[0].name);
                setSelect0(res.data);
                setSelect1(res.data);
                setSelect2(res.data);
                setSelect3(res.data);
                setSelect4(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);



    // delete un détail dans le detailx correspondant à id
    const deleteDetail = (val, id) => {
        var arr = [...blockDetail];
        // renvoi l'index de detailX si il se trouve dans arr
        var index_arr = arr.findIndex(obj => obj.id == id);//id = detailx
        var indexValToDelete = arr[index_arr].detail;
        var key = Object.keys(indexValToDelete).find(key => indexValToDelete[key] === val);

        delete arr[index_arr].detail[key];
        setBlockDetail([...arr]);
    }

    // change le typa dans blockDetail
    const changeType = (detailx, type, prevType) => {
        var arr = [...blockDetail];
        // renvoi l'index de detailX si il se trouve dans arr
        var index_arr = arr.findIndex(obj => obj.id == detailx);//id = detailx
        // met à jour le type dans BlockDetail ex: couleur, taille, poids, ...
        arr[index_arr].type = type;
        setBlockDetail([...arr]);

        // récupère chaque type dans tous les blockDetail déjà créés, Donc on récupère tous les types déjà sélectionnés
        selectedTyp = arr.map(function (el) {
            return el.type;
        });

        // enlève les doublons de selectedTypes, Set ne garde pas les doubles
        selectedTypes = [...new Set(selectedTyp)];


        // console.log('selectedTyp  ' + selectedTypes);


        // met dans currentListType les types qui n'ont pas encore été sélectionnés
        currentListType = listType.filter(item => !selectedTypes.includes(item.name));


        // currentListType.map(item => console.log('types pas sélectionnés  ' + item.name));


        // retire de currentListType l'ancien type sélectionné quand on change de type dans le select
        currentListType.find((item, i) => {
            if (item.name == prevType) {
                delete currentListType[i].item;
            }
        });

        // met à jour first type pour le premier <option></option> du select
        // setFirstType(currentListType[0].name);


        // refreshSelectType(currentListType);


        // suppression des détails inutiles
        var arr = [...blockDetail];
        // renvoi l'index de detailX si il se trouve dans arr
        var index_arr = arr.findIndex((obj => obj.id == detailx)); 
        // supprime tous les éléments de l'objet detail
        arr[index_arr].detail = {};
        setBlockDetail([...arr]);


        // récupération de tous les détails pour les pré-charger dans
        Axios.get(`http://127.0.0.1:8000/detailCompletion`,
            {
                params: {
                    type_detail_name: type,
                }
            }).then((res) => {

                // sauve dans blockDetail chaque détail l'un après l'autre
                Object.entries(res.data).map(item => saveDetail(detailx, type, item[1].libelle));
            });
    }


    // insert les donées de détail dans blockDetail
    const saveDetail = (id, type, libelle) => {
        var arr = [...blockDetail];
        // renvoi l'index de detailX si il se trouve dans arr
        var index_arr = arr.findIndex((obj => obj.id == id));//id = detailx
        // ajout libelle dans la propriété detail de l'objet, count sert à connaitre l'emplacement où inserer le nouveau détail
        let count = Object.keys(arr[index_arr].detail).length;
        arr[index_arr].detail = { ...arr[index_arr].detail, [count]: libelle };
        arr[index_arr].type = type; // ex: couleur, taille, poids, ...

        setBlockDetail([...arr]);
    }


    const addDetailsProduct = (e) => {
        e.preventDefault();
        var detailx = 'detail' + i;

        // récupère chaque type dans tous les blockDetail déjà créés, Donc on récupère tous les types déjà sélectionnés

        selectedTyp = blockDetail.map(function (el) {
            return el.type;
        });
        // enlève les doublons de selectedTypes si il y en a
        selectedTypes = [...new Set(selectedTyp), selectedTyp[blockDetail.length]];

        // met dans currentListType les types qui n'ont pas encore été sélectionnés
        currentListType = listType.filter(item => !selectedTypes.includes(item.name));

        // le length de blockDetail permet d'obtenir l'index du dernier blockDetail créé pour mettre à jour son selectx
        switch (blockDetail.length) {
            case 0:
                setSelect0([...currentListType]);
                break;
            case 1:
                setSelect1([...currentListType]);
                break;
            case 2:
                setSelect2([...currentListType]);
                break;
            case 3:
                setSelect3([...currentListType]);
                break;
            case 4:
                setSelect4([...currentListType]);
                break;
        }


        setBlockDetail([
            ...blockDetail, {
                id: detailx,
                type: currentListType[0].name,
                listTypes: { ...currentListType },
                detail: {}
            }
        ]);
        setI(i + 1);

        // on récupère l'id du select pour obtenir le bon type et on l'envoi à getTypeDetailProduct
        setTempCurrentType(currentListType[0].name);

    }


    // supprime un block de détails
    // idx est = à l'index réel du block_detail "voir return"
    const supp_block_detail = (detailx, idx) => {

        setBlockDetail(prevBlockDetail => (
            prevBlockDetail.filter(detail => detail.id !== detailx)
        ));

        // on boucle à partir de l'index du blockDetail juqu'à la fin pour décaler tous les selectx pour qu'ils correspondent à l'index
        for (let i = idx; i < 4; i++) {

            // récupère chaque type dans tous les blockDetail déjà créés, Donc on récupère tous les types déjà sélectionnés
            selectedTyp = blockDetail.map(function (el) {
                if (el.id !== detailx) return el.type;
            });

            // enlève les doublons de selectedTypes si il y en a
            selectedTypes = [...new Set(selectedTyp), selectedTyp[blockDetail.length]];

            // met dans currentListType les types qui n'ont pas encore été sélectionnés
            currentListType = listType.filter(item => !selectedTypes.includes(item.name));

            // currentListType.map(item => console.log('currentListType ' + item.name));
            // console.log('--------------------------------');
            // on modifie que les selectx qui doivent l'être
            switch (i) {
                case 0:
                    setSelect0([select1[0], ...currentListType]);
                    break;
                case 1:
                    setSelect1([select2[0], ...currentListType]);
                    break;
                case 2:
                    setSelect2([select3[0], ...currentListType]);
                    break;
                case 3:
                    setSelect3([select4[0], ...currentListType]);
                    break;
            }
        }



        for (let i = 0; i < idx; i++) {

            // récupère chaque type dans tous les blockDetail déjà créés, Donc on récupère tous les types déjà sélectionnés
            selectedTyp = blockDetail.map(function (el) {
                if (el.id !== detailx) return el.type;
            });

            // enlève les doublons de selectedTypes si il y en a
            selectedTypes = [...new Set(selectedTyp), selectedTyp[blockDetail.length]];

            // met dans currentListType les types qui n'ont pas encore été sélectionnés
            currentListType = listType.filter(item => !selectedTypes.includes(item.name));

            currentListType.map(item => console.log('currentListType ' + item.name));
            console.log('--------------------------------');

            blockDetail.map(el => console.log(el.type));

            // on modifie que les selectx qui doivent l'être
            switch (i) {
                case 0:
                    setSelect0([select0[0], ...currentListType]);
                    break;
                case 1:
                    setSelect1([select1[0], ...currentListType]);
                    break;
                case 2:
                    setSelect2([select2[0], ...currentListType]);
                    break;
                case 3:
                    setSelect3([select3[0], ...currentListType]);
                    break;
                case 4:
                    setSelect3([select4[0], ...currentListType]);
                    break;
            }
        }

        // refreshSelectType(currentListType);
    };

    const refreshSelectType = (currentListType) => {
        // met à jour le select de chaque detailX en gardant comme premier de la liste le type déjà présent dans blockDetail[j].type
        var selectX = [];
        for (let j = 0; j < blockDetail.length; j++) {

            let trueType = blockDetail[j].type;
            selectX = [{ "name": trueType }, ...currentListType];

            switch (j) {
                case 0:
                    setSelect0([...selectX]);
                    break;
                case 1:
                    setSelect1([...selectX]);
                    break;
                case 2:
                    setSelect2([...selectX]);
                    break;
                case 3:
                    setSelect3([...selectX]);
                    break;
                case 4:
                    setSelect4([...selectX]);
                    break;
            }
        }
    }


    useEffect(() => {
        props.setDataDetail([...blockDetail]);
    }, [blockDetail]);

    return (
        <div className="detailsProduct">

            {Object.keys(blockDetail).map((option, index) => <GetTypeDetailProduct
                key={index}
                idx={index}
                id={blockDetail[index]['id']}
                listTypes={index == 0 ? select0 : index == 1 ? select1 : index == 2 ? select2 : index == 3 ? select3 : index == 4 ? select4 : null}
                firstType={firstType}
                supp_block_detail={supp_block_detail}
                saveDetail={saveDetail}
                changeType={changeType}
                deleteDetail={deleteDetail}
                currentType={tempcurrentType}
            />)}

            {blockDetail.length <= 4 && (<button className="btn-submit" onClick={(e) => addDetailsProduct(e)}>Ajouter une option</button>)}

        </div>
    )
}

export default ContainerDetail;