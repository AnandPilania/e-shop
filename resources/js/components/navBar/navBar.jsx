import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import './menu_accordion.scss';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);


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
          <Link className="link" to="/listProduct">Tous les produits</Link>
          <Link className="link" to="/addProduct">Ajouter un produit</Link>
          <Link className="link" to="/editProduct/1">Modifier un produit</Link>
          <Link className="link" to="/dash">Ajouter une catégorie</Link>
        </div>
      </div>

      <div className={"accordion ${isActive && 'active'}"} onClick={() => handleMenu(1)} ><img className="barcodeIcon" src="../images\icons\icons8-label-128.png" />Produit 2</div>
      <div className="panel">
        <div className="panel_elements">
          <Link className="link" to="/dash2">Dash2</Link>
          <Link className="link" to="/dash">Dash</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
