import React, { useState, useEffect, useContext } from "react";
import AppContext from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import {
    getNowUs,
    getOnlyDate,
    getOnlyDateShort,
} from "../../functions/dateTools";
// import { getParameter, getOperator } from "../conditionsFunctions";
import CheckboxListCollection from "./checkboxListProducts";

// affiche les rows dans list.jsx
const RowListProducts = ({ productsFiltered, collections, listProductsChecked, handleCheckboxListProduct, confirmDeleteProduct, gridCols, handleGridCols }) => {

    const [showCollections, setShowCollections] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);
    const [mainImgPath, setMainImgPath] = useState('');
    const [stockCount, setStockCount] = useState('');
    const [productCollections, setProductCollections] = useState('');
    const [availablePrice, setAvailablePrice] = useState('');
    const [statusColor, setStatusColor] = useState('green');
    const [statusState, setStatusState] = useState('Activé');

    const { screenSize, listProductsFiltered, setListProductsFiltered, listCollectionNames, setIsEditProduct, productForm, setProductForm } =
        useContext(AppContext);


    var navigate = useNavigate();

    useEffect(() => {
        handleGridCols();
        setMainImgPath(productsFiltered.images_products.filter(x => x.ordre == 1)[0]);

        let tmp_stockCount = productsFiltered.variantes.reduce((acc, obj) => { return acc + obj.stock; }, 0);
        setStockCount(tmp_stockCount > 0 ? tmp_stockCount : productsFiltered.stock);

        setProductCollections(productsFiltered.collections.map(x => x.name));

        // récupération du ou des prix des différentes variantes pour un produit donné
        let tmp_reducedPrice = productsFiltered.variantes.map(x => x.reduced_price);
        let tmp_price = productsFiltered.variantes.map(x => x.price);
        if (Math.max(...tmp_reducedPrice) > 0) {
            let tmpMin = Math.min(...tmp_reducedPrice);
            let tmpMax = Math.max(...tmp_reducedPrice);
            if (tmpMin != tmpMax) {
                setAvailablePrice(tmpMin + ' € - ' + tmpMax + ' €');
            } else {
                setAvailablePrice(tmpMax + ' €');
            }
        } else if (Math.max(...tmp_price) > 0) {
            let tmpMin = Math.min(...tmp_price);
            let tmpMax = Math.max(...tmp_price);
            if (tmpMin != tmpMax) {
                setAvailablePrice(tmpMin + ' € - ' + tmpMax + ' €');
            } else {
                setAvailablePrice(tmpMax + ' €');
            }
        } else {
            setAvailablePrice('0 €');
        }

        handleStatusColorAndStatusOnOff();
    }, []);

    // permet de mettre à jour l'image dans list product quand on modifie les images en éditant un produit et qu'on clique sur le back button pour annuler
    useEffect(() => {
        setMainImgPath(productsFiltered.images_products.filter(x => x.ordre == 1)[0]);
    }, [listCollectionNames]);


    // active ou désactive un produit
    const handleActivation = (id, status) => {
        let statusData = new FormData();
        statusData.append("id", id);
        statusData.append("status", status);
        Axios.post(`/handleProductStatus`, statusData)
            .then(
                (res) => {
                    if (
                        res.data != "" &&
                        res.data != null &&
                        res.data != undefined
                    ) {
                        let tmp_arr = [...listProductsFiltered];
                        let index_arr = tmp_arr.findIndex((x) => x.id == id);
                        tmp_arr[index_arr].status = res.data.status;
                        setListProductsFiltered(tmp_arr);
                    }
                }
            );
    };

    const handleStatusColorAndStatusOnOff = () => {
        // handle status color
        if (productsFiltered?.status == 1) {
            if (productsFiltered?.dateActivation <= getNowUs()) {
                setStatusColor('bg-green-100');
            } else {
                setStatusColor('bg-zinc-50');
            }
        } else {
            setStatusColor('bg-red-100');
        }
        // handle status state
        if (productsFiltered?.status == 1) {
            if (productsFiltered?.dateActivation <= getNowUs()) {
                setStatusState("Activé");
            } else {
                setStatusState(`${getOnlyDateShort(
                    productsFiltered?.dateActivation)}`);
            }
        } else {
            setStatusState("Désactivé");
        }
    }
    useEffect(() => {
        handleStatusColorAndStatusOnOff();
    }, [listProductsFiltered]);


    const showHideCollections = (e) => {
        // getBoundingClientRect give position of div, ul or li
        if (productCollections?.length > 1) {
            var element = e.target;
            setDistanceFromBottom(
                window.innerHeight - element.getBoundingClientRect().bottom
            );
            setShowCollections(!showCollections);
        }
    };

    // permet la fermeture du popover quand on clique n'importe où en dehors du popover
    const cover = {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "-5px",
        zIndex: "-10",
        cursor: "default",
    };

    const editProduct = (id) => {
        setIsEditProduct(true);
        // isEdit indique qu'on veut éditer un produit
        navigate("/addProduct", {
            state: { productId: id, isEdit: true },
        });
    };

    const figureSize = {
        width: "50px",
        height: "50px",
        backgroundImage:
            "url(/storage/" +
            mainImgPath?.path +
            ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };



    return (
        // <li className="flex flex-row justify-between items-center w-full h-auto min-h-[48px] bg-white p-4 border-b border-gray-200 last:rounded-b-md">     

        <li className={`grid ${gridCols} gap-2 w-full h-auto min-h-[48px] bg-white py-4 border-b border-gray-200 last:rounded-b-md`}
        >
            {/* checkBox */}
            <div className="w-full flex justify-center items-center h-12 min-w-[48px]">
                {productsFiltered && (
                    <CheckboxListCollection
                        unikId={productsFiltered.id}
                        handleCheckboxListProduct={
                            handleCheckboxListProduct
                        }
                        listProductsChecked={listProductsChecked}
                    />
                )}
            </div>

            {/* thumbnail */}
            <div className="flex flex-row justify-center items-center min-h[48px] w-full">
                {mainImgPath?.path != undefined &&
                    <figure
                        className="h-12 w-12 rounded-full"
                        style={figureSize}
                    ></figure>}
            </div>

            {/* name */}
            <div className="w-full min-w-[130px] h-12 flex flex-row justify-start items-center cursor-pointer text-[15px] lg:text-base truncate">
                {productsFiltered && (
                    <span className="truncate font-medium"
                        onClick={() => {
                            editProduct(productsFiltered.id);
                        }}
                    >{productsFiltered.name}</span>
                )}
            </div>

            {/* variantes */}
            {screenSize > 639 && (
                <div className="w-full">
                    <span
                        className={`flex flex-row justify-center items-center w-10 h-10 rounded-full bg-indigo-50 m-auto text-sm`}
                    >
                        {productsFiltered.variantes.length}
                    </span>
                </div>
            )}

            {/* price */}
            {screenSize > 639 && (
                <div className="w-full">
                    <span
                        className={`flex flex-row justify-center items-center w-40 h-10 text-sm`}
                    >
                        {availablePrice}
                    </span>
                </div>
            )}

            {/* stock */}
            {screenSize > 639 && (
                <div className="w-full">
                    <span
                        className={`flex flex-row justify-center items-center w-10 h-10 rounded-full bg-indigo-50 m-auto text-sm`}
                    >
                        {stockCount}
                    </span>
                </div>
            )}


            {/* collections */}
            {screenSize > 839 && (
                <div
                    className={`w-full flex flex-row justify-start items-center min-h-[48px] ${productCollections?.length > 1 && "cursor-pointer"
                        }`}
                    onClick={showHideCollections}
                >
                    {productCollections.length > 0 ? (
                        productCollections[0] !== "" ? (
                            <div
                                className={`relative w-full max-w-[90%] flex flex-col justify-start items-start bg-white pl-4 pr-4 py-1 rounded-full border border-gray-300 bg-no-repeat bg-right-center caret-transparent ${productCollections?.length > 1 &&
                                    "bg-chevron-expand pr-12 hover:border-gray-400"
                                    }`}
                            >
                                {!showCollections ? (
                                    <div className="w-full truncate">
                                        <span className="max-w-full text-[15px] lg:text-base">
                                            {productCollections[0]}
                                        </span>
                                    </div>
                                ) : productCollections.length > 1 ? (
                                    <div
                                        className={`flex flex-col justify-start items-start w-72 max-h-[330px] absolute left-0 bg-white shadow-xl rounded-md z-30 ${distanceFromBottom < 330
                                            ? "bottom-0"
                                            : "top-[-8px]"
                                            }`}
                                    >
                                        <div
                                            style={cover}
                                            onClick={showHideCollections}
                                        />
                                        <div className="w-full h-16 min-h-[64px]  pl-5 flex flex-row justify-start items-center bg-gray-100 cursor-default text-sm">
                                            <span className="w-4 h-4 rounded-sm bg-indigo-700 text-white flex flex-row justify-center  items-center">
                                            </span>{" "}
                                            &nbsp; Cet article est dans {productCollections.length} collection{productCollections.length > 1 && "s"}
                                        </div>
                                        <ul className="flex flex-col justify-start items-start w-72 max-h-[265px] px-5 py-3 bg-white list-inside overflow-y-auto cursor-default">
                                            {productCollections.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="w-full break-all text-[15px] lg:text-base"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="w-full truncate">
                                        <span className="text-[15px] lg:text-base">
                                            {productCollections[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            ""
                        )
                    ) : (
                        ""
                    )}
                </div>
            )}

            {/* status */}
            {screenSize > 559 &&
                <div className="w-full min-w-[130px] flex justify-start items-center">
                    <span
                        className={`flex flex-row justify-center items-center rounded-l-[16px] rounded-r-md w-32 h-8 pl-2.5 text-[15px] lg:text-base font-normal 
                        ${statusColor}`}
                    >
                        {statusState}
                        <button
                            className="flex flex-row justify-center items-center w-8 h-8 ml-auto rounded-r-md bg-indigo-50"
                            // checked={productsFiltered.status == 1}
                            onClick={() =>
                                handleActivation(
                                    productsFiltered.id,
                                    productsFiltered.status
                                )
                            }
                        >
                            <img src="../images/icons/power.svg" className="h-5" />
                        </button>
                    </span>
                </div>}

            {/* created_at */}
            {screenSize > 1149 && (
                <div className="w-full min-w-[90px] flex-row min-h-[48px] pl-2 xl:pl-0 text-[15px] lg:text-base truncate">
                    {productsFiltered &&
                        getOnlyDate(productsFiltered.created_at)}
                </div>
            )}

            {/* edit & delete */}
            <div className="w-full flex justify-center items-center">
                <span
                    className="mr-5 cursor-pointer"
                    onClick={() => {
                        editProduct(productsFiltered.id);
                    }}
                >
                    <img
                        src="../images/icons/pencil.svg"
                        className="w-5 h-5 inline"
                    />
                </span>
                <span
                    className="cursor-pointer"
                    onClick={() =>
                        confirmDeleteProduct(
                            productsFiltered.id,
                            productsFiltered.name
                        )
                    }
                >
                    <img
                        src="../images/icons/trash.svg"
                        className="w-5 h-5 inline"
                    />
                </span>
            </div>
        </li>
    );
};

export default RowListProducts;
