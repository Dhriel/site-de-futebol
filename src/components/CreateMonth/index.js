import { useState } from 'react';

import {db} from '../../services/firebaseConnection';
import {collection, doc, getDoc, getDocs, setDoc} from 'firebase/firestore';

import {FiX} from 'react-icons/fi';


export default function CreateMonth({closeModal, atualizarAnos}){
    const [meses, setMeses] = useState('Janeiro');
    const [ano, setAno] = useState('2023');


    function handleChangeSelect(e){
        setMeses(e.target.value)
    }
    
    async function handleCreate(e){
        e.preventDefault();
        const docRef = doc(db, 'anos', ano);
        await setDoc(docRef, {createdAt: new Date()})

        const collectionRef = collection(docRef, meses);

        const hasMonth = await getDocs(collectionRef);

        if(hasMonth.size > 0){
          alert('Esse Mês Já existe!!');
          return;
        }


        await setDoc(doc(collectionRef, 'TGOTiRQEBgawgkCTKldfGocsgS93'), {
            uid: 'TGOTiRQEBgawgkCTKldfGocsgS93',
            name: 'Administrador',
            gols: 0,
            apelido: 'Bot',
            avatarURL: 'https://firebasestorage.googleapis.com/v0/b/galaticos-d9405.appspot.com/o/images%2FTGOTiRQEBgawgkCTKldfGocsgS93?alt=media&token=7b6c7998-7f09-4382-902e-e4b4989e921c'
        })
        .then(()=>{
            closeModal();
            atualizarAnos();

        })
        .catch((err)=>{
            alert(err)
        })

    }

    return(
        <div className="edit-container">
        <form className='form-modal' onSubmit={handleCreate}>

            <div className='edit-area'>   
                <label>
                    <span>Ano</span>
                    <input type='text' onChange={(e)=>setAno(e.target.value)} value={ano}/>
                </label>

                <label><span>Mês</span></label>
                    <select value={meses} onChange={handleChangeSelect}
                        style={{padding: 15, fontSize: 15}}
                    > 
                            <option value='Janeiro'>Janeiro</option>
                            <option value='Fevereiro'>Fevereiro</option>
                            <option value='Março'>Março</option>
                            <option value='Abril'>Abril</option>
                            <option value='Maio'>Maio</option>
                            <option value='Junho'>Junho</option>
                            <option value='Julho'>Julho</option>
                            <option value='Agosto'>Agosto</option>
                            <option value='Setembro'>Setembro</option>
                            <option value='Outubro'>Outubro</option>
                            <option value='Novembro'>Novembro</option>
                            <option value='Dezembro'>Dezembro</option>
                </select>

                <button
                    style={{
                        height: 40,
                        borderRadius: 3, marginTop: 20,
                        border: 0, padding: 10, fontSize: 15, backgroundColor: '#00388C', color: "#fff", width: '100%'
                    }}
            
                >Criar</button>
            </div>
        </form>


        <button onClick={closeModal} className='edit-close'>
                <FiX size={25}/>
            </button>
    </div>
    )
}
