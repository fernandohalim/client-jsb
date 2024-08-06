import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import DataPagination from "../dataPagination";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API } from "../../../config/api/api";
import AlertModal from "../alertModal/index.jsx";
import LoadingSpinner from "../loadingSpinner/index.jsx";

function COATable() {
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editCOA, setEditCOA] = useState({});
  const [deleteCOA, setDeleteCOA] = useState({});
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Paging
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Data Fetch
  const [COA, setCOA] = useState([]);
  const fetchCOA = async () => {
    try {
      const response = await API.get("coa");
      setCOA(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = COA.filter(
    (coa) =>
      coa.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coa.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);

      const dayA = dateA.getDate();
      const monthA = dateA.getMonth();
      const yearA = dateA.getFullYear();

      const dayB = dateB.getDate();
      const monthB = dateB.getMonth();
      const yearB = dateB.getFullYear();

      if (yearA !== yearB) {
        return sortConfig.direction === "ascending"
          ? yearA - yearB
          : yearB - yearA;
      }
      if (monthA !== monthB) {
        return sortConfig.direction === "ascending"
          ? monthA - monthB
          : monthB - monthA;
      }
      return sortConfig.direction === "ascending" ? dayA - dayB : dayB - dayA;
    }
    if (sortConfig.key) {
      const isNumeric = !isNaN(a[sortConfig.key]);
      const aValue = isNumeric
        ? parseFloat(a[sortConfig.key])
        : a[sortConfig.key].toString().toLowerCase();
      const bValue = isNumeric
        ? parseFloat(b[sortConfig.key])
        : b[sortConfig.key].toString().toLowerCase();

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      setSortConfig({ key: null, direction: "ascending" });
      return;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort"></i>;
    }
    if (sortConfig.direction === "ascending") {
      return <i className="fas fa-sort-up"></i>;
    }
    return <i className="fas fa-sort-down"></i>;
  };

  const handleEdit = (coa) => {
    setEditCOA(coa);
    setShowEditModal(true);
  };

  const handleDelete = (coa) => {
    setDeleteCOA(coa);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.patch(`coa/${editCOA.id}`, {
        code: editCOA.code,
        name: editCOA.name,
      });
      fetchCOA();
      setShowEditModal(false);
    } catch (error) {
      setModalMessage("Gagal Mengupdate Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengupdate Data:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await API.delete(`coa/${deleteCOA.id}`);
      fetchCOA();
      setShowDeleteModal(false);
    } catch (error) {
      setModalMessage("Gagal Menghapus Data: " + error);
      setShowModal(true);
      console.error("Gagal Menghapus Data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCOA();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <Form.Control
        type="text"
        placeholder="Cari COA..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {currentItems.length > 0 ? (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("code")}
                  style={{ cursor: "pointer" }}
                >
                  Kode {getSortIcon("code")}
                </th>
                <th style={{ cursor: "pointer" }}>Nama</th>
                <th style={{ cursor: "pointer" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((coa, index) => (
                <tr key={index}>
                  <td>{coa.code}</td>
                  <td>{coa.name}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(coa)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(coa)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div
            style={{
              margin: "20px 0px 20px 0px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DataPagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedData.length / itemsPerPage)}
              onPageChange={paginate}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            margin: "20px 0px 20px 0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <h4 style={{ marginBottom: "15px", marginTop: "15px" }}>
            Tidak Ada Data
          </h4>
        </div>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit COA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formCode" className="mb-3">
              <Form.Label>Kode</Form.Label>
              <Form.Control
                type="text"
                value={editCOA.code || ""}
                onChange={(e) =>
                  setEditCOA({ ...editCOA, code: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={editCOA.name || ""}
                onChange={(e) =>
                  setEditCOA({ ...editCOA, name: e.target.value })
                }
              />
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Tutup
              </Button>
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Hapus COA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus COA ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Hapus
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

export default COATable;