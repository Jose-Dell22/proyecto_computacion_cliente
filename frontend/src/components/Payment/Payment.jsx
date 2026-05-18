import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Header, Segment, Button, Icon, Divider, List, Message } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../api/client';
import { useApp } from '../../context/AppContext';
import './Payment.css';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { config } = useApp();

  const orderData = location.state?.orderData;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    setError('');
    try {
      const res = await apiFetch(`/api/objects/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: selectedMethod }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al procesar el pago');
      }
      setPaymentDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentDone) {
    const isCash = selectedMethod === 'cash';
    return (
      <Container className="payment-page">
        <Segment className="payment-success-card" textAlign="center">
          <Icon name="check circle" size="huge" className="payment-success-icon" />
          <Header as="h1" className="payment-success-title">
            {t('payment.success_title')}
          </Header>
          <p className="payment-success-msg">
            {isCash ? t('payment.cash_success_msg') : t('payment.card_success_msg')}
          </p>
          <Message info className="payment-order-ref">
            <Message.Header>{t('payment.order_number')}</Message.Header>
            <p>#{orderId}</p>
          </Message>
          <Button
            color="orange"
            size="large"
            onClick={() => navigate(config.ROUTES.HOME)}
            className="payment-home-btn"
          >
            <Icon name="home" />
            {t('payment.back_home')}
          </Button>
        </Segment>
      </Container>
    );
  }

  return (
    <Container className="payment-page">
      <Header as="h1" textAlign="center" className="payment-title">
        {t('payment.title')}
        <Header.Subheader>{t('payment.subtitle')}</Header.Subheader>
      </Header>

      <Segment className="payment-order-summary">
        <Header as="h3" className="payment-section-title">
          <Icon name="clipboard list" />
          {t('payment.order_summary')}
        </Header>
        <Divider />
        <div className="payment-order-info">
          <span className="payment-order-label">{t('payment.order_number')}</span>
          <span className="payment-order-value">#{orderId}</span>
        </div>
        {orderData && (
          <>
            <div className="payment-order-info">
              <span className="payment-order-label">{t('payment.customer')}</span>
              <span className="payment-order-value">{orderData.customer?.name || orderData.customerName}</span>
            </div>
            <div className="payment-order-info">
              <span className="payment-order-label">{t('payment.total')}</span>
              <span className="payment-order-value payment-total-amount">
                ${(orderData.total || 0).toLocaleString('es-CO')}
              </span>
            </div>
            <Divider />
            <Header as="h4" className="payment-items-header">{t('payment.items')}</Header>
            <List divided className="payment-items-list">
              {(orderData.items || []).map((item, i) => (
                <List.Item key={i} className="payment-item">
                  <span className="payment-item-name">{item.title}</span>
                  <span className="payment-item-qty">×{item.quantity || 1}</span>
                  <span className="payment-item-price">
                    ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')}
                  </span>
                </List.Item>
              ))}
            </List>
          </>
        )}
      </Segment>

      <Segment className="payment-methods-card">
        <Header as="h3" className="payment-section-title">
          <Icon name="payment" />
          {t('payment.select_method')}
        </Header>
        <Divider />

        {error && (
          <Message negative icon>
            <Icon name="warning circle" />
            <Message.Content>
              <Message.Header>{t('payment.error_header')}</Message.Header>
              {error}
            </Message.Content>
          </Message>
        )}

        <div className="payment-methods-grid">
          <div
            className={`payment-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('card')}
          >
            <div className="payment-method-icon-wrap">
              <Icon name="credit card" size="big" />
            </div>
            <Header as="h3" className="payment-method-name">{t('payment.card_title')}</Header>
            <p className="payment-method-desc">{t('payment.card_desc')}</p>
            {selectedMethod === 'card' && <Icon name="check circle" className="payment-selected-check" />}
          </div>

          <div
            className={`payment-method-card ${selectedMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('cash')}
          >
            <div className="payment-method-icon-wrap">
              <Icon name="money bill alternate" size="big" />
            </div>
            <Header as="h3" className="payment-method-name">{t('payment.cash_title')}</Header>
            <p className="payment-method-desc">{t('payment.cash_desc')}</p>
            {selectedMethod === 'cash' && <Icon name="check circle" className="payment-selected-check" />}
          </div>
        </div>

        <Button
          color="orange"
          fluid
          size="large"
          disabled={!selectedMethod || isProcessing}
          loading={isProcessing}
          onClick={handlePayment}
          className="payment-confirm-btn"
        >
          <Icon name="check circle" />
          {t('payment.confirm_payment')}
        </Button>
      </Segment>
    </Container>
  );
};

export default Payment;
