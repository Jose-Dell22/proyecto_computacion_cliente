import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { config } = useApp();
  const { t } = useTranslation();

  return (
    <Segment inverted className="site-footer">
      <Container className="site-footer__container">
        <Header as="h2" inverted textAlign="center" className="site-footer__title">
          {t('footer.title')}
        </Header>

        <Grid stackable columns={3} verticalAlign="top" className="site-footer__grid">
          {/* Horario */}
          <Grid.Column computer={5} tablet={16} mobile={16} className="site-footer__column">
            <div className="site-footer__section">
              <Header as="h4" inverted className="site-footer__section-title">
                <Icon name="clock" />
                {t('footer.schedule_title')}
              </Header>

              <div className="site-footer__content">
                {config.RESTAURANT.schedules.map((schedule, index) => (
                  <div key={index} className="site-footer__row site-footer__row--center">
                    <span>
                      <strong>{schedule.day}:</strong> {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Grid.Column>

          {/* Contacto */}
          <Grid.Column computer={6} tablet={16} mobile={16} className="site-footer__column">
            <div className="site-footer__section site-footer__section--middle">
              <Header as="h4" inverted className="site-footer__section-title">
                <Icon name="phone" />
                {t('footer.contact_title')}
              </Header>

              <div className="site-footer__content">
                <div className="site-footer__row">
                  <Icon name="phone" />
                  <span>{config.RESTAURANT.phone}</span>
                </div>

                <div className="site-footer__row">
                  <Icon name="mail" />
                  <span>{config.RESTAURANT.email}</span>
                </div>

                <div className="site-footer__row site-footer__row--top">
                  <Icon name="map marker alternate" />
                  <span>
                    {config.RESTAURANT.address}, {config.RESTAURANT.location}
                  </span>
                </div>
              </div>
            </div>
          </Grid.Column>

          {/* Redes sociales */}
          <Grid.Column computer={5} tablet={16} mobile={16} className="site-footer__column">
            <div className="site-footer__section">
              <Header as="h4" inverted className="site-footer__section-title">
                <Icon name="share alternate" />
                {t('footer.social_title')}
              </Header>

              <div className="site-footer__social">
                <a
                  href={config.RESTAURANT.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="site-footer__social-link"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={config.RESTAURANT.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="site-footer__social-link"
                >
                  <FaInstagram />
                </a>

                <a
                  href={config.RESTAURANT.social.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="site-footer__social-link"
                >
                  <FaWhatsapp />
                </a>
              </div>

              <p className="site-footer__hint">
                {config.RESTAURANT.neighborhood} • {config.RESTAURANT.location}
              </p>
            </div>
          </Grid.Column>
        </Grid>

        <Divider className="site-footer__divider" />

        <p className="site-footer__copy">
          © 2024 {config.RESTAURANT.name}. {t('footer.rights')}
        </p>
      </Container>
    </Segment>
  );
};

export default Footer;