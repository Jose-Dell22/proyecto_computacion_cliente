import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/constants';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { config } = useApp();
  const { t } = useTranslation();

  return (
    <Segment
      inverted
      color="orange"
      style={{
        background: 'linear-gradient(135deg, #ff7b00 0%, #ff4500 50%, #d35400 100%)',
        boxShadow: '0 -5px 20px rgba(255, 136, 0, 0.3)',
        border: 'none',
        borderRadius: '0',
        padding: '50px 0',
        marginTop: '2em', 
      }}
    >
      <Container textAlign="center">
        {/* 🔥 Título principal del footer */}
        <Header
          as="h2"
          inverted
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: '700',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '3em',
            textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
          }}
        >
          {t("footer.title")}
        </Header>

        {/* 🔶 Grid principal */}
        <Grid stackable centered columns={3}>
          {/* 🕒 Horarios */}
          <Grid.Column width={4.5}>
            <Header as="h4" inverted style={{ color: 'white', marginBottom: '15px' }}>
              <Icon name="clock" style={{ color: '#ffdd44' }} />
              {t("footer.schedule_title")}
            </Header>
            <div style={{ color: 'white', lineHeight: '1.8' }}>
              {config.RESTAURANT.schedules.map((schedule, index) => (
                <p key={index}>
                  <strong>{schedule.day}:</strong> {schedule.hours}
                </p>
              ))}
            </div>
          </Grid.Column>

          {/* ☎️ Contacto */}
          <Grid.Column width={4.5}>
            <Header as="h4" inverted style={{ color: 'white', marginBottom: '15px' }}>
              <Icon name="phone" style={{ color: '#ffdd44' }} />
              {t("footer.contact_title")}
            </Header>
            <div style={{ color: 'white', lineHeight: '1.8' }}>
              <p>
                <Icon name="phone" style={{ color: '#ffdd44' }} />
                {config.RESTAURANT.phone}
              </p>
              <p>
                <Icon name="mail" style={{ color: '#ffdd44' }} />
                {config.RESTAURANT.email}
              </p>
              <p>
                <Icon name="map marker" style={{ color: '#ffdd44' }} />
                {config.RESTAURANT.address}
              </p>
            </div>
          </Grid.Column>

          {/* 🌐 Redes Sociales */}
          <Grid.Column width={4.5}>
            <Header as="h4" inverted style={{ color: 'white', marginBottom: '15px' }}>
              <Icon name="share alternate" style={{ color: '#ffdd44' }} />
              {t("footer.social_title")}
            </Header>
            <div style={{ marginBottom: '15px' }}>
              <Icon
                name="facebook"
                size="large"
                style={{ color: '#ffdd44', marginRight: '10px', cursor: 'pointer' }}
                title="Facebook"
                onClick={() => window.open(config.RESTAURANT.social.facebook, '_blank')}
              />
              <Icon
                name="instagram"
                size="large"
                style={{ color: '#ffdd44', marginRight: '10px', cursor: 'pointer' }}
                title="Instagram"
                onClick={() => window.open(config.RESTAURANT.social.instagram, '_blank')}
              />
              <Icon
                name="whatsapp"
                size="large"
                style={{ color: '#ffdd44', marginRight: '10px', cursor: 'pointer' }}
                title="WhatsApp"
                onClick={() => window.open(config.RESTAURANT.social.whatsapp, '_blank')}
              />
            </div>
            <p style={{ color: 'white', fontSize: '0.9em' }}>
              © 2024 {config.RESTAURANT.name}. {t("footer.rights")}
            </p>
          </Grid.Column>
        </Grid>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)', marginTop: '40px' }} />

        {/* 📍 Mensaje Final */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9em', margin: '10px 0 0 0' }}>
            {config.RESTAURANT.neighborhood} • {config.RESTAURANT.location}
          </p>
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;
