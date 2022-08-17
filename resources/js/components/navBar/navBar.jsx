import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [itemMenuSelected, setItemMenuSelected] = useState('');
  const [screenSize, setScreenSize] = useState('');

  // get screen size
  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize)
  });

  const handleMenu = (menuItem) => {
    setItemMenuSelected(menuItem);
  }


  return (
    <nav className="sticky top-14 w-full h-[calc(100vh_-_56px)] pt-8 pl-3 bg-slate-800 flex flex-col justify-start items-start">
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
