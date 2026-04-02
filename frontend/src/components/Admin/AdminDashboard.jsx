import React, { useState } from "react";
import {
  Container,
  Header,
  Segment,
  Button,
  Icon,
  Table,
  Modal,
  Form,
  Input,
  TextArea,
  Dropdown,
  Message,
  Tab,
  Card,
  Image,
  Label,
  Divider,
  Grid,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    products,
    suggestions,
    reservations,
    adminUser,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteSuggestion,
    addReservation,
    updateReservation,
    deleteReservation,
    logoutAdmin,
    loginAdmin,
    workers,
    createWorker,
  } = useApp();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("products");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [reservationForm, setReservationForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    personas: 2,
    mesa: "",
    termino: "",
    notas: "",
  });
  const [workerForm, setWorkerForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const CUT_KEYS = ["picanha", "asado", "entrania", "churrasco"];
  const DONENESS_KEYS = ["blue", "rare", "medium", "threeQuarters", "well"];
  const PEOPLE = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    text: `${i + 1}`,
    value: i + 1,
  }));

  const CUTS = CUT_KEYS.map((k) => ({
    key: k,
    text: t(`reservation.cuts.${k}`),
    value: k,
  }));
  const DONENESS = DONENESS_KEYS.map((k) => ({
    key: k,
    text: t(`reservation.doneness.${k}`),
    value: k,
  }));

  // Funciones para productos
  const handleProductSubmit = async () => {
    if (!productForm.title || !productForm.price || !productForm.image) {
      return;
    }

    const productData = {
      title: productForm.title,
      price: parseFloat(productForm.price),
      description: productForm.description,
      image: productForm.image,
      category: productForm.category || "food",
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      resetProductForm();
      setProductModalOpen(false);
    } catch (e) {
      window.alert(e.message || t("admin.errorSave"));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      description: product.description || "",
      image: product.image,
      category: product.category || "",
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteProduct"))) return;
    try {
      await deleteProduct(id);
    } catch (e) {
      window.alert(e.message || t("admin.errorSave"));
    }
  };

  const resetProductForm = () => {
    setProductForm({
      title: "",
      price: "",
      description: "",
      image: "",
      category: "",
    });
    setEditingProduct(null);
  };

  // Funciones para reservas
  const handleReservationSubmit = async () => {
    if (
      !reservationForm.nombre ||
      !reservationForm.apellido ||
      !reservationForm.telefono ||
      !reservationForm.fecha ||
      !reservationForm.hora
    ) {
      return;
    }

    try {
      const flat = {
        ...reservationForm,
        cortesDetalle: [{ corte: "", qty: 1 }],
      };
      if (editingReservation) {
        await updateReservation(editingReservation.id, flat);
      } else {
        await addReservation(flat);
      }
      resetReservationForm();
      setReservationModalOpen(false);
    } catch (e) {
      window.alert(e.message || t("admin.errorSave"));
    }
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setReservationForm({
      nombre: reservation.nombre || "",
      apellido: reservation.apellido || "",
      telefono: reservation.telefono || "",
      email: reservation.email || "",
      fecha: reservation.fecha || "",
      hora: reservation.hora || "",
      personas: reservation.personas || 2,
      mesa: reservation.mesa || "",
      termino: reservation.termino || "",
      notas: reservation.notas || "",
    });
    setReservationModalOpen(true);
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteReservation"))) return;
    try {
      await deleteReservation(id);
    } catch (e) {
      window.alert(e.message || t("admin.errorSave"));
    }
  };

  const resetReservationForm = () => {
    setReservationForm({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      fecha: "",
      hora: "",
      personas: 2,
      mesa: "",
      termino: "",
      notas: "",
    });
    setEditingReservation(null);
  };

  const handleDeleteSuggestion = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteSuggestion"))) return;
    try {
      await deleteSuggestion(id);
    } catch (e) {
      window.alert(e.message || t("admin.errorSave"));
    }
  };

  const panes = [
    {
      menuItem: {
        key: "products",
        content: (
          <span>
            <Icon name="box" /> {t("admin.products")} ({products.length})
          </span>
        ),
      },
      render: () => (
        <Tab.Pane>
          <div style={{ marginBottom: "1em" }}>
            <Button
              color="orange"
              icon
              labelPosition="left"
              onClick={() => {
                resetProductForm();
                setProductModalOpen(true);
              }}
            >
              <Icon name="plus" />
              {t("admin.addProduct")}
            </Button>
          </div>

          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t("admin.image")}</Table.HeaderCell>
                <Table.HeaderCell>{t("admin.productTitle")}</Table.HeaderCell>
                <Table.HeaderCell>{t("admin.price")}</Table.HeaderCell>
                <Table.HeaderCell>{t("admin.description")}</Table.HeaderCell>
                <Table.HeaderCell>{t("admin.category")}</Table.HeaderCell>
                <Table.HeaderCell>{t("admin.actions")}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan="6" textAlign="center">
                    {t("admin.noProducts")}
                  </Table.Cell>
                </Table.Row>
              ) : (
                products.map((product) => (
                  <Table.Row key={product.id ?? product._id}>
                    <Table.Cell>
                      <Image
                        src={product.image}
                        alt={product.title}
                        size="tiny"
                        style={{ maxWidth: "80px", maxHeight: "80px" }}
                      />
                    </Table.Cell>
                    <Table.Cell>{product.title}</Table.Cell>
                    <Table.Cell>${product.price?.toLocaleString("es-CO")}</Table.Cell>
                    <Table.Cell>
                      {product.description?.substring(0, 50)}...
                    </Table.Cell>
                    <Table.Cell>{product.category}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="small"
                        color="blue"
                        icon
                        onClick={() => handleEditProduct(product)}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        size="small"
                        color="red"
                        icon
                        onClick={() => handleDeleteProduct(product.id ?? product._id)}
                      >
                        <Icon name="trash" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>

          <Modal
            open={productModalOpen}
            onClose={() => {
              setProductModalOpen(false);
              resetProductForm();
            }}
            size="large"
          >
            <Modal.Header>
              {editingProduct ? t("admin.editProduct") : t("admin.addProduct")}
            </Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field
                  control={Input}
                  label={t("admin.productTitle")}
                  placeholder={t("admin.productNamePlaceholder")}
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  required
                />
                <Form.Field
                  control={Input}
                  type="number"
                  step="0.01"
                  label={t("admin.price")}
                  placeholder="0.00"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  required
                />
                <Form.Field
                  control={TextArea}
                  label={t("admin.description")}
                  placeholder={t("admin.productDescPlaceholder")}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
                <Form.Field
                  control={Input}
                  label={`${t("admin.image")} URL`}
                  placeholder={t("admin.imageUrlPlaceholder")}
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  required
                />
                <Form.Field
                  control={Input}
                  label={t("admin.category")}
                  placeholder={t("admin.categoryPlaceholder")}
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={() => {
                  setProductModalOpen(false);
                  resetProductForm();
                }}
              >
                {t("admin.cancel")}
              </Button>
              <Button color="orange" onClick={handleProductSubmit}>
                {editingProduct ? t("admin.update") : t("admin.add")}
              </Button>
            </Modal.Actions>
          </Modal>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "workers",
        content: (
          <span>
            <Icon name="users" /> {t("admin.workers")} ({workers.length})
          </span>
        ),
      },
      render: () => (
        <Tab.Pane>
          <Message info>
            <Message.Header>{t("admin.workersInfoTitle")}</Message.Header>
            <p>{t("admin.workersInfoBody")}</p>
          </Message>
          <Segment>
            <Header as="h4">{t("admin.createWorker")}</Header>
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  !workerForm.name ||
                  !workerForm.email ||
                  !workerForm.password ||
                  workerForm.password.length < 5
                ) {
                  return;
                }
                try {
                  await createWorker(workerForm);
                  setWorkerForm({
                    name: "",
                    lastName: "",
                    email: "",
                    password: "",
                    phone: "",
                  });
                } catch (err) {
                  window.alert(err.message || t("admin.errorSave"));
                }
              }}
            >
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  label={t("admin.firstName")}
                  value={workerForm.name}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, name: e.target.value })
                  }
                  required
                />
                <Form.Field
                  control={Input}
                  label={t("admin.lastName")}
                  value={workerForm.lastName}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, lastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field
                  control={Input}
                  type="email"
                  label={t("admin.email").replace(":", "")}
                  value={workerForm.email}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, email: e.target.value })
                  }
                  required
                />
                <Form.Field
                  control={Input}
                  type="password"
                  label={t("admin.password")}
                  value={workerForm.password}
                  onChange={(e) =>
                    setWorkerForm({ ...workerForm, password: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Field
                control={Input}
                label={t("admin.phoneLabel")}
                value={workerForm.phone}
                onChange={(e) =>
                  setWorkerForm({ ...workerForm, phone: e.target.value })
                }
              />
              <Button type="submit" color="orange">
                <Icon name="save" /> {t("admin.createWorker")}
              </Button>
            </Form>
          </Segment>
          {workers.length === 0 ? (
            <Message warning>{t("admin.noWorkers")}</Message>
          ) : (
            <Table celled striped style={{ marginTop: "1em" }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t("admin.client")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.email")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.phoneLabel")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.role")}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {workers.map((w) => (
                  <Table.Row key={w.id}>
                    <Table.Cell>
                      {w.nombre} {w.apellido}
                    </Table.Cell>
                    <Table.Cell>{w.email}</Table.Cell>
                    <Table.Cell>{w.telefono || "—"}</Table.Cell>
                    <Table.Cell>{t("admin.workerRole")}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "suggestions",
        content: (
          <span>
            <Icon name="mail" /> {t("admin.suggestions")} ({suggestions.length})
          </span>
        ),
      },
      render: () => (
        <Tab.Pane>
          {suggestions.length === 0 ? (
            <Message info>
              <Message.Header>{t("admin.noSuggestions")}</Message.Header>
              <p>{t("admin.suggestionsEmpty")}</p>
            </Message>
          ) : (
            <Card.Group>
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} fluid>
                  <Card.Content>
                    <Card.Header>
                      <Icon name="user" /> {suggestion.nombre}
                    </Card.Header>
                    <Card.Meta>
                      <Icon name="mail" /> {suggestion.email}
                    </Card.Meta>
                    <Card.Meta>
                      <Icon name="calendar" />{" "}
                      {new Date(suggestion.fecha).toLocaleString("es-CO")}
                    </Card.Meta>
                    <Divider />
                    <Card.Description>{suggestion.mensaje}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      color="red"
                      icon
                      labelPosition="left"
                      onClick={() => handleDeleteSuggestion(suggestion.id)}
                    >
                      <Icon name="trash" />
                      {t("admin.delete")}
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "reservations",
        content: (
          <span>
            <Icon name="calendar" /> {t("admin.reservations")} ({reservations.length})
          </span>
        ),
      },
      render: () => (
        <Tab.Pane>
          <div style={{ marginBottom: "1em" }}>
            <Button
              color="orange"
              icon
              labelPosition="left"
              onClick={() => {
                resetReservationForm();
                setReservationModalOpen(true);
              }}
            >
              <Icon name="plus" />
              {t("admin.createReservation")}
            </Button>
          </div>

          {reservations.length === 0 ? (
            <Message info>
              <Message.Header>{t("admin.noReservations")}</Message.Header>
              <p>{t("admin.noReservationsRegistered")}</p>
            </Message>
          ) : (
            <Table celled striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t("admin.client")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.contact")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.date")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.time")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.people")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.table")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.actions")}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {reservations.map((reservation) => (
                  <Table.Row key={reservation.id}>
                    <Table.Cell>
                      {reservation.nombre} {reservation.apellido}
                    </Table.Cell>
                    <Table.Cell>
                      <div>{reservation.telefono}</div>
                      {reservation.email && (
                        <div style={{ fontSize: "0.9em", color: "#666" }}>
                          {reservation.email}
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>{reservation.fecha}</Table.Cell>
                    <Table.Cell>{reservation.hora}</Table.Cell>
                    <Table.Cell>{reservation.personas}</Table.Cell>
                    <Table.Cell>{reservation.mesa || "-"}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="small"
                        color="blue"
                        icon
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Icon name="edit" />
                      </Button>
                      <Button
                        size="small"
                        color="red"
                        icon
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <Icon name="trash" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          <Modal
            open={reservationModalOpen}
            onClose={() => {
              setReservationModalOpen(false);
              resetReservationForm();
            }}
            size="large"
          >
            <Modal.Header>
              {editingReservation ? t("admin.editReservation") : t("admin.createReservation")}
            </Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    label={t("admin.firstName")}
                    placeholder={t("admin.firstName")}
                    value={reservationForm.nombre}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                  <Form.Field
                    control={Input}
                    label={t("admin.lastName")}
                    placeholder={t("admin.lastName")}
                    value={reservationForm.apellido}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        apellido: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    label={t("admin.phoneLabel")}
                    placeholder={t("admin.phoneLabel")}
                    value={reservationForm.telefono}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        telefono: e.target.value,
                      })
                    }
                    required
                  />
                  <Form.Field
                    control={Input}
                    type="email"
                    label={t("admin.email").replace(":", "")}
                    placeholder={t("admin.emailPlaceholder")}
                    value={reservationForm.email}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    type="date"
                    label={t("admin.date")}
                    value={reservationForm.fecha}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        fecha: e.target.value,
                      })
                    }
                    required
                  />
                  <Form.Field
                    control={Input}
                    type="time"
                    label={t("admin.time")}
                    value={reservationForm.hora}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        hora: e.target.value,
                      })
                    }
                    required
                  />
                  <Form.Field
                    control={Dropdown}
                    selection
                    options={PEOPLE}
                    label={t("admin.people")}
                    value={reservationForm.personas}
                    onChange={(e, { value }) =>
                      setReservationForm({
                        ...reservationForm,
                        personas: value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Dropdown}
                    selection
                    options={DONENESS}
                    label={t("reservation.fields.doneness.label")}
                    placeholder={t("admin.selectTerm")}
                    value={reservationForm.termino}
                    onChange={(e, { value }) =>
                      setReservationForm({
                        ...reservationForm,
                        termino: value,
                      })
                    }
                  />
                  <Form.Field
                    control={Input}
                    label={t("admin.table")}
                    placeholder={t("admin.tableNumber")}
                    value={reservationForm.mesa}
                    onChange={(e) =>
                      setReservationForm({
                        ...reservationForm,
                        mesa: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Field
                  control={TextArea}
                  label={t("admin.notes")}
                  placeholder={t("admin.additionalNotes")}
                  value={reservationForm.notas}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      notas: e.target.value,
                    })
                  }
                  rows={3}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button
                onClick={() => {
                  setReservationModalOpen(false);
                  resetReservationForm();
                }}
              >
                {t("admin.cancel")}
              </Button>
              <Button color="orange" onClick={handleReservationSubmit}>
                {editingReservation ? t("admin.update") : t("admin.create")}
              </Button>
            </Modal.Actions>
          </Modal>
        </Tab.Pane>
      ),
    },
  ];

  const handleLogout = async () => {
    if (!window.confirm(t("admin.confirmLogout"))) return;
    await logoutAdmin();
    navigate("/");
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault?.();
    setLoginError("");
    setLoginLoading(true);
    try {
      await loginAdmin(loginEmail.trim(), loginPassword);
      setLoginPassword("");
    } catch (err) {
      setLoginError(err.message || "Error");
    } finally {
      setLoginLoading(false);
    }
  };

  if (!adminUser) {
    return (
      <Container style={{ padding: "2.5rem 0", minHeight: "80vh", maxWidth: "480px" }}>
        <Header as="h1" color="orange" textAlign="center">
          <Icon name="lock" />
          {t("admin.title")}
        </Header>
        <Segment raised style={{ marginTop: "2em" }}>
          <Form onSubmit={handleLoginSubmit} error={!!loginError}>
            {loginError && (
              <Message error header={t("reservation.errors.header")} content={loginError} />
            )}
            <Message info size="small">
              <p>{t("admin.testAccountsHint")}</p>
            </Message>
            <Form.Field
              control={Input}
              type="email"
              label="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <Form.Field
              control={Input}
              type="password"
              label={t("admin.password") || "Contraseña"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <Button color="orange" fluid loading={loginLoading} disabled={loginLoading}>
              {t("admin.login") || "Entrar"}
            </Button>
          </Form>
        </Segment>
      </Container>
    );
  }

  return (
    <Container style={{ padding: "2.5rem 0", minHeight: "80vh" }}>
      <Header as="h1" color="orange" textAlign="center">
        <Icon name="settings" />
        {t("admin.title")}
        <Header.Subheader>
          {t("admin.subtitle")}
        </Header.Subheader>
      </Header>

      {/* Información del administrador */}
      {adminUser && (
        <Segment
          raised
          className="admin-info-segment"
          style={{
            marginTop: "2em",
            marginBottom: "1em",
            background: "linear-gradient(135deg, #ff7b00 0%, #ff4500 100%)",
            color: "white",
          }}
        >
          <Grid columns={2} stackable>
            <Grid.Column>
              <Header as="h3" style={{ color: "white" }}>
                <Icon name="user circle" style={{ color: "white" }} />
                {t("admin.infoTitle")}
              </Header>
              <div style={{ marginTop: "1em" }}>
                <p>
                  <strong>
                    <Icon name="user" /> {t("admin.name")}
                  </strong>{" "}
                  {adminUser.nombre} {adminUser.apellido}
                </p>
                <p>
                  <strong>
                    <Icon name="mail" /> {t("admin.email")}
                  </strong>{" "}
                  {adminUser.email}
                </p>
                {adminUser.telefono && (
                  <p>
                    <strong>
                      <Icon name="phone" /> {t("admin.phone")}
                    </strong>{" "}
                    {adminUser.telefono}
                  </p>
                )}
                <p>
                  <strong>
                    <Icon name="shield" /> {t("admin.role")}
                  </strong>{" "}
                  {adminUser.rol}
                </p>
                {adminUser.fechaIngreso && (
                  <p>
                    <strong>
                      <Icon name="calendar" /> {t("admin.joinDate")}
                    </strong>{" "}
                    {new Date(adminUser.fechaIngreso).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="right">
              <Button
                color="red"
                size="large"
                icon
                labelPosition="left"
                onClick={handleLogout}
                style={{ marginTop: "1em" }}
              >
                <Icon name="sign out" />
                {t("admin.logout")}
              </Button>
            </Grid.Column>
          </Grid>
        </Segment>
      )}

      <Segment raised style={{ marginTop: "2em" }}>
        <Tab
          panes={panes}
          activeIndex={panes.findIndex((p) => p.menuItem.key === activeTab)}
          onTabChange={(e, { activeIndex }) => {
            if (activeIndex >= 0 && activeIndex < panes.length) {
              setActiveTab(panes[activeIndex].menuItem.key);
            }
          }}
        />
      </Segment>
    </Container>
  );
};

export default AdminDashboard;
