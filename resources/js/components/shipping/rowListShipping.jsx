import React, { useState } from 'react';

const RowListShipping = ({ shippingList }) => {

    const [showShipConditions, setShowShipConditions] = useState(false);
    const [distanceFromBottomShip, setDistanceFromBottomShip] = useState(null);


    const showHideShipDestinations = (e) => {
        // getBoundingClientRect give position of div, ul or li
        var element = e.target;
        setDistanceFromBottomShip(window.innerHeight - element.getBoundingClientRect().bottom);
        setShowShipConditions(!showShipConditions);

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


    return (
        <div className='w-full mt-12'>
            {shippingList.length > 0 &&
                shippingList.map(shippingItem =>
                    <div
                        key={shippingItem.id}
                        className="w-full"
                    >
                        <span>
                            {shippingItem.zoneName}
                        </span>

                        {/* destinations */}
                        <div className={`flex-row min-h50`}
                            onClick={showHideShipDestinations}
                        >
                            {shippingItem.destinations.length > 0 ?

                                <div className='relative w-auto flex-col justify-s align-s bg-white radius5 m-r-10'
                                >
                                    {!showShipConditions ?
                                        <div className='w-full'>
                                            <span>
                                                {shippingItem.destinations[0].name}
                                            </span>
                                        </div>
                                        :
                                        shippingItem.destinations.length > 1 ?
                                            <div className={`flex-col-s-s w300 max-h310 absolute l0 bg-white shadow-l radius5 z3 ${distanceFromBottomShip < 300 ? "b0" : "t0"}`}
                                            >
                                                <div style={cover} onClick={showHideShipDestinations}
                                                />
                                                <div className='w100pct h60 p-l-20  flex-row-s-c bg-gray-light'
                                                >
                                                    <span className="w30 h30 radius-round bg-blue white flex-row-c-c fs12"
                                                    >
                                                        {shippingItem.destinations.length}
                                                    </span>
                                                    &nbsp; Destinations
                                                </div>
                                                <ul className="scroll flex-col-s-s w300 max-h265 p20 bg-white ul scrolly">
                                                    {shippingItem.destinations.map((item, index) =>
                                                        <li key={index}
                                                            className="w100pct word-break">
                                                            {item.name}
                                                        </li>)}
                                                </ul>
                                            </div>
                                            :
                                            <div className='w-full'>
                                                <span>
                                                    {shippingItem.destinations[0].name}
                                                </span>
                                            </div>
                                    }
                                </div>

                                : '_'
                            }


                            {shippingItem.destinations?.length > 1 &&
                                <div
                                    className="w20 h20 m-r-20 m-l-auto min-w20"
                                >
                                    {!showShipConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} className="w17" /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                                </div>}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default RowListShipping;
