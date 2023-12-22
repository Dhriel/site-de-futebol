import { useEffect,useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import logo from '../../images/logo.png'

import {toast} from 'react-toastify';

import { Link } from 'react-router-dom';
import './sign.css'


function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {signIn, loadingAuth} = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();
        if(email !== '' && password !== ''){
            signIn(email, password);
        }
    }

    return(
        <div className='container-center'>
                <img src={logo} alt='logo'/>
            <div className='login-area'>

            </div>

            <form className='form' onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='E-mail'
                    value={email}
                    onChange={(e=> setEmail(e.target.value))}
                />
                <input
                    type='password'
                    placeholder='Senha'
                    value={password}
                    onChange={(e=> setPassword(e.target.value))}
                />

                
                 <button type='submit'>
                   {loadingAuth ? 'Carregando... ' : 'Acessar'}
                </button>
            </form>

                <Link to='/register'>Criar uma conta</Link>
        </div>
    )
}

export default SignIn;