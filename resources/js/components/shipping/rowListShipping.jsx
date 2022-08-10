import React, { useState } from 'react';
import Tooltip from '../elements/tooltip';

const RowListShipping = ({ deliveryZoneList, setActivePanelShipping, setIdDeliveryZones, setIdMode }) => {

    const [showShipConditions, setShowShipConditions] = useState(false);
    const [distanceFromBottomShip, setDistanceFromBottomShip] = useState(null);
    const [idDistance, setIdDistance] = useState(null);
    const [listModesDetails, setListModesDetails] = useState([]);


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

    const showListModesDetails = (id) => {
        let tmp_listModesDetails = [...listModesDetails];
        let ndx = tmp_listModesDetails.indexOf(id);

        if (ndx > -1) {
            tmp_listModesDetails.splice(ndx, 1);
        } else {
            tmp_listModesDetails.push(id);
        }
        setListModesDetails([...tmp_listModesDetails]);
    }

    const editDeliveryMode = (zoneId, modeId) => {
        setIdDeliveryZones(zoneId);
        setIdMode(modeId);
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
        <div className='w-full'>
            {deliveryZoneList.map(shippingItem =>
                <div
                    key={shippingItem.id}
                    className="grid grid-cols-[1fr_1fr_120px_60px] justify-start items-center w-full h-full border-b border-gray-200 py-2"
                >
                    {/* name */}
                    <span className={`w-full h-full flex items-center ${listModesDetails.includes(shippingItem.id) ? "bg-gray-50 font-semibold" : "bg-white"}`}>
                        {shippingItem.zone_name}
                    </span>

                    {/* destinations */}
                    <div className={`flex flex-row w-full h-full min-h-[48px] ${listModesDetails.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
                    >
                        <div className='relative w-auto flex flex-col justify-start items-start bg-white rounded-md mr-2.5'
                        >
                            {!showShipConditions ?
                                <div className='w-full max-w-[170px] flex items-center'>
                                    <span className='w-full truncate'>
                                        {shippingItem.destinations.map(x => { return ' ' + x.name }).toString()}
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
                                    </div>
                                    :
                                    <div className='w-full max-w-[170px] flex items-center'>
                                        <span className='w-full truncate'>
                                            {shippingItem.destinations.map(x => { return ' ' + x.name }).toString()}
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

                    <div className={`w-full h-full grid grid-cols-2  justify-center items-center group relative${listModesDetails.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                    >
                        <span
                            className={`w-full h-full text-blue-500 underline underline-offset-1 text-sm flex items-center hover:text-blue-400 ${listModesDetails.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <img
                                src={window.location.origin + '/images/icons/pencil.svg'}
                                className="h-5 w-5 m-auto cursor-pointer"
                                onClick={() => addDeliveryMode(shippingItem.id)}
                            />

                            <Tooltip top={-40} left={0}>
                                Modifier
                            </Tooltip>
                        </span>

                        <span
                            className={`w-full h-full text-blue-500 underline underline-offset-1 text-sm flex items-center hover:text-blue-400 ${listModesDetails.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <img
                                src={window.location.origin + '/images/icons/add_icon.svg'}
                                className="h-5 w-5 m-auto cursor-pointer"
                                onClick={() => addDeliveryMode(shippingItem.id)}
                            />

                            <Tooltip top={-40} left={0}>
                                Ajouter un mode de livraison
                            </Tooltip>
                        </span>
                    </div>

                    {/* show / hide list modes details */}
                    {shippingItem.shipping_modes.length > 0 ?
                        <span className={`w-full h-full flex items-center ${listModesDetails.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <span
                                className='cursor-pointer m-auto'
                                onClick={() => { showListModesDetails(shippingItem.id) }}
                            >
                               {listModesDetails.includes(shippingItem.id) ? "Fermer" : "Voir"} 
                            </span>
                        </span>
                        :
                        <span></span>
                    }

                    {/* affiche les modes de livraison */}
                    <div className={`w-full col-span-4 border-t border-gray-200 pb-4 ${listModesDetails.includes(shippingItem.id) ? "block" : "hidden"}`}>
                        <div className='w-full py-2 text-sm font-semibold'>
                            Modes de livraison de la zone {shippingItem.zone_name}
                        </div>
                        {shippingItem.shipping_modes.length > 0 &&
                            shippingItem.shipping_modes.map((modesItem, modeIndex) =>
                                <div
                                    key={modeIndex}
                                    className='w-full grid grid-cols-[1fr_1fr_40px_40px] gap-3 justify-start items-center'
                                >
                                    <span>
                                        {modesItem.mode_name}
                                    </span>
                                    <span>
                                        {modesItem.conditions.length} Conditions
                                    </span>
                                    <span
                                        className='text-blue-500 underline underline-offset-1 text-sm cursor-pointer hover:text-blue-400 relative group'
                                        onClick={() => editDeliveryMode(shippingItem.id, modesItem.id)}
                                    >
                                        <img
                                            src={window.location.origin + '/images/icons/pencil.svg'}
                                            className="h-5 w-5" />

                                        <Tooltip top={-40} left={0}>
                                            Modifier
                                        </Tooltip>
                                    </span>
                                    <span
                                        className='text-blue-500 underline underline-offset-1 text-sm cursor-pointer hover:text-blue-400 relative group'
                                        onClick={() => (shippingItem.id)}
                                    >
                                        <img
                                            src={window.location.origin + '/images/icons/trash.svg'}
                                            className="h-5 w-5" />

                                        <Tooltip top={-40} left={0}>
                                            Supprimer
                                        </Tooltip>
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>

            )}
        </div>
    );
}

export default RowListShipping;
