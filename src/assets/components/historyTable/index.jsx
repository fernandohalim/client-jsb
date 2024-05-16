import React, { useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { dummy } from '../../../config/dummy/dummy';
import { dummyCOA } from '../../../config/dummy/dummyCOA';
import { dummyUser } from '../../../config/dummy/dummyUser';
import DataPagination from '../dataPagination';
import '@fortawesome/fontawesome-free/css/all.min.css';

function formatAmountToRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function HistoryTable() {
  ///Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //Search
  const [searchTerm, setSearchTerm] = useState('');

  //User Define
  const [selectedUser, setSelectedUser] = useState('');

  //Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const getAmountStyle = (value) => {
    return {
      color: value === '0' ? 'green' : 'red'
    };
  };
  
  const getCOAName = (coaCode) => {
    const coa = dummyCOA.find(coa => coa.code === coaCode);
    return coa ? `${coa.code} - ${coa.name}` : coaCode;
  };

  const filteredDummy = dummy.filter(transaction =>
    (selectedUser === '' || transaction.user === selectedUser) &&
    (transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedDummy = [...filteredDummy].sort((a, b) => {
    if (sortConfig.key) {
      const isNumeric = !isNaN(a[sortConfig.key]);
      const aValue = isNumeric ? parseFloat(a[sortConfig.key]) : a[sortConfig.key].toString().toLowerCase();
      const bValue = isNumeric ? parseFloat(b[sortConfig.key]) : b[sortConfig.key].toString().toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedDummy.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      setSortConfig({ key: null, direction: 'ascending' });
      return;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort"></i>;
    }
    if (sortConfig.direction === 'ascending') {
      return <i className="fas fa-sort-up"></i>;
    }
    return <i className="fas fa-sort-down"></i>;
  };

  return (
    <>
      <Form.Select
        size='sm'
        aria-label="Default select example"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        style={{ 
          marginBottom: '10px', 
          borderRadius: '1rem', 
          padding: '2px 4px 2px 4px', 
          border: 'none',
          outline: 'none', 
          boxShadow: 'none'
        }}
      >
        <option value={""}>Tampilkan Semua User</option>
        {dummyUser.map((user, index) => (
          <option key={index} value={user.user}>{user.user}</option>
        ))}
      </Form.Select>
      <Form.Control
        type="text"
        placeholder="Cari Data..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      
      {currentItems.length > 0 ? (
        <>
        <Table hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                  # {getSortIcon('date')}
                </th>
                <th onClick={() => handleSort('coa')} style={{ cursor: 'pointer' }}>
                  COA {getSortIcon('coa')}
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Transaksi {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                  Nominal {getSortIcon('amount')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transaction, index) => (
                <tr key={index} onClick={() => handleRowClick(transaction)}>
                  <td>{transaction.date} - {transaction.time}</td>
                  <td><Badge bg="primary">{getCOAName(transaction.coa)}</Badge></td>
                  <td>{transaction.name}</td>
                  <td style={getAmountStyle(transaction.value)}>{formatAmountToRupiah(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
      
          <div style={{ margin: '20px 0px 20px 0px', display: 'flex', justifyContent: 'center' }}>
            <DataPagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedDummy.length / itemsPerPage)}
              onPageChange={paginate}
            />
          </div>
        </>
      ) : (
        <div style={{ margin: '20px 0px 20px 0px', display: 'flex', justifyContent: 'center' }}>
          <h4 style={{ marginBottom: '15px', marginTop: '15px' }}>Tidak Ada Data</h4>
        </div>
      )}

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
              <p><strong>Kode COA:</strong> <Badge bg="primary">{getCOAName(selectedTransaction.coa)}</Badge></p>
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
          <Button variant="danger" onClick={null}>
            Hapus Transaksi
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HistoryTable;
