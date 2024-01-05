
import { useEffect, useState, useContext } from 'react';
import {AuthContext} from '../../contexts/auth';

import Header from '../../components/Header'
import {  useParams, useNavigate } from 'react-router-dom';
import {db} from '../../services/firebaseConnection';
import {getDoc, doc} from 'firebase/firestore';

import './profile.css';

import ModalProfile from '../../components/ModalProfile';


import loadImage from '../../images/load.svg';

function Profile(){
    const {id} = useParams();
    const [player, setPlayer] = useState([]);
    const [closeModal, setCloseModal] = useState(false);
    const {user, logOut} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{

        async function loadUser(){
            setLoading(true);

            const docRef = doc(db, 'users', id);
            const userDoc = await getDoc(docRef);

            if(userDoc.exists){
                setPlayer(userDoc.data());
                setLoading(false);
            }else{
                navigate('/');
                setLoading(false);
                return;
            }
            
        }

        loadUser()

    },[user, id])
    
    if(loading){
        return(
            <div className="profile-area">
                <Header/>
                <div className='load-area'>
                    <img src={loadImage} alt='carregando' />
                </div>
            </div>
        )
    }


    return(
        <div className='profile-area'>
            <Header/>
            <section className='profile-user'>
                <div className='user-img'>
                    {player?.avatarUrl ? (
                        <img src={player.avatarUrl} alt='foto do usuário'/>
                    ) : (
                        <img src={require('../../images/avatar.jpg')} alt='foto do usuário'/>
                    )}
                
                </div>
                <div className='user-name'>
                    <h1>{player?.name}</h1>
                    <div className='user-complemento'>
                        {player?.complemento}
                    </div>
                </div>
            </section>

            <section className='profile-info'>
                <div className='info-area od2'>
                    <span className='desc'>Gols</span>
                    <span className='desc-player'>{player?.gols}</span>
                </div>

                <div className='info-area od3'>
                    <span className='desc'>POS</span>
                    <span className='desc-player'>{player?.pos}</span>
                </div>

                <div className='info-area od1'>
                    <span className='desc'>Apelido</span>
                    <span className='desc-player'>{player?.apelido}</span>
                </div>
            </section>
            { user.uid === id && (
            <div className='end-page'>
                <button onClick={()=> logOut()} style={{backgroundColor:"#131313"}}>Sair da conta</button>
                <button onClick={()=> setCloseModal(true)} style={{backgroundColor:"#00388C"}}>Editar Perfil</button>
            </div>
            )}

            {closeModal && (
                <ModalProfile closeModal={()=>setCloseModal(!closeModal)}/>
            )}
        </div>
    )
}

export default Profile;