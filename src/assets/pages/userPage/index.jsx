import * as React from 'react';
import { Container, Button} from 'react-bootstrap';

//Components
import AppBar from '../../components/appBar';
import UserTable from '../../components/userTable';
import PostUserModule from '../../components/postUserModule';

function UserPage() {
  const [showPostModal, setShowPostModal] = React.useState(false);

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);

  const refreshUserData = () => {
    window.location.reload();
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar/>
        <Container>
          <h3 style={{marginBottom: '15px', marginTop: '15px' }}>Kelola User</h3>
          <Button variant="primary" onClick={handleShowPostModal} style={{ marginBottom: '20px' }}>
            Tambah User
          </Button>
          <PostUserModule
            show={showPostModal}
            onHide={handleClosePostModal}
            onSuccess={refreshUserData}
          />
          <UserTable/>
        </Container>
      </div>
    </>
  );
}

export default UserPage;