import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { getNowUs, getOnlyDate, getOnlyDateShort } from '../functions/dateTools';
import { getParameter, getOperator } from './conditionsFunctions';
import CheckboxListCollection from '../elements/Checkbox_listCollection';


const useStyles = makeStyles({
    inputText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '60px',
        paddingLeft: '20px',
        color: '#000000',
        backgroundColor: 'white',
        fontWeight: 400,
        fontSize: '16px',
        border: '#f4f4f4 solid 1px',
        borderRadius: '5px',
    },
});

// affiche les rows dans list.jsx
const RowListCollections = ({ collectionFiltered, category, listCollectionsChecked, handleCheckboxListCollection, confirmDeleteCollection }) => {

    const classes = useStyles();
    const [conditions, setConditions] = useState(null);
    const [showConditions, setShowConditions] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);

    const { listCollectionsFiltered, setListCollectionsFiltered } = useContext(AppContext);

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
        var element = e.target;
        setDistanceFromBottom(window.innerHeight - element.getBoundingClientRect().bottom);
        setShowConditions(!showConditions);

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
        <li className='grid grid-cols-[5%_18%_7%_7%_19%_12%_12%_10%_10%] w-full h-auto min-h-[48px] bg-white p-4 border-b border-gray-200'>
            {/* checkBox */}
            <div className='flex-row min-h-[48px]'>
                {collectionFiltered &&
                    <CheckboxListCollection
                        unikId={collectionFiltered.id}
                        handleCheckboxListCollection={handleCheckboxListCollection}
                        listCollectionsChecked={listCollectionsChecked}
                    />}
            </div>
            {/* name */}
            <div className='flex-row min-h[48px] w-[95%] cursor-pointer truncate break-all '>
                {collectionFiltered && collectionFiltered.name}
            </div>
            {/* thumbnail */}
            <div className='flex flex-row justify-center items-center min-h[48px] w-12'>
                {collectionFiltered.thumbnail &&
                    <figure className="h-12 w-12 rounded-full" style={figureSize}>
                    </figure>}
            </div>
            {/* nb stock */}
            <div className="flex flex-row justify-center items-center w-10 h-10 rounded-full bg-blue-50 m-auto">
                {collectionFiltered.products.length}
            </div>
            {/* conditions */}
            <div className={`flex flex-row justify-start items-center min-h-[48px] ${conditions?.length > 1 && "cursor-pointer"}`} onClick={showHideConditions}>
                {conditions !== null ?
                    conditions[0].value !== '' ?
                        <div className='relative w-auto flex flex-col justify-start items-start bg-white rounded-md m-r-2.5'>

                            {!showConditions ?
                                <div className='w-full'>
                                    <span>
                                        {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                    </span>
                                </div>
                                :
                                conditions.length > 1 ?
                                    <div className={`flex flex-col justify-start items-start w-72 max-h-[310px] absolute left-0 bg-white shadow-xl rounded-md z-30 ${distanceFromBottom < 300 ? "bottom-0" : "top-0"}`}>
                                        <div style={cover} onClick={showHideConditions} />
                                        <div className='w-full h-14 pl-5 flex flex-row justify-start items-center bg-gray-50'>
                                            <span className="w-8 h-8 rounded-md bg-blue-600 text-white flex flex-row justify-center  items-center text-xs">{conditions.length} </span>  &nbsp; Conditions
                                        </div>
                                        <ul className="flex flex-col justify-start items-start w-72 max-h-[265px] p-5 bg-white list-inside overflow-y-auto">
                                            {conditions.map((item, index) =>
                                                <li key={index}
                                                    className="w-full break-all">
                                                    {getParameter(item.parameter) + ' ' + getOperator(item.operator) + ' ' + item.value}
                                                </li>)}
                                        </ul>
                                    </div>
                                    :
                                    <div className='w-full'>
                                        <span>
                                            {getParameter(conditions[0].parameter) + ' ' + getOperator(conditions[0].operator) + ' ' + conditions[0].value}
                                        </span>
                                    </div>
                            }
                        </div>
                        : '_'
                    : '_'}

                {conditions?.length > 1 && <div className="w-5 h-5 mr-5 ml-auto min-w-[20px]">
                    {!showConditions ? <img src={window.location.origin + '/images/icons/chevronDown.png'} className="w17" /> : <img src={window.location.origin + '/images/icons/chevronUp.png'} />}
                </div>}
            </div>
            {/* category */}
            <div className='flex-row min-h-[48px]'>
                <span>{category && category.name}</span>
            </div>
            {/* date activation */}
            <div className='flex min-h[48px]'>
                <span className={`shrink-0 flex flex-row justify-center items-center rounded-l-[16px] rounded-r-md w-32 h-8 pl-2.5 ${collectionFiltered?.status == 1 || collectionFiltered?.status == 2 ? collectionFiltered?.dateActivation <= getNowUs() ? 'bg-green-100' : 'bg-yellow-100' : 'bg-red-100'}`}>
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
            <div className='flex-row min-h-[48px]'>
                {collectionFiltered && getOnlyDate(collectionFiltered.created_at)}
            </div>
            {/* edit & delete */}
            <div>
                <span className="mr-5 cursor-pointer"
                    onClick={() => {
                        editCollection(collectionFiltered.id);
                    }}>
                    <img src='../images/icons/recycle.svg' 
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

{/* <div className={classes.inputText + " searchRowInputText"}>
        </div> */}