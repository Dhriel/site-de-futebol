import { useContext, useEffect, useState } from 'react';
import {AuthContext} from '../../contexts/auth';

import { Link, useNavigate } from 'react-router-dom';
import  {FiSearch} from 'react-icons/fi'

import './header.css';

function Header(){
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [hasUser, setHasUser] = useState(false);
    const [user, setUser] = useState([]);

    
    const navigate = useNavigate();

    useEffect(()=>{

        const storage = localStorage.getItem('@user');
        if(storage){
            const data = JSON.parse(storage);
            setUser(data)
            setAvatarUrl(data.avatarUrl);
            setHasUser(true);
        }

    },[])

    //TENTAR PEGAR NO LOCALSTORAGE
    function handleCheck(){
        

        if(hasUser){
            navigate(`/profile/${user.uid}`)
        }else{
            navigate('/login')
        }

    }


    return(
        <header>
        <nav>
            {/* ESQUERDA */}
            <div className='area-left'>
                <Link to='/' className='image-area'>
                    <img src={require('../../images/logobranco.png')} />
                </Link>
                <ul className="nav-list">
                    <li><Link to="/rank" className='rank-name' style={{color: "#FCA311"}}>Rank</Link></li>
                    <li><Link to="/month" style={{color: '#0C6DFF'}}>Mensal</Link></li>
                </ul>
            </div>

            {/* DIREITA */}
            <div className='area-right'>
                <Link to='/search' className='searchh'>
                    <FiSearch color='#ccc' size={15}/>
                </Link>
                <button to='/profileUser' onClick={handleCheck}>
                    {avatarUrl === null ? (
                        <img src={require('../../images/avatar.jpg')} />
                    ) : (
                        <img src={avatarUrl} />
                    )}
                </button>
            </div>


        </nav>
        </header>
    )
}

export default Header;