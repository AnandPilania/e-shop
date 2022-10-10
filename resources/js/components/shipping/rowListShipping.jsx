import React, { useState } from 'react';
import Axios from 'axios';
import ModalConfirmation from '../modal/modalConfirmation';
import TooltipWithoutIcon from '../elements/tooltipWithoutIcon';


const RowListShipping = ({ deliveryZoneList, setActivePanelShipping, IdDeliveryZones, setIdDeliveryZones, setIdMode, setDeliveryZoneList, setIsEditZone, getShippingsList }) => {

    const [showShipConditions, setShowShipConditions] = useState(false);
    const [distanceFromBottomShip, setDistanceFromBottomShip] = useState(null);
    const [idDistance, setIdDistance] = useState(null);
    const [idZone_arr, setIdZone_arr] = useState([]);
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [showModalConfirmation2, setShowModalConfirmation2] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [idShippingMode, setIdShippingMode] = useState(null);


    const showHideShipDestinations = (e, id) => {
        // getBoundingClientRect give position of div, ul or li
        var element = e.target;
        setDistanceFromBottomShip(window.innerHeight - element.getBoundingClientRect().bottom);

        setIdDistance(id);
        setShowShipConditions(!showShipConditions);
    }

    // rempli idZone_arr avec les id des zone dont on affiche les modes de livraison en cliquant sur "Voir"
    const showListModesDetails = (id) => {
        let tmp_idZone_arr = [...idZone_arr];
        let ndx = tmp_idZone_arr.indexOf(id);

        if (ndx > -1) {
            tmp_idZone_arr.splice(ndx, 1);
        } else {
            tmp_idZone_arr.push(id);
        }
        setIdZone_arr([...tmp_idZone_arr]);
    }

    const addDeliveryMode = (id) => {
        setIdDeliveryZones(id);
        setActivePanelShipping(3);
    }

    const editDeliveryMode = (zoneId, modeId) => {
        setIdDeliveryZones(zoneId);
        setIdMode(modeId);
        setActivePanelShipping(3);
    }

    const deleteShippingMode = (shippingItem, modesItem) => {
        setIdDeliveryZones(shippingItem.id);
        setIdShippingMode(modesItem.id);
        setMessageModal('Supprimer le mode de livraison ' + modesItem.mode_name + ' ?');
        setShowModalConfirmation2(true);
    }

    const handleModalConfirm2 = () => {
        setShowModalConfirmation2(false);

        let id_zone = IdDeliveryZones;
        let id_shippingMode = idShippingMode
        let modeToDeleteData = new FormData;
        modeToDeleteData.append('id', id_shippingMode);

        Axios.post(`http://127.0.0.1:8000/delete-Shipping_mode`, modeToDeleteData)
            .then(res => {
                if (res.data === 'ok') {
                    // refresh data after save new mode shipping
                    Axios.get(`http://127.0.0.1:8000/shipping-list`)
                        .then(res => {
                            setDeliveryZoneList(res.data[0]);
                            // retire l'id de la zone du tableau qui affiche les shippings mode lorsequ'on a effacé tous les mode de livraison 
                            let ndx_zone = res.data[0].findIndex(x => x.id == id_zone);
                            if (ndx_zone > -1) {
                                if (res.data[0][ndx_zone].shipping_modes.length == 0) showListModesDetails(id_zone);
                            }
                            setIdDeliveryZones(null);
                            setIdShippingMode(null);

                        }).catch(function (error) {
                            console.log('error:   ' + error);
                        });
                }
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }


    const editZone = (zoneId) => {
        setIdDeliveryZones(zoneId);
        setActivePanelShipping(2);
        setIsEditZone(true);
    }

    const deleteZone = (shippingItem) => {
        setIdDeliveryZones(shippingItem.id);
        let modesHTML = shippingItem.shipping_modes.map(x => x.mode_name + '<br>');
        setMessageModal('<br>Supprimer définitivement la zone ' + shippingItem.zone_name + ' et ses modes de livraison ? <br> Mode.s de livraison: <br>' + modesHTML.join(""));
        setShowModalConfirmation(true);
    }


    // delete zone
    const handleModalConfirm = () => {
        setShowModalConfirmation(false);
        let zondIdData = new FormData;
        zondIdData.append('IdDeliveryZones', IdDeliveryZones);

        Axios.post(`http://127.0.0.1:8000/delete-shipping`, zondIdData)
            .then(res => {
                console.log('res.data  ---> ', res.data);
                setIdDeliveryZones(null);
                getShippingsList();
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }

    const handleModalCancel = () => {
        setShowModalConfirmation(false);
        setShowModalConfirmation2(false);
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
        <div className='w-full'>
            {deliveryZoneList.map((shippingItem, indexLast) =>
                <div
                    key={shippingItem.id}
                    className={`grid grid-cols-[1fr_200px_120px_200px] justify-start items-center w-full h-full border-b border-gray-200 ${idZone_arr.includes(shippingItem.id) && "first:border-t"} ${indexLast == deliveryZoneList.length - 1 && !idZone_arr.includes(shippingItem.id) && "border-b-0"}`}
                >
                    {/* name */}
                    <span
                        className={`w-full h-full px-2 flex flex-row justify-start items-center truncate ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50 font-semibold" : "bg-white"}`}
                    >
                        {shippingItem.zone_name}
                    </span>

                    {/* destinations */}
                    <div
                        className={`px-2 flex flex-row w-full h-full min-h-[48px] ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                    >
                        <div className='relative w-auto flex flex-col justify-start items-start bg-white rounded-md mr-2.5'
                        >
                            {!showShipConditions ?
                                <div
                                    className={`w-full h-full min-h-[60px] max-w-[170px] flex items-center ${shippingItem.destinations.length > 1 && "cursor-pointer"} ${idZone_arr.includes(shippingItem.id) && "bg-gray-50"}`}
                                    onClick={(e) => {
                                        shippingItem.destinations.length > 1 &&
                                            showHideShipDestinations(e, shippingItem.id)
                                    }}
                                >
                                    <span
                                        className='w-full truncate flex flex-row justify-start items-center'
                                    >
                                        <span
                                            className="w-8 h-8 mr-2 rounded-full bg-blue-500 text-white flex flex-row justify-center items-center text-sm"
                                        >
                                            {shippingItem.destinations.length}
                                        </span>

                                        <span>
                                            pays
                                        </span>
                                    </span>
                                    {shippingItem.destinations?.length > 1 &&
                                        <div
                                            className="w-4 h-4 m-5 min-w-[20px] cursor-pointer"
                                            onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
                                        >
                                            <img src={window.location.origin + '/images/icons/caret-down-empty.svg'}
                                                className="w-4" />
                                        </div>
                                    }
                                </div>
                                :
                                shippingItem.destinations.length > 1 && shippingItem.id == idDistance ?
                                    <div className='w-full h-[60px]'>
                                        {/* popup with contries list */}
                                        <div
                                            className={`flex flex-col justify-start items-start w-[300px] max-h-[300px] absolute left-0 bg-white shadow-xl rounded-md z-30 ${distanceFromBottomShip < 300 ? "bottom-0" : "top-0"}`}
                                            onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
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
                                    <div
                                        className={`w-full h-full min-h-[60px] max-w-[170px] flex items-center ${idZone_arr.includes(shippingItem.id) && "bg-gray-50"}`}
                                    >
                                        <span
                                            className='w-full truncate flex flex-row justify-start items-center'
                                        >
                                            <span
                                                className="w-8 h-8 mr-2 rounded-full bg-blue-500 text-white flex flex-row justify-center items-center text-sm"
                                            >
                                                {shippingItem.destinations.length}
                                            </span>

                                            <span>
                                                pays
                                            </span>
                                        </span>
                                        {shippingItem.destinations?.length > 1 &&
                                            <div
                                                className="w-4 h-4 m-5 min-w-[20px] cursor-pointer"
                                                onClick={(e) => showHideShipDestinations(e, shippingItem.id)}
                                            >
                                                <img src={window.location.origin + '/images/icons/caret-down-empty.svg'}
                                                    className="w-4" />
                                            </div>
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                    <div className={`w-full h-full grid grid-cols-3  justify-center items-center ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                    >
                        {/* add delivery mode */}
                        <span
                            id={`addModeShipping101022${shippingItem.id}`}
                            className={`w-full h-full flex items-center ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <img
                                id={`img_addModeShipping101022${shippingItem.id}`}
                                src={window.location.origin + '/images/icons/add_icon.svg'}
                                className="h-5 w-5 m-auto cursor-pointer"
                                onClick={() => addDeliveryMode(shippingItem.id)}
                            />

                            <TooltipWithoutIcon
                                id={`addModeShipping101022${shippingItem.id}`}
                                idimg={`img_addModeShipping101022${shippingItem.id}`}
                                widthTip={220}>
                                Ajouter un mode de livraison<br></br>
                                <a href="http://127.0.0.1:8000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-sm underline underline-offset-1 text-white font-semibold hover:text-blue-300">Mon lien</a>
                            </TooltipWithoutIcon>

                        </span>

                        {/* edit zone */}
                        <span
                            id={`editModeShipping101022${shippingItem.id}`}
                            className={`w-full h-full flex items-center ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <img
                                id={`img_editModeShipping101022${shippingItem.id}`}
                                src={window.location.origin + '/images/icons/pencil.svg'}
                                className="h-5 w-5 m-auto cursor-pointer"
                                onClick={() => editZone(shippingItem.id)}
                            />
                            <TooltipWithoutIcon
                                id={`editModeShipping101022${shippingItem.id}`}
                                idimg={`img_editModeShipping101022${shippingItem.id}`}
                                widthTip={85}>
                                Modifier
                            </TooltipWithoutIcon>
                        </span>

                        {/* delete zone */}
                        <span
                            id={`deleteModeShipping101022${shippingItem.id}`}
                            className={`w-full h-full flex items-center ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                        >
                            <img
                                id={`img_deleteModeShipping101022${shippingItem.id}`}
                                src={window.location.origin + '/images/icons/trash.svg'}
                                className="h-5 w-5 m-auto cursor-pointer"
                                onClick={() => deleteZone(shippingItem)}
                            />
                            <TooltipWithoutIcon
                                id={`deleteModeShipping101022${shippingItem.id}`}
                                idimg={`img_deleteModeShipping101022${shippingItem.id}`}
                                widthTip={95}>
                                Supprimer
                            </TooltipWithoutIcon>
                        </span>
                    </div>

                    {/* show / hide list modes details */}
                    {shippingItem.shipping_modes.length > 0 ?
                        <span
                            className={`w-full h-full pl-6 flex items-center cursor-pointer ${idZone_arr.includes(shippingItem.id) ? "bg-gray-50" : "bg-white"}`}
                            id={`showModeShipping101022${shippingItem.id}`}
                            onClick={() => { showListModesDetails(shippingItem.id) }}
                        >
                            {idZone_arr.includes(shippingItem.id) ?
                                <img
                                    id={`img_showModeShipping101022${shippingItem.id}`}
                                    src={window.location.origin + '/images/icons/eye-slash.svg'}
                                    className="h-5 w-5"
                                />
                                :
                                <img
                                    id={`img_showModeShipping101022${shippingItem.id}`}
                                    src={window.location.origin + '/images/icons/eye.svg'}
                                    className="h-5 w-5"
                                />
                            }
                            <TooltipWithoutIcon
                                id={`showModeShipping101022${shippingItem.id}`}
                                idimg={`img_showModeShipping101022${shippingItem.id}`}
                                widthTip={210}>
                                Voir les modes de livraison
                            </TooltipWithoutIcon>
                        </span>
                        :
                        <span></span>
                    }

                    {/* affiche les modes de livraison */}
                    <div className={`w-full col-span-4 border-t border-x  border-gray-200 pb-4 bg-[#fefefe] ${idZone_arr.includes(shippingItem.id) ? "block" : "hidden"}`}>
                        <div className='w-full flex justify-start m-0 p-0 '>
                            <div className='w-auto flex justify-center items-center pt-3 pb-1 px-2 text-sm font-semibold'>
                                {shippingItem.length > 1 ? "Modes" : "Mode"} de livraison de la zone {shippingItem.zone_name}
                            </div>
                        </div>
                        {shippingItem.shipping_modes.length > 0 &&
                            <div className='w-full'>
                                <div
                                    className='w-full py-1 px-2  even:bg-violet-50 grid grid-cols-[1fr_140px_50px_50px] gap-2 justify-start items-center'
                                >
                                    <span className='text-sm font-semibold'>
                                        Nom
                                    </span>
                                    <span className='text-sm font-semibold'>
                                        Tarif.s
                                    </span>
                                    <span className='col-span-2 text-sm font-semibold pr-2'>
                                        Opérations
                                    </span>
                                </div>
                                {shippingItem.shipping_modes.map((modesItem, modeIndex) =>
                                    <div
                                        key={modeIndex}
                                        className='w-full py-2 px-2 even:bg-[#f9fdff] grid grid-cols-[1fr_140px_50px_50px] gap-2 justify-start items-center'
                                    >
                                        <span className='w-full truncate'>
                                            {modesItem.mode_name}
                                        </span>
                                        <span>
                                            {modesItem.conditions.length} {modesItem.conditions.length > 1 ? "tarifs" : "tarif"}
                                        </span>
                                        <span
                                            id={`edit2ModeShipping101022${shippingItem.id}`}
                                            className='w-full h-full flex justify-center items-center cursor-pointer'
                                            onClick={() => editDeliveryMode(shippingItem.id, modesItem.id)}
                                        >
                                            <img
                                                id={`img_edit2ModeShipping101022${shippingItem.id}`}
                                                src={window.location.origin + '/images/icons/pencil.svg'}
                                                className="h-5 w-5"
                                            />
                                            <TooltipWithoutIcon
                                                id={`edit2ModeShipping101022${shippingItem.id}`}
                                                idimg={`img_edit2ModeShipping101022${shippingItem.id}`}
                                                widthTip={85}>
                                                Modifier
                                            </TooltipWithoutIcon>
                                        </span>
                                        <span
                                            id={`delete2ModeShipping101022${shippingItem.id}`}
                                            className='w-full h-full flex justify-center items-center cursor-pointer'
                                            onClick={() => deleteShippingMode(shippingItem, modesItem)}
                                        >
                                            <img
                                                id={`img_delete2ModeShipping101022${shippingItem.id}`}
                                                src={window.location.origin + '/images/icons/trash.svg'}
                                                className="h-5 w-5"
                                            />
                                            <TooltipWithoutIcon
                                                id={`delete2ModeShipping101022${shippingItem.id}`}
                                                idimg={`img_delete2ModeShipping101022${shippingItem.id}`}
                                                widthTip={95}>
                                                Supprimer
                                            </TooltipWithoutIcon>
                                        </span>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </div>

            )}
            <ModalConfirmation
                show={showModalConfirmation}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
                messageModal={messageModal}
            />

            <ModalConfirmation
                show={showModalConfirmation2}
                handleModalConfirm={handleModalConfirm2}
                handleModalCancel={handleModalCancel}
            >
                <h2 className="childrenModal">{messageModal}</h2>
            </ModalConfirmation>
        </div>
    );
}

export default RowListShipping;
