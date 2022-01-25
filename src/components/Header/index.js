import { useContext } from "react";
import { AuthContext } from "../../contexts/user";
import { Link } from 'react-router-dom';
import { BsFillJournalBookmarkFill, BsGear, BsPower, BsPeople } from "react-icons/bs";
import img from '../../assets/img/profile.svg';
import './Header.css';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <h1 className="to-do-title">To
                <span className='to-do-span'>Do</span>
            </h1>
            <img src={user.avatarUrl !== null ? user.avatarUrl : img} alt="imagem perfil" />
            <nav className="nav">
                <Link to='/'><BsFillJournalBookmarkFill className='icon' />Tarefas</Link>
                <Link to='contacts'><BsPeople className='icon' />Contatos</Link>
                <Link to='profile'><BsGear className='icon' />Configurações</Link>
            </nav>
            <button className="btn btn-sair" onClick={() => logout()} ><BsPower className='icon' />Sair</button>
        </header>
    )
}