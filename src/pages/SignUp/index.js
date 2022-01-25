import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import imgLogin from '../../assets/img/login.svg';
import { AuthContext } from "../../contexts/user";
import './log.css';

const SignUp = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { userData, loadingUser } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();

        if (name !== '' && lastName !== '' && email !== '' && password !== '') {
            userData(email, password, name, lastName)
        }
    }

    return (
        <section className='section log-section'>
            <div className="sign-in main-content">
            <h1 className="to-do-title">To
                <span className='to-do-span'>Do</span>
            </h1>
                <div className="image-content">
                    <img src={imgLogin} alt='logo' />
                </div>
                <div className="form-content">
                    <h2>Nova Conta</h2>
                    <form className='form form-log' onSubmit={handleSubmit}>
                        <label>Nome:
                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>Sobrenome:
                            <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </label>
                        <label>Email:
                            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>Senha:
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button className="btn">{loadingUser ? 'Carregando...' : 'Cadastrar'}</button>
                        <Link to='/'>Já tem uma conta? Acessar</Link>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignUp;