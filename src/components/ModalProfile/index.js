import { useState, useContext } from 'react';
import {AuthContext} from '../../contexts/auth';
import {FiUpload, FiX} from 'react-icons/fi';

import {storage, db} from '../../services/firebaseConnection';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { updateDoc, doc, getDocs, collection, query, where} from 'firebase/firestore';

import {toast} from 'react-toastify';

import './style.css'

export default function ModalProfile({closeModal}){
    const {user,setUser,saveUser } = useContext(AuthContext)
    
    const [name, setName] = useState(user && user?.name);
    const [apelido, setApelido] = useState(user && user?.apelido);
    const [complemento, setComplemento] = useState(user && user?.complemento);
    const [uid, setUid] = useState(user && user?.uid);

    const [pos, setPos] = useState(user && user?.pos);
    
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    const [loading, setLoading] = useState(false);



    // Meses para pegar o nome de cada um
    const [monthName] = useState([
        'Dezembro', 'Novembro', 'Outubro', 'Setembro', 'Agosto', 'Julho', 'Junho', 'Maio', 'Abril', 'Março', 'Fevereiro','Janeiro'
      ]);

    // Função parar alterar todas as informações do jogador dentro de todos os meses.
    async function handleUpdate(imagemRecebida){
        const anosTemp = [];
        const snapshot = await getDocs(collection(db, 'anos'));
        snapshot.forEach((item) => {
            anosTemp.push(`${item.id}`);
        });

        for (const anoNome of anosTemp){
            
            const docRef = doc(db, 'anos', anoNome);

            await Promise.all(
                monthName.map(async(mes)=>{
                    try{

                    const mesRef = collection(docRef, mes);
                    const dataP = await getDocs(mesRef);

                    if(!dataP.empty){
                        const docUser = doc(mesRef, uid);
                        
                        if(imagemRecebida){
                            await updateDoc(docUser, {
                                name: name,
                                apelido: apelido,
                                avatarUrl: imagemRecebida
                            })
                        }else{
                            await updateDoc(docUser, {
                                name: name,
                                apelido: apelido,
                            })
                        }
                    }

                    }catch(err){
                        console.log('Deu erro! ' + err)
                    }
                })
            )
        }




    }


    // Pegar a imagem recebida;
    async function handleFile(e){
        if(e.target.files[0]){

            // Para pegar a primeira imagem que for enviada.
            const image = e.target.files[0]
            
            try{
                // Esse url é o enviado diretamente do computador.
                setImageAvatar(image);
                // Agora transformamos a imagem em URL para ser mostrada na tela.
                setAvatarUrl(URL.createObjectURL(image));
                console.log(avatarUrl)
            }
            catch{
                toast.error('Formato de imagem inválido', {theme: 'dark'});
            }
        }
    }

    async function handleUploadFile(){
        const currentUid = user.uid;
                                                        //É literalmente o nome que a imagem está no computador do usuário.
        const uploadRef = ref(storage, `images/${currentUid}`);

        // Com esse método já envia a imagem para o storage.
        const upladoTask = uploadBytes(uploadRef, imageAvatar) 
        .then((snasphot)=>{
            // Agora nós pegamos a imagem pelo ref.
            getDownloadURL(snasphot.ref).then(async (downloadURL)=>{
                let urlFoto = downloadURL;

                // Enviamos ela para o firebase
                const docRef = doc(db, 'users', user.uid);
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    name: name,
                    apelido: apelido,
                    complemento: complemento,
                    pos: pos
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                    }
                    setUser(data);
                    saveUser(data);
                    handleUpdate(urlFoto);
                    toast.success('Perfil alterado com sucesso!', {theme: 'dark'});
                })
                .catch(()=>{
                    toast.error('Algo deu errado, tente novamente', {theme: 'dark'});
                })
            })

        })
    }

    function handleChangeSelect(e){
        setPos(e.target.value)
    }
    
    // Função para salvar informações.
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);

        if(name === '') {
            return;
        }

        if(imageAvatar === null && name !== ''){

        const upperName = upperCase(name);
        const upperApelido = upperCase(apelido);
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
            name: upperName,
            apelido: upperApelido,
            complemento: complemento,
            pos: pos
        })
        .then(()=>{
            let data = {
                ...user,
                name: upperName,
                apelido: upperApelido,
                complemento: complemento,
                pos: pos
            }

            setUser(data);
            saveUser(data);
            handleUpdate();
            closeModal();
            setLoading(false);
            toast.success('Perfil alterado com sucesso!', {theme: 'dark'});
        })
        .catch((error)=>{
            alert(error);
            setLoading(false);
        })

    }else if(name !== '' && imageAvatar !== null){
        handleUploadFile();
        closeModal();
        setLoading(false);
    }

    function upperCase(item){
        const subs = item.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        })

        return subs;
    }

}

    return(
        <div className="edit-container">
            <form className='form-modal'>

                <label className='user-img'>
                            <span>
                                <FiUpload size={25} color='#2391'/>
                            </span>

                        <input type='file' accept='image/*' onChange={handleFile} className='img-file'/>
                            {
                                avatarUrl === null ? (

                                        <img src={require('../../images/avatar.jpg')} alt='Foto de Perfil'
                                            style={{width: 200, height: 200}}
                                        />
                                    ) : (
                                        <img src={avatarUrl} alt='Foto de Perfil'
                                            style={{width: 200, height: 200}}
                                        />
                                    
                                        )
                                    }

                        <button onClick={handleSubmit} className='edit-save' style={{color: "#fff"}}>{loading ? 'Carregando....' : 'Salvar'}</button>
                    </label>
                    

                <div className='edit-area'>   
                    <label>
                        <span>Nome</span>
                        <input type='text'
                            maxLength={20}
                            value={name}
                            onChange={e=> setName(e.target.value)}
                            />
                    </label>

                    <label>
                        <span>Apelido</span>
                        <input type='text'
                            maxLength={15}
                            value={apelido}
                            onChange={e=> setApelido(e.target.value)}
                            />
                    </label>

                    <label>
                        <span>Descrição</span>
                        <input type='text'
                            value={complemento}
                            onChange={e=> setComplemento(e.target.value)}
                            maxLength={80}
                        />
                    </label>

                    <label><span>Posição</span></label>
                        <select value={pos} onChange={handleChangeSelect} className='select'>
                            <option value='GOL'>GOL</option>
                            <option value='ZAG'>ZAG</option>
                            <option value='LAT'>LAT</option>
                            <option value='VOL'>VOL</option>
                            <option value='MEI '>MEI </option>
                            <option value='ATA'>ATA</option>
                        </select>
                </div>
            </form>


            <button onClick={closeModal} className='edit-close'>
                <FiX size={25}/>
            </button>
        </div>
    )
}