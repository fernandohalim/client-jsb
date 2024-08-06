import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import DataPagination from "../dataPagination";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API } from "../../../config/api/api";
import AlertModal from "../alertModal/index.jsx";
import LoadingSpinner from "../loadingSpinner/index.jsx";

function UserTable() {
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [deleteUser, setDeleteUser] = useState({});
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
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await API.get("user/fetch");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await API.patch(`user/update/${deleteUser.id}`);
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      setModalMessage("Gagal Menghapus Data: " + error);
      setShowModal(true);
      console.error("Gagal Menghapus Data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  return (
    <>
      <div className="table-responsive">
        <Form>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Cari berdasarkan username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
        </Form>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Table bordered hover className="user-table">
            <thead>
              <tr>
                <th>
                  Username
                </th>
                <th>
                  Role
                </th>
                <th onClick={() => handleSort("date")}>
                  Tanggal Dibuat {getSortIcon("date")}
                </th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.updatedAt).toLocaleString()}</td>
                  <td>
                    {user.role === 'admin' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus User ini?</Modal.Body>
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

export default UserTable;