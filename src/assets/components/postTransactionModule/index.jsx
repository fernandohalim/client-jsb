import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import { API } from "../../../config/api/api";
import AlertModal from "../alertModal";
import LoadingSpinner from "../loadingSpinner";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

function formatNumber(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function NumberInput({ value, onChange }) {
  const handleInputChange = (e) => {
    const inputValue = e.target.value.replace(/\./g, "");
    if (!isNaN(inputValue)) {
      onChange(formatNumber(inputValue));
    }
  };

  return <Form.Control value={value} onChange={handleInputChange} />;
}

function PostTransactionModule() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(1);
  const [userId, setUserId] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");

  const [coaId1, setCoaId1] = useState(null);
  const [coaId2, setCoaId2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setAttachment(file);
      setAttachmentPreview(URL.createObjectURL(file));
    } else {
      setModalMessage("Lampiran harus berupa file PNG atau JPG!");
      setShowModal(true);
    }
  };

  const handleDeleteAttachment = () => {
    setAttachment(null);
    setAttachmentPreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name || !amount || !description) {
        setModalMessage("Harap isi semua field!");
        setShowModal(true);
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("amount", amount.replace(/\./g, ""));
      formData.append("description", description);
      formData.append("value", value);
      formData.append("userId", userId);
      formData.append("amount1", amount.replace(/\./g, ""));
      formData.append("amount2", amount.replace(/\./g, ""));
      formData.append("coaId1", coaId1);
      formData.append("coaId2", coaId2);
      formData.append("value1", 0);
      formData.append("value2", 1);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      console.log(formData)

      await API.post("transaction", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalMessage("Transaksi berhasil ditambahkan");
      setShowModal(true);
      setName("");
      setAmount("");
      setDescription("");
      setValue(0);
      setCoaId1(0);
      setCoaId2(0);

      setAttachment(null);
      setAttachmentPreview("");
    } catch (error) {
      setModalMessage("Gagal Menambahkan Transaksi: " + error);
      setShowModal(true);
      console.error("Gagal Menambahkan Transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIsLogin = async () => {
    try {
      const response = await API.get("user");
      console.log(response);
      setUserId(response.data.user.id);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const [coa, setCoa] = useState([]);
  const fetchCoa = async () => {
    try {
      const response = await API.get("coa");
      setCoa(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleIsLogin();
    fetchCoa();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm className="mb-3">
            <Form.Group controlId="formGridName">
              <Form.Label>Nama Transaksi</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col sm className="mb-3">
            <Form.Group controlId="formGridAmount">
              <Form.Label>Nominal</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: "1rem 0 0 1rem" }}>
                  Rp
                </InputGroup.Text>
                <NumberInput value={amount} onChange={setAmount} />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formGridDescription">
          <Form.Label>Deskripsi Transaksi</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            style={{ resize: "none" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col sm className="mb-3">
            <Form.Group controlId="formGridValue">
              <Form.Label>Jenis Transaksi</Form.Label>
              <Form.Control
                as="select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="1">Pengeluaran</option>
                <option value="0">Pemasukan</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col sm className="mb-3">
            <Form.Group controlId="formGridAttachment">
              <Form.Label>Tambah Lampiran</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ borderRadius: "1rem 0 0 1rem" }}>
                  Pilih File
                </InputGroup.Text>
                <Form.Control
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleAttachmentChange}
                  style={{ height: "100%" }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Masukkan Detil Jurnal</Card.Title>
              <Row>
                <Col sm className="mb-3">
                  <Form.Group controlId="formGridValue">
                    <Form.Label>Pilih COA (Debit)</Form.Label>
                    <Form.Control
                      as="select"
                      value={coaId1}
                      onChange={(e) => {setCoaId1(e.target.value); console.log(coaId1)}}
                    >
                      {coa.map(coaItem => (
                        <option key={coaItem.id} value={coaItem.id}>
                          {coaItem.code} - {coaItem.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col sm className="mb-3">
                  <Form.Group controlId="formGridValue">
                    <Form.Label>Pilih COA (Kredit)</Form.Label>
                    <Form.Control
                      as="select"
                      value={coaId2}
                      onChange={(e) => setCoaId2(e.target.value)}
                    >
                      {coa.map(coaItem => (
                        <option key={coaItem.id} value={coaItem.id}>
                          {coaItem.code} - {coaItem.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

          </Card.Body>
        </Card>

        <Row>
          <Col sm className="mb-3">
            <Button
              variant="primary"
              type="submit"
              style={{ marginRight: "10px", marginBottom: "10px" }}
            >
              Submit
            </Button>
            {attachmentPreview && (
              <Button
                variant="danger"
                style={{ marginRight: "10px", marginBottom: "10px" }}
                onClick={handleDeleteAttachment}
              >
                Hapus Lampiran
              </Button>
            )}
          </Col>

          <Col sm className="mb-3">
            {attachmentPreview && (
              <div>
                <Image
                  rounded
                  src={attachmentPreview}
                  alt="Attachment Preview"
                  style={{
                    maxWidth: "200px",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
      </Form>

      <AlertModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={modalMessage}
      />
    </>
  );
}

export default PostTransactionModule;
