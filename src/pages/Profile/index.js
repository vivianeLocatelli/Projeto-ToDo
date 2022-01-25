import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/user";
import img from '../../assets/img/profile.svg';
import { BsArrowBarDown } from "react-icons/bs";
import './Profile.css';
import firebase from "../../services/firebaseConnection";

export default function Profile() {
    const { user, setUser, storageData } = useContext(AuthContext);
    const [name, setName] = useState(user && user.name);
    const [lastName, setLastName] = useState(user && user.lastName);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [validFile, setValidFile] = useState(null);
    const [btn, setBtn] = useState(false);

    function handleChange(e) {
        const picture = e.target.files[0];

        if (picture) {
            if (picture.type === 'image/jpeg' || picture.type === 'image/png') {
                setImageAvatar(picture);
                setAvatarUrl(URL.createObjectURL(picture));
                setValidFile(true);
            } else {
                console.log('Formato não suportado')
                setImageAvatar(null)
                setValidFile(false)
            }
            setBtn(false);
        }
    }

    async function imageChange() {
        const uid = user.uid;
        await firebase.storage()
            .ref(`images/${uid}/${imageAvatar.name}`).put(imageAvatar)
            .then(async () => {
                await firebase.storage().ref(`images/${uid}`)
                    .child(imageAvatar.name).getDownloadURL()
                    .then(async (url) => {
                        await firebase.firestore().collection('Users').doc(uid)
                            .update({
                                avatarUrl: url,
                            })
                    }).then(() => {
                        let data = {
                            ...user,
                            avatarUrl: avatarUrl
                        }
                        setUser(data);
                        storageData(data);
                    })
            }).catch((e) => {
                console.log(e)
            })
    }

    async function updateName() {
        await firebase.firestore().collection('Users').doc(user.uid)
            .update({
                name: name,
                lastName: lastName,
            }).then(() => {
                let data = {
                    ...user,
                    name: name,
                    lastName: lastName
                }
                setUser(data);
                storageData(data);
                setBtn(true);
            }).catch((e) => {
                console.log(e)
            })
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (name !== '' && lastName !== '') {
            if (imageAvatar === null) {
                updateName();
            } else {
                imageChange();
                updateName();
            }
        }
    }

    return (
        <section className="section section-profile">
            <div className="profile-content">
                <form className="form form-profile" onSubmit={handleSubmit}>
                    <label>
                        <span className="icon-photo"><BsArrowBarDown /></span>
                        <input type='file' accept="/image" onChange={handleChange} />
                        <img src={avatarUrl !== null ? avatarUrl : img} alt="imagem de perfil" />
                    </label>
                    {validFile !== null && (
                        <span className={validFile ? 'valid' : 'invalid'}>
                            {validFile ? 'Arquivo válido' : 'Arquivo Inválido'}
                        </span>)}
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input type='text' value={user.email} disabled />
                    <button className="btn-dash btn-send">Salvar Alterações</button>
                    {btn && (
                        <span className='valid'>
                            Alterações salvas
                        </span>)}
                </form>
            </div>
        </section>
    )
}