import {useEffect, useState} from 'react';
import {db} from '../../services/firebaseConnection';
import {getDocs, collection} from 'firebase/firestore';

import './rank.css';

import Header from '../../components/Header';
import { Link } from 'react-router-dom';

import Card from '../../components/Card';

import loadImage from '../../images/load.svg';

function Rank(){
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{

        async function loadPlayer(){
            setLoading(true);
            const docRef = collection(db, 'users');
            await getDocs(docRef)
            .then((snapshot)=>{

                let lista = [];

                snapshot.forEach((item)=>{
                    
                    if(item.data().uid === 'TGOTiRQEBgawgkCTKldfGocsgS93') return;

                    lista.push({
                        uid: item.id,
                        name: item.data().name,
                        apelido: item.data().apelido,
                        gols: item.data().gols,
                        avatarUrl: item.data().avatarUrl

                    })
                })

                const sorted = lista.sort((a,b)=>{
                    return a.gols - b.gols
                })
                setPlayers(sorted.reverse());
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false);
                
            })
            
        }

        loadPlayer();

    },[])

    return(
        <div className="container">
            <Header/>
            <h1 style={{fontSize: '2.5em', margin: 0}}>Artilharia Geral</h1>
            {loading && (
                <div className='load-area'>
                    <img src={loadImage} alt='carregando' />
                </div>
            )}
            <Card data={players}/>
        </div>
    )
}

export default Rank;