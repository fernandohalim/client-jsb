import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import DataPagination from '../dataPagination';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Card from 'react-bootstrap/Card';
import { API } from '../../../config/api/api';
import { DateFormat } from '../dateFormat';
import AlertModal from '../alertModal';
import LoadingSpinner from '../loadingSpinner';

function formatAmountToRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function HistoryTable() {
  ///Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  //Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [COA, setCOA] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await API.get('history');
      setHistory(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage('Gagal Mengambil Data: ' + error);
      setShowModal(true);
      console.error('Gagal Mengambil Data:', error);
    } finally{
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const transactionId = id.toString()
      await API.patch(`transaction/status/${transactionId}`);
      setShowModalDetail(false)
      setModalMessage('Berhasil Menghapus Transaksi');
      setShowModal(true);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    console.log(transaction)
    setShowModalDetail(true);
  };

  const getAmountStyle = (value) => {
    return {
      color: value === '0' ? 'green' : 'red'
    };
  };

  const getStatusStyle = (value) => {
    return {
      color: value === 'active' ? 'green' : 'red'
    };
  };
  
  const getCOAName = (coaCode) => {
    const coa = COA.find(coa => coa.id.toString() === coaCode.toString());
    return coa ? `${coa.id} - ${coa.name}` : coaCode;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(()=>{
    setLoading(true);
    fetchHistory();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      {currentItems.length > 0 ? (
        <>
          {currentItems.map((history, index) => (
            <Card onClick={()=>(handleRowClick(history))} style={{marginBottom: '10px'}}>
              <Card.Body>
                <Card.Title>{history.name}</Card.Title>
                <Card.Text>
                  {DateFormat(history.updatedAt)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}

          <div style={{ margin: '20px 0px 20px 0px', display: 'flex', justifyContent: 'center' }}>
            <DataPagination
              currentPage={currentPage}
              totalPages={Math.ceil(history.length / itemsPerPage)}
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
              <p><strong>Status Transaksi:</strong> <span style={getStatusStyle(selectedTransaction.transaction.status)}>{selectedTransaction.transaction.status}</span></p>
              <p><strong>Tanggal Transaksi:</strong> {DateFormat(selectedTransaction.updatedAt)}</p>
              <p><strong>Transaksi:</strong> {selectedTransaction.transaction.name}</p>
              <p><strong>Deskripsi:</strong> {selectedTransaction.transaction.description}</p>
              <p><strong>Nominal:</strong> <span style={getAmountStyle(selectedTransaction.transaction.value)}>{formatAmountToRupiah(selectedTransaction.transaction.amount)}</span></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedTransaction && selectedTransaction.transaction.attachment !== null && (
            <Button variant="secondary">
              Lihat Lampiran
            </Button>
          )}
          {selectedTransaction && selectedTransaction.transaction.status === 'active' && (
            <Button variant="danger" onClick={() => handleDelete(selectedTransaction.transactionId)}>
              Hapus Transaksi
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowModalDetail(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            window.location.reload();
          }}
          message={modalMessage}
      />
    </>
  );
}

export default HistoryTable;
