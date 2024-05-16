import * as React from 'react';
import { Container } from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';
import MainChart from '../../components/mainChart';

function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '30px', marginTop: '15px' }}>Dasbor</h3>
        </Container>
    </div>
  );
}

export default DashboardPage;