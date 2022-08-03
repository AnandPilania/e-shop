import React, { useState, useEffect } from 'react';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Axios from 'axios';
import SimpleMode from './simpleMode';
import AdvancedMode from './advancedMode';
import Toggle from '../elements/toggle/toggle';
import DeliveryZoneForm from './deliveryZoneForm';
import RowListShipping from './rowListShipping';


const Shipping = () => {

    const [activePanelShipping, setActivePanelShipping] = useState(1);
    const [shippingList, setShippingList] = useState([]);
    const [countriesList, setCountriesList] = useState([]);
    const [shipping, setShipping] = useState([]);
    const [zone, setZone] = useState([]);

    const [deliveryZones, setDeliveryZones] = useState([]);

    useEffect(() => {
        // charge la liste des shippings
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setShippingList(res.data[0]);
                setCountriesList(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    const getShippingsList = () => {
        // charge la liste des shippings
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setShippingList(res.data[0]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }



    // const addNewDeliveryZone = (zoneName, destinations) => {
    //     let tmp_deliveryZones = [...deliveryZones];
    //     tmp_deliveryZones.push({
    //         id: Date.now(),
    //         zoneName: zoneName,
    //         destinations: destinations,
    //         hasDeliveryMode: 0,
    //     });

    //     setDeliveryZones([...tmp_deliveryZones]);

    //     saveNewDeliveryZone(tmp_deliveryZones);
    // }

    // const saveNewDeliveryZone = (zonesData) => {
    //     let deliveryZonesData = new FormData;
    //     deliveryZonesData.append('zonesData', JSON.stringify(zonesData));

    //     Axios.post(`http://127.0.0.1:8000/save-shipping`, deliveryZonesData)
    //         .then(res => {
    //             console.log('res.data  --->  ok');

    //         });

    // }



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

                    {shippingList.length > 0 &&
                        <div className='w-full mt-10'>
                            <div
                                className='grid grid-cols-[1fr_1fr_70px_1fr_40px_40px] justify-start items-start w-full'
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
                                    Tarif
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2'
                                >
                                    Conditions
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch'>
                                </span>
                                <span
                                    className='text.base w-full border-gray-300 bg-gray-50 py-3 pl-2 self-stretch rounded-tr-md'>
                                </span>
                            </div>

                            <RowListShipping
                                shippingList={shippingList}
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
                    shippingList={shippingList}
                    setActivePanelShipping={setActivePanelShipping}
                />
            }


            {/* Ajouter un mode d'expédition---------------------------------*/}
            {
                activePanelShipping == 22 &&
                <div className='w-full'>
                    {/* <AdvancedMode
                                shippingList={shippingList}
                                setShippingList={setShippingList}
                                countriesList={countriesList}
                                shipping={shipping}
                                setShipping={setShipping}
                            /> */}

                    <SimpleMode
                        shippingList={shippingList}
                        setShippingList={setShippingList}
                        countriesList={countriesList}
                        shipping={shipping}
                        setShipping={setShipping}
                    />
                </div>
            }

            {/* Gérer les modes d'expédition-------------------------------- */}
            {
                activePanelShipping == 3 &&
                <Flexbox_row_s_c_wrap>
                    <div className='w-full'>
                        TAB 2
                    </div>
                </Flexbox_row_s_c_wrap>
            }

        </Flex_col_s_s>
    );
}

export default Shipping;
