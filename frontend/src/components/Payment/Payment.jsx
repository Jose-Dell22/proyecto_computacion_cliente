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

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardErrors, setCardErrors] = useState({});

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
    if (cardErrors.cardNumber) {
      setCardErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const handleCardExpiryChange = (e) => {
    setCardExpiry(formatExpiry(e.target.value));
    if (cardErrors.cardExpiry) {
      setCardErrors((prev) => ({ ...prev, cardExpiry: '' }));
    }
  };

  const handleCvvChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(digits);
    if (cardErrors.cardCvv) {
      setCardErrors((prev) => ({ ...prev, cardCvv: '' }));
    }
  };

  const handleCardNameChange = (e) => {
    const lettersOnly = e.target.value.replace(/[0-9]/g, '');
    setCardName(lettersOnly);
    if (cardErrors.cardName) {
      setCardErrors((prev) => ({ ...prev, cardName: '' }));
    }
  };

  const validateCardForm = () => {
    const errors = {};
    const num = cardNumber.replace(/\s/g, '');
    if (!num) errors.cardNumber = t('payment.card_number_required');
    else if (!/^\d{13,19}$/.test(num)) errors.cardNumber = t('payment.card_number_invalid');

    if (!cardName.trim()) errors.cardName = t('payment.card_name_required');

    if (!cardExpiry) errors.cardExpiry = t('payment.card_expiry_required');
    else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.cardExpiry = t('payment.card_expiry_invalid');

    if (!cardCvv) errors.cardCvv = t('payment.card_cvv_required');
    else if (!/^\d{3,4}$/.test(cardCvv)) errors.cardCvv = t('payment.card_cvv_invalid');

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;
    if (selectedMethod === 'card' && !validateCardForm()) return;
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
          <Message info className="payment-order-ref">
            <Message.Header>{t('payment.order_number')}</Message.Header>
            <p>#{orderId}</p>
          </Message>
          <p className="payment-success-msg">
            {isCash ? t('payment.cash_success_msg') : t('payment.card_success_msg')}
          </p>
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
            onClick={() => { setSelectedMethod('card'); setCardErrors({}); }}
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
            onClick={() => { setSelectedMethod('cash'); setCardErrors({}); }}
          >
            <div className="payment-method-icon-wrap">
              <Icon name="money bill alternate" size="big" />
            </div>
            <Header as="h3" className="payment-method-name">{t('payment.cash_title')}</Header>
            <p className="payment-method-desc">{t('payment.cash_desc')}</p>
            {selectedMethod === 'cash' && <Icon name="check circle" className="payment-selected-check" />}
          </div>
        </div>

        {selectedMethod === 'card' && (
          <Segment className="payment-card-form-segment">
            <Header as="h4" className="payment-card-form-title">
              <Icon name="credit card" />
              {t('payment.card_form_title')}
            </Header>
            <Divider />
            <div className="payment-card-form-grid">
              <div className="payment-card-field">
                <label>{t('payment.card_number')}</label>
                <input
                  className="payment-card-input"
                  placeholder={t('payment.card_number_placeholder')}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  autoComplete="cc-number"
                />
                {cardErrors.cardNumber && <span className="payment-card-error">{cardErrors.cardNumber}</span>}
              </div>
              <div className="payment-card-field">
                <label>{t('payment.card_name')}</label>
                <input
                  className="payment-card-input"
                  placeholder={t('payment.card_name_placeholder')}
                  value={cardName}
                  onChange={handleCardNameChange}
                  autoComplete="cc-name"
                />
                {cardErrors.cardName && <span className="payment-card-error">{cardErrors.cardName}</span>}
              </div>
              <div className="payment-card-row">
                <div className="payment-card-field payment-card-expiry">
                  <label>{t('payment.card_expiry')}</label>
                  <input
                    className="payment-card-input"
                    placeholder={t('payment.card_expiry_placeholder')}
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    maxLength={5}
                    autoComplete="cc-exp"
                  />
                  {cardErrors.cardExpiry && <span className="payment-card-error">{cardErrors.cardExpiry}</span>}
                </div>
                <div className="payment-card-field payment-card-cvv">
                  <label>{t('payment.card_cvv')}</label>
                  <input
                    className="payment-card-input"
                    placeholder={t('payment.card_cvv_placeholder')}
                    value={cardCvv}
                    onChange={handleCvvChange}
                    maxLength={4}
                    type="password"
                    autoComplete="cc-csc"
                  />
                  {cardErrors.cardCvv && <span className="payment-card-error">{cardErrors.cardCvv}</span>}
                </div>
              </div>
            </div>
          </Segment>
        )}

        <Button
          color="orange"
          fluid
          size="large"
          disabled={!selectedMethod || isProcessing}
          loading={isProcessing}
          onClick={handlePayment}
          className="payment-confirm-btn"
        >
          <Icon name={selectedMethod === 'card' ? 'lock' : 'check circle'} />
          {selectedMethod === 'card'
            ? t('payment.pay_with_card', { total: `$${(orderData?.total || 0).toLocaleString('es-CO')}` })
            : t('payment.confirm_payment')}
        </Button>
      </Segment>
    </Container>
  );
};

export default Payment;
