import React, { useState } from "react";
import { Card, Image, Button, Icon, Container, Message } from "semantic-ui-react";
import { useApp } from "../../context/AppContext";
import { ICONS, MESSAGES } from "../../config/constants";
import { useTranslation } from "react-i18next"; // 🌍 Soporte de idiomas
import "./menuComponent.css";

const MenuComponent = () => {
  const { addToCart, config } = useApp();
  const [addedMessage, setAddedMessage] = useState(null);
  const { t } = useTranslation();

  const menuData = [
    {
      id: "507f1f77bcf86cd799439011",
      title: t("menu.items.beef_barrel.title"),
      description: t("menu.items.beef_barrel.description"),
      price: 35000,
      image: "/img/carnesAlBarril.jpg",
    },
    {
      id: "507f1f77bcf86cd799439012",
      title: t("menu.items.ribs_bbq.title"),
      description: t("menu.items.ribs_bbq.description"),
      price: 38000,
      image: "/img/costillasBBQ.jpg",
    },
    {
      id: "507f1f77bcf86cd799439013",
      title: t("menu.items.sausage.title"),
      description: t("menu.items.sausage.description"),
      price: 25000,
      image: "/img/chorizoParrillero.jpeg",
    },
    {
      id: "507f1f77bcf86cd799439014",
      title: t("menu.items.picanha.title"),
      description: t("menu.items.picanha.description"),
      price: 42000,
      image: "/img/puntadeAnca.jpg",
    },
    {
      id: "507f1f77bcf86cd799439015",
      title: t("menu.items.chicken_breast.title"),
      description: t("menu.items.chicken_breast.description"),
      price: 30000,
      image: "/img/PechugaParrilla.jpg",
    },
    {
      id: "507f1f77bcf86cd799439016",
      title: t("menu.items.grill_trilogy.title"),
      description: t("menu.items.grill_trilogy.description"),
      price: 52000,
      image: "/img/TrilogíaParrillera.jpg",
    },
  ];

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedMessage(item.title);
    setTimeout(() => setAddedMessage(null), config.APP.messageTimeout);
  };

  return (
    <div className="menu-estatico-container">
      {/* === Encabezado === */}
      <Container textAlign="center" className="menu-estatico-content">
        <h1 className="menu-estatico-header">{t("menu.title")}</h1>

        {/* Mensaje de confirmación */}
        {addedMessage && (
          <Message positive style={{ marginTop: "1em" }}>
            <Icon name={ICONS.check} />
            <strong>{addedMessage}</strong> {t("menu.added_message")}
          </Message>
        )}

        {/* Cartas del menú */}
        <Card.Group centered itemsPerRow={3} stackable style={{ marginTop: "2em" }}>
          {menuData.map((item) => (
            <Card key={item.id} className="menu-estatico-card transition-normal">
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
                  ${item.price.toLocaleString("es-CO", {
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
          ))}
        </Card.Group>
      </Container>
    </div>
  );
};

export default MenuComponent;
