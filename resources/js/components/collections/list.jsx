import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchRow from './searchRow';

const ListCollections = () => {
    const [listCollections, setListCollections] = useState([]);

    useEffect(() => {
        // chargement des collections
        axios.get(`http://127.0.0.1:8000/collections-list-back-end`)
            .then(res => {
                setListCollections(res.data);
            }).catch(function (error) {
                console.log('error:   ' + error);
            });
    }, []);


    return (
        <div>
        <div>
        <input type='text' placeholder='Filtrer les collections' />
        <button><Link className="link" to="/add-collection">Ajouter une collection</Link></button>
        </div>
            
            {listCollections.map(item => 
                  <SearchRow key={item.id} collection={item} />
            )}

        </div>
    );
}

export default ListCollections;
