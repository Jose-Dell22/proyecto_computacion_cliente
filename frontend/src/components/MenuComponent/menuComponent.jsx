import React, { useState, useRef } from "react";
import {
  Card,
  Image,
  Button,
  Icon,
  Container,
  Message,
  Loader,
} from "semantic-ui-react";
import { useApp } from "../../context/AppContext";
import { ICONS, MESSAGES } from "../../config/constants";
import { useTranslation } from "react-i18next";
import {
  bindCardInteractions,
  revealOnScroll,
  staggerCardsOnScroll,
} from "../../utils/animations";
import { useGsapScroll } from "../../hooks/useGsapScroll";
import "./menuComponent.css";

const MenuComponent = () => {
  const { addToCart, config, specialties, specialtiesLoading } = useApp();
  const [addedMessage, setAddedMessage] = useState(null);
  const { t } = useTranslation();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useGsapScroll(() => {
    if (headerRef.current) {
      revealOnScroll(headerRef.current, {
        trigger: sectionRef.current,
        y: 35,
      });
    }

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length) {
      staggerCardsOnScroll(cards, {
        trigger: sectionRef.current,
        stagger: 0.1,
      });
      cards.forEach((wrapper) =>
        bindCardInteractions(wrapper, { imageScale: 1.08 })
      );
    }
  }, [specialties, specialtiesLoading]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedMessage(item.title);
    setTimeout(() => setAddedMessage(null), config.APP.messageTimeout);
  };

  if (specialtiesLoading) {
    return (
      <Loader
        active
        inline="centered"
        size="large"
        content={MESSAGES.loadingSpecialties}
      />
    );
  }

  return (
    <div className="menu-estatico-container" ref={sectionRef}>
      <Container textAlign="center" className="menu-estatico-content">
        <h1 ref={headerRef} className="menu-estatico-header">
          {t("menu.title")}
        </h1>

        {addedMessage && (
          <Message positive style={{ marginTop: "1em" }}>
            <Icon name={ICONS.check} />
            <strong>{addedMessage}</strong> {t("menu.added_message")}
          </Message>
        )}

        {specialties.length === 0 ? (
          <Message info style={{ marginTop: "2em" }}>
            {t("menu.no_specialties")}
          </Message>
        ) : (
          <Card.Group
            centered
            itemsPerRow={3}
            stackable
            style={{ marginTop: "2em" }}
          >
            {specialties.map((item, index) => (
              <div
                key={item.id ?? item._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="menu-estatico-card-wrap"
              >
              <Card className="menu-estatico-card gsap-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  className="menu-estatico-image"
                />
                <Card.Content textAlign="center">
                  <Card.Header className="menu-estatico-title">
                    {item.title}
                  </Card.Header>
                  <Card.Description className="menu-estatico-description">
                    {item.description}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra textAlign="center">
                  <strong className="menu-estatico-price">
                    $
                    {item.price.toLocaleString("es-CO", {
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                  <Button
                    color="orange"
                    circular
                    icon
                    onClick={() => handleAddToCart(item)}
                    className="menu-estatico-button"
                  >
                    <Icon name={ICONS.plus} />
                  </Button>
                </Card.Content>
              </Card>
              </div>
            ))}
          </Card.Group>
        )}
      </Container>
    </div>
  );
};

export default MenuComponent;
