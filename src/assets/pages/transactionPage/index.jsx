import * as React from 'react';
import '../../../config/styles/bootstrap.min.css';
import { Container } from 'react-bootstrap';


//Components
import AppBar from '../../components/appBar';
import TransactionTable from '../../components/transactionTable';

function TransactionPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '30px', marginTop: '15px' }}>Transaksi</h3>
          <TransactionTable/>
        </Container>
    </div>
  );
}

export default TransactionPage;