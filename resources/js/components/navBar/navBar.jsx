import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [itemMenuSelected, setItemMenuSelected] = useState('');
  const [screenSize, setScreenSize] = useState('');

  const { showSideNav, setShowSideNav } = useContext(AppContext);

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

  return (
    <nav
      className={`sideNav absolute lg:sticky top-14 left-0 w-0 h-[calc(100vh_-_56px)] pt-8 pl-3 bg-slate-800 flex flex-col justify-start items-start z-50 transition ease-in-out delay-150 ${showSideNav ? "translate-x-0 w-60" : "translate-x-[-100%] w-0"} lg:w-60 lg:translate-x-0`}
    >
      {showSideNav &&
        <>
          <div className="w-full py-1 text-base text-white cursor-pointer"
            onClick={() => handleMenu("products")}
          >
            Produits
          </div>
          {itemMenuSelected == "products" &&
            <div className="w-full py-1">
              <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/listProduct">Tous les produits</Link>
              <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/addProduct">Ajouter un produit</Link>
              <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/collections-list">Collections</Link>
            </div>}
          <div className="w-full py-1 text-base text-white cursor-pointer"
            onClick={() => handleMenu("parameters")}
          >
            Paramètres
          </div>
          {itemMenuSelected == "parameters" &&
            <div className="w-full py-1">
              <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/settings">Paramètres</Link>
              <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/cropImage">Crop</Link>
            </div>}
        </>}
    </nav>
  );
}

export default Navbar;
