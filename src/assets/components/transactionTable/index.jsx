import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Image  } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { dummy } from '../../../config/dummy/dummy';
import { dummyCOA } from '../../../config/dummy/dummyCOA';
import DataPagination from '../dataPagination';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API } from '../../../config/api/api';
import AlertModal from '../alertModal/index.jsx';
import LoadingSpinner from '../loadingSpinner/index.jsx';
import { DateFormat } from '../dateFormat/index.jsx';
import { DateFormatShort } from '../dateFormatShort/index.jsx';

function formatAmountToRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function TransactionTable() {
  //Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  //Search
  const [searchTerm, setSearchTerm] = useState('');

  //Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  //Data Fetch
  const [transaction, setTransaction] = useState([]);
  const fetchTransaction = async () => {
    try {
      const response = await API.get('transaction');
      setTransaction(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage('Gagal Mengambil Data: ' + error);
      setShowModal(true);
      console.error('Gagal Mengambil Data:', error);
    } finally{
      setLoading(false);
    }
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModalDetail(true);
  };

  const getAmountStyle = (value) => {
    return {
      color: value === '0' ? 'green' : 'red'
    };
  };

  const filteredData = transaction.filter(transaction =>
    (transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
  
      const dayA = dateA.getDate();
      const monthA = dateA.getMonth();
      const yearA = dateA.getFullYear();
  
      const dayB = dateB.getDate();
      const monthB = dateB.getMonth();
      const yearB = dateB.getFullYear();
  
      if (yearA !== yearB) {
        return sortConfig.direction === 'ascending' ? yearA - yearB : yearB - yearA;
      }
      if (monthA !== monthB) {
        return sortConfig.direction === 'ascending' ? monthA - monthB : monthB - monthA;
      }
      return sortConfig.direction === 'ascending' ? dayA - dayB : dayB - dayA;
    }
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
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

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

  useEffect(()=>{
    setLoading(true);
    fetchTransaction();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
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
                <th style={{ cursor: 'pointer' }}>
                  Transaksi
                </th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                  Nominal {getSortIcon('amount')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((transaction, index) => (
                <tr key={index} onClick={() => handleRowClick(transaction)}>
                  <td>{DateFormatShort(transaction.updatedAt)}</td>
                  <td>{transaction.name}</td>
                  <td style={getAmountStyle(transaction.value)}>{formatAmountToRupiah(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
      
          <div style={{ margin: '20px 0px 20px 0px', display: 'flex', justifyContent: 'center' }}>
            <DataPagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedData.length / itemsPerPage)}
              onPageChange={paginate}
            />
          </div>
        </>
      ) : (
        <div style={{ margin: '20px 0px 20px 0px', display: 'flex', justifyContent: 'center' }}>
          <h4 style={{ marginBottom: '15px', marginTop: '15px' }}>Tidak Ada Data</h4>
        </div>
      )}

      <Modal show={showModalDetail} onHide={() => setShowModalDetail(false)}>
        <Modal.Header>
          <Modal.Title>Detil Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div>
              <p><strong>Tanggal Transaksi:</strong> {DateFormat(selectedTransaction.updatedAt)}</p>
              <p><strong>Transaksi:</strong> {selectedTransaction.name}</p>
              <p><strong>Deskripsi:</strong> {selectedTransaction.description}</p>
              <p><strong>Nominal:</strong> <span style={getAmountStyle(selectedTransaction.value)}>{formatAmountToRupiah(selectedTransaction.amount)}</span></p>
              <p><strong>Dibuat oleh:</strong> {selectedTransaction.user.username}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedTransaction && selectedTransaction.attachment !== null && (
            <Button variant="secondary" onClick={() => setShowAttachmentModal(true)}>
              Lihat Lampiran
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowModalDetail(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAttachmentModal} onHide={() => setShowAttachmentModal(false)}>
        <Modal.Header>
          <Modal.Title>Lampiran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <Image
              src={"http://localhost:5000/" + selectedTransaction.attachment}
              alt="Attachment"
              style={{width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowAttachmentModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <AlertModal
          show={showModal}
          onHide={() => setShowModal(false)}
          message={modalMessage}
      />
    </>
  );
}

export default TransactionTable;
