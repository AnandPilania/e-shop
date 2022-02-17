import { React, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import RowListCollections from './RowListCollections';
import AppContext from '../contexts/AppContext';


const ListCollections = () => {

    const [listCollections, setListCollections] = useState([]);
    const [doggleSort, setDoggleSort] = useState({
        nameSens: true,
        categorySens: true,
        ceated_atSens: true
    });

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

    useEffect(() => {
        // add category name in new property categoryName
        listCollections && listCollections.map((item, index) => {
            listCollections[index].categoryName = item.category ? item.category.name : '';
        })
    }, [listCollections]);

    // sort routing 
    function sortList(sender) {
        switch (sender) {
            case 'name':
                doggleSort.nameSens === true ? sortList_AZ('name') : sortList_ZA('name');
                setDoggleSort((prevState) => ({
                    ...prevState,
                    nameSens: !doggleSort.nameSens,
                    categorySens: true,
                    ceated_atSens: true
                })); 
                break;
            case 'categoryName':
                doggleSort.categorySens === true ? sortList_AZ('categoryName') : sortList_ZA('categoryName');
                setDoggleSort((prevState) => ({
                    ...prevState,
                    categorySens: !doggleSort.categorySens,
                    nameSens: true,
                    ceated_atSens: true
                })); 
                break;
            case 'created_at':
                doggleSort.ceated_atSens === true ? sortList_AZ('created_at') : sortList_ZA('created_at');
                setDoggleSort((prevState) => ({
                    ...prevState,
                    ceated_atSens: !doggleSort.ceated_atSens,
                    nameSens: true,
                    categorySens: true,
                })); 
                break;
            default:
                doggleSort.nameSens === true ? sortList_AZ('name') : sortList_ZA('name');
                setDoggleSort((prevState) => ({
                    ...prevState,
                    nameSens: !doggleSort.nameSens,
                    categorySens: true,
                    ceated_atSens: true
                })); 
         }
    }
    // sort list
    function sortList_AZ(item) {
        setListCollections([].concat(listCollections).sort((a, b) => a[item].localeCompare(b[item])));
    }
    function sortList_ZA(item) {
        setListCollections([].concat(listCollections).sort((b, a) => a[item].localeCompare(b[item])));
    }


    return (
        <section className='div-vert-align listCollections'>
            <div className='sub-div-horiz-align'>
                <input type="text" placeholder='Filtrer les collections' />
                <div>
                    <button type="button" className='btn'><Link to="/add-collection">Ajouter une collection</Link></button>
                </div>
            </div>
            <ul className='sub-div-vert-align'>
                <li className='sub-div-horiz-align bg-white p15 m10'>
                    <div className='w50 p5'>
                        {<input
                            // className={classes.checkBox}
                            type='checkbox'
                            value="all" />}
                    </div>
                    <div className='w20pct p5 flex-row'>
                        Nom
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('name')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                    <div className='w75'>
                        {/* collection.thumbnail */}
                    </div>
                    <div className='w150 p5 txt-c'>
                        Supprimer
                    </div>
                    <div className="w30pct p5">
                        Conditions
                    </div>
                    <div className='w20pct p5 flex-row'>
                        Catégories
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('categoryName')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                    <div className='w20pct p5 flex-row'>
                        Date Création
                        <figure className='h15 w15 m-l-10 cursor' onClick={() => sortList('created_at')}>
                            <img src={window.location.origin + '/images/icons/sort.png'} />
                        </figure>
                    </div>
                </li>
                {!!listCollections && listCollections.map(item =>
                    <RowListCollections key={item.id} collection={item} category={item.category} />
                )}
            </ul>
        </section>
    );
}

export default ListCollections;

