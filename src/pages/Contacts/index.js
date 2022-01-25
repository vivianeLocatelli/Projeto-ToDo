import { BsCheck, BsPersonPlusFill, BsPencilSquare, BsXSquare } from "react-icons/bs";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../contexts/user";
import firebase from "../../services/firebaseConnection";
import './Contacts.css';

const Contacts = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');

    const [contacts, setContacts] = useState([]);
    const [newContactBtn, setNewContactBtn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [newUser, setNewUser] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        function contactListener() {
            firebase.firestore().collection('Contacts').orderBy('name', 'asc')
                .onSnapshot((snapshot) => {
                    let data = [];

                    snapshot.forEach(doc => {
                        const isEqual = user.uid === doc.data().uid;
                        if (isEqual) {
                            data.push({
                                id: doc.id,
                                uid: doc.data().uid,
                                name: doc.data().name,
                                number: doc.data().number,
                                email: doc.data().email
                            })
                            setNewUser(false);
                        }
                    })
                    if(data.length !== 0) {
                        setContacts(data);
                        setLoading(false);
                    } else {
                        setNewUser(true);
                        setLoading(false);
                    }
                })
        }
        contactListener()
    }, [user]);

    function formatPhone(phone) {
        return phone.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const exists = contacts.some(item => item.id === id);

        if (name !== '' && number !== '' && email !== '') {
            if (!exists) {
                await firebase.firestore().collection('Contacts').add({
                    uid: user.uid,
                    name: name,
                    number: formatPhone(number),
                    email: email
                }).then(() => {
                    setName('');
                    setNumber('');
                    setEmail('');
                    setNewUser(false);
                }).catch((e) => {
                    console.log(e)
                })
            } else {
                await firebase.firestore().collection('Contacts').doc(id)
                    .set({
                        name: name,
                        number: number,
                        email: email
                    }).then(() => {
                        setName('');
                        setNumber('');
                        setEmail('');
                        setId(null);
                        setNewContactBtn(false)
                    })
            }
        }
    }

    async function handleDelete(contact) {
        const id = contact.id;

        await firebase.firestore().collection('Contacts').doc(id)
            .delete()
    }

    async function handleEdit(contact) {
        const id = contact.id;

        await firebase.firestore().collection('Contacts').doc(id)
            .get().then((snapshot) => {
                setNewContactBtn(true)
                setName(snapshot.data().name);
                setEmail(snapshot.data().email);
                setNumber(snapshot.data().number);
                setId(id);
            })
    }


    return (
        <section className='section section-contacts'>
            <div className='tasks-container'>
                <h2>Contatos</h2>

                <button className='btn-dash btn-send' onClick={() => setNewContactBtn(!newContactBtn)}>
                    <BsPersonPlusFill className='btn-icon' />{!newContactBtn ? 'Adicionar' : 'Fechar'}
                </button>
                {newContactBtn &&
                    (
                        <form onSubmit={handleSubmit} className='form-contacts'>
                            <input placeholder="Nome" type='text' value={name} onChange={(e) => setName(e.target.value)} />
                            <input placeholder="Telefone" type='number' value={number} onChange={(e) => setNumber(e.target.value)} />
                            <input placeholder="Email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className='btn-dash btn-send'><BsCheck className='btn-icon' />Adicionar</button>
                        </form>
                    )
                }

                <div className='tasks-content'>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : (
                        <ul className='ul-tasks'>
                            {!newUser ? contacts.map(contact => {
                                return (
                                    <li className="li-contact" key={contact.id}>
                                        <h4>{contact.name}</h4>
                                        <h5>{contact.number}</h5>
                                        <h5>{contact.email}</h5>
                                        <span className="btn-li">
                                            <BsXSquare onClick={() => handleDelete(contact)} className="delete" />
                                            <BsPencilSquare onClick={() => handleEdit(contact)} className="edit" />
                                        </span>
                                    </li>
                                )
                            }) : (
                                <li className="li-contact example">
                                    <h4>ex: João Costa</h4>
                                    <h5>(99) 99999-9999</h5>
                                    <h5>joao@costa.com</h5>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </section >
    )
}

export default Contacts;

