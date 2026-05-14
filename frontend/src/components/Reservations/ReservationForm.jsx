import React, { useState } from "react";
import {
  Container, Header, Segment, Form, Input, TextArea, Dropdown,
  Button, Icon, Message, Checkbox
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";
import "./ReservationForm.css";

const CUT_KEYS = ["picanha", "asado", "entrania", "churrasco"];

const CUT_PRICES = {
  picanha: 42000,
  asado: 45000,
  entrania: 35000,
  churrasco: 39000,
};

const PEOPLE = Array.from({ length: 12 }, (_, i) => ({
  key: i + 1, text: `${i + 1}`, value: i + 1
}));

// Generar opciones de hora en formato PM (12:00 - 22:00)
const TIME_OPTIONS = [
  { key: '12:00', text: '12:00 PM', value: '12:00' },
  { key: '12:30', text: '12:30 PM', value: '12:30' },
  { key: '13:00', text: '1:00 PM', value: '13:00' },
  { key: '13:30', text: '1:30 PM', value: '13:30' },
  { key: '14:00', text: '2:00 PM', value: '14:00' },
  { key: '14:30', text: '2:30 PM', value: '14:30' },
  { key: '15:00', text: '3:00 PM', value: '15:00' },
  { key: '15:30', text: '3:30 PM', value: '15:30' },
  { key: '16:00', text: '4:00 PM', value: '16:00' },
  { key: '16:30', text: '4:30 PM', value: '16:30' },
  { key: '17:00', text: '5:00 PM', value: '17:00' },
  { key: '17:30', text: '5:30 PM', value: '17:30' },
  { key: '18:00', text: '6:00 PM', value: '18:00' },
  { key: '18:30', text: '6:30 PM', value: '18:30' },
  { key: '19:00', text: '7:00 PM', value: '19:00' },
  { key: '19:30', text: '7:30 PM', value: '19:30' },
  { key: '20:00', text: '8:00 PM', value: '20:00' },
  { key: '20:30', text: '8:30 PM', value: '20:30' },
  { key: '21:00', text: '9:00 PM', value: '21:00' },
  { key: '21:30', text: '9:30 PM', value: '21:30' },
];

const INITIAL = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  fecha: "",
  hora: "",
  personas: 2,
  mesa: "",
  decoracionMesa: false,
  notas: "",
  cortesSeleccionados: {},
};

// Obtener fecha actual en formato YYYY-MM-DD para el atributo min
const getTodayDate = () => {
  const today = new Date();
  // Usar zona horaria local para evitar bloqueos prematuros
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export default function ReservationForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addReservation } = useApp();
  const [values, setValues] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (_e, { name, value }) => {
    if (name === "nombre" || name === "apellido") {
      value = value.replace(/[^a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]/g, '');
    } else if (name === "telefono") {
      value = value.replace(/[^\d\s\-()+]/g, '');
    }
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleCheckbox = (_e, { name, checked }) =>
    setValues(v => ({ ...v, [name]: checked }));

  const toggleCut = (cutKey) => {
    setValues(v => {
      const current = { ...v.cortesSeleccionados };
      if (current[cutKey]) {
        delete current[cutKey];
      } else {
        current[cutKey] = 1;
      }
      return { ...v, cortesSeleccionados: current };
    });
  };

  const updateCutPortions = (cutKey, rawQty) => {
    const qty = parseInt(rawQty, 10);
    if (isNaN(qty) || qty < 1) return;
    setValues(v => ({
      ...v,
      cortesSeleccionados: { ...v.cortesSeleccionados, [cutKey]: qty },
    }));
  };

  const totalQty = Object.values(values.cortesSeleccionados).reduce(
    (s, q) => s + (parseInt(q, 10) || 0), 0
  );

  const totalPrice = Object.entries(values.cortesSeleccionados).reduce(
    (sum, [cut, qty]) => sum + (CUT_PRICES[cut] || 0) * (parseInt(qty, 10) || 0), 0
  );

  const validate = () => {
    const nameRegex = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/;
    const phoneRegex = /^[+\d][\d\s\-()]{6,14}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.nombre?.trim()) return t("reservation.errors.nameRequired");
    if (values.nombre.trim().length < 2) return t("reservation.errors.nameTooShort");
    if (!nameRegex.test(values.nombre.trim())) return t("reservation.errors.nameInvalid");

    if (!values.apellido?.trim()) return t("reservation.errors.nameRequired");
    if (values.apellido.trim().length < 2) return t("reservation.errors.lastNameTooShort");
    if (!nameRegex.test(values.apellido.trim())) return t("reservation.errors.lastNameInvalid");

    if (!values.telefono?.trim()) return t("reservation.errors.phoneRequired");
    if (!phoneRegex.test(values.telefono.trim())) return t("reservation.errors.phoneInvalid");

    if (values.email?.trim() && !emailRegex.test(values.email.trim())) return t("reservation.errors.emailInvalid");

    if (!values.fecha || !values.hora) return t("reservation.errors.datetimeRequired");
    if (!values.personas) return t("reservation.errors.peopleRequired");
    
    // Validación de fecha futura
    const today = getTodayDate();
    if (values.fecha < today) {
      return t("reservation.errors.pastDate");
    }
    
    // Validación de horario entre 12:00 y 22:00
    if (values.hora) {
      const [hours] = values.hora.split(':').map(Number);
      if (hours < 12 || hours >= 22) {
        return t("reservation.errors.invalidTimeRange", { open: "12:00", close: "22:00" });
      }
    }
    
    if (Object.keys(values.cortesSeleccionados).length === 0) return "Selecciona al menos un corte";
    if (totalQty > values.personas)
      return t("reservation.errors.qtyExceedsPeople", { totalQty, personas: values.personas });
    return "";
  };

  const onSubmit = async () => {
    const v = validate();
    if (v) { setErrorMsg(v); setStatus("error"); return; }

    setStatus("loading");
    setErrorMsg("");

    try {
      await addReservation(values);
      navigate("/contacto", { state: { reservationSuccess: true } });
    } catch (_e) {
      setErrorMsg(t("reservation.errors.submitFailed"));
      setStatus("error");
    }
  };

  return (
    <Container style={{ padding: "2.5rem 0" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button
        color="orange"
        icon
        labelPosition="left"
        size="large"
        onClick={() => navigate("/contacto")}
        aria-label="Volver a Contacto"
      >
        <Icon name="arrow left" />
        Volver a Contacto
      </Button>
      </div>

      <Header as="h1" color="orange" textAlign="center">
        {t("reservation.title")}
        <Header.Subheader style={{ color: "#c9cdd3" }}>
          {t("reservation.subtitle")}
        </Header.Subheader>
      </Header>

      <Segment raised>
          <Form onSubmit={onSubmit} loading={status === "loading"}>
            {status === "error" && (
              <Message error icon>
                <Icon name="warning sign" />
                <Message.Content>
                  <Message.Header>{t("reservation.errors.header")}</Message.Header>
                  {errorMsg}
                </Message.Content>
              </Message>
            )}

            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label={t("reservation.fields.firstName.label")}
                placeholder={t("reservation.fields.firstName.placeholder")}
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                required
              />
              <Form.Field
                control={Input}
                label={t("reservation.fields.lastName.label")}
                placeholder={t("reservation.fields.lastName.placeholder")}
                name="apellido"
                value={values.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label={t("reservation.fields.phone.label")}
                placeholder={t("reservation.fields.phone.placeholder")}
                name="telefono"
                value={values.telefono}
                onChange={handleChange}
                required
              />
              <Form.Field
                control={Input}
                label={t("reservation.fields.email.label")}
                placeholder={t("reservation.fields.email.placeholder")}
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                type="date"
                label={t("reservation.fields.date.label")}
                name="fecha"
                value={values.fecha}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
              <Form.Field
                control={Dropdown}
                selection
                options={TIME_OPTIONS}
                label={t("reservation.fields.time.label")}
                name="hora"
                value={values.hora}
                onChange={handleChange}
                placeholder="Seleccionar hora"
                required
              />
              <Form.Field
                control={Dropdown}
                selection
                options={PEOPLE}
                label={t("reservation.fields.people.label")}
                name="personas"
                value={values.personas}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Información de horarios de atención */}
            <Message info icon>
              <Icon name="clock" />
              <Message.Content>
                <Message.Header>Horarios de Atención</Message.Header>
                <p>Nuestro horario de atención para reservas es de <strong>12:00 PM a 10:00 PM</strong>.</p>
                <p>Por favor selecciona una hora dentro de este rango para confirmar tu reserva.</p>
              </Message.Content>
            </Message>

            <Header as="h4" style={{ color: "#ff7a1a" }}>
              {t("reservation.sections.cuts")}
            </Header>

            <div className="cut-list">
              {CUT_KEYS.map(key => {
                const price = CUT_PRICES[key];
                const selected = !!values.cortesSeleccionados[key];
                return (
                  <div
                    key={key}
                    className={`cut-item ${selected ? "cut-item-selected" : ""}`}
                  >
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleCut(key)}
                    />
                    <div className="cut-item-content">
                      <span className="cut-item-name">{t(`reservation.cuts.${key}`)}</span>
                      <span className="cut-item-price">${price.toLocaleString("es-CO")}/und</span>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      className="cut-portion-input"
                      value={values.cortesSeleccionados[key] || ""}
                      disabled={!selected}
                      onChange={(_e, { value }) => updateCutPortions(key, value)}
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>

            <Form.Field>
              <div className="total-price-row">
                <span className="total-qty-label">{t("reservation.labels.totalPortions", { totalQty })} / {t("reservation.labels.people", { personas: values.personas })}</span>
                <div>
                  <span className="total-price-label">{t("reservation.labels.totalPrice", { total: "" }).replace("{{total}}", "").trim()}</span>
                  <span className="total-price-display">${totalPrice.toLocaleString("es-CO")}</span>
                </div>
              </div>
            </Form.Field>

            <Form.Group widths="equal">
              <Form.Field
                control={Input}
                label={t("reservation.fields.table.label")}
                placeholder={t("reservation.fields.table.placeholder")}
                name="mesa"
                maxLength={30}
                value={values.mesa}
                onChange={handleChange}
              />
              <Form.Field style={{ paddingTop: "1.6rem" }}>
                <Checkbox
                  label={t("reservation.fields.tableDecoration.label")}
                  name="decoracionMesa"
                  checked={values.decoracionMesa}
                  onChange={handleCheckbox}
                />
              </Form.Field>
            </Form.Group>

            <Form.Field
              control={TextArea}
              label={t("reservation.fields.notes.label")}
              placeholder={t("reservation.fields.notes.placeholder")}
              name="notas"
              value={values.notas}
              onChange={handleChange}
              rows={4}
            />

            {/* Botón RESERVAR en naranja */}
            <Button
              color="orange"
              size="large"
              fluid
              type="submit"
              loading={status === "loading"}
              disabled={status === "loading"}
            >
              <Icon name="calendar plus" /> {t("reservation.actions.reserve")}
            </Button>
          </Form>
        </Segment>
    </Container>
  );
}
