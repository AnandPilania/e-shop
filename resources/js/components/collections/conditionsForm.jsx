import * as React from 'react';
import { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import Axios from 'axios';
import ConditionCollection from './conditionCollection';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


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


const ConditionsForm = () => {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const { conditions, setConditions, listCollectionsFiltered, warningIdCondition, listCollectionsChecked, setIsAutoConditions } = useContext(AppContext);


  // gère le paramètre à changer dans les conditions automatiques
  const handleChangeParam = (param, id) => {
    let tmp_conditions = [...conditions];
    var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
    tmp_conditions[index_arr].parameter = param;
    setConditions(tmp_conditions);
  };

  // gère le type d'opérations à éffectuer dans les conditons automatiques
  const handleChangeOperator = (e, id) => {
    let tmp_conditions = [...conditions];
    var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
    // if e is not a event target but just a variable 
    if (e.target == undefined || e.target == null || e.target == '') {
      tmp_conditions[index_arr].operator = e
    } else {
      tmp_conditions[index_arr].operator = e.target.value;
    }

    setConditions(tmp_conditions);
  };

  // gère la valeur entrée dans les conditions automatiques
  const handleChangeValue = (e, id) => {
    let tmp_conditions = [...conditions];
    var index_arr = tmp_conditions.findIndex(obj => obj.id == id);
    // if e comes from FltaPickr then this is not a event target but just a variable 
    if (e.target == undefined || e.target == null || e.target == '') {
      tmp_conditions[index_arr].value = e.replace(/ (\d|:)+/, '');
    } else {
      tmp_conditions[index_arr].value = e.target.value;
    }

    setConditions(tmp_conditions);
  };

  //add condition
  const addCondition = () => {
    // get bigger id to define the next id to insert in conditions
    var objWithBiggerId = {};
    if (conditions.length > 0) {
      objWithBiggerId = conditions.reduce(function (prev, current) {
        return (prev.id > current.id) ? prev : current
      });
    } else {
      objWithBiggerId.id = -1;
    }
    setConditions([
      ...conditions, {
        id: objWithBiggerId.id + 1,
        parameter: '1',
        operator: '1',
        value: ''
      }
    ]);

    // dropDown
    var dropable = document.getElementById('conditions_collection');
    if (dropable != null) {
      dropable.style.maxHeight = parseInt(dropable.scrollHeight + 60) + "px";
    }
  };

  // delete la condition dont l'id correspond à l'id transmit
  const deleteCondition = (id) => {
    var arr = [...conditions];
    var index_arr = arr.findIndex(obj => obj.id == id);
    arr.splice(index_arr, 1);

    setConditions([...arr]);

    // repasse à isAutoConditions = 0 quand on delete toutes les conditions
    arr.length === 0 && setIsAutoConditions(0);
    localStorage.setItem('isAutoConditions', 0);
  }


  const handleSave = () => {

    var newConditions = conditions.filter(condition => {
      return (condition.operator == 1 || condition.operator == 5 || condition.operator == 6) && condition.value != '';
    })
    // console.log('newConditions  ', newConditions);
    // console.log('listCollectionsFiltered  ', listCollectionsFiltered[0].objConditions)
    // console.log('conditions  ', conditions)

    // check si un paramètre et son opérateur sont déjà utilisé dans les conditions quand l'opérateur des nouvelles conditions à ajouter correspond à éest égale à" ou "commence par" ou "se termine par"

    
    let prev_conds = JSON.parse(listCollectionsFiltered[0].objConditions);

    let arr = prev_conds.filter((item, i) => { // <- ne parcour pas l'entièreté des deux tableaux pcq ils n'ont pas spécialement la même longueur
        return item.parameter == newConditions[i].parameter && item.operator == newConditions[i].operator;
    })



    console.log('arr  ', arr)
    // console.log('duplicatedConditions  ', duplicatedConditions)
    let typeOperation = value === 0 ? 'save' : 'delete';
    let formData = new FormData;
    formData.append('ids', JSON.stringify(listCollectionsChecked))


    // Axios.post(`http://127.0.0.1:8000/getCollectionByIds`, formData)
    //   .then(res => {
    //     console.log(res.data);

    //   }).catch(function (error) {
    //     console.log('error:   ' + error);
    //   });

    formData.append('conditions', JSON.stringify(conditions))
    formData.append('typeOperation', typeOperation)

    //   Axios.post(`http://127.0.0.1:8000/save-collection`, formData)
    //     .then(res => {
    //       console.log('res.data  --->  ok');
    //       if (res.data === 'ok') {

    //       }
    //     }).catch(function (error) {
    //       console.log('error:   ' + error);
    //     });

  }

  // console.log('listCollectionsChecked  ', listCollectionsChecked)
  // console.log('value  ', value)
  // console.log('conditions  ', conditions)
  // console.log('listCollectionsFiltered  ', listCollectionsFiltered[0].objConditions)


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
                handleChangeOperator={handleChangeOperator} handleChangeValue={handleChangeValue}
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
      <div>
        <button className="btn-bcknd mb15" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    </>
  );
}


export default ConditionsForm;
