import React, { useState } from 'react';
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
  Checkbox,
} from 'semantic-ui-react';
import { useApp } from '../../context/AppContext';
import { useForm } from '../../hooks/useForm';
import { APP_CONFIG, MESSAGES, ICONS } from '../../config/constants';
import { useTranslation } from 'react-i18next';
import './Checkout.css';

export default function Checkout() {
  const {
    config,
    cart,
    getCartTotal,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
  } = useApp();

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const onSubmit = async (formValues) => {
    try {
      // Crear el pedido para enviar al backend
      const orderPayload = {
        customer: {
          name: formValues.nombre,
          phone: formValues.telefono,
          email: formValues.email,
        },
        delivery: {
          address: formValues.direccion,
          reference: formValues.referencia || '',
        },
        items: cart.map(item => ({
          productId: item.id || item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        total: getCartTotal(),
      };

      // Enviar pedido al backend
      const response = await fetch('/api/objects/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al procesar el pedido');
      }

      const savedOrder = await response.json();
      setOrderData(savedOrder);
      setOrderSuccess(true);
      clearCart();
      reset();

    } catch (error) {
      console.error('Error submitting order:', error);
      // El error se mostrará automáticamente a través del estado del formulario
      throw error;
    }
  };

  const cartItemsCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = getCartTotal();

  if (orderSuccess) {
    return (
      <Container className="checkout-page">
        <Segment color="green" textAlign="center" style={{ marginTop: '3em' }}>
          <Header as="h1" color="green">
            <Icon name="check circle" />
            {t('checkout.success_title')}
          </Header>
          <p>{t('checkout.success_message')}</p>
          <Message success>
            <Message.Header>{t('checkout.order_number')}</Message.Header>
            <p>#{orderData?._id || 'N/A'}</p>
          </Message>
          <Button primary onClick={() => window.location.href = config.ROUTES.HOME}>
            <Icon name="home" />
            {t('checkout.back_home')}
          </Button>
        </Segment>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="checkout-page">
        <Segment textAlign="center" style={{ marginTop: '3em' }}>
          <Header as="h2" icon>
            <Icon name="shopping cart" />
            {t('checkout.empty_title')}
          </Header>
          <p>{t('checkout.empty_message')}</p>
          <Button primary onClick={() => window.location.href = config.ROUTES.MENU_COMPONENT}>
            <Icon name="utensils" />
            {t('checkout.go_menu')}
          </Button>
        </Segment>
      </Container>
    );
  }

  return (
    <Container className="checkout-page" style={{ maxWidth: '1400px' }}>
      {/* Título con icono */}
      <Header as="h1" textAlign="center" className="checkout-title">
        <span className="title-row">
          {t('checkout.title')}
          <Icon name={ICONS.shopping_cart} className="title-icon" aria-hidden="true" />
        </span>
        <Header.Subheader>{t('checkout.subtitle')}</Header.Subheader>
      </Header>

      <Grid stackable columns={2} className="checkout-grid" style={{ gap: '3em' }}>
        {/* Columna izquierda: Formulario de entrega (60%) */}
        <Grid.Column computer={10} tablet={16} mobile={16} width={10}>
          <Segment raised className="delivery-form-card">
            <Header as="h3" className="section-title">
              <Icon name="truck" />
              {t('checkout.delivery_info')}
            </Header>

            <Form
              size="large"
              className="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit);
              }}
              error={!!errors.general}
            >
              {errors.general && (
                <Message error icon>
                  <Icon name={ICONS.warning} />
                  <Message.Content>
                    <Message.Header>{t('checkout.error_header')}</Message.Header>
                    {errors.general}
                  </Message.Content>
                </Message>
              )}

              {/* Información del cliente */}
              <Header as="h4" className="form-section-title">
                {t('checkout.customer_info')}
              </Header>

              <Form.Field
                control={Input}
                label={t('checkout.name')}
                placeholder={t('checkout.name_placeholder')}
                name="nombre"
                value={values.nombre || ''}
                onChange={handleChange}
                error={errors.nombre ? { content: errors.nombre } : null}
                required
                fluid
              />

              <Form.Field
                control={Input}
                type="email"
                label={t('checkout.email')}
                placeholder={t('checkout.email_placeholder')}
                name="email"
                value={values.email || ''}
                onChange={handleChange}
                error={errors.email ? { content: errors.email } : null}
                required
                fluid
              />

              <Form.Field
                control={Input}
                label={t('checkout.phone')}
                placeholder={t('checkout.phone_placeholder')}
                name="telefono"
                value={values.telefono || ''}
                onChange={handleChange}
                error={errors.telefono ? { content: errors.telefono } : null}
                required
                fluid
              />

              <Divider />

              {/* Información de entrega */}
              <Header as="h4" className="form-section-title">
                {t('checkout.delivery_address')}
              </Header>

              <Form.Field
                control={TextArea}
                label={t('checkout.address')}
                placeholder={t('checkout.address_placeholder')}
                name="direccion"
                value={values.direccion || ''}
                onChange={handleChange}
                error={errors.direccion ? { content: errors.direccion } : null}
                rows={3}
                required
              />

              <Form.Field
                control={Input}
                label={t('checkout.reference')}
                placeholder={t('checkout.reference_placeholder')}
                name="referencia"
                value={values.referencia || ''}
                onChange={handleChange}
                fluid
              />

              <Form.Field>
                <Checkbox
                  label={t('checkout.terms_label')}
                  name="terms"
                  checked={values.terms || false}
                  onChange={(e, { checked }) => handleChange({ target: { name: 'terms', value: checked } })}
                  error={errors.terms ? { content: errors.terms } : null}
                  required
                />
              </Form.Field>

              <Button
                type="submit"
                primary
                fluid
                size="large"
                loading={isSubmitting}
                disabled={isSubmitting || !values.terms}
                style={{ marginTop: '2em', fontSize: '1.1em', padding: '1.2em' }}
              >
                <Icon name={ICONS.check} />
                {t('checkout.confirm_order')}
              </Button>
            </Form>
          </Segment>
        </Grid.Column>

        {/* Columna derecha: Resumen del carrito (40%) */}
        <Grid.Column computer={6} tablet={16} mobile={16} width={6}>
          <Segment raised className="cart-summary-card">
            <Header as="h3" className="section-title">
              <Icon name="shopping cart" />
              {t('checkout.cart_summary')} ({cartItemsCount} {t('checkout.items')})
            </Header>

            <div style={{ textAlign: 'right', marginBottom: '1em' }}>
              <Button
                as="a"
                href={config.ROUTES.PRODUCTS}
                basic
                size="small"
                style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
              >
                <Icon name="arrow left" />
                {t('checkout.continue_shopping')}
              </Button>
            </div>

            <List divided relaxed className="checkout-product-list">
              {cart.map((item, index) => (
                <List.Item key={`${item.id}-${index}`} className="checkout-product-item">
                  <div className="product-image-container">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="product-image-fallback" style={{ display: item.image ? 'none' : 'flex' }}>
                      <Icon name="utensils" size="large" color="orange" />
                    </div>
                  </div>
                  <List.Content className="product-content">
                    <List.Header className="product-title">{item.title}</List.Header>
                    <List.Description className="product-details">
                      <div className="price-row">
                        ${item.price.toLocaleString('es-CO')} × {item.quantity || 1}
                      </div>
                      <div className="subtotal-row">
                        <strong>
                          ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')}
                        </strong>
                      </div>
                    </List.Description>
                    <div className="product-controls">
                      <Button
                        icon="minus"
                        size="mini"
                        color="orange"
                        onClick={() => decreaseQuantity(index)}
                        title={t('checkout.decrease')}
                        disabled={item.quantity <= 1}
                      />
                      <span className="quantity-display">
                        {item.quantity || 1}
                      </span>
                      <Button
                        icon="plus"
                        size="mini"
                        color="orange"
                        onClick={() => increaseQuantity(index)}
                        title={t('checkout.increase')}
                      />
                      <Button
                        icon="trash"
                        size="mini"
                        color="red"
                        onClick={() => removeFromCart(index)}
                        title={t('checkout.remove')}
                      />
                    </div>
                  </List.Content>
                </List.Item>
              ))}
            </List>

            <Divider />

            <Header as="h3" textAlign="center" color="orange" style={{ fontSize: '1.4em', fontWeight: 'bold' }}>
              {t('checkout.total')}: ${cartTotal.toLocaleString('es-CO')}
            </Header>

            <div style={{ textAlign: 'center', marginTop: '1.5em' }}>
              <Button color="red" basic onClick={() => clearCart()} size="small">
                <Icon name="trash" />
                {t('checkout.clear_cart')}
              </Button>
            </div>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
