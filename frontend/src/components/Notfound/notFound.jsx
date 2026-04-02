import React from "react";
import { Container, Header, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NotFound.css";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="notfound-container">
      <Container textAlign="center">
        <Header as="h1" icon className="notfound-header">
          <Icon name="warning sign" color="orange" />
          {t("notFound.title")}
        </Header>

        <Header.Subheader className="notfound-subheader">
          {t("notFound.subtitle")}
        </Header.Subheader>

        <Button
          as={Link}
          to="/"
          color="orange"
          size="large"
          className="back-button"
        >
          <Icon name="arrow left" /> {t("notFound.back_button")}
        </Button>
      </Container>
    </div>
  );
};

export default NotFound;
