import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import Option from './option';
import OptionVariantesList from './optionVariantesList';
import Axios from "axios";
import Toggle from "../../elements/toggle/toggle";
import ModalconfirmCancelWithoutSapveOptions from './modalconfirmCancelWithoutSapveOptions';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Label from '../../form/label';
import Flex_col_s_s from '../../elements/container/flex_col_s_s';
import ModalCreateOption from './modalCreateOption';

const Options = () => {

    const [showModalCancelWithoutSaveOptions, setShowModalCancelWithoutSaveOptions] = useState(false);
    const [showModalCreateOption, setShowModalCreateOption] = useState(false);

    const { optionsObj, setOptionsObj, setListType, showOptions, setShowOptions } = useContext(AppContext);

    useEffect(() => {
        // get list of option types. Is required !!
        Axios.get(`http://127.0.0.1:8000/getOptionsNames`)
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
        setShowModalCreateOption(false);
    }


    const addOption = () => {
        setOptionsObj([
            ...optionsObj,
            {
                id: Date.now(),
                name: '',
                values: [],
                ordre: optionsObj.length
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

    // show and hide add options
    const handleShowOptions = () => { console.log('ICI OPTIONS')
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
        <Flex_col_s_s>
            <Label label="Variantes" />
            <div className='w-full h-auto mb-5 mt-2.5 flex justify-between items-center'>
                <Toggle
                    id="options_add_variantes"
                    isChecked={showOptions}
                    change={handleShowOptions}
                    label="Ajouter des variantes"
                />
                <button
                    className='flex justify-around items-center px-3 py-2 shrink-0 border border-gray-300 rounded-md text-base cursor-pointer'
                    onClick={() => setShowModalCreateOption(true)}>
                    <img
                        src={window.location.origin + '/images/icons/gear.svg'}
                        className="h-[22px] w-[22px] mr-2" />
                    Céer une option
                </button>
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
                    <div className="w-full h-auto flex flex-row justify-start items-center mb-6">
                        <button
                            onClick={addOption}
                            className='h-10 px-2.5 mt-4 border border-slate-200 '>
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

            <div className='w-full'>
                {showOptions && <OptionVariantesList />}
            </div>


            <ModalconfirmCancelWithoutSapveOptions
                show={showModalCancelWithoutSaveOptions}
                handleModalConfirm={confirmCancelWithoutSapveOptions}
                handleModalCancel={closeModal}
                textButtonConfirm="Confirmer">
                <h2 className="childrenModal">Fermer sans sauvegarder les options</h2>
            </ModalconfirmCancelWithoutSapveOptions>

            <ModalCreateOption
                show={showModalCreateOption}
                handleModalConfirm={confirmCancelWithoutSapveOptions}
                handleModalCancel={closeModal}
                setShowModalCreateOption={setShowModalCreateOption} />


        </Flex_col_s_s>
    );
}

export default Options;
