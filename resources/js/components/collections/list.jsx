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
        <section className='div-vert-align'>
            <div className='sub-div-horiz-align'>
                <input type="text" placeholder='Filtrer les collections' />
                <div>
                    <button type="button" className='btn'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <table className='sub-div-vert-align' style={{ border: "solid red 2px" }}>
                <thead className='sub-div-horiz-align'>
                    <tr style={{ border: "solid green 2px" }}>
                        <th colSpan="2">The table header</th>
                    </tr>
                </thead>
                <tbody className='sub-div-vert-align' style={{ border: "solid blue 2px" }}>
                    {!!listCollections && listCollections.map(item => 
                        <RowListCollections key={item.id} collection={item} category={item.category} />
                    )}
                </tbody>
            </table>
        </section>
    );
}

export default ListCollections;

