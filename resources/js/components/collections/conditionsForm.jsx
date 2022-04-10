import * as React from 'react';
import { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ConditionCollection from './conditionCollection';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import { getParameter, getOperator } from './conditionsFunctions';
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

  const { conditions, setConditions, setTypeOperationListCollections, warningIdCondition, setIsAutoConditions, showModalSimpleMessage, setShowModalSimpleMessage, messageModal, imageModal, setDsablNamProd, setDsablType, setDsablSuppl, setDsablPrice, setDsablTag, setDsablBeforePromo, setDsablWeight, setDsablStock, setDsablDate } = useContext(AppContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTypeOperationListCollections(newValue);
  };


  // disable un parameter quand il a déjà été utilisé avec l'operator "est égale à"
  const handleDisableParam = () => {
    setDsablNamProd(false);
    setDsablType(false);
    setDsablSuppl(false);
    setDsablPrice(false);
    setDsablTag(false);
    setDsablBeforePromo(false);
    setDsablWeight(false);
    setDsablStock(false);
    setDsablDate(false);

    conditions.forEach(x => {
      switch (x.parameter + x.operator) {
        case '11': setDsablNamProd(true); break;
        case '21': setDsablType(true); break;
        case '31': setDsablSuppl(true); break;
        case '41': setDsablPrice(true); break;
        case '51': setDsablTag(true); break;
        case '61': setDsablBeforePromo(true); break;
        case '71': setDsablWeight(true); break;
        case '81': setDsablStock(true); break;
        case '91': setDsablDate(true); break;
      }
    });
  }


  // gère le paramètre à changer dans les conditions automatiques
  const handleChangeParam = (param, id) => {
    let tmp_conditions = [...conditions];
    let index_arr = tmp_conditions.findIndex(obj => obj.id == id);
    tmp_conditions[index_arr].parameter = param;
    setConditions(tmp_conditions);
    handleDisableParam();
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
    handleDisableParam();
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

  const closeSimpleModal = () => {
    setShowModalSimpleMessage(false);
  }

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
    console.log('conditions  ', conditions)


    let p = '1';
    let paraOperArray = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
    conditions.forEach(x => { 
      console.log('x.parameter + x.operator  ', !paraOperArray.includes(x.parameter + x.operator))
      switch (true) {
        case !paraOperArray.includes(x.parameter + x.operator): p = '1'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '2'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '3'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '4'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '5'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '6'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '7'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '8'; break;
        case !paraOperArray.includes(x.parameter + x.operator): p = '9'; break;
        default: p = '1'; break;
      }
    })


    setConditions([
      ...conditions, {
        id: objWithBiggerId.id + 1,
        parameter: p,
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
      <ModalSimpleMessage
        show={showModalSimpleMessage} // true/false show modal
        handleModalCancel={closeSimpleModal}
        image={imageModal}>
        <h2 className="childrenModal">{messageModal}</h2>
      </ModalSimpleMessage>
    </>
  );
}


export default ConditionsForm;
