import React from "react";
import {
  Container,
  Header,
  Segment,
  Grid,
  Card,
  Button,
  Divider,
  Icon,
} from "semantic-ui-react";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./About.css";

export default function AboutUs() {
  const { config } = useApp();
  const { t } = useTranslation();

  return (
    <>
      <Segment textAlign="center" className="about-hero">
        <div className="about-hero__overlay" aria-hidden="true" />
        <div className="about-hero__content">
          <Header as="h1" size="huge">
            <Icon name="fire" />
            {config.RESTAURANT.name}
          </Header>
          <Header as="h3">{t("about.hero_subtitle")}</Header>
        </div>
      </Segment>

      <div className="about-page">
        <Container>
          <Segment vertical>
            <Header as="h2" textAlign="center">
              <Icon name="history" />
              {t("about.history_title")}
            </Header>
            <Divider />
            <Segment raised className="about-history-body">
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

          <Segment vertical>
            <Header as="h2" textAlign="center">
              <Icon name="chart line" />
              {t("about.stats_title")}
            </Header>
            <Grid columns={4} stackable textAlign="center">
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Header as="h2" className="about-stat-number">
                      15+
                    </Header>
                    <Card.Description>{t("about.stats_years")}</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Header as="h2" className="about-stat-number">
                      1000+
                    </Header>
                    <Card.Description>{t("about.stats_clients")}</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Header as="h2" className="about-stat-number">
                      50+
                    </Header>
                    <Card.Description>{t("about.stats_cuts")}</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Content>
                    <Header as="h2" className="about-stat-number">
                      100%
                    </Header>
                    <Card.Description>
                      {t("about.stats_satisfaction")}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>

          <Segment vertical>
            <Header as="h2" textAlign="center">
              <Icon name="heart" />
              {t("about.values_title")}
            </Header>
            <Grid columns={3} stackable>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="star" size="huge" />
                    <Card.Header>{t("about.value_quality_title")}</Card.Header>
                    <Card.Description>
                      {t("about.value_quality_desc")}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="fire" size="huge" />
                    <Card.Header>{t("about.value_tradition_title")}</Card.Header>
                    <Card.Description>
                      {t("about.value_tradition_desc")}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="users" size="huge" />
                    <Card.Header>{t("about.value_experience_title")}</Card.Header>
                    <Card.Description>
                      {t("about.value_experience_desc")}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>

          <Segment vertical>
            <Header as="h2" textAlign="center">
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
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="user" size="huge" />
                    <Card.Header>Jose Dell</Card.Header>
                    <Card.Meta>{t("about.team_owner")}</Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="user" size="huge" />
                    <Card.Header>Santiago Perdomo</Card.Header>
                    <Card.Meta>{t("about.team_grill_chef")}</Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="user" size="huge" />
                    <Card.Header>Miguel Cordoba</Card.Header>
                    <Card.Meta>{t("about.team_manager")}</Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card raised>
                  <Card.Content textAlign="center">
                    <Icon name="user" size="huge" />
                    <Card.Header>David Roa</Card.Header>
                    <Card.Meta>{t("about.team_assistant_chef")}</Card.Meta>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>

          <Segment vertical textAlign="center" className="about-cta">
            <Header as="h2">
              <Icon name="calendar" />
              {t("about.cta_title")}
            </Header>
            <Button
              as={Link}
              to="/contacto"
              color="orange"
              size="large"
              icon
              labelPosition="left"
              style={{ marginBottom: "0.5rem" }}
            >
              <Icon name="mail" />
              {t("contact.title")}
            </Button>
            <p
              style={{
                fontSize: "1.2em",
                lineHeight: "1.8em",
                margin: "0.5rem 0 0 0",
              }}
            >
              {t("about.cta_description")}
            </p>
          </Segment>
        </Container>
      </div>
    </>
  );
}
