import React, { useState, useEffect } from 'react';
import { usePromptCollection } from '../hooks/usePromptCollection';
import SelectWithCheckbox_icon_search from './selectWithCheckbox_icon_search';
import ModalConfirmation from '../modal/modalConfirmation';
import ModalSimpleMessage from '../modal/modalSimpleMessage';
import InputText from '../form/inputText';
import Axios from 'axios';
import Label from '../form/label';


const DeliveryZoneForm = ({ countriesList, deliveryZoneList, IdDeliveryZones, setIdDeliveryZones, setActivePanelShipping, getShippingsList, isEdidtZone, setIsEditZone }) => {

    const [zoneName, setZoneName] = useState('');
    const [prevZoneName, setPrevZoneName] = useState(null);
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [prevDestinations, setPrevDestinations] = useState(null);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showModalConfirmation2, setShowModalConfirmation2] = useState(false);
    const [showModalSimple, setShowModalSimple] = useState(false);
    const [showErrorMessageZone, setShowErrorMessageZone] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [messageModalSimple, setMessageModalSimple] = useState('');
    const [isDirtyZoneShipping, setIsDirtyZoneShipping] = useState(false);
    const [isDirtyDestionation, setIsDirtyDestination] = useState(false);
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        if (isEdidtZone) {
            let ndx = deliveryZoneList.findIndex(x => x.id == IdDeliveryZones);
            if (ndx > -1) {
                setZoneName(deliveryZoneList[ndx].name);
                setDestinations(deliveryZoneList[ndx].destinations);
                setPrevZoneName(deliveryZoneList[ndx].name);
                setPrevDestinations(deliveryZoneList[ndx].destinations);
            }
        }
    }, []);

    // demande confirmation avant de quitter le form sans sauvegarder
    usePromptCollection('Quitter sans sauvegarder vos données ?', isDirtyZoneShipping, setShowModalConfirmation, setMessageModal);


    const handleNameZoneShipping = (e) => {
        setZoneName(e.target.value);
    }

    const removeDestination = (item) => {
        let index = destinations.findIndex(x => x.id == item.id);
        if (index > -1) {
            let tmp_arr = [...destinations];
            tmp_arr.splice(index, 1);

            // si "Tous les pays" est coché et qu'on décoche un pays alors on décoche "Tous les pays"
            let all_countries_index = destinations.findIndex(x => x.id == 1);
            if (all_countries_index > -1) {
                tmp_arr.splice(all_countries_index, 1);
            }
            
            setDestinations([...tmp_arr]);
        }
    }

    // confirm reinitialisatio form
    const confirmInitShippingForm = () => {
        setMessageModal('Réinitialiser les pays sélectionnés ?');
        setShowModalConfirmation(true);
    }

    // reset delivery zone form 
    const initShippingForm = () => {
        setDestinations([]);
        setInputValue('');
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        initShippingForm();
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
        setShowModalConfirmation2(false);
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

        if (zoneName.length > 0 && destinations.length > 0) {
            setShowErrorMessageZone(false);
        }

        return () => {
            setIsDirtyZoneShipping(false);
            setShowErrorMessageZone(false);
        };
    }, [zoneName, destinations]);

    // check if destinations is dirty
    useEffect(() => {
        if (destinations.length > 0) {
            setIsDirtyDestination(true);
        } else {
            setIsDirtyDestination(false);
        }

        return () => {
            setIsDirtyDestination(false);
        };
    }, [destinations]);

    const handleModalConfirm2 = () => {
        setShowModalConfirmation2(false);
        setActivePanelShipping(1);
    }

    // gère le annuler sans sauvegarder
    const handleBackButton = () => {
        if (isDirtyZoneShipping && prevZoneName == null &&
            prevDestinations == null) {
            setMessageModal('Quitter sans sauvegarder vos données ?');
            setShowModalConfirmation2(true);
        } else if ((prevZoneName !== zoneName ||
            prevDestinations !== destinations) && prevZoneName !== null &&
            prevDestinations !== null) {
            setMessageModal('Quitter sans sauvegarder vos données ?');
            setShowModalConfirmation2(true);
        } else {
            setActivePanelShipping(1);
        }
        setIsEditZone(false);
        setIdDeliveryZones(null);
    }


    const validationZoneName = (zoneName, destinations) => {
        if (zoneName.length == 0) {
            setMessageModal('Veuillez entrer un nom pour la zone de livraison');
            setShowErrorMessageZone(true);
            return;
        }

        let ndx = deliveryZoneList.findIndex(x => x.name == zoneName);
        if (ndx > -1) {
            setMessageModal('Ce nom éxiste déjà. Veuillez entrer un nom différent');
            setShowErrorMessageZone(true);
            return;
        }

        if (destinations.length == 0) {
            setMessageModal('Veuillez choisir au moins un pays de destination');
            setShowErrorMessageZone(true);
            return;
        }

        setActivePanelShipping(1);
        saveDeliveryZone(zoneName, destinations);
        initShippingForm();
    }

    const saveDeliveryZone = (zoneName, destinations) => {
        let deliveryZonesData = new FormData;
        deliveryZonesData.append('zone_name', zoneName);
        deliveryZonesData.append('destinations', JSON.stringify(destinations));
        deliveryZonesData.append('IdDeliveryZones', IdDeliveryZones);

        if (isEdidtZone) {
            Axios.post(`http://127.0.0.1:8000/edit-shipping`, deliveryZonesData)
                .then(res => {
                    console.log('res.data  --->  ok');
                    setIsEditZone(false);
                    setIdDeliveryZones(null);
                });
        } else {
            Axios.post(`http://127.0.0.1:8000/save-shipping`, deliveryZonesData)
                .then(res => {
                    console.log('res.data  --->  ok');

                });
        }
        getShippingsList();
    }


    return (
        <div className='w-full pb-7 pt-10 relative'>
            {/* error message validation name && price without conditions */}
            {showErrorMessageZone &&
                <div
                    className="w-full p-4 flex justify-start items-start rounded-md bg-red-50 text-sm text-gray-700 font-semibold absolute top-0 left-0"
                >
                    <img
                        src={window.location.origin + '/images/icons/exclamation-triangle.svg'}
                        className="h-4 w-4 mr-3"
                    />
                    {messageModal}
                </div>
            }

            <h3 className="text-base font-semibold my-4 text-gray-700 w-auto">
                Créer une nouvelle zone de livraison
            </h3>

            {/* name */}
            <div className='w-96 mb-4 flex flex-col justify-start items-start rounded-md'>
                <Label label="Nom" />
                <div
                    className={`w-full rounded-md ${zoneName?.length == 0 && showErrorMessageZone && "border-2 border-red-700"}`}
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
                <div className='w-full flex flex-row flex-wrap justify-start items-end'>
                    <div className='flex flex-col'>
                        <Label label="Sélectionner un ou plusieurs pays de destination" />
                        <div className={`w-96 mr-2 rounded-md ${destinations?.length == 0 && showErrorMessageZone && "border-2 border-red-700"}`}>
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
                            />
                        </div>
                    </div>
                    {/* réinitialisation */}
                    {isDirtyDestionation && (
                        <button
                            className='w-28 h-10 mt-4 flex flex-row justify-center items-center border border-blue-700 rounded-md text-gray-700'
                            onClick={() => {
                                confirmInitShippingForm();
                            }}>
                            Réinitialiser
                        </button>)}
                </div>
                <div
                    className={`flex flex-wrap ${destinations.length > 0 && "pt-4"} w-full`}>
                    {destinations.map(item =>
                        <div
                            key={item.id}
                            className="flex justify-between items-center rounded-md bg-gray-100 border border-gray-300 pl-2 pr-1.5 py-1 mb-1 mr-2"
                        >
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
                    onClick={handleBackButton}>
                    Annuler
                </button>
            </div>

            <ModalConfirmation
                show={showModalConfirmation}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>

            <ModalConfirmation
                show={showModalConfirmation2}
                handleModalConfirm={handleModalConfirm2}
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
