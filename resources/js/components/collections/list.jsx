import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
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

    console.log('listCollections  ', listCollections)

    return (
        <section className='div-vert-align listCollections'>
            <div className='sub-div-horiz-align'>
                <input type="text" placeholder='Filtrer les collections' />
                <div>
                    <button type="button" className='btn'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <ul className='sub-div-vert-align'>
                <li>Header</li>
                {!!listCollections && listCollections.map(item =>
                    <RowListCollections key={item.id} collection={item} category={item.category} />
                )}
            </ul>
        </section>
    );
}

export default ListCollections;

