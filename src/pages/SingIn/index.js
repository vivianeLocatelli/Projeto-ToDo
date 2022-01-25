import { useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import imgLogin from '../../assets/img/login.svg';
import './login.css';
import { AuthContext } from '../../contexts/user';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loadingUser } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();

        login(email, password)
    }

    return (
        <section className='section login-section'>
            <div className="sign-in main-content">
            <h1 className="to-do-title">To
                <span className='to-do-span'>Do</span>
            </h1>
                <div className="image-content">
                    <img src={imgLogin} alt='logo' />
                </div>
                <div className="form-content">
                    <h2>Faça Login</h2>
                    <form className='form form-login' onSubmit={handleSubmit}>
                        <label>Email:
                            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>Senha:
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button className='btn'>{loadingUser ? 'Carregando...' : 'Entrar'}</button>
                        <Link to='/signup'>Cadastrar Conta</Link>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignIn;