import React, { useEffect } from 'react'
import './ContactoUbicacion.css'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import {
  Container,
  Header,
  Grid,
  Segment,
  Form,
  Input,
  TextArea,
  Button,
  Icon,
  Divider,
  List,
  Message,
  Embed,
} from 'semantic-ui-react'
import { useApp } from '../../context/AppContext'
import { useForm } from '../../hooks/useForm'
import { ICONS } from '../../config/constants'
import { useTranslation } from 'react-i18next'

export default function ContactoUbicacion() {
  const {
    config,
    contactForm,
    suggestions,
    updateContactForm,
    cart,
    getCartTotal,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    submitContactMessage,
    loadSuggestions,
  } = useApp()

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm()
  const { t } = useTranslation()

  const reservationPath = config?.ROUTES?.RESERVATION || '/reservar'

  const onSubmit = async (formValues) => {
    await submitContactMessage({
      nombre: formValues.nombre,
      email: formValues.email,
      mensaje: formValues.mensaje,
    })

    await loadSuggestions()

    updateContactForm({
      successMessage: t('contact.success'),
      data: { nombre: '', email: '', mensaje: '' },
    })

    reset()
  }

  useEffect(() => {
    loadSuggestions()
  }, [loadSuggestions])

  return (
    <Container className="contact-page">
      {/* Título */}
      <Header as="h1" textAlign="center" className="contact-title">
        <span className="title-row">
          {t('contact.title')}
          <Icon name={ICONS.phone} className="title-icon" aria-hidden="true" />
        </span>
        <Header.Subheader>{t('contact.subtitle')}</Header.Subheader>
      </Header>

      {/* Carrito */}
      {cart.length > 0 && (
        <Segment color="orange" style={{ marginBottom: '2em' }}>
          <Header as="h3" color="orange">
            <Icon name="shopping cart" />
            {t('contact.cart_title')}
          </Header>

          <List divided relaxed>
            {cart.map((item, index) => (
              <List.Item key={`${item.id}-${index}`}>
                <List.Content floated="right">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Button
                      icon="minus"
                      size="mini"
                      color="orange"
                      onClick={() => decreaseQuantity(index)}
                      title={t('contact.decrease')}
                      disabled={item.quantity <= 1}
                    />
                    <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>
                      {item.quantity || 1}
                    </span>
                    <Button
                      icon="plus"
                      size="mini"
                      color="orange"
                      onClick={() => increaseQuantity(index)}
                      title={t('contact.increase')}
                    />
                    <Button
                      icon="trash"
                      size="mini"
                      color="red"
                      onClick={() => removeFromCart(index)}
                      title={t('contact.remove')}
                    />
                  </div>
                </List.Content>

                <List.Content>
                  <List.Header>{item.title}</List.Header>
                  <List.Description>
                    {t('contact.price')}: ${item.price.toLocaleString('es-CO')} × {item.quantity || 1} = $
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')}
                  </List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>

          <Divider />

          <Header as="h4" textAlign="center">
            {t('contact.total')}: ${getCartTotal().toLocaleString('es-CO')}
          </Header>

          <div style={{ textAlign: 'center', marginTop: '1em' }}>
            <Button color="red" basic onClick={() => clearCart()} size="small">
              <Icon name="trash" />
              {t('contact.clear_cart')}
            </Button>
          </div>
        </Segment>
      )}

      {/* Tarjeta principal */}
      <Segment raised className="contact-card">
        <Grid stackable columns={2} className="contact-grid" style={{ alignItems: 'flex-start' }}>
          {/* Columna izquierda */}
          <Grid.Column computer={8} tablet={16} mobile={16} className="form-col" textAlign="left" verticalAlign="top">
            <Header as="h3" className="section-title">
              {t('contact.write_us')}
            </Header>

            <Form
              size="large"
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)
              }}
              error={!!errors.general}
              success={!!contactForm.successMessage}
              style={{ textAlign: 'left', width: '100%', maxWidth: 'none', margin: 0 }}
            >
              {errors.general && (
                <Message error icon>
                  <Icon name={ICONS.warning} />
                  <Message.Content>
                    <Message.Header>{t('contact.error_header')}</Message.Header>
                    {errors.general}
                  </Message.Content>
                </Message>
              )}

              {contactForm.successMessage && (
                <Message success icon>
                  <Icon name={ICONS.check} />
                  <Message.Content>
                    <Message.Header>{t('contact.sent')}</Message.Header>
                    {contactForm.successMessage}
                  </Message.Content>
                </Message>
              )}

              <Form.Field
                control={Input}
                label={t('contact.name')}
                placeholder={t('contact.name_placeholder')}
                name="nombre"
                value={values.nombre || ''}
                onChange={handleChange}
                error={errors.nombre ? { content: errors.nombre } : null}
                required
              />

              <Form.Field
                control={Input}
                type="email"
                label={t('contact.email')}
                placeholder={t('contact.email_placeholder')}
                name="email"
                value={values.email || ''}
                onChange={handleChange}
                error={errors.email ? { content: errors.email } : null}
                required
              />

              <Form.Field
                control={TextArea}
                label={t('contact.message')}
                placeholder={t('contact.message_placeholder')}
                name="mensaje"
                value={values.mensaje || ''}
                onChange={handleChange}
                error={errors.mensaje ? { content: errors.mensaje } : null}
                rows={6}
                required
              />

              <Button type="submit" primary fluid size="large" loading={isSubmitting} disabled={isSubmitting}>
                <Icon name={ICONS.send} /> {t('contact.send')}
              </Button>
            </Form>

            <Divider hidden />

            <Header as="h4" className="section-subtitle">
              {t('contact.also_here')}
            </Header>

            <div className="contact-actions">
              <Button
                as="a"
                href={`tel:${config.RESTAURANT.phone.replace(/\s|-/g, '')}`}
                basic
                icon
                labelPosition="left"
              >
                <Icon name={ICONS.phone} /> {config.RESTAURANT.phone}
              </Button>

              <Button as="a" href={`mailto:${config.RESTAURANT.email}`} basic icon labelPosition="left">
                <Icon name={ICONS.email} /> {config.RESTAURANT.email}
              </Button>
            </div>

            {/* BOTÓN CENTRADO */}
            <div className="reserve-cta-wrap">
              <Button
                as={Link}
                to={reservationPath}
                size="large"
                color="black"
                inverted
                className="reserve-cta-button"
              >
                <Icon name="calendar check" />
                Reservar mesa
              </Button>
            </div>

            <Divider hidden />

            {/* ICONOS CENTRADOS Y FORZADOS */}
            <div className="social-icons">
            <a href={config.RESTAURANT.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={config.RESTAURANT.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={config.RESTAURANT.social.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
          </Grid.Column>

          {/* Columna derecha */}
          <Grid.Column computer={8} tablet={16} mobile={16} className="info-col" textAlign="left" verticalAlign="top">
            <Header as="h3" className="section-title">
              {t('contact.visit_us')}
            </Header>

            <Segment tertiary className="info-card">
              <List relaxed>
                <List.Item>
                  <Icon name={ICONS.map} size="large" />
                  <List.Content>
                    <List.Header>
                      {config.RESTAURANT.name} – {config.RESTAURANT.location}
                    </List.Header>
                    <List.Description>
                      {config.RESTAURANT.address} – {config.RESTAURANT.neighborhood}
                    </List.Description>
                    <a href={config.RESTAURANT.maps.directionsUrl} target="_blank" rel="noreferrer">
                      <Icon name={ICONS.direction} /> {t('contact.directions')}
                    </a>
                  </List.Content>
                </List.Item>

                <List.Item>
                  <Icon name={ICONS.clock} size="large" />
                  <List.Content>
                    <List.Header>{t('contact.schedule')}</List.Header>
                    <List.List>
                      {config.RESTAURANT.schedules.map((s) => (
                        <List.Item key={s.day}>
                          <strong>{s.day}:</strong> {s.hours}
                        </List.Item>
                      ))}
                    </List.List>
                  </List.Content>
                </List.Item>

                <List.Item>
                  <Icon name={ICONS.phone} size="large" />
                  <List.Content>
                    <List.Header>{t('contact.reservations')}</List.Header>
                    <a href={`tel:${config.RESTAURANT.phone.replace(/\s|-/g, '')}`}>{config.RESTAURANT.phone}</a>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>

            {/* Sugerencias */}
            <Segment secondary className="suggestions-card" style={{ marginTop: '1em' }}>
              <Header as="h4" className="section-subtitle">
                {t('contact.suggestions_title')}
              </Header>

              {suggestions.length === 0 ? (
                <Message info>
                  <Message.Header>{t('contact.suggestions_empty')}</Message.Header>
                </Message>
              ) : (
                <List divided relaxed>
                  {suggestions.slice(0, 5).map((s) => (
                    <List.Item key={s.id}>
                      <List.Content>
                        <List.Header>
                          {s.nombre}
                          {s.email ? (
                            <span style={{ marginLeft: 6, opacity: 0.75, fontWeight: 400 }}>
                              ({s.email})
                            </span>
                          ) : null}
                        </List.Header>

                        <List.Description>{s.mensaje}</List.Description>

                        {s.fecha ? (
                          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '0.35em' }}>
                            {new Date(s.fecha).toLocaleString('es-CO')}
                          </div>
                        ) : null}
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              )}
            </Segment>

            <div className="map-wrap">
              <Embed
                active
                iframe={{
                  title: t('contact.map_title'),
                  src: config.RESTAURANT.maps.embedUrl,
                  allowFullScreen: true,
                  loading: 'lazy',
                  referrerPolicy: 'no-referrer-when-downgrade',
                }}
              />
            </div>
          </Grid.Column>
        </Grid>
      </Segment>

      <Divider hidden />

      <Segment basic textAlign="center">
        <Header as="h5" disabled>
          <Icon name={ICONS.shield} />
          {t('contact.privacy')}
        </Header>
      </Segment>
    </Container>
  )
}