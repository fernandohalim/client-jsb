import './App.css';
import './config/styles/bootstrap.min.css'
import { HashRouter,Routes, Route} from 'react-router-dom';

import DashboardPage from './assets/pages/dashboardPage';
import LoginPage from './assets/pages/loginPage';
import TransactionPage from './assets/pages/transactionPage';
import PostTransactionPage from './assets/pages/postTransactionPage';
import HistoryPage from './assets/pages/historyPage';
import COAPage from './assets/pages/COAPage';
import UserPage from './assets/pages/userPage';
import JournalPage from './assets/pages/journalPage';

function App() {
  return (
    <>
      <HashRouter>
          <Routes>
            <Route exact path="/" element={<DashboardPage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/transaction" element={<TransactionPage />}/>
            <Route path="/post-transaction" element={<PostTransactionPage />}/>
            <Route path="/history" element={<HistoryPage />}/>
            <Route path="/coa" element={<COAPage />}/>
            <Route path="/user" element={<UserPage />}/>
            <Route path="/journal" element={<JournalPage />}/>
          </Routes>
          
      </HashRouter>
    </>
  );
}

export default App;