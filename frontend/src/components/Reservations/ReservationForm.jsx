import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Header, Segment, Form, Input, TextArea, Dropdown,
  Button, Icon, Message
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppContext";

const CUT_KEYS = ["picanha", "asado", "entrania", "churrasco"];
const DONENESS_KEYS = ["blue", "rare", "medium", "threeQuarters", "well"];

const PEOPLE = Array.from({ length: 12 }, (_, i) => ({
  key: i + 1, text: `${i + 1}`, value: i + 1
}));

const INITIAL = {
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
  cortesDetalle: [{ corte: "", qty: 1 }],
};

export default function ReservationForm() {
  // 👇 Igual que About.jsx: namespace por defecto "translation"
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addReservation } = useApp();
  const [values, setValues] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Opciones traducidas (recalculan si cambia el idioma)
  const CUTS = useMemo(
    () => CUT_KEYS.map(k => ({ key: k, text: t(`reservation.cuts.${k}`), value: k })),
    [t]
  );
  const DONENESS = useMemo(
    () => DONENESS_KEYS.map(k => ({ key: k, text: t(`reservation.doneness.${k}`), value: k })),
    [t]
  );

  const handleChange = (_e, { name, value }) =>
    setValues(v => ({ ...v, [name]: value }));

  const addCutRow = () =>
    setValues(v => ({ ...v, cortesDetalle: [...v.cortesDetalle, { corte: "", qty: 1 }] }));

  const updateCutRow = (idx, field, value) =>
    setValues(v => ({
      ...v,
      cortesDetalle: v.cortesDetalle.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    }));

  const removeCutRow = (idx) =>
    setValues(v => ({
      ...v,
      cortesDetalle: v.cortesDetalle.filter((_, i) => i !== idx),
    }));

  const totalQty = values.cortesDetalle.reduce(
    (s, r) => s + (parseInt(r.qty, 10) || 0),
    0
  );

  const validate = () => {
    if (!values.nombre || !values.apellido) return t("reservation.errors.nameRequired");
    if (!values.telefono) return t("reservation.errors.phoneRequired");
    if (!values.fecha || !values.hora) return t("reservation.errors.datetimeRequired");
    if (!values.personas) return t("reservation.errors.peopleRequired");
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
      setStatus("success");
    } catch (_e) {
      setErrorMsg(t("reservation.errors.submitFailed"));
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success") {
      const tmo = setTimeout(() => navigate("/about"), 2500);
      return () => clearTimeout(tmo);
    }
  }, [status, navigate]);

  const resetForAnother = () => {
    setValues(INITIAL);
    setStatus("idle");
  };

  return (
    <Container style={{ padding: "2.5rem 0" }}>
      {/* Botón visible para salir sin reservar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button
          color="orange"
          icon
          labelPosition="left"
          size="large"
          onClick={() => navigate("/about")}
          aria-label={t("reservation.actions.backToAbout")}
        >
          <Icon name="arrow left" />
          {t("reservation.actions.backToAbout")}
        </Button>
      </div>

      {/* Título sin icono, en naranja */}
      <Header as="h1" color="orange" textAlign="center">
        {t("reservation.title")}
        <Header.Subheader style={{ color: "#c9cdd3" }}>
          {t("reservation.subtitle")}
        </Header.Subheader>
      </Header>

      {/* Éxito */}
      {status === "success" && (
        <Segment placeholder raised textAlign="center" color="green">
          <Icon name="check circle" size="huge" color="green" />
          <Header as="h2" content={t("reservation.success.title")} />
          <p>{t("reservation.success.body")}</p>
          <Button color="green" onClick={resetForAnother}>
            <Icon name="add" /> {t("reservation.actions.reserveAnother")}
          </Button>
          <Button basic onClick={() => navigate("/about")}>
            <Icon name="arrow left" /> {t("reservation.actions.backToAbout")}
          </Button>
        </Segment>
      )}

      {status !== "success" && (
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
                required
              />
              <Form.Field
                control={Input}
                type="time"
                label={t("reservation.fields.time.label")}
                name="hora"
                value={values.hora}
                onChange={handleChange}
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

            {/* Repetidor de Cortes preferidos */}
            <Header as="h4" style={{ color: "#ff7a1a" }}>
              {t("reservation.sections.cuts")}
            </Header>

            {values.cortesDetalle.map((row, idx) => (
              <Form.Group widths="equal" key={`cut-${idx}`}>
                <Form.Field
                  control={Dropdown}
                  selection
                  placeholder={t("reservation.placeholders.selectCut")}
                  options={CUTS}
                  label={t("reservation.fields.cut.label")}
                  value={row.corte}
                  onChange={(_e, { value }) => updateCutRow(idx, "corte", value)}
                />
                <Form.Field
                  control={Input}
                  type="number"
                  min={1}
                  step={1}
                  label={t("reservation.fields.qty.label")}
                  placeholder={t("reservation.fields.qty.placeholder")}
                  value={row.qty}
                  onChange={(_e, { value }) => updateCutRow(idx, "qty", value)}
                />
                <Form.Field width={3} style={{ display: "flex", alignItems: "flex-end" }}>
                  <Button
                    type="button"
                    icon
                    color="red"
                    basic
                    onClick={() => removeCutRow(idx)}
                    aria-label={t("reservation.actions.removeLine")}
                  >
                    <Icon name="trash" />
                  </Button>
                </Form.Field>
              </Form.Group>
            ))}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                type="button"
                basic
                color="orange"
                icon
                labelPosition="left"
                onClick={addCutRow}
              >
                <Icon name="plus" />
                {t("reservation.actions.addCut")}
              </Button>
              <span style={{ marginLeft: 12, opacity: 0.7 }}>
                {t("reservation.labels.totalPortions", { totalQty })} / {t("reservation.labels.people", { personas: values.personas })}
              </span>
            </div>

            <Form.Group widths="equal">
              <Form.Field
                control={Dropdown}
                selection
                options={DONENESS}
                label={t("reservation.fields.doneness.label")}
                name="termino"
                value={values.termino}
                onChange={handleChange}
                placeholder={t("reservation.fields.doneness.placeholder")}
              />
              <Form.Field
                control={Input}
                label={t("reservation.fields.table.label")}
                placeholder={t("reservation.fields.table.placeholder")}
                name="mesa"
                value={values.mesa}
                onChange={handleChange}
              />
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
            <Button color="orange" size="large" fluid>
              <Icon name="calendar plus" /> {t("reservation.actions.reserve")}
            </Button>
          </Form>
        </Segment>
      )}
    </Container>
  );
}
