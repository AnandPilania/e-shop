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

    const [showConditions, setShowConditions] = useState(false);
    const [distanceFromBottom, setDistanceFromBottom] = useState(null);
    const [mainImgPath, setMainImgPath] = useState('');
    const [stockCount, setStockCount] = useState('');
    const [productCollections, setProductCollections] = useState('');

    const { screenSize, listProductsFiltered, setListProductsFiltered } =
        useContext(AppContext);


    var navigate = useNavigate();

    useEffect(() => {
        handleGridCols();
        setMainImgPath(productsFiltered.images_products.filter(x => x.ordre == 1)[0]);
        setStockCount(productsFiltered.variantes.reduce((acc, obj) => { return acc + obj.stock; }, 0));
        setProductCollections(productsFiltered.collections.map(x => x.name));
    }, []);


    // active ou désactive une collection
    const handleActivation = (id, status) => {
        let statusData = new FormData();
        statusData.append("id", id);
        statusData.append("status", status);
        Axios.post(`http://127.0.0.1:8000/handleProductStatus`, statusData).then(
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
        // isEdit indique qu'on veut éditer un produit
        navigate("/addProduct", {
            state: { productId: id, isEdit: true },
        });
    };

    const figureSize = {
        width: "50px",
        height: "50px",
        backgroundImage:
            "url(" +
            window.location.origin +
            "/" +
            mainImgPath?.path +
            ")",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };

    console.log('productsFiltered  ', productsFiltered)


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
            {screenSize > 1279 && (
                <div className="w-full flex flex-row justify-start items-center truncate">
                    <span className="w-full truncate">
                        {productsFiltered && productCollections}
                    </span>
                </div>
            )}

            {/* status */}
            {screenSize > 559 &&
                <div className="w-full min-w-[130px] flex justify-start items-center">
                    <span
                        className={`flex flex-row justify-center items-center rounded-l-[16px] rounded-r-md w-32 h-8 pl-2.5 text-[15px] lg:text-base font-normal 
                        ${productsFiltered?.status == 1 ||
                                productsFiltered?.status == 2
                                ? productsFiltered?.dateActivation <= getNowUs()
                                    ? "bg-green-100"
                                    : "bg-zinc-50"
                                : "bg-red-100"
                            }`}
                    >
                        {productsFiltered?.status == 1 ||
                            productsFiltered?.status == 2
                            ? productsFiltered?.dateActivation <= getNowUs()
                                ? "On"
                                : `${getOnlyDateShort(
                                    productsFiltered?.dateActivation
                                )}`
                            : "Off"}
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
                            <img src="../images/icons/power.PNG" className="h20" />
                        </button>
                    </span>
                </div>}

            {/* type */}
            {screenSize > 1149 && (
                <div className="w-full min-w-[90px] flex-row min-h-[48px] pl-2 xl:pl-0 text-[15px] lg:text-base truncate">
                    {productsFiltered &&
                        productsFiltered.type}
                </div>
            )}

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
