import React, { useState, useEffect } from 'react';
import './createProduct_Js.scss';
import AddDetail from './addDetail';
import SelectType from './select';
import Axios from "axios";



const GetTypeDetailProduct = (props) => {

  const [type, setType] = useState('');
  const [input_detail, setInput_detail] = useState('');
  const [tab_details, setTab_details] = useState([]);

  // charge les données de détails pour les afficher et si <GetTypeDetailProduct /> est appelé depuis containerDetailEdit alors on ne doit pas sauvegarder avec saveDetail les détails car ils sont déjà enregistrés dans containerDetailEdit dans le useEffect
  useEffect(() => {
    // initialise type avec la premiere valeur de champ select du type
    setType(props.firstType);
    // vide tab_details si besoin 
    setTab_details([]);

    let temp_setTab_details = [];
    props.details && Object.entries(props.details).map(item => temp_setTab_details = ([...temp_setTab_details, item[1]]));

    setTab_details([...temp_setTab_details]);


    // sauve dans blockDetail chaque détail l'un après l'autre
    if (!props.fromEditProduct) {
      props.details && Object.entries(props.details).map(item => props.saveDetail(props.id, props.currentType, item[1]));
    }

  }, []);


  // !!!!!!!!!!!!!!!!!!!!!!! REACTIVER ICI !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    // récupération de tous les détails pour les pré-charger dans
    if (props.currentType) {
      Axios.get(`http://127.0.0.1:8000/detailCompletion`,
        {
          params: {
            type_detail_name: props.currentType,
          }
        }).then((res) => {
          let temp_setTab_details = [];
          Object.entries(res.data).map(item => temp_setTab_details = ([...temp_setTab_details, item[1].libelle]));

          setTab_details([...temp_setTab_details]);

          // sauve dans blockDetail chaque détail l'un après l'autre
          Object.entries(res.data).map(item => props.saveDetail(props.id, props.currentType, item[1].libelle));
        });
    }

  }, []);


  // gère l'input et met dans tab_details les nouveaux détails
  const handleChange = (e, id) => {

    // check si la denière lettre entrée est != à ',' et met à jour input_detail
    if (e.target.value[e.target.value.length - 1] != ',') {
      setInput_detail(e.target.value);
    } else {
      // met dans val la value de l'input sans le dernier caractère qui est une virgule ou autre
      var val = e.target.value.substring(0, e.target.value.length - 1);
      // met à jour tab_details en ajoutant un nouveau détail 
      setTab_details([...tab_details, val]);
      // vide l'input
      setInput_detail('');

      // on récupère l'id du select pour obtenir le bon type
      let currentType = document.getElementById(id + "type").value

      // savegarde des détails dans blockDetail dans le fichier containerDetail
      props.saveDetail(id, currentType, val);
    }
  };

  // supprime un détail 
  const remouveDetail = (e, val, detailx) => {
    var tab_detailsTab = [...tab_details];
    // si le détail se trouve dans tab_details alors on le delete avec splice
    var index = tab_detailsTab.indexOf(val);
    if (index !== -1) {
      tab_detailsTab.splice(index, 1);
      setTab_details([...tab_detailsTab]);
    }
    e.preventDefault();
    props.deleteDetail(val, detailx);
  }

  // supprime tous les détails lorsqu'on supprime un block de détails 
  const remouveAllDetail = (e) => {
    setTab_details([]);
    e.preventDefault();
    props.supp_block_detail(props.id, props.idx)
  }

  // récupère le type de critère ex: couleur, taille, ...
  // et envoi le nouveau type à blockDetail pour le mettre à jour
  const handleType = (e) => {

    setTab_details([]);

    // récupération de tous les détails pour les pré-charger dans
    Axios.get(`http://127.0.0.1:8000/detailCompletion`,
      {
        params: {
          type_detail_name: e.target.value,
        }
      }).then((res) => {
        let temp_setTab_details = [];
        res.data.map(item => temp_setTab_details = ([...temp_setTab_details, item.libelle]));

        setTab_details([...temp_setTab_details]);
      });

    var prevType = type;
    setType(e.target.value);
    props.changeType(props.id, e.target.value, prevType);
  }

  return (
    <div className="main_div">
      <div className="list_div">

        <span className="supp_block_detail" onClick={remouveAllDetail}>Supprimer</span>
        <br />

        <SelectType listTypes={props.listTypes} id={props.id} handleType={handleType} type={type} selectedType={props.selectedType} />

      </div>

      <div className="new_detail_div">
        {tab_details.map((detail, index) => <AddDetail key={index + '_' + detail} id={props.id} detail={detail} remouveDetail={remouveDetail} />)}
      </div>

      <input type="text" className="input_detail" value={input_detail} onChange={(e) => handleChange(e, props.id)} />
    </div>
  )
}

export default GetTypeDetailProduct;