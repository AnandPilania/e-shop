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


  

  const closeSimpleModal = () => {
    setShowModalSimpleMessage(false);
  }
console.log('conditionsForm  ', conditions)
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
