import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import { API } from '../../../config/api/api';
import COAInput from '../COAInput';
import AlertModal from '../alertModal';
import LoadingSpinner from '../loadingSpinner';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function NumberInput({ value, onChange }) {
  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/\./g, '');
    if (!isNaN(inputValue)) {
      onChange(formatNumber(inputValue));
    }
  };

  return (
    <Form.Control 
      value={value}
      onChange={handleInputChange}
    />
  );
}

function PostTransactionModule() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [COAForm, setCOAForm] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [COA, setCOA] = useState([]);

  const fetchCOA = async () => {
    try {
      const response = await API.get('transaction/get-coa');
      setCOA(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage('Gagal Mengambil Data: ' + error);
      setShowModal(true);
      console.error('Gagal Mengambil Data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCOA();
  }, []);

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setAttachment(file);
      setAttachmentPreview(URL.createObjectURL(file));
    } else {
      setModalMessage('Lampiran harus berupa file PNG atau JPG!');
      setShowModal(true);
    }
  };

  const handleDeleteAttachment = () => {
    setAttachment(null);
    setAttachmentPreview('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name || !amount || !description || !COAForm) {
        setModalMessage('Harap isi semua field!');
        setShowModal(true);
        return;
      }
      setLoading(true);
      const COASubmit = COAForm.toString();
      console.log(COASubmit + name + amount.replace(/\./g, '') + description);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('amount', amount.replace(/\./g, ''));
      formData.append('description', description);
      formData.append('coa', COASubmit);
      formData.append('value', '1');
      formData.append('user', 'super');
      if (attachment) {
        formData.append('attachment', attachment);
      }

      // await API.post('transaction/create-transaction', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      await API.post('transaction/create-transaction', {
        name,
        amount: amount.replace(/\./g, ''),
        description,
        coa: COASubmit,
        value: '1',
        user: 'super',

      });

      setModalMessage('Transaksi berhasil ditambahkan');
      setShowModal(true);
      setName('');
      setAmount('');
      setDescription('');
      setCOAForm('');
      setAttachment(null);
      setAttachmentPreview('');
    } catch (error) {
      setModalMessage('Gagal Menambahkan Transaksi: ' + error);
      setShowModal(true);
      console.error('Gagal Menambahkan Transaksi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm className='mb-3'>
            <Form.Group controlId="formGridName">
              <Form.Label>Nama Transaksi</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </Form.Group>
          </Col>

          <Col sm className='mb-3'>
            <Form.Group controlId="formGridAmount">
              <Form.Label>Nominal</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: '1rem 0 0 1rem' }}>Rp</InputGroup.Text>
                <NumberInput
                  value={amount}
                  onChange={setAmount}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formGridDescription">
          <Form.Label>Deskripsi Transaksi</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            style={{ resize: 'none' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col sm className='mb-3'>
            <Form.Group className="mb-3" controlId="formGridCOA">
              <Form.Label>COA Transaksi</Form.Label>
              <COAInput
                value={COAForm}
                onChange={setCOAForm}
                options={COA}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            {attachmentPreview && (
              <Button variant="danger" style={{marginLeft: '10px'}} onClick={handleDeleteAttachment}>
                Hapus Lampiran
              </Button>
            )}
          </Col>

          <Col sm className='mb-3'>
            <Form.Group className="mb-3" controlId="formGridAttachment">
              <Form.Label>Tambah Lampiran</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: '1rem 0 0 1rem' }}>Pilih File</InputGroup.Text>
                <Form.Control
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleAttachmentChange}
                  style={{height:'100%'}}
                />
              </InputGroup>
            </Form.Group>
            {attachmentPreview && (
              <div>
                <Image rounded
                  src={attachmentPreview}
                  alt="Attachment Preview"
                  style={{maxWidth: '200px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </div>
            )}
          </Col>
        </Row>

        <div style={{display: 'flex'}}>
          

          
        </div>

      </Form>
      
      <AlertModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={modalMessage}
      />
    </>
  );
}

export default PostTransactionModule;
