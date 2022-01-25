import { Routes, Route } from "react-router-dom";
import RouteWrapper from "./teste";
import SignIn from '../pages/SingIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from "../pages/Profile";
import Tasks from "../pages/Tasks";
import Contacts from "../pages/Contacts";
import NotF from "../components/NotF";

export default function AllRoutes() {
    return (
        <Routes>
            <Route path='/' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} />} />
            <Route path='/dashboard' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} isPrivate />}>
                <Route path='profile' element={<Profile />} />
                <Route path='' element={<Tasks />} />
                <Route path='contacts' element={<Contacts />} />
            </Route>
            <Route path='/signin' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignIn />} />} />
            <Route path='/signup' element={<RouteWrapper loggedComponent={<Dashboard />} defaultComponent={<SignUp />} />} />
            <Route path='*' element={<NotF />} />
        </Routes>
    )
}