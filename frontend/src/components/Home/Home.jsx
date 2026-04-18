import React, { useEffect, useRef } from "react";
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
  createCardEntranceAnimation, 
  createStaggeredCardAnimation, 
  createImageHoverEffect,
  animateHeroImages,
  scrollTriggerAnimations,
  animations
} from "../../utils/animations";
import { ScrollTrigger } from 'gsap/ScrollTrigger'; //  Soporte de idiomas

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

  // Refs for animations
  const heroSectionRef = useRef(null);
  const navigationCardsRef = useRef([]);
  const featuredProductsRef = useRef([]);
  const imageRefs = useRef([]);

  useEffect(() => {
    try {
      // Animate hero section images
      if (heroSectionRef.current) {
        const heroImages = heroSectionRef.current.querySelectorAll('img');
        if (heroImages.length > 0) {
          animateHeroImages(heroImages);
        }
      }

      // Animate navigation cards with stagger effect
      if (navigationCardsRef.current.length > 0) {
        createStaggeredCardAnimation(navigationCardsRef.current);
        navigationCardsRef.current.forEach(card => {
          if (card) {
            const img = card.querySelector('img');
            if (img) {
              createImageHoverEffect(img, { scale: 1.1 });
            }
          }
        });
      }

      // Animate featured products
      if (featuredProductsRef.current.length > 0) {
        scrollTriggerAnimations.scaleInOnScroll(featuredProductsRef.current);
        featuredProductsRef.current.forEach(card => {
          if (card) {
            const img = card.querySelector('img');
            if (img) {
              createImageHoverEffect(img, { scale: 1.05 });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error in GSAP animations:', error);
    }

    // Cleanup animations on unmount
    return () => {
      try {
        // Kill all ScrollTrigger instances and animations for this component
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger && (
            trigger.trigger.closest('[data-home-component]') ||
            navigationCardsRef.current.includes(trigger.trigger) ||
            featuredProductsRef.current.includes(trigger.trigger)
          )) {
            trigger.kill();
          }
        });
        
        // Kill animations on refs
        if (heroSectionRef.current) {
          gsap.killTweensOf(heroSectionRef.current.querySelectorAll('*'));
        }
        navigationCardsRef.current.forEach(card => {
          if (card) gsap.killTweensOf(card);
        });
        featuredProductsRef.current.forEach(card => {
          if (card) gsap.killTweensOf(card);
        });
      } catch (error) {
        console.error('Error cleaning up animations:', error);
      }
    };
  }, [products, loading]);

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
    <>
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

          <Grid stackable columns={4} textAlign="center">
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
                  color="black"
                  inverted
                  raised
                  className="card-hover"
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
                <Card
                  raised
                  style={{
                    background: "#000",
                    border: "2px solid #ff7b00",
                    boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
                    minHeight: "350px",
                  }}
                >
                <Image
                  src="data:image/webp;base64,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"
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
    <Card
      color="black"
      inverted
      raised
      style={{
        background: "#000",
        border: "2px solid #ff7b00",
        boxShadow: "0 10px 30px rgba(255, 123, 0, 0.3)",
        minHeight: "350px",
      }}
    >
      <Image
      src="data:image/webp;base64,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"
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

            {/* Sección de productos destacados */}
      <Segment vertical style={{
        marginTop: "2em",
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Imagen de fondo de alguien picando carnes */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.1,
          zIndex: 0
        }} />
        
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Header as="h2" textAlign="center" color="orange" style={{ marginBottom: '1em' }}>
            <Icon name="star" />
            Productos Destacados
          </Header>
          <p style={{ textAlign: "center", marginBottom: "2em", fontSize: "1.1em", color: '#333' }}>
            Los favoritos de nuestros clientes
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2em" }}>
              <Loader active inline="centered" />
              <p>Cargando productos destacados...</p>
            </div>
          ) : (
            <Card.Group centered itemsPerRow={3} stackable style={{ marginTop: "2em" }}>
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id ?? product._id}
                  ref={el => featuredProductsRef.current[index] = el}
                  className="transition-normal"
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
              ))}
            </Card.Group>
          )}
          <div style={{ textAlign: "center", marginTop: "2em" }}>
            <Button 
              size="large" 
              color="orange"
              onClick={() => navigate(config.ROUTES.PRODUCTS)}
              style={{
                background: 'linear-gradient(45deg, #ff7b00, #ff4500)',
                boxShadow: '0 4px 15px rgba(255, 123, 0, 0.4)'
              }}
            >
              Ver Todos los Productos
            </Button>
      </div>
        </Container>
      </Segment>



     
    </>
  );
};

export default Home;
