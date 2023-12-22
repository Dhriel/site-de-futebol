import { useEffect, useState, useRef } from "react";
import { FiX, FiSearch } from "react-icons/fi";

import { db } from '../../services/firebaseConnection';
import {query, onSnapshot, collection,where, } from 'firebase/firestore';

import loadImage from '../../images/load.svg'

function AddPlayerMonth({closeModal, dataLista, adicionar}){
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
                    lista.push({
                        ...item.data(),
                    });
                });
                setUser(lista.reverse());
                setLoading(false);
            })


        return () => searchedPlayer();

    },[texto])

    function addItem(item){
        textFocus.current.focus();
        adicionar({
            ...item,
            gols: 0
        });
    }


    return(
        <div className="edit-container">

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

             <ul className="card-ul">
                {user?.map((item, index)=>{
                    return(
                        <li key={index}>
                            <div className='area'>
                                <button onClick={()=>addItem(item)} className='area-left'>
                                    <span className='order'>{index + 1}</span>

                                    {item?.avatarUrl ? (
                                        <img src={item.avatarUrl} alt='foto do usuário' loading='lazy'/>
                                    ) : (
                                        <img src={require('../../images/avatar.jpg')} alt='foto do usuário' loading='lazy'/>
                                    )}
                                    
                                    <div className='area-name'>
                                        <strong>{item.name}</strong>
                                        <span>{item.apelido}</span>
                                    </div>
                                </button>

                                <span className='gols'>{item.gols}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>

        <button onClick={closeModal} className='edit-close'>
                <FiX size={25}/>
        </button>
    </div>
    )
}

export default AddPlayerMonth;