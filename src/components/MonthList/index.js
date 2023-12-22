import { useEffect, useState } from 'react';
import './monthlist.css';
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiRefreshCw, FiPlusCircle } from 'react-icons/fi';

import { db } from '../../services/firebaseConnection';
import {updateDoc, doc, collection, deleteDoc, setDoc, getDoc} from 'firebase/firestore';

import AddPlayerMonth from '../AddPlayerMonth';

function MonthList({ data }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [monthData, setMonthData] = useState(data || []); // Começar com um array vazio se o não receber nada
  const [clicado, setClicado] = useState([]);
  const [refresh, setRefresh] = useState(false);
  
  const [permission, setPermission] = useState(false);

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

  useEffect(() => {
    const sortedData = monthData.map((item) => ({
      ...item,
      eachMonth: item.eachMonth.map((month) => ({
        ...month,
        artilharia: [...month.artilharia].sort((a, b) => b.gols - a.gols),
      })),
    }));
    setMonthData(sortedData);
  }, [refresh]);


  // Aumenta da lista
  function handleAddGols(index, monthIndex, playerIndex){
    // Pegar o index geral de anos, o index do mês e o index do jogador.
    const updatedMonthData = [...monthData];

    let year = (updatedMonthData[index].year)
    let month = updatedMonthData[index].eachMonth[monthIndex].mesNome;
    let user = updatedMonthData[index].eachMonth[monthIndex].artilharia[playerIndex].uid;
    let gols = updatedMonthData[index].eachMonth[monthIndex].artilharia[playerIndex].gols;

    updatedMonthData[index].eachMonth[monthIndex].artilharia[playerIndex].gols++
    addFirebase(year, month, user, gols);

    setMonthData(updatedMonthData);
  };

    // Diminui da lista 
  function handleMinusGols(index,monthIndex, playerIndex){
      const updatedMonthData = [...monthData];
      const currentMonth = updatedMonthData[index].eachMonth[monthIndex];
  
      let year = updatedMonthData[index].year;
      let month = currentMonth.mesNome;
      let user = currentMonth.artilharia[playerIndex].uid;
      let gols =currentMonth.artilharia[playerIndex].gols;
  
      if(gols === 0){
        removeFirebase(year, month, user);
        currentMonth.artilharia.splice(playerIndex, 1);
  
        if(currentMonth.artilharia.length === 0){
          updatedMonthData[index].eachMonth.splice(monthIndex, 1);
  
        }
  
        if(updatedMonthData[index].eachMonth.length === 0){
          updatedMonthData.splice(index, 1);
          removeYearFirebase(year);
        }
  
        setMonthData(updatedMonthData);
  
      }else{
        minusFirebase(year, month, user, gols);
        updatedMonthData[index].eachMonth[monthIndex].artilharia[playerIndex].gols--;
        setMonthData(updatedMonthData);
      }
  
    };

  // Aumenta a quantidade de gols no firebase.
  async function addFirebase(year, month, user, gols){
    try{

    const docRef = doc(db, 'anos', year);
    const collectionRef = collection(docRef, month);
    const docCollectionRef = doc(collectionRef, user);

    await updateDoc(docCollectionRef, {
      gols: gols + 1
    });

    const docUser = doc(db, 'users', user);
    await getDoc(docUser)
    .then(async (snapshot)=>{
      
      if(snapshot.exists()){

        const currentGols = snapshot.data().gols;

        await updateDoc(docUser,{
          gols: currentGols + 1
        })
      }

    })
    .catch(()=>{
      alert('Gol não adicionado');
    })


    }catch{
      alert('Deu erro!')
    }

  }

  // Diminui a quantidade de gols no firebase.
  async function minusFirebase(year, month, user, gols){
    try{

      const docRef = doc(db, 'anos', year);
      const collectionRef = collection(docRef, month);
      const docCollectionRef = doc(collectionRef, user);

      await updateDoc(docCollectionRef, {
        gols: gols -1
      });

      const docUser = doc(db, 'users', user);
      await getDoc(docUser)
      .then(async (snapshot)=>{
        
        if(snapshot.exists()){
  
          const currentGols = snapshot.data().gols;
  
          await updateDoc(docUser,{
            gols: currentGols - 1
          })
        }
  
      })
      .catch(()=>{
        alert('Gol não adicionado');
      })

    }catch{
      alert('Deu erro!')
    }

  }


  // Remove usuário do firebase.
  async function removeFirebase(year, month, user){
    const docRef = doc(db, 'anos', year);
    const collectionRef = collection(docRef, month);
    const docCollectionRef = doc(collectionRef, user);
    await deleteDoc(docCollectionRef);
  }

  // Adiciona um novo jogar na lista.
  async function adicionarNovosDados(novosDados){
    const updatedMonthData = [...monthData];
    let refreshGols = {
      ...novosDados,
      gols: 0
    }

    const userExists = updatedMonthData[clicado[0]].eachMonth[clicado[1]].artilharia.some((item) => item.uid === novosDados.uid);

    if(userExists){
      console.log('Usuário já adicionado')
    }else{

      updatedMonthData[clicado[0]].eachMonth[clicado[1]].artilharia.push(refreshGols);

      const docRef = doc(db, 'anos', clicado[2]);
      const mesRef = collection(docRef, clicado[3]);// Vai buscar a coleção de anos.
      const newDocRef = doc(mesRef, novosDados.uid);

      await setDoc(newDocRef, {...novosDados})
      .then(()=>{
        console.log('Adicionado!')
      })
      .catch(()=>{
        alert('Não conseguiu salvar os dados')
    })

    }

  }

  //Remove ano do firebase
  async function removeYearFirebase(year){
    const docRef = doc(db, 'anos', year);
    await deleteDoc(docRef);
  }

  if (!monthData) {
    return null;
  }

  return (
    <div className='artilharia-container'>
      {monthData?.map((item, index) => (
        <div className='artilharia-area' key={index}>
           <h2>{item?.year}</h2>
          <ul className='artilharia-box'>
            {item.eachMonth.map((monthData, monthIndex) => (
              <li className='artilharia-lista' key={monthIndex}>
                <div className='artilharia-mesnome'>
                  <h3>{monthData?.mesNome}</h3>
                  {permission && (
                    <>
                      <button style={{backgroundColor: "#5a189a"}} onClick={()=> setRefresh(!refresh)}><FiRefreshCw color='#fff'/></button>
                      <button style={{backgroundColor: "#55a630"}} 
                        onClick={()=> {
                            setClicado([`${index}`, `${monthIndex}`, `${item.year}`,`${monthData.mesNome}`]);
                            setModalVisible(true);
                          }}><FiPlusCircle color='#FFF'/>
                      </button>
                    </>
                  )}
                </div>
                <ul>
                  {monthData.artilharia.map((playerData, playerIndex) => (
                    <li key={playerIndex}>
                      <div className='montharea'>
                        <Link to={`/profile/${playerData.uid}`} className='montharea-left'>
                          <span className='monthorder'>{playerIndex + 1}</span>
                          {playerData?.avatarUrl ? (
                            <img src={playerData.avatarUrl} alt='foto do usuário' loading='lazy'/>
                          ) : (
                            <img src={require('../../images/avatar.jpg')} alt='foto do usuário' loading='lazy'/>
                          )}
                          <div className='montharea-name'>
                            <strong>{playerData?.name}</strong>
                            <span>{playerData?.apelido}</span>
                          </div>
                        </Link>
                        <div className='montharea-button'>
                            {permission ? (
                              <>
                              <button onClick={() => handleMinusGols(index, monthIndex, playerIndex)}
                                style={{backgroundColor: "#d00000"}}
                                >
                                <FiMinus size={17} />
                                </button>
                                <span className='gols'>{playerData?.gols}</span>
                                <button onClick={() => handleAddGols(index, monthIndex, playerIndex)}
                                  style={{backgroundColor: "#22333b"}}
                                >
                                  <FiPlus size={17} />
                              </button>
                              </>
                            ) : (
                                <>
                                  <span className='gols'>{playerData?.gols}</span>
                                </>
                            )}

                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {modalVisible && (
        <AddPlayerMonth  closeModal={()=> setModalVisible(false)} adicionar={adicionarNovosDados}/>
      )}
    </div>
  );
}

export default MonthList;
