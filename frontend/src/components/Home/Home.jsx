import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Header,
  Icon,
  Segment,
  Card,
  Image,
  Button,
  Loader,
} from "semantic-ui-react";
import HeroSection from "../common/HeroSection";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import {
  bindCardInteractions,
  revealOnScroll,
  staggerCardsOnScroll,
} from "../../utils/animations";
import { useGsapScroll } from "../../hooks/useGsapScroll";
import "./Home.css";

const heroImages = [
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1616628182507-9f858d7a1b8a?auto=format&fit=crop&w=2000&q=80",
];

const Home = () => {
  const navigate = useNavigate();
  const { config, addToCart, products, productsLoading } = useApp();
  const { t } = useTranslation();

  const featuredProducts = products.slice(0, 6);
  const loading = productsLoading;

  const heroSectionRef = useRef(null);
  const exploreSectionRef = useRef(null);
  const exploreTitlesRef = useRef(null);
  const navigationCardsRef = useRef([]);
  const featuredSectionRef = useRef(null);
  const featuredProductsRef = useRef([]);

  useGsapScroll(() => {
    if (exploreTitlesRef.current) {
      revealOnScroll(exploreTitlesRef.current, {
        trigger: exploreSectionRef.current,
        y: 30,
      });
    }

    const navCards = navigationCardsRef.current.filter(Boolean);
    if (navCards.length) {
      staggerCardsOnScroll(navCards, { trigger: exploreSectionRef.current });
      navCards.forEach((wrapper) =>
        bindCardInteractions(wrapper, { imageScale: 1.08 })
      );
    }
  }, []);

  useGsapScroll(() => {
    if (loading) return;

    const featured = featuredProductsRef.current.filter(Boolean);
    if (!featured.length) return;

    staggerCardsOnScroll(featured, {
      trigger: featuredSectionRef.current,
      y: 40,
      stagger: 0.1,
    });
    featured.forEach((wrapper) => bindCardInteractions(wrapper));
  }, [loading, featuredProducts.length]);

  // 🔹 Botón de WhatsApp
  const handleWhatsAppClick = () => {
    window.open(
      `${config.RESTAURANT.social.whatsapp}?text=¡Hola!%20Quiero%20hacer%20un%20pedido`,
      "_blank"
    );
  };

  // 🔹 Botón que lleva al contacto
  const handleRappiClick = () => {
    navigate(config.ROUTES.CONTACT);
  };

  // 🔹 Agregar producto al carrito
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div data-home-component>
      {/* Sección principal */}
      <div ref={heroSectionRef}>
        <HeroSection
          title={config.RESTAURANT.name}
          subtitle={t("home.subtitle")}
          buttonText={t("home.explore_menu")}
          onButtonClick={() => navigate(config.ROUTES.PRODUCTS)}
        />
      </div>

      {/* Sección de navegación llamativa */}
      <div ref={exploreSectionRef}>
      <Segment
        vertical
        style={{
          background: "linear-gradient(135deg, #ff7b00 0%, #ff4500 50%, #d35400 100%)",
          padding: "4em 0",
          position: "relative",
          marginBottom: "0.8em",
          overflow: "hidden",
          marginTop: "2em",
        }}
      >
        {/* Efectos de fondo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <Container>
          <div ref={exploreTitlesRef}>
            <Header
              as="h1"
              textAlign="center"
              inverted
              style={{
                fontSize: "3em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                marginBottom: "0.2em",
              }}
            >
              <Icon name="fire" style={{ color: "#ffeb3b" }} />
              {t("home.explore_world")}
            </Header>

            <Header
              as="h3"
              textAlign="center"
              inverted
              style={{
                fontWeight: "300",
                marginBottom: "3em",
                opacity: 0.9,
                color: "white",
              }}
            >
              {t("home.experience_text")}
            </Header>
          </div>

          <Grid stackable columns={4} textAlign="center" className="home-explore-grid">
            {/* 🔥 Nuestro Menú */}
            <Grid.Column>
              <div
                ref={el => navigationCardsRef.current[0] = el}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => navigate(config.ROUTES.PRODUCTS)}
              >
                <Card
                  raised
                  className="gsap-card"
                  style={{
                    background: "#000",
                    border: "2px solid #ff7b00",
                    boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
                    minHeight: "350px",
                  }}
                >
                  <Image
                    className="image-enhanced"
                    src="https://img.freepik.com/vector-premium/formato-horizontal-menu-restaurante-digital_23-2148655475.jpg"
                    alt={t("home.menu_title")}
                    style={{ borderRadius: "8px", height: "160px", objectFit: "cover" }}
                  />
                  <Card.Content style={{ padding: "2em" }}>
                    <Card.Header
                      style={{
                        fontSize: "1.5em",
                        color: "#ff7b00",
                        marginTop: "1em",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                      }}
                    >
                      {t("home.menu_title")}
                    </Card.Header>
                    <Card.Description
                      style={{
                        fontSize: "1.1em",
                        marginTop: "1em",
                        lineHeight: "1.6",
                        color: "#fff",
                      }}
                    >
                      {t("home.menu_description")}
                    </Card.Description>
                    <Button
                      className="pulse-btn"
                      color="orange"
                      size="large"
                      onClick={() => navigate(config.ROUTES.PRODUCTS)}
                      style={{
                        marginTop: "2em",
                        background: "linear-gradient(45deg, #ff7b00, #ff4500)",
                        boxShadow: "0 4px 15px rgba(255, 123, 0, 0.4)",
                      }}
                    >
                      {t("home.menu_button")}
                    </Button>
                  </Card.Content>
                </Card>
              </div>
            </Grid.Column>

            {/* 📍 Ubicación */}
            <Grid.Column>
              <div
                ref={el => navigationCardsRef.current[1] = el}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(config.ROUTES.CONTACT)}
              >
                <Card raised className="gsap-card" style={{
                    background: "#000",
                    border: "2px solid #ff7b00",
                    boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
                    minHeight: "350px",
                  }}
                >
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Ubicación"
                  style={{ borderRadius: "8px", height: "160px", objectFit: "cover" }}
                />
                <Card.Content style={{ padding: "2em" }}>
                  <Card.Header
                    style={{
                      fontSize: "1.5em",
                      color: "#ff7b00",
                      marginTop: "1em",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {t("home.location_title")}
                  </Card.Header>
                  <Card.Description
                    style={{
                      fontSize: "1.1em",
                      marginTop: "1em",
                      color: "#fff",
                    }}
                  >
                    {t("home.location_description")}
                  </Card.Description>
                  <Button
                    color="orange"
                    size="large"
                    onClick={handleRappiClick}
                    style={{
                      marginTop: "2em",
                      background: "linear-gradient(45deg, #ff7b00, #ff4500)",
                      boxShadow: "0 4px 15px rgba(255, 123, 0, 0.4)",
                    }}
                  >
                    {t("home.location_button")}
                  </Button>
                </Card.Content>
                </Card>
              </div>
            </Grid.Column>

            {/* 🧠 Sobre Nosotros */}
            <Grid.Column>
              <div
                ref={el => navigationCardsRef.current[2] = el}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(config.ROUTES.ABOUT)}
              >
                <Card
                  raised
                  className="gsap-card"
                  style={{
                    background: "#000",
                    border: "2px solid #ff7b00",
                    boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
                    minHeight: "350px",
                  }}
                >
                <Image
                  src="https://img.freepik.com/foto-gratis/cocinero-cocina-preparando-plato_53876-109787.jpg"
                  alt="Sobre Nosotros"
                  style={{ borderRadius: "8px", height: "160px", objectFit: "cover" }}
                />
                <Card.Content style={{ padding: "2em" }}>
                  <Card.Header
                    style={{
                      fontSize: "1.5em",
                      color: "#ff7b00",
                      marginTop: "1em",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {t("home.about_title")}
                  </Card.Header>
                  <Card.Description
                    style={{
                      fontSize: "1.1em",
                      marginTop: "1em",
                      color: "#fff",
                    }}
                  >
                    {t("home.about_description")}
                  </Card.Description>
                  <Button
                    color="orange"
                    size="large"
                    onClick={() => navigate(config.ROUTES.ABOUT)}
                    style={{
                      marginTop: "2em",
                      background: "linear-gradient(45deg, #ff7b00, #ff4500)",
                      boxShadow: "0 4px 15px rgba(255, 123, 0, 0.4)",
                    }}
                  >
                    {t("home.about_button")}
                  </Button>
                </Card.Content>
                </Card>
              </div>
            </Grid.Column>
             <Grid.Column>
  <div
    ref={el => navigationCardsRef.current[3] = el}
    style={{ cursor: "pointer" }}
    onClick={() => navigate(config.ROUTES.MENU_COMPONENT)}
  >
    <Card raised className="gsap-card" style={{
        background: "#000",
        border: "2px solid #ff7b00",
        boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
        minHeight: "350px",
      }}
    >
      <Image
        src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
        alt={t("home.specials_title")}
        style={{ borderRadius: "8px", height: "160px", objectFit: "cover" }}
      />
      <Card.Content style={{ padding: "2em" }}>
        <Card.Header
          style={{
            fontSize: "1.5em",
            color: "#ff7b00",
            marginTop: "1em",
            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {t("home.specials_title")}
        </Card.Header>
        <Card.Description
          style={{
            fontSize: "1.1em",
            marginTop: "1em",
            lineHeight: "1.6",
            color: "#fff",
          }}
        >
          {t("home.specials_description")}
        </Card.Description>
        <Button
          color="orange"
          size="large"
          onClick={() => navigate(config.ROUTES.MENU_COMPONENT)}
          style={{
            marginTop: "2em",
            background: "linear-gradient(45deg, #ff7b00, #ff4500)",
            boxShadow: "0 4px 15px rgba(255, 123, 0, 0.4)",
          }}
        >
          {t("home.specials_button")}
        </Button>
      </Card.Content>
    </Card>
  </div>
</Grid.Column>

          </Grid>
        </Container>
      </Segment>
      </div>

            {/* Sección de productos destacados */}
      <div ref={featuredSectionRef}>
      <Segment vertical className="home-featured-section">
        <div className="home-featured-section__bg" aria-hidden="true" />
        <div className="home-featured-section__overlay" aria-hidden="true" />

        <Container className="home-featured-section__content">
          <Header as="h2" textAlign="center" className="home-featured-title">
            <Icon name="star" />
            Productos Destacados
          </Header>
          <p className="home-featured-subtitle">
            Los favoritos de nuestros clientes
          </p>

          {loading ? (
            <div className="home-featured-loading" style={{ textAlign: "center", padding: "2em" }}>
              <Loader active inline="centered" />
              <p>Cargando productos destacados...</p>
            </div>
          ) : (
            <Card.Group centered stackable className="home-featured-grid">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id ?? product._id}
                  ref={(el) => (featuredProductsRef.current[index] = el)}
                  className="home-featured-card-wrap"
                >
                <Card
                  className="gsap-card"
                  style={{
                    borderRadius: "18px",
                    background: config.COLORS.cardBackground,
                    boxShadow: "0 6px 15px rgba(255, 136, 0, 0.2)",
                    border: 'none'
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    style={{ height: "180px", objectFit: "contain", padding: "1em" }}
                  />
                  <Card.Content textAlign="center">
                    <Card.Header className="text-primary" style={{ color: config.COLORS.primary }}>
                      {product.title}
                    </Card.Header>
                    <Card.Description style={{ fontSize: "0.9em", color: "#444" }}>
                      {(product.description || "").slice(0, 80)}
                      {(product.description || "").length > 80 ? "..." : ""}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra textAlign="center">
                    <strong style={{ color: "#d35400" }}>
                      ${product.price.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                    </strong>
                    <Button
                      color="orange"
                      circular
                      icon
                      onClick={() => handleAddToCart(product)}
                      style={{ marginLeft: "1em" }}
                    >
                      <Icon name="plus" />
                    </Button>
                  </Card.Content>
                </Card>
                </div>
              ))}
            </Card.Group>
          )}
          <div style={{ textAlign: "center" }}>
            <Button
              size="large"
              color="orange"
              className="home-featured-load-more"
              onClick={() => navigate(config.ROUTES.PRODUCTS)}
            >
              Ver Todos los Productos
            </Button>
          </div>
        </Container>
      </Segment>
      </div>

    </div>
  );
};

export default Home;
