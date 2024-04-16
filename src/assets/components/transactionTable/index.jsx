import React, { useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';

function formatAmountToRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function TransactionTable() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dummy = [
    {
      date: '2 Jan 2024',
      time: '12:01',
      name: 'Penggajian',
      category: 'Beban',
      description: 'Pembayaran gaji Jamal',
      attachment: null,
      amount: 2000000,
      value: '1',
      user: 'Asep'
    },
    {
      date: '2 Jan 2024',
      time: '12:02',
      name: 'Pembayaran Listrik',
      category: 'Beban',
      description: 'Pembayaran listrik bangunan',
      attachment: null,
      amount: 4000000,
      value: '1',
      user: 'Asep'
    },
    {
      date: '2 Jan 2024',
      time: '12:03',
      name: 'Pembayaran Piutang',
      category: 'Beban',
      description: 'Pembayaran piutang PT. Agung',
      attachment: '_',
      amount: 30000000,
      value: '0',
      user: 'Siti'
    },
  ];

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const getAmountStyle = (value) => {
    return {
      color: value === '0' ? 'green' : 'red'
    };
  };

  return (
    <>
      <Table hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Transaksi</th>
            <th>Nominal</th>
          </tr>
        </thead>
        <tbody>
          {dummy.map((transaction, index) => (
            <tr key={index} onClick={() => handleRowClick(transaction)}>
              <td>{transaction.date} - {transaction.time}</td>
              <td>{transaction.name}</td>
              <td style={getAmountStyle(transaction.value)}>{formatAmountToRupiah(transaction.amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Detil Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <p><strong>Tanggal Transaksi:</strong> {selectedTransaction.date}</p>
              <p><strong>Waktu Transaksi:</strong> {selectedTransaction.time}</p>
              <p><strong>Transaksi:</strong> {selectedTransaction.name}</p>
              <p><strong>Kategori Transaksi:</strong> {selectedTransaction.category}</p>
              <p><strong>Deskripsi:</strong> {selectedTransaction.description}</p>
              <p><strong>Nominal:</strong> {formatAmountToRupiah(selectedTransaction.amount)}</p>
              <p><strong>Dibuat oleh:</strong> {selectedTransaction.user}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedTransaction && selectedTransaction.attachment !== null && (
            <Button variant="secondary">
              Lihat Lampiran
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TransactionTable;
