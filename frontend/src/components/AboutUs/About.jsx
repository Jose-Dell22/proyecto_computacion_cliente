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

  const stats = [
    {
      value: "15+",
      label: t("about.stats_years"),
      icon: "calendar check",
    },
    {
      value: "1000+",
      label: t("about.stats_clients"),
      icon: "users",
    },
    {
      value: "50+",
      label: t("about.stats_cuts"),
      icon: "food",
    },
    {
      value: "100%",
      label: t("about.stats_satisfaction"),
      icon: "thumbs up",
    },
  ];

  const values = [
    {
      icon: "star",
      title: t("about.value_quality_title"),
      description: t("about.value_quality_desc"),
    },
    {
      icon: "fire",
      title: t("about.value_tradition_title"),
      description: t("about.value_tradition_desc"),
    },
    {
      icon: "users",
      title: t("about.value_experience_title"),
      description: t("about.value_experience_desc"),
    },
  ];

  const team = [
    {
      name: "Jose Dell",
      role: t("about.team_owner"),
    },
    {
      name: "Santiago Perdomo",
      role: t("about.team_grill_chef"),
    },
    {
      name: "Miguel Cordoba",
      role: t("about.team_manager"),
    },
    {
      name: "David Roa",
      role: t("about.team_assistant_chef"),
    },
  ];

  return (
    <>
      <Segment textAlign="center" className="about-hero">
        <div className="about-hero__overlay" aria-hidden="true" />

        <div className="about-hero__content">
          <Header as="h1" size="huge" className="about-hero__title">
            <Icon name="fire" />
            {config.RESTAURANT.name}
          </Header>

          <Header as="h3" className="about-hero__subtitle">
            {t("about.hero_subtitle")}
          </Header>
        </div>
      </Segment>

      <main className="about-page">
        <Container>
          {/* Historia */}
          <Segment vertical className="about-section about-section--history">
            <Header as="h2" textAlign="center" className="about-section-title">
              <span className="about-section-title__icon">
                <Icon name="history" />
              </span>
              <span>{t("about.history_title")}</span>
            </Header>

            <Divider className="about-divider" />

            <Segment raised className="about-history-body">
              <p className="about-history-text">
                {t("about.history_paragraph1", {
                  name: config.RESTAURANT.name,
                })}
              </p>

              <p className="about-history-text">
                {t("about.history_paragraph2")}
              </p>
            </Segment>
          </Segment>

          {/* Estadísticas */}
          <Segment vertical className="about-section">
            <Header as="h2" textAlign="center" className="about-section-title">
              <span className="about-section-title__icon">
                <Icon name="chart line" />
              </span>
              <span>{t("about.stats_title")}</span>
            </Header>

            <Grid columns={4} stackable textAlign="center" className="about-stats-grid">
              {stats.map((stat) => (
                <Grid.Column key={stat.label}>
                  <Card className="about-card about-stat-card">
                    <Card.Content>
                      <div className="about-small-icon">
                        <Icon name={stat.icon} />
                      </div>

                      <Header as="h2" className="about-stat-number">
                        {stat.value}
                      </Header>

                      <Card.Description>{stat.label}</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          </Segment>

          {/* Valores */}
          <Segment vertical className="about-section">
            <Header as="h2" textAlign="center" className="about-section-title">
              <span className="about-section-title__icon">
                <Icon name="heart" />
              </span>
              <span>{t("about.values_title")}</span>
            </Header>

            <Grid columns={3} stackable className="about-values-grid">
              {values.map((value) => (
                <Grid.Column key={value.title}>
                  <Card raised className="about-card about-value-card">
                    <Card.Content textAlign="center">
                      <div className="about-card-icon">
                        <Icon name={value.icon} />
                      </div>

                      <Card.Header>{value.title}</Card.Header>

                      <Card.Description>{value.description}</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          </Segment>

          {/* Equipo */}
          <Segment vertical className="about-section">
            <Header as="h2" textAlign="center" className="about-section-title">
              <span className="about-section-title__icon">
                <Icon name="users" />
              </span>
              <span>{t("about.team_title")}</span>
            </Header>

            <p className="about-team-description">{t("about.team_description")}</p>

            <Grid columns={4} stackable textAlign="center" className="about-team-grid">
              {team.map((member) => (
                <Grid.Column key={member.name}>
                  <Card raised className="about-card about-team-card">
                    <Card.Content textAlign="center">
                      <div className="about-team-avatar">
                        <Icon name="user" />
                      </div>

                      <Card.Header>{member.name}</Card.Header>

                      <Card.Meta>{member.role}</Card.Meta>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid>
          </Segment>

          {/* CTA */}
          <Segment vertical textAlign="center" className="about-cta">
            <Header as="h2" className="about-cta__title">
              <span className="about-section-title__icon">
                <Icon name="calendar" />
              </span>
              <span>{t("about.cta_title")}</span>
            </Header>

            <Button
              as={Link}
              to="/contacto"
              color="orange"
              size="large"
              icon
              labelPosition="left"
              className="about-cta__button"
            >
              <Icon name="mail" />
              {t("contact.title")}
            </Button>

            <p className="about-cta__description">{t("about.cta_description")}</p>
          </Segment>
        </Container>
      </main>
    </>
  );
}