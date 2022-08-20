import React, { useState, useEffect } from 'react';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Axios from 'axios';
import DeliveryZoneForm from './deliveryZoneForm';
import RowListShipping from './rowListShipping';
import DeliveryModeForm from './deliveryModeForm';


const Shipping = () => {

    const [activePanelShipping, setActivePanelShipping] = useState(1);
    const [deliveryZoneList, setDeliveryZoneList] = useState([]);
    const [countriesList, setCountriesList] = useState([]);
    const [IdDeliveryZones, setIdDeliveryZones] = useState(null);
    const [idMode, setIdMode] = useState(null);
    const [isEdidtZone, setIsEditZone] = useState(false);


    useEffect(() => {
        // charge la liste des shippings
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setDeliveryZoneList(res.data[0]);
                setCountriesList(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    const getShippingsList = () => {
        // charge la liste des shippings
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setDeliveryZoneList(res.data[0]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }


    return (
        <Flex_col_s_s css="mt-10">
            <span className='text-xl font-semibold text=gray-600 mt-4 mb-4'>
                Livraison
            </span>

            {activePanelShipping == 1 &&
                <div className='w-full'>
                    <div className='w-full'>
                        <button className='w-auto py-2 px-3 text-base text-gray-700 cursor-pointer border border-gray-200 rounded-md'
                            onClick={() => setActivePanelShipping(2)}>
                            Ajouter une zone de livraison
                        </button>
                    </div>

                    {deliveryZoneList.length > 0 &&
                        <div className='w-full mt-10'>
                            <div
                                className='grid grid-cols-[1fr_200px_120px_200px] justify-start items-start w-full bg-gray-50 rounded-t-md text-base'
                            >
                                <span
                                    className='w-full border-gray-200 px-2 py-3 font-semibold'
                                >
                                    Zone de Livraison
                                </span>
                                <span
                                    className='w-full border-gray-200 px-2 py-3 font-semibold'
                                >
                                    Pays
                                </span>
                                <span
                                    className='w-full border-gray-200 px-2 py-3 font-semibold'
                                >
                                    Opérations
                                </span>
                                <span
                                    className='w-full border-gray-200 px-2 py-3 font-semibold'
                                >
                                    Détails
                                </span>
                            </div>

                            <RowListShipping
                                deliveryZoneList={deliveryZoneList}
                                setActivePanelShipping={setActivePanelShipping}
                                IdDeliveryZones={IdDeliveryZones}
                                setIdDeliveryZones={setIdDeliveryZones}
                                setIdMode={setIdMode}
                                setDeliveryZoneList={setDeliveryZoneList}
                                setIsEditZone={setIsEditZone}
                                getShippingsList={getShippingsList}
                            />
                        </div>
                    }
                </div>
            }


            {/* destinations */}
            {activePanelShipping == 2 &&
                <DeliveryZoneForm
                    countriesList={countriesList}
                    getShippingsList={getShippingsList}
                    deliveryZoneList={deliveryZoneList}
                    setActivePanelShipping={setActivePanelShipping}
                    isEdidtZone={isEdidtZone}
                    setIsEditZone={setIsEditZone}
                    IdDeliveryZones={IdDeliveryZones}
                    setIdDeliveryZones={setIdDeliveryZones}
                />
            }


            {/* Ajouter un mode d'expédition---------------------------------*/}
            {
                activePanelShipping == 3 &&
                <div className='w-full'>
                    <DeliveryModeForm
                        deliveryZoneList={deliveryZoneList}
                        setDeliveryZoneList={setDeliveryZoneList}
                        IdDeliveryZones={IdDeliveryZones}
                        setActivePanelShipping={setActivePanelShipping}
                        idMode={idMode}
                        setIdMode={setIdMode}
                    />
                </div>
            }


        </Flex_col_s_s>
    );
}

export default Shipping;
