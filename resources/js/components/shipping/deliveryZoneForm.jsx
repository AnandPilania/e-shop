import React, { useState, useEffect } from 'react';
import SelectWithCheckbox_icon_search from '../elements/selectWithCheckbox_icon_search';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import Axios from 'axios';
import Label from '../form/label';


const DeliveryZoneForm = ({ countriesList, deliveryZoneList, setActivePanelShipping, getShippingsList }) => {

    const [zoneName, setZoneName] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showValidationMessageZone, setShowValidationMessageZone] = useState(false);
    const [showModalSimple, setShowModalSimple] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [messageModalSimple, setMessageModalSimple] = useState('');
    const [isDirtyZoneShipping, setIsDirtyZoneShipping] = useState(false);
    const [inputValue, setInputValue] = useState('');



    const handleNameZoneShipping = (e) => {
        setZoneName(e.target.value);
    }

    const removeDestination = (item) => {
        let index = destinations.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destinations];
            tmp_arr.splice(index, 1);
            setDestinations([...tmp_arr]);
        }
    }

    // confirm reinitialisatio form
    const confirmInitShippingForm = () => {
        setMessageModal('Réinitialiser la zone de livraison ?');
        setShowModalConfirmation(true);
    }

    // reset delivery zone form 
    const initShippingForm = () => {
        setZoneName('');
        setDestinations([]);
        setInputValue('');
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        initShippingForm();
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
    }

    const handleModalSimpleCancel = () => {
        setShowModalSimple(false);
    }

    // check if form is dirty
    useEffect(() => {
        if (zoneName.length > 0 || destinations.length > 0) {
            setIsDirtyZoneShipping(true);
        } else {
            setIsDirtyZoneShipping(false);
        }

        return () => {
            setIsDirtyZoneShipping(false);
        };
    }, [zoneName, destinations]);


    const validationZoneName = (zoneName, destinations) => {
        if (zoneName.length == 0) {
            setMessageModalSimple('Veuillez entrer un nom pour la zone de livraison');
            setShowModalSimple(true);
            return;
        }

        let ndx = deliveryZoneList.findIndex(x => x.zone_name == zoneName);
        if (ndx > -1) {
            setMessageModalSimple('Le nom que vous avez entré existe déjà');
            setShowModalSimple(true);
            return;
        }

        if (destinations.length == 0) {
            setMessageModalSimple('Veuillez choisir au moins un pays de destination');
            setShowModalSimple(true);
            return;
        }

        setActivePanelShipping(1);
        addNewDeliveryZone(zoneName, destinations);
        initShippingForm();
    }

    const addNewDeliveryZone = (zoneName, destinations) => {

        let deliveryZonesData = new FormData;
        deliveryZonesData.append('zoneName', zoneName);
        deliveryZonesData.append('destinations', JSON.stringify(destinations));
        deliveryZonesData.append('hasDeliveryMode', 0);

        Axios.post(`http://127.0.0.1:8000/save-shipping`, deliveryZonesData)
            .then(res => {
                console.log('res.data  --->  ok');

            });

        getShippingsList();
    }


    return (
        <div className='w-full pb-7'>
            <h3 className="text-base font-semibold mb-4 text-gray-700 w-auto">
                Créer une nouvelle zone de livraison
            </h3>

            {/* name */}
            <div className='w-96 mb-4 flex flex-col justify-start items-start rounded-md'>
                <Label lebel="Nom" />
                <div
                    className={`w-full rounded-md ${zoneName?.length == 0 && showValidationMessageZone && "border-2 border-red-700"}`}
                >
                    <InputText
                        id="nameDeliveryZone"
                        value={zoneName}
                        handleChange={handleNameZoneShipping}
                        placeholder=""
                        css="w-full"
                    />
                </div>
            </div>

            {/* destinations */}
            <div className='w-full'>
                <div className='w-96 mb-4'>
                    <SelectWithCheckbox_icon_search
                        key="SelectWithCheckbox_delivery_destinations"
                        unikId="SelectWithCheckbox_delivery_destinations"
                        list={countriesList}
                        selected={destinations}
                        setSelected={setDestinations}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        toggleSelectWithCheckbox={toggleSelectDestination}
                        setToggleSelectWithCheckbox={setToggleSelectDestination}
                        placeholder="Liste des pays"
                        label="Sélectionner un ou plusieurs pays de destination"
                    />
                </div>
                <div
                    className={`flex flex-wrap ${destinations.length > 0 && "pt-4"} w-full`}>
                    {destinations.map(item =>
                        <div key={item.id}
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2">
                            <span
                                className="h-full text-gray-500 mr-2 rounded-md">
                                {item.name}
                            </span>
                            <span
                                className="h-5 w-5 flex justify-center items-center hover:cursor-pointer bg-indigo-600  hover:bg-red-500 rounded-md"
                                onClick={() => removeDestination(item)}>
                                <img src='../images/icons/x-white.svg' className="w-5 h-5 hover:scale-125" />
                            </span>
                        </div>
                    )}
                </div>
            </div>


            {/* save */}
            <div className="w-full flex flex-row justify-start items-start mt-7">
                <button
                    className='w-28 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-green-600 text-white'
                    onClick={() => validationZoneName(zoneName, destinations)}>
                    Enregistrer
                </button>

                <button
                    className='w-28 h-10 ml-5 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-red-600 text-white'
                    onClick={() => setActivePanelShipping(1)}>
                    Annuler
                </button>

                {/* réinitialisation */}
                {isDirtyZoneShipping && (
                    <button
                        className='w-28 ml-5 h-10 flex flex-row justify-center items-center border border-blue-700 rounded-md text-gray-700'
                        onClick={() => {
                            confirmInitShippingForm();
                        }}>
                        Réinitialiser
                    </button>)}
            </div>

            <ModalConfirmation
                show={showModalConfirmation}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>

            <ModalSimpleMessage
                show={showModalSimple}
                handleModalCancel={handleModalSimpleCancel}
            >
                <h2 className="childrenModal">{messageModalSimple}</h2>
            </ModalSimpleMessage>
        </div>
    );
}

export default DeliveryZoneForm;
