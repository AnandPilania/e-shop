import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { getNowUs, getOnlyDate, getOnlyDateShort } from '../../functions/dateTools';
import { getParameter, getOperator } from '../conditionsFunctions';
import CheckboxListCollection from './checkBox_listCollection';



// affiche les rows dans list.jsx
const RowListCollections = ({ collectionFiltered, category, listCollectionsChecked, handleCheckboxListCollection, confirmDeleteCollection }) => {

    const [conditions, setConditions] = useState(null);
    const [showConditions, setShowConditions] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);

    const { listCollectionsFiltered, setListCollectionsFiltered, screenSize } = useContext(AppContext);

    var navigate = useNavigate();

    useEffect(() => {
        setConditions(JSON.parse(collectionFiltered.objConditions));
    }, []);

    // met à jour conditions quand on ajoute de nouvelles conditions dans operations List
    useEffect(() => {
        setConditions(JSON.parse(collectionFiltered.objConditions));
    }, [collectionFiltered]);


    const showHideConditions = (e) => {
        // getBoundingClientRect give position of div, ul or li
        if (conditions?.length > 1) {
            var element = e.target;
            setDistanceFromBottom(window.innerHeight - element.getBoundingClientRect().bottom);
            setShowConditions(!showConditions);
        }
    }

    // active ou désactive une collection
    const handleActivation = (id, status) => {
        let statusData = new FormData;
        statusData.append('id', id);
        statusData.append('status', status);
        Axios.post(`http://127.0.0.1:8000/handleStatus`, statusData)
            .then(res => {
                if (res.data != '' && res.data != null && res.data != undefined) {
                    let tmp_arr = [...listCollectionsFiltered];
                    let index_arr = tmp_arr.findIndex(x => x.id == id);
                    tmp_arr[index_arr].status = res.data.status;
                    setListCollectionsFiltered(tmp_arr);
                }
            });
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

    const editCollection = (id) => {
        // isEdit indique qu'on veut éditer la collection
        navigate('/add-collection', { state: { collectionId: id, isEdit: true } });
    }


    const figureSize = {
        width: "50px",
        height: "50px",
        backgroundImage: "url(" + window.location.origin + '/' + collectionFiltered.thumbnail + ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    }

    return (
        <li className='grid grid-cols-[48px_70px_120px_65px_1fr_80px]  sm:grid-cols-[48px_70px_140px_65px_22%_1fr_80px]  md:grid-cols-[48px_70px_1fr_65px_17%_1fr_1fr_80px] xl:grid-cols-[48px_70px_1fr_65px_17%_1fr_1fr_1fr_80px] w-full h-auto min-h-[48px] bg-white p-4 border-b border-gray-200 last:rounded-b-md gap-3'>
            {/* checkBox */}
            <div className='flex justify-start items-center h-12 p-1.5 min-w-[48px]'>
                {collectionFiltered &&
                    <CheckboxListCollection
                        unikId={collectionFiltered.id}
                        handleCheckboxListCollection={handleCheckboxListCollection}
                        listCollectionsChecked={listCollectionsChecked}
                    />}
            </div>
            {/* thumbnail */}
            <div className='flex flex-row justify-center items-center min-h[48px] w-12'>
                {collectionFiltered.thumbnail &&
                    <figure className="h-12 w-12 rounded-full" style={figureSize}>
                    </figure>}
            </div>

            {/* name */}
            <div className='h-12 w-auto sm:min-w-[140px] flex flex-row justify-start items-center cursor-pointer text-[15px] lg:text-base brd-red-1'>
                {collectionFiltered &&
                    <span className='truncate'>
                        {collectionFiltered.name}
                    </span>}
            </div>

            {/* nb stock */}
            {screenSize > 559 &&
            <div className={`brd-green-1 flex flex-row justify-center items-center w-10 h-10 rounded-full bg-indigo-50 m-auto text-base ${collectionFiltered.products.length > 99 && "text-sm"}`}>
                {collectionFiltered.products.length}
            </div>}

            {/* conditions */}
            {screenSize > 639 &&
                <div className={`flex flex-row justify-start items-center min-h-[48px] ${conditions?.length > 1 && "cursor-pointer"}`} onClick={showHideConditions}>
                    {conditions !== null ?
                        conditions[0].value !== '' ?
                            <div className={`relative w-full max-w-[90%] flex flex-col justify-start items-start bg-white m-r-2.5 pl-4 pr-4 py-1 rounded-full border border-gray-300 bg-no-repeat bg-right-center caret-transparent ${conditions?.length > 1 && "bg-chevron-expand pr-12 hover:border-gray-400"}`}>

                                {!showConditions ?
                                    <div className='w-full truncate'>
                                        <span className='max-w-full text-[15px] lg:text-base'>
                                            {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                        </span>
                                    </div>
                                    :
                                    conditions.length > 1 ?
                                        <div className={`flex flex-col justify-start items-start w-72 max-h-[330px] absolute left-0 bg-white shadow-xl rounded-md z-30 ${distanceFromBottom < 330 ? "bottom-0" : "top-[-8px]"}`}>
                                            <div style={cover} onClick={showHideConditions} />
                                            <div className='w-full h-16 min-h-[64px]  pl-5 flex flex-row justify-start items-center bg-gray-100 cursor-default'>
                                                <span className="w-8 h-8 rounded-md bg-indigo-700 text-white flex flex-row justify-center  items-center text-xs">{conditions.length} </span>  &nbsp; Conditions
                                            </div>
                                            <ul className="flex flex-col justify-start items-start w-72 max-h-[265px] px-5 py-3 bg-white list-inside overflow-y-auto cursor-default">
                                                {conditions.map((item, index) =>
                                                    <li key={index}
                                                        className="w-full break-all text-[15px] lg:text-base">
                                                        {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                                                    </li>)}
                                            </ul>
                                        </div>
                                        :
                                        <div className='w-full truncate'>
                                            <span className='text-[15px] lg:text-base'>
                                                {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                            </span>
                                        </div>
                                }
                            </div>
                            : ''
                        : ''}
                </div>}

            {/* category */}
            {screenSize > 1279 &&
                <div className='flex-row min-h-[48px]'>
                    <span>{category && category.name}</span>
                </div>}

            {/* date activation */}
            <div className='w-full flex justify-start items-center'>
                <span
                    className={`shrink-0 flex flex-row justify-center items-center rounded-l-[16px] rounded-r-md w-32 h-8 pl-2.5 text-[15px] lg:text-base ${collectionFiltered?.status == 1 || collectionFiltered?.status == 2 ? collectionFiltered?.dateActivation <= getNowUs() ? 'bg-green-100' : 'bg-yellow-100' : 'bg-red-100'}`}
                >
                    {collectionFiltered?.status == 1 || collectionFiltered?.status == 2 ? collectionFiltered?.dateActivation <= getNowUs() ? "On" : `${getOnlyDateShort(collectionFiltered?.dateActivation)}` : "Off"}
                    <button
                        className="flex flex-row justify-center items-center w-8 h-8 ml-auto rounded-r-md bg-blue-50"
                        checked={collectionFiltered.status == 1}
                        onClick={() => handleActivation(collectionFiltered.id, collectionFiltered.status)}>
                        <img src='../images/icons/power.PNG' className="h20" />
                    </button>
                </span>
            </div>

            {/* created_at */}
            {screenSize > 767 &&
                <div className='flex-row min-h-[48px] pl-2 xl:pl-0 text-[15px] lg:text-base'>
                    {collectionFiltered && getOnlyDate(collectionFiltered.created_at)}
                </div>}

            {/* edit & delete */}
            <div className='w-full flex justify-center items-center'>
                <span className="mr-5 cursor-pointer"
                    onClick={() => {
                        editCollection(collectionFiltered.id);
                    }}>
                    <img src='../images/icons/pencil.svg'
                        className="w-5 h-5 inline" />
                </span>
                <span className="cursor-pointer"
                    onClick={() => confirmDeleteCollection(collectionFiltered.id, collectionFiltered.name)}>
                    <img src='../images/icons/trash.svg' className="w-5 h-5 inline" />
                </span>
            </div>
        </li>
    );
}

export default RowListCollections;

