import React, { useMemo, useState } from "react";
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    products,
    suggestions,
    reservations,
    orders,
    adminUser,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteSuggestion,
    addReservation,
    updateReservation,
    deleteReservation,
    fetchOrders,
    updateOrderStatus,
    logoutAdmin,
    loginAdmin,
    workers,
    createWorker,
  } = useApp();

  const locale =
    i18n.language === "en"
      ? "en-US"
      : i18n.language === "zh"
      ? "zh-CN"
      : "es-CO";

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

  const DONENESS_KEYS = ["blue", "rare", "medium", "threeQuarters", "well"];
  const PEOPLE = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    text: `${i + 1}`,
    value: i + 1,
  }));

  const DONENESS = DONENESS_KEYS.map((k) => ({
    key: k,
    text: t(`reservation.doneness.${k}`),
    value: k,
  }));

  const ORDER_STATUS_OPTIONS = [
    { key: 'pending', text: t('admin.pending'), value: 'pending' },
    { key: 'preparing', text: t('admin.preparing'), value: 'preparing' },
    { key: 'sent', text: t('admin.sent'), value: 'sent' },
    { key: 'delivered', text: t('admin.delivered'), value: 'delivered' },
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(); // Recargar para asegurar sincronización
    } catch (error) {
      window.alert(error.message || 'Error al cambiar el estado del pedido');
    }
  };

  const formatNumber = (value) =>
    new Intl.NumberFormat(locale).format(Number(value) || 0);

  const formatLongDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString(locale);
  };

  const truncateText = (text, max = 72) => {
    if (!text) return "—";
    return text.length > max ? `${text.substring(0, max)}...` : text;
  };

  const statsCards = useMemo(
    () => [
      {
        key: "products",
        icon: "box",
        value: products.length,
        label: t("admin.products"),
      },
      {
        key: "workers",
        icon: "users",
        value: workers.length,
        label: t("admin.workers"),
      },
      {
        key: "suggestions",
        icon: "mail",
        value: suggestions.length,
        label: t("admin.suggestions"),
      },
      {
        key: "reservations",
        icon: "calendar check",
        value: reservations.length,
        label: t("admin.reservations"),
      },
    ],
    [products.length, workers.length, suggestions.length, reservations.length, t]
  );

  const handleProductSubmit = async () => {
    if (!productForm.title || !productForm.price || !productForm.image) return;

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

  // Filtrar pestañas según el rol del usuario
  const getFilteredPanes = () => {
    if (adminUser?.rol === 'Trabajador') {
      // Workers solo ven Pedidos y Reservas
      return panes.filter(pane => 
        pane.menuItem.key === 'orders' || pane.menuItem.key === 'reservations'
      );
    }
    // Admins ven todas las pestañas
    return panes;
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
        <Tab.Pane className="admin-tab-pane">
          <div className="admin-pane-toolbar">
            <Button
              color="orange"
              icon
              labelPosition="left"
              className="admin-primary-btn"
              onClick={() => {
                resetProductForm();
                setProductModalOpen(true);
              }}
            >
              <Icon name="plus" />
              {t("admin.addProduct")}
            </Button>
          </div>

          <Table celled striped className="admin-data-table">
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
                        className="admin-thumb"
                      />
                    </Table.Cell>

                    <Table.Cell className="admin-cell-title">
                      {product.title}
                    </Table.Cell>

                    <Table.Cell>${formatNumber(product.price)}</Table.Cell>

                    <Table.Cell className="admin-description-cell">
                      {truncateText(product.description, 70)}
                    </Table.Cell>

                    <Table.Cell>
                      <Label className="admin-tag">
                        {product.category || "food"}
                      </Label>
                    </Table.Cell>

                    <Table.Cell className="admin-actions-cell">
                      <Button
                        size="small"
                        icon
                        className="admin-icon-btn edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Icon name="edit" />
                      </Button>

                      <Button
                        size="small"
                        icon
                        className="admin-icon-btn delete"
                        onClick={() =>
                          handleDeleteProduct(product.id ?? product._id)
                        }
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
            className="admin-modal"
          >
            <Modal.Header>
              {editingProduct ? t("admin.editProduct") : t("admin.addProduct")}
            </Modal.Header>

            <Modal.Content>
              <Form className="admin-form">
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
        <Tab.Pane className="admin-tab-pane">
          <Message info className="admin-message">
            <Message.Header>{t("admin.workersInfoTitle")}</Message.Header>
            <p>{t("admin.workersInfoBody")}</p>
          </Message>

          <Segment className="admin-inner-segment">
            <Header as="h4">{t("admin.createWorker")}</Header>

            <Form
              className="admin-form"
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

              <Button type="submit" color="orange" className="admin-primary-btn">
                <Icon name="save" /> {t("admin.createWorker")}
              </Button>
            </Form>
          </Segment>

          {workers.length === 0 ? (
            <Message warning className="admin-message">
              {t("admin.noWorkers")}
            </Message>
          ) : (
            <Table celled striped className="admin-data-table admin-spacing-top">
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
                    <Table.Cell>
                      <Label className="admin-tag">{t("admin.workerRole")}</Label>
                    </Table.Cell>
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
        <Tab.Pane className="admin-tab-pane">
          {suggestions.length === 0 ? (
            <Message info className="admin-message">
              <Message.Header>{t("admin.noSuggestions")}</Message.Header>
              <p>{t("admin.suggestionsEmpty")}</p>
            </Message>
          ) : (
            <Card.Group className="admin-suggestion-group">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} fluid className="admin-suggestion-card">
                  <Card.Content>
                    <Card.Header>
                      <Icon name="user" /> {suggestion.nombre}
                    </Card.Header>

                    <Card.Meta>
                      <Icon name="mail" /> {suggestion.email}
                    </Card.Meta>

                    <Card.Meta>
                      <Icon name="calendar" /> {formatDateTime(suggestion.fecha)}
                    </Card.Meta>

                    <Divider />

                    <Card.Description>{suggestion.mensaje}</Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <Button
                      className="admin-danger-btn"
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
        <Tab.Pane className="admin-tab-pane">
          <div className="admin-pane-toolbar">
            <Button
              color="orange"
              icon
              labelPosition="left"
              className="admin-primary-btn"
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
            <Message info className="admin-message">
              <Message.Header>{t("admin.noReservations")}</Message.Header>
              <p>{t("admin.noReservationsRegistered")}</p>
            </Message>
          ) : (
            <Table celled striped className="admin-data-table">
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
                    <Table.Cell className="admin-cell-title">
                      {reservation.nombre} {reservation.apellido}
                    </Table.Cell>

                    <Table.Cell>
                      <div>{reservation.telefono}</div>
                      {reservation.email && (
                        <div className="admin-secondary-text">
                          {reservation.email}
                        </div>
                      )}
                    </Table.Cell>

                    <Table.Cell>{reservation.fecha}</Table.Cell>
                    <Table.Cell>{reservation.hora}</Table.Cell>
                    <Table.Cell>
                      <Label className="admin-tag">{reservation.personas}</Label>
                    </Table.Cell>
                    <Table.Cell>{reservation.mesa || "-"}</Table.Cell>

                    <Table.Cell className="admin-actions-cell">
                      <Button
                        size="small"
                        icon
                        className="admin-icon-btn edit"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Icon name="edit" />
                      </Button>

                      <Button
                        size="small"
                        icon
                        className="admin-icon-btn delete"
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
            className="admin-modal"
          >
            <Modal.Header>
              {editingReservation
                ? t("admin.editReservation")
                : t("admin.createReservation")}
            </Modal.Header>

            <Modal.Content>
              <Form className="admin-form">
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
    {
      menuItem: {
        key: "orders",
        content: (
          <span>
            <Icon name="shopping cart" /> {t("admin.orders")} ({orders.length})
          </span>
        ),
      },
      render: () => (
        <Tab.Pane className="admin-tab-pane">
          {orders.length === 0 ? (
            <Message info className="admin-message">
              <Message.Header>{t("admin.noOrders")}</Message.Header>
              <p>{t("admin.noOrdersRegistered")}</p>
            </Message>
          ) : (
            <Table celled striped className="admin-data-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t("admin.orderId")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.customer")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.phone")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.total")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.status")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.date")}</Table.HeaderCell>
                  <Table.HeaderCell>{t("admin.actions")}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {orders.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell className="admin-cell-title">
                      <strong>#{order.id?.slice(-8) || order.id}</strong>
                    </Table.Cell>

                    <Table.Cell>
                      <div>{order.customerName}</div>
                      {order.customerEmail && (
                        <div className="admin-secondary-text">
                          {order.customerEmail}
                        </div>
                      )}
                    </Table.Cell>

                    <Table.Cell>{order.customerPhone || "N/A"}</Table.Cell>

                    <Table.Cell>
                      <strong>${formatNumber(order.total)}</strong>
                    </Table.Cell>

                    <Table.Cell>
                      <Dropdown
                        selection
                        compact
                        upward
                        options={ORDER_STATUS_OPTIONS}
                        value={order.status}
                        onChange={(e, { value }) => 
                          handleStatusChange(order.id, value)
                        }
                        className={`admin-status-dropdown ${order.status}`}
                      />
                    </Table.Cell>

                    <Table.Cell>{formatDateTime(order.createdAt)}</Table.Cell>

                    <Table.Cell className="admin-actions-cell">
                      <Button
                        size="small"
                        icon
                        className="admin-icon-btn info"
                        onClick={() => {
                          const itemsText = order.items.map(item => 
                            `${item.title} x${item.quantity} ($${item.price.toLocaleString('es-CO')})`
                          ).join('\n');
                          const addressText = order.deliveryAddress + 
                            (order.deliveryReference ? `\nRef: ${order.deliveryReference}` : '');
                          window.alert(
                            `${t("admin.orderDetails")}:\n\n` +
                            `${t("admin.customer")}: ${order.customerName}\n` +
                            `${t("admin.phone")}: ${order.customerPhone}\n` +
                            `${t("admin.email")}: ${order.customerEmail}\n` +
                            `${t("admin.deliveryAddress")}: ${addressText}\n\n` +
                            `${t("admin.items")}:\n${itemsText}\n\n` +
                            `${t("admin.total")}: $${formatNumber(order.total)}`
                          );
                        }}
                        title={t("admin.orderDetails")}
                      >
                        <Icon name="eye" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
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
      <Container className="admin-login-page">
        <div className="admin-login-shell">
          <Segment raised className="admin-login-card">
            <div className="admin-login-badge">
              <Icon name="lock" />
            </div>

            <Header as="h1" className="admin-login-title" textAlign="center">
              {t("admin.title")}
              <Header.Subheader>{t("admin.subtitle")}</Header.Subheader>
            </Header>

            <Form
              onSubmit={handleLoginSubmit}
              error={!!loginError}
              className="admin-form"
            >
              {loginError && (
                <Message
                  error
                  header={t("reservation.errors.header")}
                  content={loginError}
                />
              )}

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

              <Button
                color="orange"
                fluid
                loading={loginLoading}
                disabled={loginLoading}
                className="admin-login-btn"
              >
                {t("admin.login") || "Entrar"}
              </Button>
            </Form>
          </Segment>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-dashboard">
      <div className="admin-hero">
        <div className="admin-hero-icon-wrap">
          <Icon name="settings" className="admin-hero-icon" />
        </div>

        <div className="admin-hero-text">
          <span className="admin-eyebrow">Carnes al Barril</span>
          <Header as="h1" className="admin-main-title">
            {t("admin.title")}
            <Header.Subheader>{t("admin.subtitle")}</Header.Subheader>
          </Header>
        </div>
      </div>

      <Grid className="admin-summary-grid" stackable>
        {statsCards.map((item) => (
          <Grid.Column key={item.key} computer={4} tablet={8} mobile={16}>
            <Segment className={`admin-stat-card ${item.key}`}>
              <div className="admin-stat-icon">
                <Icon name={item.icon} />
              </div>
              <div className="admin-stat-content">
                <span className="admin-stat-value">{item.value}</span>
                <span className="admin-stat-label">{item.label}</span>
              </div>
            </Segment>
          </Grid.Column>
        ))}
      </Grid>

      <Segment raised className="admin-profile-card">
        <Grid stackable>
          <Grid.Column computer={11} tablet={16} mobile={16}>
            <div className="admin-profile-head">
              <div className="admin-profile-avatar">
                <Icon name="user circle" />
              </div>

              <div>
                <span className="admin-eyebrow">{t("admin.infoTitle")}</span>
                <Header as="h2" className="admin-profile-name">
                  {adminUser.nombre} {adminUser.apellido}
                </Header>
                <Label className="admin-role-chip">{adminUser.rol}</Label>
              </div>
            </div>

            <div className="admin-profile-grid">
              <div className="admin-profile-item">
                <Icon name="mail" />
                <div>
                  <span>{t("admin.email")}</span>
                  <strong>{adminUser.email}</strong>
                </div>
              </div>

              {adminUser.telefono && (
                <div className="admin-profile-item">
                  <Icon name="phone" />
                  <div>
                    <span>{t("admin.phone")}</span>
                    <strong>{adminUser.telefono}</strong>
                  </div>
                </div>
              )}

              <div className="admin-profile-item">
                <Icon name="shield" />
                <div>
                  <span>{t("admin.role")}</span>
                  <strong>{adminUser.rol}</strong>
                </div>
              </div>

              {adminUser.fechaIngreso && (
                <div className="admin-profile-item">
                  <Icon name="calendar" />
                  <div>
                    <span>{t("admin.joinDate")}</span>
                    <strong>{formatLongDate(adminUser.fechaIngreso)}</strong>
                  </div>
                </div>
              )}
            </div>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="admin-profile-actions"
          >
            <Button
              color="red"
              size="large"
              icon
              labelPosition="left"
              onClick={handleLogout}
              className="admin-logout-btn"
            >
              <Icon name="sign out" />
              {t("admin.logout")}
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment raised className="admin-main-panel">
        <Tab
          className="admin-tabs"
          menu={{ secondary: true, pointing: false }}
          panes={getFilteredPanes()}
          activeIndex={getFilteredPanes().findIndex((p) => p.menuItem.key === activeTab)}
          onTabChange={(e, { activeIndex }) => {
            const filteredPanes = getFilteredPanes();
            if (activeIndex >= 0 && activeIndex < filteredPanes.length) {
              setActiveTab(filteredPanes[activeIndex].menuItem.key);
            }
          }}
        />
      </Segment>
    </Container>
  );
};

export default AdminDashboard;