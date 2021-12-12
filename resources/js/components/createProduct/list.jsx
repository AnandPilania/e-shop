import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import InputText from '../InputText/Input_text';


const List = () => {
    const [products, setProducts] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/products`)
            .then(res => {
                setProducts(Object.values(res.data));
                // console.log(res.data);
                // Object.values(res.data).map(element => {
                //     console.log(element);
                // });

            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);

    products.map(element => {
        console.log(element);
    });


    var check = false;
    function bestSellChecked(id) {
        // if (document.getElementById(id).checked) {
        //     check = 1;
        // } else {
        //     check = 0;
        // }

        // axios.post(`http://127.0.0.1:8000/bestSeller`, {
        //         id: id,
        //         checked: check
        //     })
        //     .then(res => {
        //         console.log('res:   ' + res);
        //     }).catch(function(error) {
        //         console.log('error:   ' + error);
        //     });
    }


    return (
        <div className="card">
            <h4 className="card-title">Produits</h4>
            <button className="btn btn_ajouter"><a href="/products/create">Ajouter un article</a></button>
            <table className="table">

                <thead>
                    <tr className="tr_thead">
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Collection</th>
                        <th>Catégorie</th>
                        <th>Ajouté le</th>
                        <th>--Actions--</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>
                                <img src={window.location.origin + "/" + product.image_path} />
                            </td>
                            <td>
                                {product.name}
                            </td>
                            <td>
                                {product.collection}
                            </td>
                            <td>
                                {product.category}
                            </td>
                            <td>
                                {product.created_at}
                            </td>
                            <td className="td_buton">
                                <button className="btn btn_img">
                                    <Link className="link" to={`/editImagesProduct/${product.id}`}>Image</Link>
                                </button>



                                <button className="btn btn_edit"><Link className="link" to={`/editProduct/${product.id}`}>Modifier</Link></button>
                                

                                {/* <form action="/products/{{ $product->id }}" method="post">

                                    <input type="submit" value="Supprimer" name="delete" className="btn btn_delete" />
                                </form> */}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default List;






