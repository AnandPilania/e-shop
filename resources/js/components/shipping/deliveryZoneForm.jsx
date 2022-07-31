import React, { useState, useEffect } from 'react';
import SelectWithCheckbox_icon from '../elements/selectWithCheckbox_icon';
import ModalConfirmation from '../modal/modalConfirmation';
import InputText from '../form/inputText';


const DeliveryZoneForm = ({ countryList }) => {

    const [zoneName, setZoneName] = useState('');
    const [toggleSelectDestination, setToggleSelectDestination] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [isDirtyZoneShipping, setIsDirtyZoneShipping] = useState(false);


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
    }

    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        initShippingForm();
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
    }

    useEffect(() => {
        zoneName.length > 0 ? setIsDirtyZoneShipping(true) : setIsDirtyZoneShipping(false);
    }, [zoneName]);
    

    return (
        <div className='w-full'>
            <h3 className="text-base font-semibold mb-2.5 text-gray-500 w-auto">
                Destinations
            </h3>

            {/* name */}
            <div>
                <InputText
                    id="nameShipping"
                    value={zoneName}
                    handleChange={handleNameZoneShipping}
                    // handleClick={}
                    placeholder=""
                    label="Nom"
                />
                <span className={`text-sm text-red-700 ${zoneName.length > 255 ? "block" : "none"}`}>Le nom de la zone d'expédition ne peut pas dépasser 255 caractères</span>
            </div>
            <div className='w-96'>
                <SelectWithCheckbox_icon
                    key="SelectWithCheckbox_destinations"
                    unikId="SelectWithCheckbox_destinations"
                    list={countryList}
                    selected={destinations}
                    setSelected={setDestinations}
                    toggleSelectWithCheckbox={toggleSelectDestination}
                    setToggleSelectWithCheckbox={setToggleSelectDestination}
                    placeholder="Sélectionner un ou plusieurs pays"
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

            {/* save */}
            <div className="w-full flex flex-row justify-start items-start mt-7">
                <button
                    className='w-auto px-3 h-10 flex flex-row justify-center items-center border border-gray-300 rounded-md bg-green-600 text-white'
                    onClick={() => addNewDeliveryZone()}>
                    Enregistrer
                </button>

                {/* réinitialisation */}
                {isDirtyZoneShipping && (
                    <button
                        className='w-auto ml-5 px-3 h-10  flex flex-row justify-center items-center border border-red-700 rounded-md text-gray-700'
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
        </div>
    );
}

export default DeliveryZoneForm;
