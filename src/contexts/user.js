import { createContext, useState, useEffect } from "react";
import firebase from '../services/firebaseConnection';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);


    useEffect(() => {
        function loading() {
            const data = localStorage.getItem('SistemData');

            if (data) {
                setUser(JSON.parse(data))
                setLoadingPage(false);
            }

            setLoadingPage(false);
        }
        loading();
    }, [])

    async function login(email, password) {
        setLoadingUser(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                const userData = await firebase.firestore().collection('Users').doc(uid)
                    .get();

                let data = {
                    uid: uid,
                    name: userData.data().name,
                    lastName: userData.data().lastName,
                    email: userData.data().email,
                    avatarUrl: userData.data().avatarUrl
                }
                setUser(data);
                storageData(data);
                setLoadingUser(false)
            }).catch((e) => {
                console.log(e)
                setLoadingUser(false);
            })
    }

    async function userData(email, password, name, lastName) {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.firestore().collection('Users').doc(uid)
                    .set({
                        name: name,
                        lastName: lastName,
                        email: email,
                        avatarUrl: null,
                    }).then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            lastName: lastName,
                            email: value.user.email,
                            avatarUrl: null,
                        }
                        setUser(data);
                        storageData(data);
                        setLoadingUser(false);
                    })
            }).catch((e) => {
                console.log(e);
                setLoadingUser(false);
            })
    }

    function storageData(data) {
        localStorage.setItem('SistemData', JSON.stringify(data));
    }

    async function logout() {
        await firebase.auth().signOut();
        localStorage.removeItem('SistemData');
        setUser(null);
    }


    return (
        <AuthContext.Provider
            value={{ 
                auth: !!user, user, loadingPage, userData, logout, login, loadingUser, setUser, storageData 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}