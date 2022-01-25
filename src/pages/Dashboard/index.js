import Header from "../../components/Header";
import './Dashboard.css';
import { Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <section className="dashboard">
            <Header />
            <div className="dashboard-container">
                <Outlet />
            </div>
        </section>
    )
}

export default Dashboard;