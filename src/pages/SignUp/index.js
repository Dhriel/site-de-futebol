import { useState, useContext } from 'react';
import logo from '../../images/logocomnome.png';

import { AuthContext } from '../../contexts/auth';

import { Link } from 'react-router-dom';


function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {signUp, loadingAuth} = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();
        if(name !== '' && email !== '' && password !== ''){
            let upper = upperCase(name);
            signUp(email, password, upper);
        }
        
        
    }

    function upperCase(item){
        const subs = item.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        })

        return subs;
    }


    return(
        <div className='container-center'>
                <img src={logo} alt='logo'/>
            <div className='login-area'>

            </div>

            <form className='form' onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Nome'
                    value={name}
                    onChange={(e=> setName(e.target.value))}
                    maxLength={20}
                    autoCapitalize='words'
                />
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
                   {loadingAuth ? 'Carregando... ' : 'Cadastrar'}
                </button>
            </form>


                <Link to='/login'>Já possui uma conta?</Link>
        </div>
    )
}

export default SignUp;