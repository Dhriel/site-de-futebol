import { Link } from 'react-router-dom'
import './styles.css'

export default function ErrorPage(){
    return(
        <div className="error-container">
            <div className='error-area'></div>
            <h1>Está página não existe.....</h1>

            <Link to='/'> <button>GALÁTICOS FC</button> </Link>
        </div>
    )
}