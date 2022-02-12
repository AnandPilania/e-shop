import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import RowListCollections from './searchRow';
import AppContext from '../contexts/AppContext';


const ListCollections = () => {

    const [listCollections, setListCollections] = useState([]);
    const { checkLeave, nameCollection } = useContext(AppContext);

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
        <section className="listContainerCollections">
            <div className='headerBarCollections'>
                <input type='text' placeholder='Filtrer les collections' />
                <button><Link className="link" to="/add-collection" onClick={checkLeave}>Ajouter une collection</Link></button>
            </div>

            <table className="listCollection">
                <thead>
                    <tr>
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
        </section>
    );
}

export default ListCollections;

