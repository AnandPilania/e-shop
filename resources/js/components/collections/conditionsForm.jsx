import * as React from 'react';
import { useState, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import withHandleConditions from './withHandleConditions';
import ConditionCollection from './conditionCollection';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
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

// les props viennent de withHandleCollections
const ConditionsForm = ({
  handleChangeParam,
  handleChangeOperator,
  handleChangeValue,
  addCondition,
  deleteCondition }) => {

  const [value, setValue] = useState(0);

  const { conditions, setTypeOperationListCollections, warningIdCondition, showModalSimpleMessage, setShowModalSimpleMessage, messageModal, imageModal } = useContext(AppContext);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTypeOperationListCollections(newValue);
  };


  const closeSimpleModal = () => {
    setShowModalSimpleMessage(false);
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={value} onChange={handleChange} aria-label="modifications des conditions">
          <Tab label="Ajouter" {...a11yProps(0)} />
          <Tab label="Supprimer" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0} sx={{ width: '100%' }}>
        <div className="sub-div-vert-align w100pct">
          <div className="block-select-conditions">
            <span className="m-l-10">Paramètre</span>
            <span className="m-l-10">Opérateur</span>
            <span className="m-l-10">Valeur</span>
          </div>
          {conditions &&
            conditions.map((condition, i) => (
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
            {/* ajouter une condition */}
          <button className="btn-bcknd mb15" onClick={addCondition}>
            <img src='../images/icons/add_icon.svg' alt=" bouton ajouter une condition" height="30px" width="30px" />
          </button>
        </div>
      </TabPanel>

      <TabPanel value={value} index={1}>
        Gérer la suppression des conditions
      </TabPanel>

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
