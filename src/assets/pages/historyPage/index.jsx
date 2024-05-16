import * as React from 'react';
import { Container } from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';
import HistoryTable from '../../components/historyTable';

function HistoryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '15px', marginTop: '15px' }}>Histori Transaksi</h3>
          <HistoryTable/>
        </Container>
    </div>
  );
}

export default HistoryPage;