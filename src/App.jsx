import './App.css';
import { HashRouter,Routes, Route} from 'react-router-dom';

import DashboardPage from './assets/pages/dashboardPage';
import LoginPage from './assets/pages/loginPage';

function App() {
  return (
    <HashRouter>
        <Routes>
          <Route exact path="/" element={<DashboardPage />}/>
          <Route path="/login" element={<LoginPage />}/>
        </Routes>
    </HashRouter>
  );
}

export default App;