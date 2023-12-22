import {createContext, useState, useEffect} from 'react';
import {auth, db} from '../services/firebaseConnection';

import {getDoc, setDoc, doc} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState([]);
    const [loadingAuth, setLoadingAuth] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{

        async function loadUser(){

            const storageUser = localStorage.getItem('@user');

            if(storageUser){
                setUser(JSON.parse(storageUser));
            }

        }

        loadUser();

    },[])
    
    // Logar
    async function signIn(email, password){
        setLoadingAuth(true);
        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef)

                let data = {
                    name: docSnap.data().name,
                    gols: docSnap.data().gols,
                    uid: uid,
                    apelido: docSnap.data().apelido,
                    partidas: docSnap.data().partidas,
                    pos:docSnap.data().pos,
                    complemento: docSnap.data().complemento,
                    avatarUrl: docSnap.data().avatarUrl
                }

            setUser(data);
            saveUser(data);
            setLoadingAuth(false);
            navigate('/');

            
        })
        .catch((error)=>{
            toast.error(`E-mail ou senha incorretos! Verifique novamente!`, {theme: 'dark' , position: toast.POSITION.TOP_CENTER});
            setLoadingAuth(false);
        })
    }


    // CADASTRAR
    async function signUp(email, password, name){
        setLoadingAuth(true);
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            let data = {
                name: name,
                gols: 0,
                uid: uid,
                apelido: 'sem apelido',
                pos: 'ATA',
                complemento: 'Jogador ainda não adicionou uma descrição',
                avatarUrl: null
            }

            await setDoc(doc(db, 'users', uid),{
                ...data
            });

            setUser(data);
            saveUser(data);
            setLoadingAuth(false);
            navigate('/');

        })
        .catch((error)=>{
            setLoadingAuth(false);
            let message = error.code;
                switch (message){
                    case "auth/email-already-exists":
                    message = 'Este e-mail já pertence a um usuário'
                    break;
                    case "auth/invalid-email":
                    message = 'Digite um e-mail válido!';
                    break;
                    case "auth/user-disabled":
                    message = 'A conta deste usuário foi desativada pelo administrador';
                    break;
                    case "auth/wrong-password":
                    message = 'Senha incorreta';
                    break;    
                    case "auth/email-already-in-use":
                    message = 'O endereço de e-mail já utilizado, tente outro.';
                    break;    
                    case "auth/weak-password":
                    message = 'Senha muito fraca, tente criar uma mais forte';
                    break;    
                    case "auth/too-many-requests":
                    message = 'Muitos usuários ativos no momento, espere um tempo e tente novamente';
                    break;
                    case "auth/invalid-login-credentials":
                        message = 'Credenciais de login inválidas. Verifique seu e-mail e senha.';
                    break;    
                }

            toast.error(`${message}`, {theme: 'dark' , position: toast.POSITION.TOP_CENTER});
        })

    }

    // LocalStorage

    async function saveUser(data){
        await localStorage.setItem('@user', JSON.stringify(data));
    }

    async function logOut(){
        await signOut(auth);
        setUser(null);
        localStorage.removeItem('@user');
        navigate('/');
    }

    return (
        <AuthContext.Provider value={{
            user,
            loadingAuth,
            signUp,
            signIn,
            logOut,
            setUser,
            saveUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;