import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from "react-i18next";
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const { config } = useApp();
  const { t } = useTranslation();

  const sectionTitleStyle = {
    color: 'white',
    marginBottom: '12px',
    fontSize: '1.15rem',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    color: 'white',
    fontSize: '1rem',
    lineHeight: '1.5',
  };

  const iconStyle = {
    color: '#ffdd44',
    margin: 0,
    minWidth: '18px',
  };

  return (
    <Segment
      inverted
      color="orange"
      style={{
        background: 'linear-gradient(135deg, #ff7b00 0%, #ff4500 50%, #d35400 100%)',
        boxShadow: '0 -5px 20px rgba(255, 136, 0, 0.25)',
        border: 'none',
        borderRadius: '0',
        padding: '32px 0 18px',
        marginTop: '1.25em',
      }}
    >
      <Container>
        {/* Título principal */}
        <Header
          as="h2"
          inverted
          textAlign="center"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: '700',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '1.8em',
            fontSize: '2.1rem',
            textShadow: '2px 2px 6px rgba(0,0,0,0.35)',
          }}
        >
          {t("footer.title")}
        </Header>

        {/* Grid principal */}
        <Grid stackable columns={3} verticalAlign="top" style={{ margin: 0 }}>
          {/* Horarios */}
          <Grid.Column computer={5} tablet={16} mobile={16}>
            <Header as="h4" inverted style={sectionTitleStyle}>
              <Icon name="clock" style={{ color: '#ffdd44' }} />
              {t("footer.schedule_title")}
            </Header>

            <div>
              {config.RESTAURANT.schedules.map((schedule, index) => (
                <div key={index} style={{ ...rowStyle, marginBottom: '8px' }}>
                  <span>
                    <strong>{schedule.day}:</strong> {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </Grid.Column>

          {/* Contacto */}
          <Grid.Column computer={6} tablet={16} mobile={16}>
            <Header as="h4" inverted style={sectionTitleStyle}>
              <Icon name="phone" style={{ color: '#ffdd44' }} />
              {t("footer.contact_title")}
            </Header>

            <div style={rowStyle}>
              <Icon name="phone" style={iconStyle} />
              <span>{config.RESTAURANT.phone}</span>
            </div>

            <div style={rowStyle}>
              <Icon name="mail" style={iconStyle} />
              <span>{config.RESTAURANT.email}</span>
            </div>

            <div style={{ ...rowStyle, alignItems: 'flex-start' }}>
              <Icon name="map marker alternate" style={{ ...iconStyle, marginTop: '3px' }} />
              <span>
                {config.RESTAURANT.address}, {config.RESTAURANT.location}
              </span>
            </div>
          </Grid.Column>

          {/* Redes Sociales */}
          <Grid.Column computer={5} tablet={16} mobile={16}>
            <Header as="h4" inverted style={sectionTitleStyle}>
              <Icon name="share alternate" style={{ color: '#ffdd44' }} />
              {t("footer.social_title")}
            </Header>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '14px',
                flexWrap: 'wrap',
              }}
            >
              <a
                href={config.RESTAURANT.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '42px',
                  height: '42px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.18)',
                  color: '#ffdd44',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                }}
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href={config.RESTAURANT.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '42px',
                  height: '42px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.18)',
                  color: '#ffdd44',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                }}
              >
                <FaInstagram size={20} />
              </a>

              <a
                href={config.RESTAURANT.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                style={{
                  width: '42px',
                  height: '42px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.18)',
                  color: '#ffdd44',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                }}
              >
                <FaWhatsapp size={20} />
              </a>
            </div>

            <p
              style={{
                color: 'white',
                fontSize: '0.92em',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              © 2024 {config.RESTAURANT.name}. {t("footer.rights")}
            </p>
          </Grid.Column>
        </Grid>

        <Divider
          style={{
            borderColor: 'rgba(255, 255, 255, 0.28)',
            marginTop: '22px',
            marginBottom: '10px',
          }}
        />

        {/* Mensaje final */}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.92em',
              margin: 0,
            }}
          >
            {config.RESTAURANT.neighborhood} • {config.RESTAURANT.location}
          </p>
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;