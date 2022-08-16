import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Option from './option';
import OptionVariantesList from './optionVariantesList';
import Axios from "axios";
import Toggle from "../../elements/toggle/toggle";
import ModalconfirmCancelWithoutSapveOptions from './modalconfirmCancelWithoutSapveOptions';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const Options = () => {

    const [showOptions, setShowOptions] = useState(false);
    const [showModalCancelWithoutSaveOptions, setShowModalCancelWithoutSaveOptions] = useState(false);

    const { optionsObj, setOptionsObj, listType, setListType } = useContext(AppContext);


    useEffect(() => {
        // get list of option types
        Axios.get(`http://127.0.0.1:8000/listtype`)
            .then(res => {
                setListType(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    const confirmCancelWithoutSapveOptions = () => {
        setShowModalCancelWithoutSaveOptions(false);
        setShowOptions(false);
        setOptionsObj([]);
    }

    const closeModal = () => {
        setShowModalCancelWithoutSaveOptions(false);
    }


    const addOption = () => {
        // get bigger ordre num
        const ordres = optionsObj.map(x => { return x.ordre });
        setOptionsObj([
            ...optionsObj,
            {
                id: Date.now(),
                name: '',
                values: [],
                ordre: ordres.length
            }]);
    }


    // si il y a une nouvelle option on l'ajoute sinon on retire l'option passée en params
    const saveOption = (newOption) => {
        let arr = [...optionsObj];
        let ndx = arr.findIndex(obj => obj.id == newOption.id);
        if (ndx > -1) {
            arr.splice(ndx, 1, newOption);
            setOptionsObj([...arr]);
        } else {
            setOptionsObj([...optionsObj, newOption]);
        }
    }

    const deleteOption = (id) => {
        let arr = [...optionsObj];
        let ndx = arr.findIndex(obj => obj.id == id);
        if (ndx > -1) {
            arr.splice(ndx, 1);
            setOptionsObj([...arr]);
        }
    }

    // const removeOptionValue = (item, optionObj_data) => {
    //     // whatOptionBeenDeleted est utilisé pour mettre à jour checkedVariantesList dans selectionVariantesList
    //     setWhatOptionBeenDeleted({ item: item, data: optionObj_data });

    //     let index = optionsObj.values.indexOf(item);
    //     if (index > -1) {
    //         let tmp_arr = [...optionsObj.values];
    //         tmp_arr.splice(index, 1);
    //         setOptionsObj({ ...optionsObj, values: [...tmp_arr] });
    //     }
    // }

    // show and hide add options
    const handleShowOptions = () => {
        if (showOptions) {
            // on demande confirmation avant d'annuler les options et de perdre tout ce qu'il y a dans les champs 
            if (optionsObj.findIndex(x => x.name.length > 0 || x.values.length > 0) > -1) {
                setShowModalCancelWithoutSaveOptions(true);
            } else {
                setShowOptions(false);
                setOptionsObj([]);
            }
        } else {
            setOptionsObj([
                ...optionsObj,
                {
                    id: Date.now(),
                    name: '',
                    values: [],
                    ordre: 0
                }
            ]);
            setShowOptions(true);
        }
    }


    const onDragEnd = (result) => {
        const { source, destination } = result;

        // si on drop en dehors de la zone droppable 
        if (!destination) {
            return;
        }

        // si on drop sur l'emplacement initial 
        if (destination.droppableId === destination.droppableId && destination.index === source.index) {
            return;
        }

        // si on drop ailleurs que sur l'emplacement initial sur la zone droppable
        const tmp_optionsObj_DnD = Array.from(optionsObj);
        const [removed] = tmp_optionsObj_DnD.splice(source.index, 1);
        tmp_optionsObj_DnD.splice(destination.index, 0, removed);

        // modifie ordre en fonction de l'emplacement de l'objet dns le tableau
        tmp_optionsObj_DnD.forEach((x, index) => {
            x.ordre = index;
        });
        setOptionsObj(tmp_optionsObj_DnD);
    };


    return (
        <div className="w-full brd-blue-2">
            <div className='w-full h-auto mb-5'>
                <Toggle
                    id="options_add_variantes"
                    isChecked={showOptions}
                    change={handleShowOptions}
                    label="Ajouter des variantes"
                />
            </div>


            {optionsObj?.length > 0 &&
                <div
                    className='w-full h-auto grid gap-x-4 gap-y-2 grid-cols-[1fr_1fr_25px] justify-start items-start px-4 pb-1'
                >
                    <label className='mt-0 mx-0 p-0'>Nom de l'option</label>
                    <label className='mt-0 mx-0 p-0'>Valeur de l'option</label>
                    <label className='mt-0 mx-0 p-0'></label>
                </div>
            }

            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <Droppable
                    droppableId={"optionsObjDroppableId"}
                    direction="vertical">
                    {(provided, snapshot) => (
                        <div
                            className='w-full'
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {optionsObj?.map((item, ndx) =>
                                <Option
                                    key={item.id}
                                    option_obj={item}
                                    saveOption={saveOption}
                                    deleteOption={deleteOption}
                                    optionsObj={optionsObj}
                                    index={ndx}
                                />
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>


                {optionsObj?.length < 4 && showOptions &&
                    <div className="w-full h-auto flex flrx-row justify-start items-center mb-[25px]">
                        <button
                            onClick={addOption}
                            className='h-[40px] px-[10px] mt-4 border border-slate-200 '>
                            Ajouter une option
                        </button>
                    </div>
                }
                {optionsObj?.length === 4 &&
                    <span className='text-blue-500 text-sm'>
                        Vous pouvez ajouter jusqu'à 4 options
                    </span>
                }

            </DragDropContext>

            <OptionVariantesList
                // listType={listType}
                setShowOptions={setShowOptions}
            />

            {/* modal for confirmation */}
            <ModalconfirmCancelWithoutSapveOptions
                show={showModalCancelWithoutSaveOptions}
                handleModalConfirm={confirmCancelWithoutSapveOptions}
                handleModalCancel={closeModal}
                textButtonConfirm="Confirmer">
                <h2 className="childrenModal">Fermer sans sauvegarder les options</h2>
            </ModalconfirmCancelWithoutSapveOptions>

        </div>
    );
}

export default Options;
