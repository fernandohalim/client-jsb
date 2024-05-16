import * as React from 'react';
import { Container } from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';

function PostTransactionPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '15px', marginTop: '15px' }}>Tambah Transaksi</h3>
        </Container>
    </div>
  );
}

export default PostTransactionPage;