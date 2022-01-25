import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/user';

export default function RouteWrapper({ loggedComponent, defaultComponent, isPrivate }) {
    const { auth, loadingPage } = useContext(AuthContext); // se tem um usuário logado ou não

    if (loadingPage) {
        return (
            <div>
                <span>Carregando...</span>
            </div>
        )
    }

    if (auth && !isPrivate) {
        return <Navigate to='/dashboard' />
    } else if (!auth && isPrivate) {
        return <Navigate to='/' />
    }

    return auth ? loggedComponent : defaultComponent
}
