import * as React from 'react';
import { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ConditionCollection from './conditionCollection';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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

  const [value, setValue] = useState(0);


  const { conditions, setConditions, setTypeOperationListCollections, warningIdCondition, setIsAutoConditions, conditionParameter, setConditionParameter } = useContext(AppContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTypeOperationListCollections(newValue);
  };


  // gère le paramètre à changer dans les conditions automatiques
  const handleChangeParam = (param, id) => {
    let tmp_conditions = [...conditions];
    let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
    tmp_conditions[index_arr].parameter = param;
    setConditions(tmp_conditions);
  };

  // gère le type d'opérations à éffectuer dans les conditons automatiques
  const handleChangeOperator = (e, id) => {
    let tmp_conditions = [...conditions];
    let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
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
    let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
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


    let para = [];
    conditions.forEach(x => {
      switch (x.parameter + x.operator) {
        case '11': para.push(1); break;
        case '21': para.push(2); break;
        case '31': para.push(3); break;
        case '41': para.push(4); break;
        case '51': para.push(5); break;
        case '61': para.push(6); break;
        case '71': para.push(7); break;
        case '81': para.push(8); break;
        case '91': para.push(9); break;
      }
    })


     
    setConditionParameter(para);
    console.log('conditionParameter   ', conditionParameter)
    

    // let p;
    // let o;
    // conditions.forEach(cond => {
    //   if (!para.includes(cond.parameter)) {
    //     p = cond.parameter;
    //     o = 1;
    //     console.log('not include  ', cond.parameter)
    //   } else {
    //     console.log('include  ', cond.parameter)
    //     o = 2;
    //   }
    // });

    // if (conditions.findIndex(obj => obj.parameter == 1 && obj.operator == 1) == -1) {
    //   var p = 1;
    //   var o = 1;
    // } else {
    //   var p = 2;
    // }
   


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
    </>
  );
}


export default ConditionsForm;
