import { BsClipboardPlus, BsXSquare, BsPencilSquare, BsCheck2Square, BsFillPeopleFill } from 'react-icons/bs';
import { useEffect, useState, useContext } from 'react';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/user';
import './Tasks.css';

const Tasks = () => {
    const [newTask, setNewTask] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [select, setSelect] = useState('');

    const [contacts, setContacts] = useState(null);
    const [newTaskBtn, setNewTaskBtn] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [newUser, setNewUser] = useState(false);

    const [ctc, setCtc] = useState(false);
    const [newId, setNewId] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        function tasksListener() {
            firebase.firestore().collection('Tasks').orderBy('date', 'asc')
                .orderBy('time', 'asc').onSnapshot((snapshot) => {
                    let list = [];

                    snapshot.forEach(doc => {
                        const isIqual = user.uid === doc.data().uid;
                        if (isIqual) {
                            list.push({
                                id: doc.id,
                                uid: user.uid,
                                task: doc.data().task,
                                time: doc.data().time,
                                date: doc.data().date,
                                contact: doc.data().contact
                            })
                            setNewUser(false);
                        }
                    })
                    if (list.length !== 0) {
                        setTasks(list);
                        setLoading(false);
                    } else {
                        setNewUser(true);
                        setLoading(false);
                    }
                })
        }
        tasksListener()
    }, [user]);

    useEffect(() => {
        function getContacts() {
            firebase.firestore().collection('Contacts').orderBy('name', 'asc')
                .get().then((snapshot) => {
                    let list = [];
                    snapshot.forEach(item => {
                        const isIqual = user.uid === item.data().uid;
                        if (isIqual) {
                            list.push({
                                id: item.id,
                                name: item.data().name,
                                number: item.data().number,
                                email: item.data().email
                            })
                        } else {
                            setSelect('');
                        }
                    })
                    setContacts(list)
                })
        }
        getContacts()
    }, [user]);

    async function handleSubmit(e) {
        e.preventDefault()
        const exists = tasks.some(task => task.id === id);
        const contact = contacts.filter(contact => contact.name === select);

        if (newTask !== '' && date !== '' && time !== '') {
            if (!exists) {
                await firebase.firestore().collection('Tasks').add({
                    uid: user.uid,
                    task: newTask,
                    date: date,
                    time: time,
                    contact: contact
                }).then(() => {
                    setNewTask('');
                    setDate('');
                    setTime('');
                    setSelect('');
                    setNewTaskBtn(false);
                    setNewUser(false);
                }).catch((e) => {
                    console.log(e)
                })
            } else if (exists && contact) {
                await firebase.firestore().collection('Tasks').doc(id)
                    .set({
                        uid: user.uid,
                        task: newTask,
                        date: date,
                        time: time,
                        contact: contact
                    }).then(() => {
                        setNewTask('');
                        setDate('');
                        setTime('');
                        setSelect('');
                        setId(null);
                        setNewTaskBtn(false)
                    })
            }
        }
    }

    async function handleDelete(task) {
        const id = task.id;

        await firebase.firestore().collection('Tasks').doc(id)
            .delete()
    }

    async function handleEdit(task) {
        const id = task.id;

        await firebase.firestore().collection('Tasks').doc(id)
            .get().then((snapshot) => {
                if (snapshot.data().contact[0]) {
                    setNewTaskBtn(true)
                    setNewTask(snapshot.data().task)
                    setTime(snapshot.data().time)
                    setDate(snapshot.data().date)
                    setSelect(snapshot.data().contact[0].name)
                    setId(id);
                } else {
                    setNewTaskBtn(true)
                    setNewTask(snapshot.data().task)
                    setTime(snapshot.data().time)
                    setDate(snapshot.data().date)
                    setSelect('')
                    setId(id);
                }
            })
    }

    function formatDate(task) {
        const arr = task.date.split('-');
        return `${arr[2]}/${arr[1]}/${arr[0]}`;
    }

    function changeBtn(e) {
        const el = e.id;
        setNewId(el)
        setCtc(!ctc)
    }

    return (
        <section className='section tasks-section'>
            <div className='tasks-container'>
                <h2>Adicionar Tarefas:</h2>

                <button className='btn btn-send'
                    onClick={() => setNewTaskBtn(!newTaskBtn)}>
                    <BsClipboardPlus
                        className='btn-icon' />
                    {!newTaskBtn ? 'Nova' : 'Fechar'}
                </button>
                {newTaskBtn &&
                    (
                        <form className='form-task' onSubmit={handleSubmit}>
                            <label>Tarefa:
                                <input type='text'
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)} />
                            </label>
                            <label>Dia:
                                <input type='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)} />
                            </label>
                            <label>Hora:
                                <input type='time'
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)} />
                            </label>
                            <select
                                className='select-tasks'
                                value={select}
                                onChange={(e) => setSelect(e.target.value)}>
                                <option>Selecione um contato</option>
                                {contacts.map(contact => {
                                    return (
                                        <option key={contact.id}>{contact.name}</option>
                                    )
                                })}
                            </select>
                            <button className='btn-dash btn-send'>
                                <BsCheck2Square
                                    className='btn-icon' />
                                Enviar
                            </button>
                        </form>
                    )
                }

                <div className='tasks-content'>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : (
                        <div className='ul-tasks'>
                            {!newUser ? tasks.map(task => {
                                return (
                                    <ul className='li-tasks' key={task.id}>
                                        <li>
                                            <h4>{task.task}</h4>
                                            <h5>{formatDate(task)}</h5>
                                            <h5>{task.time}</h5>
                                            <span className="btn-li">
                                                <BsXSquare
                                                    value={task.id}
                                                    onClick={() => handleDelete(task)}
                                                    className="delete" />
                                                <BsPencilSquare
                                                    value={task.id}
                                                    onClick={() => handleEdit(task)}
                                                    className="edit" />
                                            </span>
                                        </li>

                                        {task.contact[0] && <BsFillPeopleFill
                                            className='btn-icon icon'
                                            value={ctc}
                                            onClick={() => changeBtn(task)}
                                        />}
                                        {task.contact && ctc && newId === task.id ? (
                                            <li>
                                                <h4>{task.contact[0].name}</h4>
                                                <h5>{task.contact[0].number}</h5>
                                                <h5>{task.contact[0].email}</h5>
                                            </li>
                                        ) : !task.contact[0] && (
                                            <div>Nenhum contato</div>
                                        )}
                                    </ul>
                                )
                            }) : (
                                <ul className='li-tasks example'>
                                    <li>
                                        <h4>ex: Tomar café</h4>
                                        <h5>12/02/2022</h5>
                                        <h5>10:00</h5>
                                    </li>
                                    <li>
                                        <h4>Info contato</h4>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )
                    }
                </div>
            </div>
        </section>
    )
}

export default Tasks;