import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import RowListCollections from './searchRow';
import AppContext from '../contexts/AppContext';


const ListCollections = () => {

    const [listCollections, setListCollections] = useState([]);
    // const { checkLeave, nameCollection } = useContext(AppContext);

    useEffect(() => {
        // chargement des collections
        Axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
            .then(res => {
                setListCollections(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    return (
        <section className="col-lg-12" style={{ boxShadow: "none" }}>
            <div class="input-group mb-3">
                <input type="text" className="form-control" placeholder='Filtrer les collections' />
                <div className="input-group-append">
                    <button type="button" className='btn btn-dark'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <table class="table table-responsive">
                        <thead>
                            <tr style={{ border: "solid green 2px" }}>
                                <th colSpan="2">The table header</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {listCollections.map(item =>
                                        <RowListCollections key={item.id} collection={item} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default ListCollections;

