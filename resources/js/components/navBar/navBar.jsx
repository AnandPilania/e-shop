import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  const [itemMenuSelected, setItemMenuSelected] = useState('');
  const [screenSize, setScreenSize] = useState('');

  const { showSideNav, setShowSideNav, setIsVisible , hasLeaveThisPage, setHasLeaveThisPage, handleLocalStorage } = useContext(AppContext);

  // get screen size
  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize)
  }, []);

  useEffect(() => {
    setShowSideNav(screenSize < 1024 ? false : true);
  }, [screenSize]);

  const handleMenu = (menuItem) => {
    setItemMenuSelected(menuItem);
  }

  const navigateTo = (url) => {

    // déclenche le localStorage des formulaires si on quitte une des pages qui ne peuvent pas être quitter quand elles sont dirty
    if (hasLeaveThisPage === "createProductForm") {
      handleLocalStorage();
      setHasLeaveThisPage('');
    } else if (hasLeaveThisPage === "createCollectionForm") {
      handleLocalStorage();
      setHasLeaveThisPage('');
    } else {
      setIsVisible(true);
    }
    navigate(url);
  }

  return (
    <nav
      className={`sideNav absolute lg:sticky top-14 left-0 w-0 h-[calc(100vh_-_56px)] pt-8 pl-3 bg-indigo-900 flex flex-col justify-start items-start z-50 transition ease-in-out delay-150 ${showSideNav ? "translate-x-0 w-60" : "translate-x-[-100%] w-0"} lg:w-60 lg:translate-x-0`}
    >

        <>
          <div className="w-full py-1 text-base text-white cursor-pointer"
            onClick={() => handleMenu("products")}
          >
            Produits
          </div>
          {itemMenuSelected == "products" &&
            <div className="w-full py-1">
              <span className="block visited:text-white hover:text-white text-base text-white cursor-pointer" onClick={() => navigateTo("/listProduct")}>Tous les produits</span>
              <span className="block visited:text-white hover:text-white text-base text-white cursor-pointer" onClick={() => navigateTo("/addProduct")}>Ajouter un produit</span>
              <span className="block visited:text-white hover:text-white text-base text-white cursor-pointer" onClick={() => navigateTo("/collections-list")}>Collections</span>
            </div>}
          <div className="w-full py-1 text-base text-white cursor-pointer"
            onClick={() => handleMenu("parameters")}
          >
            Paramètres
          </div>
          {itemMenuSelected == "parameters" &&
            <div className="w-full py-1">
              <span className="block visited:text-white hover:text-white text-base text-white cursor-pointer" onClick={() => navigateTo("/settings")}>Paramètres</span>
              <span className="block visited:text-white hover:text-white text-base text-white cursor-pointer" onClick={() => navigateTo("/cropImage")}>Crop</span>
            </div>}
        </>
    </nav>
  );
}

export default Navbar;
