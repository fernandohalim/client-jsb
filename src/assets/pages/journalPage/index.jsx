import * as React from 'react';
import { Container, Button} from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';
import JournalTable from '../../components/journalTable';

function JournalPage() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '15px', marginTop: '15px' }}>Jurnal</h3>
          <JournalTable/>
        </Container>
      </div>
    </>
  );
}

export default JournalPage;