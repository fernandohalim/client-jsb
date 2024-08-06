import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API } from '../../../config/api/api';
import AlertModal from '../alertModal/index.jsx';
import { InputGroup } from 'react-bootstrap';

function PostCOAModule({ show, onHide, onSuccess }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await API.post('coa/', { code, name });
      setModalMessage('COA berhasil ditambahkan!');
      onSuccess(); // Notify parent component about the success
      setCode('');
      setName('');
      onHide(); // Close the modal
    } catch (error) {
      setModalMessage('Gagal menambahkan COA: ' + error);
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Tambah COA Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCode" className='mb-3'>
              <Form.Label>Kode</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: '1rem 0 0 1rem' }}>Kode</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama COA"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

export default PostCOAModule;