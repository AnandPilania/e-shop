import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/dropDown.scss';
// import AppContext from '../contexts/AppContext';


const Navbar = () => {
  const [isActive, setIsActive] = useState(false);


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

      <div className={"accordion ${isActive && 'active'}"} onClick={() => handleMenu(0)} ><img className="barcodeIcon" src="../images\icons\icons8-label-128.png" />
        Produit
      </div>

      <div className="panel">
        <div className="panel_elements">
          <Link className="link" to="/listProduct">Tous les produits</Link>
          <Link className="link" to="/addProduct">Ajouter un produit</Link>
          <Link className="link" to="/editProduct/1">Modifier un produit</Link>
          <Link className="link" to="/collections-list">Collections</Link>
          <Link className="link" to="/cropImage">Crop</Link>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
