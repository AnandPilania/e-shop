import React, { useState } from 'react';

const RowListShipping = ({ deliveryZoneList, setActivePanelShipping, setIdDeliveryZones }) => {

    const [showShipConditions, setShowShipConditions] = useState(false);
    const [distanceFromBottomShip, setDistanceFromBottomShip] = useState(null);
    const [idDistance, setIdDistance] = useState(null);


    const showHideShipDestinations = (e, id) => {
        // getBoundingClientRect give position of div, ul or li
        var element = e.target;
        setDistanceFromBottomShip(window.innerHeight - element.getBoundingClientRect().bottom);

        setIdDistance(id);
        setShowShipConditions(!showShipConditions);
    }

    const addDeliveryMode = (id) => {
        setIdDeliveryZones(id);
        setActivePanelShipping(3);
    }


    // permet la fermeture du popover quand on clique n'importe où en dehors du popover
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '-5px',
        zIndex: '-10',
        cursor: 'default',
    }


    console.log('deliveryZoneList  ', deliveryZoneList)


    return (
        <div className='w-full mt-2'>
            {deliveryZoneList.map(shippingItem =>
                <div
                    key={shippingItem.id}
                    className='grid grid-cols-[1fr_1fr_1fr_1fr] justify-start items-start w-full'
                >
                    {/* name */}
                    <span>
                        {shippingItem.zoneName}
                    </span>

                    {/* destinations */}
                    <div className={`flex flex-row h-3 min-h-[48px]`}
                        onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
                    >
                        <div className='relative w-auto flex flex-col justify-start items-start bg-white rounded-md mr-2.5'
                        >
                            {!showShipConditions ?
                                <div className='w-full flex items-center'>
                                    <span>
                                        {shippingItem.destinations[0].name}
                                    </span>
                                </div>
                                :
                                shippingItem.destinations.length > 1 && shippingItem.id == idDistance ?
                                    <div className='w-full h-full'>
                                        <div
                                            className={`flex flex-col justify-start items-start w-[300px] max-h-[300px] absolute left-0 bg-white shadow-xl rounded-md z-30 ${distanceFromBottomShip < 300 ? "bottom-0" : "top-0"}`}
                                        >
                                            <div
                                                style={cover}
                                                onClick={(e) => {
                                                    showHideShipDestinations(e, shippingItem.id);
                                                    setIdDistance(null);
                                                }}
                                            />
                                            <div
                                                className='w-full h-auto p-4  flex flex-row justify-start items-center bg-gray-50'
                                            >
                                                <span
                                                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex flex-row justify-center items-center text-sm"
                                                >
                                                    {shippingItem.destinations.length}
                                                </span>
                                                &nbsp; Pays
                                            </div>
                                            <ul className="overflow-y-auto flex flex-col justify-start items-start w-[300px] max-h-[265px] px-5 pt-2 pb-5 bg-white list-inside">
                                                {shippingItem.destinations.map((item, index) =>
                                                    <li key={index}
                                                        className="w-full flex flex-row justify-start items-center py-2"
                                                    >
                                                        <img
                                                            src={`../images/flags_4_3/${item.code_1}.svg`} className="h-4"
                                                        />
                                                        <span className='ml-2 truncate'>
                                                            {item.name}
                                                        </span>
                                                    </li>)}
                                            </ul>
                                        </div>
                                        :
                                        <div className='w-full h-full flex items-center'>
                                            <span>
                                                {shippingItem.destinations[0].name}
                                            </span>
                                        </div>
                                    </div>
                                    :
                                    <div className='w-full h-full flex items-center'>
                                        <span>
                                            {shippingItem.destinations[0].name}
                                        </span>
                                    </div>
                            }
                        </div>

                        {shippingItem.destinations?.length > 1 &&
                            <div
                                className="w-5 h-5 mr-5 ml-auto min-w-[20px]"
                                onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
                            >
                                {showShipConditions && shippingItem.id == idDistance ?
                                    <img src={window.location.origin + '/images/icons/chevronUp.png'}
                                        className="w17" />
                                    :
                                    <img src={window.location.origin + '/images/icons/chevronDown.png'} />}
                            </div>
                        }
                    </div>

                    <span
                        className='text-blue-400 underline underline-offset-1 text-sm'
                        onClick={() => addDeliveryMode(shippingItem.id)}>
                        Ajouter un mode de livraison
                    </span>
                    <span>
                        Voir
                    </span>
                </div>
            )}
        </div>
    );
}

export default RowListShipping;
