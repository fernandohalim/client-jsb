import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { CardBody } from 'react-bootstrap';
import { useState } from 'react';

function LoginCard() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
};
return (
    <div className='d-grid gap-2' style={{ width: '30%' }}>
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
    </div>
);
}

export default LoginCard;