import React, { useState, useEffect } from 'react';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Axios from 'axios';
import AdvancedMode from './advancedMode';
import DeliveryZoneForm from './deliveryZoneForm';
import RowListShipping from './rowListShipping';


const Shipping = () => {

    const [activePanelShipping, setActivePanelShipping] = useState(1);
    const [deliveryZoneList, setDeliveryZoneList] = useState([]);
    const [countriesList, setCountriesList] = useState([]);
    const [shipping, setShipping] = useState([]);
    const [IdDeliveryZones, setIdDeliveryZones] = useState(null);

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
            <span className='text-xl font-semibold text=gray-600 my-4 px-4'>
                Livraisons
            </span>

            {activePanelShipping == 1 &&
                <div className='w-full'>
                    <span className='text-base text-blue-500 underline underline-offset-1 cursor-pointer'
                        onClick={() => setActivePanelShipping(2)}>
                        Ajouter une zone de livraison
                    </span>

                    {deliveryZoneList.length > 0 &&
                        <div className='w-full mt-10'>
                            <div
                                className='grid grid-cols-[1fr_1fr_1fr_1fr] justify-start items-start w-full'
                            >
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 rounded-tl-md'
                                >
                                    Nom
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2'
                                >
                                    Destinations
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2'
                                >
                                    Mode de livraison
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2'
                                >
                                    Détails
                                </span>
                            </div>

                            <RowListShipping
                                deliveryZoneList={deliveryZoneList}
                                setActivePanelShipping={setActivePanelShipping}
                                setIdDeliveryZones={setIdDeliveryZones}
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
                />
            }


            {/* Ajouter un mode d'expédition---------------------------------*/}
            {
                activePanelShipping == 3 &&
                <div className='w-full'>
                    <AdvancedMode
                        deliveryZoneList={deliveryZoneList}
                        setDeliveryZoneList={setDeliveryZoneList}
                        countriesList={countriesList}
                        shipping={shipping}
                        setShipping={setShipping}
                        IdDeliveryZones={IdDeliveryZones}
                    />
                </div>
            }


        </Flex_col_s_s>
    );
}

export default Shipping;
