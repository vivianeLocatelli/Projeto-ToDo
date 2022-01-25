import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './routes/index';
import './App.css';
import AuthProvider from './contexts/user';

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <BrowserRouter>
          <AllRoutes />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
