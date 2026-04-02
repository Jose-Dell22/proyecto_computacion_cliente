import React from "react";
import { Container, Header, Segment, Grid, Card, Button, Divider, Icon } from "semantic-ui-react";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 🌍 i18n agregado

export default function AboutUs() {
  const { config } = useApp();
  const { t } = useTranslation(); // Hook de traducción

  return (
    <>
      {/* Hero Section */}
      <Segment
        textAlign="center"
        inverted
        color="orange"
        style={{
          padding: "6em 0",
          background: "linear-gradient(135deg, #ff7b00 0%, #ff4500 50%, #d35400 100%)",
          color: "white",
          borderRadius: "0 0 1em 1em",
        }}
      >
        <Header as="h1" size="huge" inverted>
          <Icon name="fire" />
          {config.RESTAURANT.name}
        </Header>
        <Header as="h3" inverted>
          {t("about.hero_subtitle")}
        </Header>
      </Segment>

      <Container>
        {/* Nuestra Historia */}
        <Segment vertical>
          <Header as="h2" textAlign="center" color="orange">
            <Icon name="history" />
            {t("about.history_title")}
          </Header>
          <Divider />
          <Segment raised>
            <p
              style={{
                fontSize: "1.2em",
                lineHeight: "1.8em",
                textAlign: "center",
                margin: "2em 0",
              }}
            >
              {t("about.history_paragraph1", { name: config.RESTAURANT.name })}
            </p>
            <p
              style={{
                fontSize: "1.2em",
                lineHeight: "1.8em",
                textAlign: "center",
                margin: "2em 0",
              }}
            >
              {t("about.history_paragraph2")}
            </p>
          </Segment>
          <Divider />
        </Segment>

        {/* Estadísticas */}
        <Segment vertical inverted>
          <Header as="h2" textAlign="center" inverted>
            <Icon name="chart line" />
            {t("about.stats_title")}
          </Header>
          <Grid columns={4} stackable textAlign="center">
            <Grid.Column>
              <Card color="orange">
                <Card.Content>
                  <Header as="h2" color="orange">
                    15+
                  </Header>
                  <Card.Description>{t("about.stats_years")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange">
                <Card.Content>
                  <Header as="h2" color="orange">
                    1000+
                  </Header>
                  <Card.Description>{t("about.stats_clients")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange">
                <Card.Content>
                  <Header as="h2" color="orange">
                    50+
                  </Header>
                  <Card.Description>{t("about.stats_cuts")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange">
                <Card.Content>
                  <Header as="h2" color="orange">
                    100%
                  </Header>
                  <Card.Description>{t("about.stats_satisfaction")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </Segment>

        {/* Nuestros Valores */}
        <Segment vertical>
          <Header as="h2" textAlign="center" color="orange">
            <Icon name="heart" />
            {t("about.values_title")}
          </Header>
          <Grid columns={3} stackable>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="star" size="huge" color="orange" />
                  <Card.Header>{t("about.value_quality_title")}</Card.Header>
                  <Card.Description>{t("about.value_quality_desc")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="fire" size="huge" color="orange" />
                  <Card.Header>{t("about.value_tradition_title")}</Card.Header>
                  <Card.Description>{t("about.value_tradition_desc")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="users" size="huge" color="orange" />
                  <Card.Header>{t("about.value_experience_title")}</Card.Header>
                  <Card.Description>{t("about.value_experience_desc")}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </Segment>

        {/* Nuestro Equipo */}
        <Segment vertical inverted>
          <Header as="h2" textAlign="center" inverted>
            <Icon name="users" />
            {t("about.team_title")}
          </Header>
          <p
            style={{
              fontSize: "1.2em",
              lineHeight: "1.8em",
              textAlign: "center",
              margin: "2em 0",
            }}
          >
            {t("about.team_description")}
          </p>
          <Grid columns={4} stackable textAlign="center">
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="user" size="huge" color="orange" />
                  <Card.Header>Jose Dell</Card.Header>
                  <Card.Meta>{t("about.team_owner")}</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="user" size="huge" color="orange" />
                  <Card.Header>Santiago Perdomo</Card.Header>
                  <Card.Meta>{t("about.team_grill_chef")}</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="user" size="huge" color="orange" />
                  <Card.Header>Miguel Cordoba</Card.Header>
                  <Card.Meta>{t("about.team_manager")}</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card color="orange" raised>
                <Card.Content textAlign="center">
                  <Icon name="user" size="huge" color="orange" />
                  <Card.Header>David Roa</Card.Header>
                  <Card.Meta>{t("about.team_assistant_chef")}</Card.Meta>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>
        </Segment>

        {/* CTA Section */}
        <Segment vertical color="orange" textAlign="center">
          <Header as="h2" inverted>
            <Icon name="calendar" />
            {t("about.cta_title")}
          </Header>
          <p style={{ fontSize: "1.2em", lineHeight: "1.8em", margin: "2em 0" }}>
            {t("about.cta_description")}
          </p>

          {/* 👉 Redirige al formulario de reservas */}
          <Button
            as={Link}
            to={ (config?.ROUTES?.RESERVATION) || "/reservar" }
            size="large"
            color="black"
            inverted
            aria-label="Ir al formulario de reservas"
          >
            <Icon name="calendar check" />
            {t("about.cta_button")}


          </Button>
        </Segment>
      </Container>
    </>
  );
}
