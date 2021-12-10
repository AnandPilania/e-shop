import { React, useState, useEffect } from 'react';
import axios from 'axios';
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

    const handleChecked = (best_sell) => {
        // event.target.checked = best_sell == 1 ? true : false;
    }

    return (
        <div className="card">
            <h4 className="card-title">Produits</h4>
            <button className="btn btn_ajouter"><a href="/products/create">Ajouter un article</a></button>
            <table className="table">

                <thead>
                    <tr className="tr_thead">
                        <th>Order #</th>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Collection</th>
                        <th>Prix</th>
                        <th>Best Seller</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="td_id">
                                {product.id}
                            </td>
                            <td>
             
                                    <img src={window.location.origin + "/" + product.image_path} />
                             
                            </td>
                            <td>
                                {product.name}
                            </td>
                            {/* <td>
                                 @isset($product->collections->first()->name) 
                                    @foreach($product->collections as $collection)
                                product.collection.name
                                <br>
                                    @endforeach
                                    @endisset
                            </td> */}
                            <td>
                                {/* {product.price} */}
                            </td>
                            <td>
                                <input type="checkbox" id={product.id} onClick={bestSellChecked(product.id)}  onChange={handleChecked(product.best_sell)}  />
                            </td>
                            <td className="td_buton">
                                {/* <button class="btn btn_img"><a href="/editImagesProduct/{{$product->id}}">Image</a></button>

                                <button class="btn btn_edit"><a href="/products/{{$product->id}}/edit">Modifier</a></button>


                                <form action="/products/{{ $product->id }}" method="post">

                                    <input type="submit" value="Supprimer" name="delete" class="btn btn_delete" />
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






