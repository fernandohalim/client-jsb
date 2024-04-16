import './App.css';
import { HashRouter,Routes, Route} from 'react-router-dom';

import DashboardPage from './assets/pages/dashboardPage';
import LoginPage from './assets/pages/loginPage';
import TransactionPage from './assets/pages/transactionPage';

function App() {
  return (
    <HashRouter>
        <Routes>
          <Route exact path="/" element={<DashboardPage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/transaction" element={<TransactionPage />}/>
        </Routes>
    </HashRouter>
  );
}

export default App;