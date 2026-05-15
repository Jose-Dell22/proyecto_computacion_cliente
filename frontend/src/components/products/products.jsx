import React, { useState, useRef } from "react";
import {
  Card,
  Image,
  Button,
  Icon,
  Loader,
  Container,
  Header,
  Message,
} from "semantic-ui-react";
import { useApp } from "../../context/AppContext";
import { ICONS } from "../../config/constants";
import { useTranslation } from "react-i18next";
import {
  bindCardInteractions,
  revealOnScroll,
  staggerCardsOnScroll,
} from "../../utils/animations";
import { useGsapScroll } from "../../hooks/useGsapScroll";
import { matchesCategoryFilter } from "../../utils/productCategory";
import "./Products.css";

const Products = () => {
  const { addToCart, config, products, productsLoading } = useApp();

  const [visibleCount, setVisibleCount] = useState(config.APP.productsPerPage);
  const [addedMessage, setAddedMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { t } = useTranslation();

  const loading = productsLoading;

  const productCardsRef = useRef([]);
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const sectionRef = useRef(null);

  const filteredProducts = products.filter(
    (item) =>
      matchesCategoryFilter(item, categoryFilter) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  useGsapScroll(() => {
    if (loading) return;

    if (headerRef.current) {
      revealOnScroll(headerRef.current, {
        trigger: sectionRef.current,
        x: -40,
        y: 0,
      });
    }

    if (filtersRef.current) {
      revealOnScroll(filtersRef.current, {
        trigger: sectionRef.current,
        y: 24,
        delay: 0.1,
      });
    }

    const cards = productCardsRef.current.filter(Boolean);
    if (cards.length) {
      staggerCardsOnScroll(cards, {
        trigger: sectionRef.current,
        stagger: 0.08,
      });
      cards.forEach((wrapper) => bindCardInteractions(wrapper));
    }
  }, [loading, visibleProducts.length, categoryFilter, searchTerm]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedMessage(item.title);
    setTimeout(() => setAddedMessage(null), config.APP.messageTimeout);
  };

  if (loading) {
    return (
      <Loader
        active
        inline="centered"
        size="large"
        content={t("loadingProducts")}
      />
    );
  }

  return (
    <div
      className="products-container"
      data-products-component
      ref={sectionRef}
      style={{
        position: "relative",
        backgroundColor: "#000",
        paddingBottom: "0.5em",
      }}
    >
      <div
        className="products-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.75)",
          zIndex: 0,
        }}
      />

      <Container
        textAlign="center"
        className="products-content"
        style={{ position: "relative", zIndex: 1, paddingTop: "4em" }}
      >
        <div ref={headerRef} style={{ display: "inline-block" }}>
          <Header
            as="h1"
            className="products-header"
            style={{
              color: "#fff",
              display: "inline-block",
              padding: "0.6em 1.5em",
              borderRadius: "14px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              background: "linear-gradient(45deg, #ff7b00, #ff4500)",
              boxShadow: "0 4px 15px rgba(255,123,0,0.4)",
              fontSize: "1.8em",
              fontWeight: "800",
              margin: 0,
            }}
          >
            {config.RESTAURANT.name}
          </Header>
        </div>

        <div ref={filtersRef} className="products-category-filters">
          {[
            { key: "all", label: t("products.filter_all") },
            { key: "food", label: t("products.filter_food") },
            { key: "drink", label: t("products.filter_drinks") },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`products-filter-btn${
                categoryFilter === key ? " products-filter-btn--active" : ""
              }`}
              onClick={() => {
                setCategoryFilter(key);
                setVisibleCount(config.APP.productsPerPage);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "1.5em", marginBottom: "2em" }}>
          <input
            type="text"
            placeholder={
              t("products.search_placeholder") || "Buscar producto..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(config.APP.productsPerPage);
            }}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "0.8em 1.2em",
              borderRadius: "12px",
              border: "2px solid #ff7b00",
              outline: "none",
              fontSize: "1em",
              fontWeight: "500",
              background: "#fff",
              color: "#333",
              boxShadow: "0 3px 10px rgba(255,123,0,0.25)",
            }}
          />
        </div>

        {addedMessage && (
          <Message positive style={{ marginTop: "1em" }}>
            <Icon name={ICONS.check} />
            <strong>{addedMessage}</strong> {t("menu.added_message")}
          </Message>
        )}

        <Card.Group
          centered
          itemsPerRow={4}
          stackable
          style={{ marginTop: "2em", marginBottom: "3em" }}
        >
          {visibleProducts.map((item, index) => (
            <div
              key={item.id ?? item._id}
              ref={(el) => (productCardsRef.current[index] = el)}
              className="product-card-wrap"
            >
              <Card
              className="gsap-card card-hover"
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                overflow: "hidden",
                border: "none",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <Card.Content textAlign="center" style={{ padding: "1em" }}>
                <Card.Header
                  style={{
                    color: "#ff7b00",
                    fontWeight: "700",
                    fontSize: "1.1em",
                    marginBottom: "0.4em",
                  }}
                >
                  {item.title}
                </Card.Header>
                <Card.Description
                  style={{
                    color: "#555",
                    fontSize: "0.9em",
                    lineHeight: "1.4",
                  }}
                >
                  {(item.description || "").slice(0, 80)}
                  {(item.description || "").length > 80 ? "..." : ""}
                </Card.Description>
              </Card.Content>

              <Card.Content
                extra
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0.9em",
                  borderTop: "1px solid #eee",
                  gap: "0.7em",
                }}
              >
                <strong
                  style={{
                    color: "#ff7b00",
                    fontSize: "1.1em",
                    fontWeight: "700",
                  }}
                >
                  ${" "}
                  {item.price.toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                  })}
                </strong>

                <Button
                  circular
                  icon
                  color="orange"
                  onClick={() => handleAddToCart(item)}
                  style={{
                    boxShadow: "0 0 12px rgba(255,136,0,0.4)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow =
                      "0 0 18px rgba(255,136,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 0 12px rgba(255,136,0,0.4)";
                  }}
                >
                  <Icon name={ICONS.plus} />
                </Button>
              </Card.Content>
            </Card>
            </div>
          ))}
        </Card.Group>

        {visibleCount < filteredProducts.length && (
          <div
            style={{
              position: "relative",
              marginTop: "3em",
              marginBottom: "2em",
              display: "flex",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <Button
              color="orange"
              size="large"
              icon
              labelPosition="right"
              onClick={() =>
                setVisibleCount(
                  (prev) => prev + config.APP.productsPerPage
                )
              }
              className="products-load-more"
              style={{
                background: "linear-gradient(45deg, #ff7b00, #ff4500)",
                boxShadow: "0 4px 15px rgba(255,123,0,0.4)",
                padding: "1em 1em",
                border: "none",
                color: "white",
                fontWeight: "bold",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.97)";
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(255,123,0,0.6)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(255,123,0,0.4)";
              }}
            >
              {t("products.load_more")}
              <Icon name={ICONS.arrowDown} />
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;
