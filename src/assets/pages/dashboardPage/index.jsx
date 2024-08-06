import * as React from "react";
import { Container, Button, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Components
import AppBar from "../../components/appBar";
import { API } from "../../../config/api/api";
import LoadingSpinner from "../../components/loadingSpinner";
import { useEffect, useState } from "react";
import AlertModal from "../../components/alertModal";

function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [transaction, setTransaction] = useState([]);
  const [history, setHistory] = useState([]);
  const [journal, setJournal] = useState([]);
  const [user, setUser] = useState('');

  const fetchTransaction = async () => {
    try {
      const response = await API.get("transaction");
      setTransaction(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await API.get("history");
      setHistory(response.data);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const isLogin = async () => {
    try {
      const response = await API.get("user");
      setUser(response.data.user);
      console.log(response.data);
    } catch (error) {
      setModalMessage("Gagal Mengambil Data: " + error);
      setShowModal(true);
      console.error("Gagal Mengambil Data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTransaction();
    fetchHistory();
    fetchJournal();
    isLogin();
  }, []);

  const getTotalCashflowForCurrentMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transaction
      .filter((trx) => {
        const trxDate = new Date(trx.createdAt);
        return (
          trxDate.getMonth() === currentMonth &&
          trxDate.getFullYear() === currentYear
        );
      })
      .reduce((total, trx) => total + trx.amount, 0);
  };

  const totalCashflow = getTotalCashflowForCurrentMonth();

  const formattedTotalCashflow = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalCashflow);

  const currentMonthYear = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const latestActivities = history.slice(0, 4);
  const latestJournal = journal.slice(0, 4);

  const navigate = useNavigate();

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar />
        <Container>
          <h3 style={{ marginBottom: "15px", marginTop: "15px" }}>Selamat datang {user.username}</h3>
          
          <Row className="g-4">
            <Col xs={12} md={6} className="mb-3">
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    Total Cashflow untuk {currentMonthYear}:
                  </Card.Title>
                  <Card className="mb-3">
                    <Card.Body>
                      <h3>{formattedTotalCashflow}</h3>
                    </Card.Body>
                  </Card>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/transaction")}
                  >
                    Lihat Semua Transaksi
                  </Button>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Aktivitas Terbaru:</Card.Title>
                  <ListGroup>
                    {latestActivities.map((activity) => (
                      <ListGroup.Item key={activity.id}>
                        {activity.name} <br/>
                        <strong>{new Date(activity.updatedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  {user.role !== 'admin' && (
                  <Button
                    variant="primary"
                    onClick={() => navigate("/history")}
                    style={{ marginTop: "15px" }}
                  >
                    Lihat Semua Histori
                  </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Jurnal Terbaru:</Card.Title>
                  <ListGroup>
                    {latestJournal.map((activity) => (
                      <ListGroup.Item key={activity.id}>
                        {activity.transaction.name} <br/>
                        <Badge variant='primary' style={{ color: "white", padding: "6px", marginBottom:'8px', marginTop: '2px' }}>
                          {activity.coa.code} - {activity.coa.name}
                        </Badge> <br/>
                        <strong>{new Date(activity.updatedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/journal")}
                    style={{ marginTop: "15px" }}
                  >
                    Lihat Semua Jurnal
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <AlertModal
          show={showModal}
          onHide={() => setShowModal(false)}
          message={modalMessage}
        />
      </div>
    </>
  );
}

export default DashboardPage;
