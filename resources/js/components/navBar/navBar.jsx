import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [itemMenuSelected, setItemMenuSelected] = useState('');
  const [screenSize, setScreenSize] = useState('');
  const [showSideNav, setShowSideNav] = useState(true);

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

  //  handle hamberguer nav
  const handleShowSideNav = (e) => {
    e.target.setAttribute("aria-expanded", showSideNav ? "false" : "true");
    setShowSideNav(!showSideNav);
  }

  return (
    <nav
      className={`sideNav absolute lg:sticky top-14 left-0 w-0 h-[calc(100vh_-_56px)] pt-8 pl-3 bg-slate-800 flex flex-col justify-start items-start z-50 transition ease-in-out delay-150 ${showSideNav ? "translate-x-0 w-60" : "translate-x-[-100%] w-0"} lg:w-60 lg:translate-x-0`}
    >

      <button
        className="absolute top-2 left-5 w-10 h-10 p-1 cursor-pointer flex flex-col justify-around items-center bg-[#fafafa] rounded-md z-50 hover:bg-slate-200 lg:hidden"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded="false"
        onClick={handleShowSideNav}
      >
        <span className='w-full h-[3px] bg-gray-600 pointer-events-none'></span>
        <span className='w-full h-[3px] bg-gray-600 pointer-events-none'></span>
        <span className='w-full h-[3px] bg-gray-600 pointer-events-none'></span>
      </button>

      <div className="w-full py-1 text-base text-white cursor-pointer"
        onClick={() => handleMenu("products")}>
        Produits
      </div>
      {itemMenuSelected == "products" &&
        <div className="w-full py-1">
          <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/listProduct">Tous les produits</Link>
          <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/addProduct">Ajouter un produit</Link>
          <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/collections-list">Collections</Link>
        </div>}
      <div className="w-full py-1 text-base text-white cursor-pointer"
        onClick={() => handleMenu("parameters")}>
        Paramètres
      </div>
      {itemMenuSelected == "parameters" &&
        <div className="w-full py-1">
          <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/settings">Paramètres</Link>
          <Link className="block visited:text-white hover:text-white text-base text-white cursor-pointer" to="/cropImage">Crop</Link>
        </div>}
      <div>
        <span className="block hover:text-white text-base text-white cursor-pointer">{screenSize}</span>
      </div>
    </nav>
  );
}

export default Navbar;
