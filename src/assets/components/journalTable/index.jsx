import React, { useEffect, useState } from "react";
import { Table, Form, Button, Badge } from "react-bootstrap";
import { API } from "../../../config/api/api";
import DataPagination from "../dataPagination";
import AlertModal from "../alertModal/index.jsx";
import LoadingSpinner from "../loadingSpinner/index.jsx";
import { DateFormatShort } from "../dateFormatShort/index.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function formatAmountToRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

function JournalTable() {
  const [journal, setJournal] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchJournal();
  }, []);

  const fetchJournal = async () => {
    try {
      const response = await API.get("journal");
      setJournal(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAmountStyle = (value) => {
    return {
      color: value === "0" ? "green" : "red",
    };
  };

  const filteredData = journal.filter(
    (journal) =>
      journal.transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        return sortConfig.direction === "ascending" ? yearA - yearB : yearB - yearA;
      }
      if (monthA !== monthB) {
        return sortConfig.direction === "ascending" ? monthA - monthB : monthB - monthA;
      }
      return sortConfig.direction === "ascending" ? dayA - dayB : dayB - dayA;
    }
    if (sortConfig.key) {
      const isNumeric = !isNaN(a[sortConfig.key]);
      const aValue = isNumeric ? parseFloat(a[sortConfig.key]) : a[sortConfig.key].toString().toLowerCase();
      const bValue = isNumeric ? parseFloat(b[sortConfig.key]) : b[sortConfig.key].toString().toLowerCase();

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
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
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

  const handlePrint = async () => {
    const filteredJournal = journal.filter((entry) => {
      const entryDate = new Date(entry.updatedAt);
      return (
        entryDate.getMonth() === selectedMonth.getMonth() &&
        entryDate.getFullYear() === selectedMonth.getFullYear()
      );
    });

    if (filteredJournal.length === 0) {
      setModalMessage("Tidak ada data di bulan yang dipilih");
      setShowModal(true);
      return;
    }

    const pdf = new jsPDF();
    const tableBody = filteredJournal.map((entry) => [
      DateFormatShort(entry.updatedAt),
      entry.transaction.name,
      `${entry.coa.code} - ${entry.coa.name}`,
      entry.value === "0" ? formatAmountToRupiah(entry.amount) : "",
      entry.value === "1" ? formatAmountToRupiah(entry.amount) : ""
    ]);

    pdf.text("Journal Data", 14, 20);
    pdf.autoTable({
      head: [["Date", "Transaction", "COA", "Debit", "Credit"]],
      body: tableBody,
    });

    pdf.save(`Journal_${selectedMonth.getMonth() + 1}_${selectedMonth.getFullYear()}.pdf`);
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <>
      {loading && <LoadingSpinner />}
      <Form.Control
        type="text"
        placeholder="Cari Data..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ position: "relative" }}>
          <Button
            variant="secondary"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {`${monthNames[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`}
          </Button>
          {showDatePicker && (
            <div style={{ position: "absolute", zIndex: 1000 }}>
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => {
                  setSelectedMonth(date);
                  setShowDatePicker(false);
                }}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
          )}
        </div>
        <Button variant="primary" onClick={handlePrint} style={{ marginLeft: "10px" }}>
          Print Laporan Jurnal (PDF)
        </Button>
      </div>

      {currentItems.length > 0 ? (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                  # {getSortIcon("date")}
                </th>
                <th style={{ cursor: "pointer" }}>Transaksi</th>
                <th style={{ cursor: "pointer" }}>COA</th>
                <th style={{ cursor: "pointer" }}>Debit</th>
                <th style={{ cursor: "pointer" }}>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((journal, index) => (
                <tr key={index}>
                  <td>{DateFormatShort(journal.updatedAt)}</td>
                  <td>{journal.transaction.name}</td>
                  <td>
                    <Badge bg="primary" style={{ color: "white", padding: "6px" }}>
                      {journal.coa.code} - {journal.coa.name}
                    </Badge>
                  </td>
                  <td style={journal.value === "0" ? getAmountStyle("0") : {}}>
                    {journal.value === "0" ? formatAmountToRupiah(journal.amount) : ""}
                  </td>
                  <td style={journal.value === "1" ? getAmountStyle("1") : {}}>
                    {journal.value === "1" ? formatAmountToRupiah(journal.amount) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ margin: "20px 0px 20px 0px", display: "flex", justifyContent: "center" }}>
            <DataPagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedData.length / itemsPerPage)}
              onPageChange={paginate}
            />
          </div>
        </>
      ) : (
        <div style={{ margin: "20px 0px 20px 0px", display: "flex", justifyContent: "center" }}>
          <h4 style={{ marginBottom: "15px", marginTop: "15px" }}>Tidak Ada Data</h4>
        </div>
      )}

      <AlertModal show={showModal} onHide={() => setShowModal(false)} message={modalMessage} />
    </>
  );
}

export default JournalTable;
