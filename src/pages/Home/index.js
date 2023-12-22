import { useEffect,useState,  } from 'react';
import { Link } from "react-router-dom";

import { FcFlashOn } from "react-icons/fc";
import { FiCheckCircle,FiPlusCircle } from "react-icons/fi";


import { db } from '../../services/firebaseConnection';
import {setDoc, doc, collection, getDocs} from 'firebase/firestore';

import AddPlayerMonth from '../../components/AddPlayerMonth';

import loadImage from '../../images/load.svg';


import './home.css'

import Header from '../../components/Header';

function Home() {
  const [permission, setPermission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerShow, setPlayerShow] = useState([]) // Pegar o artilheiro do mês;

    useEffect(()=>{     
      async function load(){
        
        const collectionRef = collection(db, 'artilharia');
        await getDocs(collectionRef)
        .then((snapshot)=>{
          let lista = [];

          snapshot.forEach((item)=>{
            lista.push({
              ...item.data()
            })
          })

          setPlayerShow(lista[0]);
          console.log(lista);

        })
        .catch((err)=>{
          alert(err)
        })
        

      }

      load();

    },[])

    useEffect(()=>{
        async function loadAdm(){
            const storageUser = localStorage.getItem('@user');
            if(storageUser){
                const user = JSON.parse(storageUser);
                if(user.uid === 'TGOTiRQEBgawgkCTKldfGocsgS93') setPermission(true);
                
            }
        }
        loadAdm();
    });

    async function adicionarNovosDados(novosDados){
      let data = {...novosDados}
      const docRef = doc(db, 'artilharia', 'artilheiro')
      await setDoc(docRef,{
        ...novosDados
      })
      .then(()=>{
        console.log('Deu certo!')
        setPlayerShow(data);
        console.log(data)
      })
      .catch((err)=>{
        console.log(`Deu erro: ${err}`)
      })
    }

  return (
    <div className='home-container'>
      
      {permission && (
                <>
                    <label className='month-button'>
                        <button onClick={() => setModalVisible(true)}>
                            <FiPlusCircle style={{ marginRight: '10px' }} /> Alterar Jogador
                        </button>
                    </label>
                </>
            )}

      <Header/>
      <div className='home-left'>
        <Link to='/rank' className='home-button'>
          <FcFlashOn size={30}/>
            ARTILHARIA GERAL
        </Link>

        <Link to='/month' className='home-button2'>
          <FiCheckCircle size={30}/>
          GOLS POR MÊS
        </Link>

        <div className='home-area'>
          <Link to={`/profile/${playerShow.uid}`} className='home-img'>
              <img src={playerShow.avatarUrl ? playerShow.avatarUrl : require('../../images/avatar.jpg')}/>
          </Link>
          {playerShow ? (
            <>
              <h1>
                Parabéns <span style={{color: '#FCA311'}}>{playerShow?.name}</span><br/>
                <span style={{color:"#0C6DFF"}}>ARTILHEIRO DO MÊS</span>
              </h1>
            </>
          ) : (
            <>
              <img src={loadImage} alt='carregando' />
            </>
          )}
        </div>


      </div>
      <div className='home-right'>
        <img src={require('../../images/logobranco.png')}/>
      </div>
      
      {modalVisible && (
        <AddPlayerMonth  closeModal={()=> setModalVisible(false)} adicionar={adicionarNovosDados}/>
      )}

    </div>
  );
}

export default Home;
