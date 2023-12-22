import { Link } from "react-router-dom";

export default function Card({data}){
    return(
            <ul className="card-ul">
                {data.map((item, index)=>{
                    return(
                        <li key={index}>
                            <div className='area'>
                                <Link to={`/profile/${item.uid}`} className='area-left'>
                                    <span className='order'>{index + 1}</span>

                                    {item?.avatarUrl ? (
                                        <img src={item.avatarUrl} alt='foto do usuário' loading='lazy'/>
                                    ) : (
                                        <img src={require('../../images/avatar.jpg')} alt='foto do usuário' loading='lazy'/>
                                    )}
                                    
                                    <div className='area-name'>
                                        <strong>{item.name}</strong>
                                        <span>{item.apelido}</span>
                                    </div>
                                </Link>

                                <span className='gols'>{item.gols}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
    )
}