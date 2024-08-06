import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { API } from "../../../config/api/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../loadingSpinner";

function AppBar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState([]);
  const handleLogout = async () => {
    try {
      await API.post("user/logout");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIsLogin = async () => {
    try {
      const response = await API.get("user");
      console.log(response);
      setActiveUser(response.data.user);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleIsLogin();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        style={{ borderBottom: "1px solid #dee2e6" }}
      >
        <Container>
          <Navbar.Brand href="#/">Jasplast Sukses Bersama</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#/post-transaction">Tambah Transaksi</Nav.Link>
              <Nav.Link href="#/transaction">Lihat Daftar Transaksi</Nav.Link>
              <Nav.Link href="#/journal">Lihat Daftar Jurnal</Nav.Link>
              <NavDropdown
                title={`Login Sebagai: ${activeUser.username}`}
                id="basic-nav-dropdown"
              >
                {activeUser.role === "superadmin" && (
                  <>
                    <NavDropdown.Item href="#/history">
                      Lihat Histori
                    </NavDropdown.Item>
                    
                    <NavDropdown.Item href="#/coa">Kelola COA</NavDropdown.Item>
                    <NavDropdown.Item href="#/user">
                      Kelola Akun
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Keluar Akun
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AppBar;
