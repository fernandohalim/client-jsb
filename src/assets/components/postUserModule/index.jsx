import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API } from '../../../config/api/api';
import AlertModal from '../alertModal/index.jsx';

function PostUserModule({ show, onHide, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const role = 'admin';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await API.post('user/register', { username, password, role });
      setModalMessage('User berhasil ditambahkan!');
      onSuccess(); // Notify parent component about the success
      setUsername('');
      setPassword('');
      onHide(); // Close the modal
    } catch (error) {
      setModalMessage('Gagal menambahkan User: ' + error);
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Tambah User Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Tutup
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Menambahkan...' : 'Tambah'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <AlertModal
        show={showAlertModal}
        onHide={() => setShowAlertModal(false)}
        message={modalMessage}
      />
    </>
  );
}

export default PostUserModule;
