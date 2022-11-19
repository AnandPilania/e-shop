import { useContext } from 'react';
import AppContext from '../contexts/AppContext';

export function useHandleLocalStorage(isVisiblePage) {


    const { descriptionProduct, supplier, collections, productPrice, productStock, productParcelWeight, transporter, productParcelWeightMeasureUnit, nameProduct, optionsObj, tva, imageVariantes, productCode, productCost, reducedProductPrice, variantes, metaTitleProduct, metaDescriptionProduct, metaUrlProduct, ribbonProduct, unlimited, isInAutoCollection, dateFieldProduct, promoApplied, promoType, isShowPromoProduct, changedVariantes, productStatus } = useContext(AppContext);

    if (isVisiblePage) {
    let prodGlobalHook = {};
    prodGlobalHook.nameProduct = nameProduct;
    prodGlobalHook.isInAutoCollection = isInAutoCollection;
    prodGlobalHook.ribbonProduct = ribbonProduct;
    prodGlobalHook.descriptionProduct = descriptionProduct;
    prodGlobalHook.collections = collections;
    prodGlobalHook.productPrice = productPrice;
    prodGlobalHook.reducedProductPrice = reducedProductPrice;
    prodGlobalHook.promoApplied = promoApplied;
    prodGlobalHook.promoType = promoType;
    prodGlobalHook.productCost = productCost;
    prodGlobalHook.productStock = productStock;
    prodGlobalHook.unlimited = unlimited;
    prodGlobalHook.productStatus = productStatus;
    prodGlobalHook.productParcelWeight = productParcelWeight;
    prodGlobalHook.productParcelWeightMeasureUnit = productParcelWeightMeasureUnit;
    prodGlobalHook.productCode = productCode;
    prodGlobalHook.transporter = transporter;
    prodGlobalHook.optionsObj = optionsObj;
    prodGlobalHook.metaUrlProduct = metaUrlProduct;
    prodGlobalHook.metaTitleProduct = metaTitleProduct;
    prodGlobalHook.metaDescriptionProduct = metaDescriptionProduct;
    prodGlobalHook.dateFieldProduct = dateFieldProduct
    prodGlobalHook.tva = tva;
    prodGlobalHook.supplier = supplier;
    prodGlobalHook.variantes = variantes;
    prodGlobalHook.imageVariantes = imageVariantes;
    prodGlobalHook.changedVariantes = changedVariantes;
    prodGlobalHook.isShowPromoProduct = isShowPromoProduct;

    localStorage.setItem('productForm', JSON.stringify(prodGlobalHook));
  }

  return true;
}