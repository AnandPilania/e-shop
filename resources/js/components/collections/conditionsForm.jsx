import * as React from 'react';
import { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import withHandleConditions from './withHandleConditions';
import ConditionCollection from './conditionCollection';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import { getParameter, getOperator } from './conditionsFunctions';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SyncDisabled } from '@material-ui/icons';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const ConditionsForm = ({ 
  handleChangeParam,
  handleChangeOperator,
  handleChangeValue,
  addCondition,
  deleteCondition}) => {

  const [value, setValue] = useState(0);

  const { conditions, setConditions, setTypeOperationListCollections, warningIdCondition, setIsAutoConditions, showModalSimpleMessage, setShowModalSimpleMessage, messageModal, setMessageModal, imageModal, setDsablNamProd, setDsablType, setDsablSuppl, setDsablPrice, setDsablTag, setDsablBeforePromo, setDsablWeight, setDsablStock, setDsablDate } = useContext(AppContext);

  var p = '3';

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTypeOperationListCollections(newValue);
  };


  // // gère l'affichage et le disable des paramètres des conditions
  // const handleDisableParam = () => {
  //   // disable un parameter quand il a déjà été utilisé avec l'operator "est égale à"
  //   setDsablNamProd(false);
  //   setDsablType(false);
  //   setDsablSuppl(false);
  //   setDsablPrice(false);
  //   setDsablTag(false);
  //   setDsablBeforePromo(false);
  //   setDsablWeight(false);
  //   setDsablStock(false);
  //   setDsablDate(false);
  //   conditions.forEach(x => {
  //     switch (x.parameter + x.operator) {
  //       case '11': setDsablNamProd(true); break;
  //       case '21': setDsablType(true); break;
  //       case '31': setDsablSuppl(true); break;
  //       case '41': setDsablPrice(true); break;
  //       case '51': setDsablTag(true); break;
  //       case '61': setDsablBeforePromo(true); break;
  //       case '71': setDsablWeight(true); break;
  //       case '81': setDsablStock(true); break;
  //       case '91': setDsablDate(true); break;
  //     }
  //   });

  //   // paraOperArray contient toutes les combinaisons de parameter + operator qui représentent des conditions non duplicables
  //   let paraOperArray = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
  //   let tmp_paraOperArray = [];
  //   // on extrait la plus petite valeur de paraOperArray qui n'est pas dans conditions pour déterminer quel paramètre afficher quand on ajoute une condition. on ne garde que le premier chiffre qui correspond au parameter
  //   for (let i = 0; i < conditions.length; i++) {
  //     if (paraOperArray.includes(conditions[i].parameter + conditions[i].operator)) {
  //       tmp_paraOperArray.push(conditions[i].parameter + conditions[i].operator)
  //     }
  //   }
  //   paraOperArray = paraOperArray.filter(val => !tmp_paraOperArray.includes(val));
  //   p = Math.min(...paraOperArray).toString().substring(0, 1);


  //   // OPERATOR ----------------------------------------------------------------
  //   // let tab = ['12','15','16','17','18']
  //   // if (parameter already used with operator != "est égale à") {
  //   //   disable("est égale à")
  //   // }
    

  // }



  // // gère le paramètre à changer dans les conditions automatiques
  // const handleChangeParam = (param, id) => {
  //   let tmp_conditions = [...conditions];
  //   let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
  //   tmp_conditions[index_arr].parameter = param;
  //   setConditions(tmp_conditions);
  //   handleDisableParam();
  // };

  // // gère le type d'opérations à éffectuer dans les conditons automatiques
  // const handleChangeOperator = (e, id) => {
  //   let tmp_conditions = [...conditions];
  //   let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
  //   // if e is not a event target but just a variable 
  //   if (e.target == undefined || e.target == null || e.target == '') {
  //     tmp_conditions[index_arr].operator = e
  //   } else {
  //     tmp_conditions[index_arr].operator = e.target.value;
  //   }
  //   setConditions(tmp_conditions);
  //   handleDisableParam();
  // };

  // // gère la valeur entrée dans les conditions automatiques
  // const handleChangeValue = (e, id) => {
  //   let tmp_conditions = [...conditions];
  //   let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
  //   // if e comes from FltaPickr then this is not a event target but just a variable 
  //   if (e.target == undefined || e.target == null || e.target == '') {
  //     tmp_conditions[index_arr].value = e.replace(/ (\d|:)+/, '');
  //   } else {
  //     tmp_conditions[index_arr].value = e.target.value;
  //   }
  //   setConditions(tmp_conditions);
  // };

  // //add condition
  // const addCondition = () => {

  //   let paraOperArray = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
  //   let tmp_paraOperArray = [];
  //   let countIfAllUnduplicable = 0;
  //   for (let i = 0; i < conditions.length; i++) {
  //     if (paraOperArray.includes(conditions[i].parameter + conditions[i].operator)) {
  //       countIfAllUnduplicable++;
  //     }
  //   }

  //   // && paraOperArray.length != countIfAllUnduplicable
  //   if (conditions.findIndex(c => c.value.length == 0) == -1 ) {
  //     // get bigger id to define the next id to insert in conditions
  //     var objWithBiggerId = {};
  //     if (conditions.length > 0) {
  //       objWithBiggerId = conditions.reduce(function (prev, current) {
  //         return (prev.id > current.id) ? prev : current
  //       });
  //     } else {
  //       objWithBiggerId.id = -1;
  //     }

  //     handleDisableParam();

  //     setConditions([
  //       ...conditions, {
  //         id: objWithBiggerId.id + 1,
  //         parameter: p,
  //         operator: '1',
  //         value: ''
  //       }
  //     ]);

  //     // dropDown
  //     var dropable = document.getElementById('conditions_collection');
  //     if (dropable != null) {
  //       dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
  //     }
  //   } else {
  //     setShowModalSimpleMessage(true);
  //     setMessageModal('Le champ valeur ne peut pas être vide.');
  //   }

  // };

  // // delete la condition dont l'id correspond à l'id transmit
  // const deleteCondition = (id) => {
  //   var arr = [...conditions];
  //   var index_arr = arr.findIndex(obj => obj.id == id);
  //   arr.splice(index_arr, 1);

  //   setConditions([...arr]);

  //   // repasse à isAutoConditions = 0 quand on delete toutes les conditions
  //   arr.length === 0 && setIsAutoConditions(0);
  //   localStorage.setItem('isAutoConditions', 0);
  // }

  const closeSimpleModal = () => {
    setShowModalSimpleMessage(false);
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="modifications des conditions">
            <Tab label="Ajouter" {...a11yProps(0)} />
            <Tab label="Supprimer" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <div className="sub-div-vert-align">
            {conditions && conditions.map((condition, i) => (
              <ConditionCollection
                key={i}
                handleChangeParam={handleChangeParam}
                handleChangeOperator={handleChangeOperator}
                handleChangeValue={handleChangeValue}
                condition={condition}
                deleteCondition={deleteCondition}
                warningIdCondition={warningIdCondition}
              />
            ))}
            <button className="btn-bcknd mb15" onClick={addCondition}>
              Ajouter une condition
            </button>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          Gérer la suppression des conditions
        </TabPanel>

      </Box>
      <ModalSimpleMessage
        show={showModalSimpleMessage} // true/false show modal
        handleModalCancel={closeSimpleModal}
        image={imageModal}>
        <h2 className="childrenModal">{messageModal}</h2>
      </ModalSimpleMessage>
    </>
  );
}


export default withHandleConditions(ConditionsForm);
