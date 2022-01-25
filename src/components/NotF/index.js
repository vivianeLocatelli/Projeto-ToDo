import './NotF.css';
import img from '../../assets/img/n-F404.svg';

export default function NotF() {
    return(
        <div className='notF-page'>
            <h1>Página não encontrada</h1>
            <img src={img} alt='' />
        </div>
    )
}