import { React, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './menu_accordion.scss';
import AppContext from '../contexts/AppContext';


const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const { checkLeave, nameCollection } = useContext(AppContext);

  // gère le menu déroulant
  const handleMenu = (i) => {
    var acc = document.getElementsByClassName("accordion")[i];

    setIsActive(!isActive);

    var panel = acc.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  
  return (
    <nav>
      <div className={"accordion ${isActive && 'active'}"} onClick={() => handleMenu(0)} ><img className="barcodeIcon" src="../images\icons\icons8-label-128.png" />Produit</div>
      <div className="panel">
        <div className="panel_elements">
          <Link className="link" to="/listProduct" onClick={checkLeave}>Tous les produits</Link>
          <Link className="link" to="/addProduct" onClick={checkLeave}>Ajouter un produit</Link>
          <Link className="link" to="/editProduct/1" onClick={checkLeave}>Modifier un produit</Link>
          <Link className="link" to="/collections-list" onClick={checkLeave}>Collections</Link>
        </div>
      </div>

      <div className={"accordion ${isActive && 'active'}"} onClick={() => handleMenu(1)} ><img className="barcodeIcon" src="../images\icons\icons8-label-128.png" />Produit 2</div>
      <div className="panel">
        <div className="panel_elements">
          <Link className="link" to="/listProduct">Tous les produits</Link>
          <Link className="link" to="/addProduct">Ajouter un produit</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
