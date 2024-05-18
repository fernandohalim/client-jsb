import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

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

  return (
    <Form>
      <Row>
        <Col sm className='mb-3'>
          <Form.Group controlId="formGridName">
            <Form.Label>Nama Transaksi</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}/>
          </Form.Group>
        </Col>
        
        <Col sm className='mb-3'>
          <Form.Group controlId="formGridAmount">
            <Form.Label>Nominal</Form.Label>
            <InputGroup>
              <InputGroup.Text style={{borderRadius:'1rem 0 0 1rem'}}>Rp</InputGroup.Text>
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

      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default PostTransactionModule;