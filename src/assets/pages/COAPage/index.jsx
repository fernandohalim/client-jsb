import * as React from 'react';
import { Container, Button} from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';
import COATable from '../../components/COATable';
import PostCOAModule from '../../components/postCOAModule';

function COAPage() {
  const [showPostModal, setShowPostModal] = React.useState(false);

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);

  const refreshCOAData = () => {
    window.location.reload();
  };
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '15px', marginTop: '15px' }}>Kelola COA</h3>
          <Button variant="primary" onClick={handleShowPostModal} style={{ marginBottom: '20px' }}>
            Tambah COA
          </Button>
          <PostCOAModule
            show={showPostModal}
            onHide={handleClosePostModal}
            onSuccess={refreshCOAData}
          />
          <COATable/>
        </Container>
      </div>
    </>
  );
}

export default COAPage;