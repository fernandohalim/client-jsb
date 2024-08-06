import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CardBody } from 'react-bootstrap';
import { useState } from 'react';
import {API} from '../../../config/api/api.js'
import { useNavigate } from 'react-router-dom';
import AlertModal from '../alertModal/index.jsx';
import LoadingSpinner from '../loadingSpinner/index.jsx';

function LoginCard() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();

//Alert
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    try {
      event.preventDefault();
      if (!username || !password) {
        setModalMessage('Username dan password harus diisi');
        setShowModal(true);
        return;
      }

      const response = await API.post("user/login", {
        username,
        password,
      });

      console.log(response);
      navigate('/');
    } catch (error) {
      if (error.response) {
        console.error("Server Error", error.response.data);
        setModalMessage(error.response.data.message);
      } else if (error.request) {
        console.error("No Response", error.request);
        setModalMessage('No response from the server');
      } else {
        console.error("Request Error", error.message);
        setModalMessage('Request error: ' + error.message);
      }
      setShowModal(true);
    } finally {
        setLoading(false)
    }
  };


return (
    <>
        {loading && <LoadingSpinner />}
        <div className='d-grid gap-2'>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Halaman Login</h3>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type='text' 
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Kata Sandi</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Masukkan kata sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" style={{ width: "100%", marginTop: '30px', height: '50px' }} type="submit">
                            Login
                        </Button>
                    </Form>
                </CardBody>
            </Card>

            <AlertModal
                show={showModal}
                onHide={() => setShowModal(false)}
                message={modalMessage}
            />
        </div>
    </>
);
}

export default LoginCard;