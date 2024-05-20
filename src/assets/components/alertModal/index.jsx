import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AlertModal({ show, onHide, message }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Perhatian
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Tutup</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;
