import React, { useState, useEffect } from 'react';
import Flex_col_s_s from '../elements/container/flex_col_s_s';
import Flexbox_row_s_c_wrap from '../elements/container/flexbox_row_s_c_wrap';
import Axios from 'axios';
import SimpleMode from './simpleMode';
import AdvancedMode from './advancedMode';
import Toggle from '../elements/toggle/toggle';


const Shipping = () => {

    const [activeTabShipping, setActiveTabShipping] = useState(1);
    const [isShippingAdvancedMode, setIsShippingAdvancedMode] = useState(false);
    const [shippingList, setShippingList] = useState([]);
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        getShippings();
    }, []);

    const getShippings = () => {
        // charge la liste des shippings
        Axios.get(`http://127.0.0.1:8000/shipping-list`)
            .then(res => {
                setShippingList(res.data[0]);
                setCountryList(res.data[1]);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    const handleShippingTabs = (indexTab) => {
        setActiveTabShipping(indexTab);
    }


    return (
        <Flex_col_s_s css="mt-10">
            <span className='text-xl font-semibold text=gray-600 my-4 px-4'>
                Livraison
            </span>
            <div className='w-full border-b border-gray-300 mb-7 pb-2.5 px-4'>
                <span
                    className={`text-base font-normal hover:font-medium text=gray-600 pb-3 mr-6 pr-1 cursor-pointer ${activeTabShipping == 1 && "border-b-2 border-indigo-600"}`}
                    onClick={() => handleShippingTabs(1)}
                >
                    Ajouter un mode d'expédition
                </span>
                <span
                    className={`text-base font-normal hover:font-medium text=gray-600 pb-3 px-1 cursor-pointer ${activeTabShipping == 2 && "border-b-2 border-indigo-600"}`}
                    onClick={() => handleShippingTabs(2)}
                >
                    Gérer les modes d'expédition
                </span>
            </div>

            {/* Ajouter un mode d'expédition---------------------------------*/}
            {activeTabShipping == 1 &&
                <div className='w-full'>

                    <Toggle
                        id={`toggleShipping${() => date()}`}
                        isChecked={isShippingAdvancedMode}
                        change={() => setIsShippingAdvancedMode(!isShippingAdvancedMode)}
                        label="Créer un mode d'expédition avancé"
                    />

                    <div className='w-full'>
                        {isShippingAdvancedMode ?
                            <AdvancedMode
                                shippingList={shippingList}
                                setShippingList={setShippingList}
                                countryList={countryList}
                            />
                            :
                            <SimpleMode
                                shippingList={shippingList}
                                setShippingList={setShippingList}
                                countryList={countryList}
                            />}
                    </div>
                </div>
            }

            {/* Gérer les modes d'expédition-------------------------------- */}
            {activeTabShipping == 2 &&
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
