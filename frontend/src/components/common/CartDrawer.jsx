import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon, List, Header, Divider } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import './CartDrawer.css';

const CartDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart, decreaseQuantity, increaseQuantity, clearCart, getCartTotal, getCartItemsCount } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigating = useRef(false);

  const cartItemsCount = getCartItemsCount();
  const cartTotal = getCartTotal();
  const isCheckoutPage = location.pathname === '/checkout' || location.pathname.startsWith('/payment/') || location.pathname === '/reservar';

  useEffect(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setIsOpen(false);
    navigating.current = false;
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isOpen]);

  if (isCheckoutPage) return null;

  const handleGoToCheckout = () => {
    if (navigating.current) return;
    navigating.current = true;
    setIsOpen(false);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    navigate('/checkout');
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <Header as="h3" className="cart-drawer-title">
            <Icon name="shopping cart" />
            {t('cart.title')}
            {cartItemsCount > 0 && <span className="cart-count-badge">{cartItemsCount}</span>}
          </Header>
          <Button icon="close" size="tiny" className="cart-close-btn" onClick={() => setIsOpen(false)} />
        </div>

        <Divider className="cart-drawer-divider" />

        <div className="cart-drawer-body">
          {cart.length > 0 ? (
            <List divided relaxed className="cart-drawer-list">
              {cart.map((item, index) => (
                <List.Item key={`${item.id}-${index}`} className="cart-drawer-item">
                  <div className="cart-item-image-wrap">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="cart-item-img"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div className="cart-item-img-fallback" style={{ display: item.image ? 'none' : 'flex' }}>
                      <Icon name="utensils" color="orange" />
                    </div>
                  </div>
                  <List.Content className="cart-item-content">
                    <List.Header className="cart-item-title">{item.title}</List.Header>
                    <div className="cart-item-price">${item.price.toLocaleString('es-CO')}</div>
                    <div className="cart-item-controls">
                      <Button icon="minus" size="mini" compact
                        color="orange"
                        onClick={() => decreaseQuantity(index)}
                        disabled={item.quantity <= 1}
                      />
                      <span className="cart-item-qty">{item.quantity || 1}</span>
                      <Button icon="plus" size="mini" compact
                        color="orange"
                        onClick={() => increaseQuantity(index)}
                      />
                      <Button icon="trash alternate" size="mini" compact
                        color="red"
                        onClick={() => removeFromCart(index)}
                      />
                    </div>
                  </List.Content>
                  <div className="cart-item-subtotal">
                    ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CO')}
                  </div>
                </List.Item>
              ))}
            </List>
          ) : (
            <div className="cart-drawer-empty">
              <Icon name="shopping cart" size="huge" className="cart-empty-icon" />
              <p>{t('cart.empty')}</p>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <Divider className="cart-drawer-divider" />
            <div className="cart-drawer-total">
              <span>{t('cart.total')}</span>
              <span className="cart-total-amount">${cartTotal.toLocaleString('es-CO')}</span>
            </div>
            <Button color="orange" fluid size="large" className="cart-checkout-btn" onClick={handleGoToCheckout}>
              <Icon name="credit card" />
              {t('cart.goToCheckout')}
            </Button>
            <Button color="red" fluid basic size="small" className="cart-clear-btn" onClick={() => clearCart()}>
              <Icon name="trash" />
              {t('cart.clear')}
            </Button>
          </div>
        )}
      </div>

      {cartItemsCount > 0 && (
        <Button
          circular
          color="orange"
          size="large"
          className="cart-fab"
          onClick={() => setIsOpen(true)}
        >
          <Icon name="shopping cart" />
          <span className="fab-count">{cartItemsCount}</span>
        </Button>
      )}
    </>
  );
};

export default CartDrawer;
