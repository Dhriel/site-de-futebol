import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import './styles.css'
import Header from '../../components/Header';
import Card from '../../components/Card'

import { db } from '../../services/firebaseConnection';
import {query, onSnapshot, collection,where, } from 'firebase/firestore';

import loadImage from '../../images/load.svg'


function Search(){
    const [texto, setTexto] = useState('');
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const textFocus = useRef();

    useEffect(()=>{
        textFocus.current.focus();
        setLoading(true);


            if(texto === ''){
                setUser([]);
                setLoading(false);
                return;
            }

            const docRef = collection(db, 'users');
            const q = query(docRef,where('name', '>=', texto), where('name', '<=', texto + "\uf8ff"));
            const searchedPlayer  = onSnapshot(q, (snapshot) =>{
                let lista = []

                snapshot.forEach((item)=>{

                    if(item.data().uid === 'TGOTiRQEBgawgkCTKldfGocsgS93') return;

                    lista.push({
                        ...item.data()
                    });
                });
                setUser(lista.reverse());
                setLoading(false);
            })


        return () => searchedPlayer();

    },[texto])


    return( 
        <div className="search-container">
            <Header/>
        <div className='search-area' >
                <FiSearch size={20}/>
                <input type='text'
                    value={texto}
                    ref={textFocus}
                    placeholder='Busque algum jogador pelo nome'
                    onChange={(e)=>setTexto(e.target.value)}
                />
        </div>
            {loading && (
                <div className='load-area'>
                    <img src={loadImage} alt='carregando' />
                </div>
            )}
            <Card data={user}/>
        </div>
    )
}

export default Search;