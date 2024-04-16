import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AppBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ borderBottom: '1px solid #dee2e6' }}>
      <Container>
        <Navbar.Brand href="#/">Jasplast Sukses Bersama</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="">Tambah Transaksi</Nav.Link>
            <Nav.Link href="#/transaction">Lihat Daftar Transaksi</Nav.Link>
            <NavDropdown title="Login Sebagai: Jamal" id="basic-nav-dropdown">
              <NavDropdown.Item href="">
                Lihat Histori
              </NavDropdown.Item>
              <NavDropdown.Item href="">
                Keluar Akun
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppBar;