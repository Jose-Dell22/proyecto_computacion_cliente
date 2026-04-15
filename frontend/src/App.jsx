import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Menu, Container, Loader, Dimmer, Dropdown, Icon } from "semantic-ui-react";

import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import ContactoUbicacion from "./components/Contact/ContactoUbicacion";
import NotFound from "./components/Notfound/Notfound";
import AboutUs from "./components/AboutUs/About";
import MenuComponent from "./components/MenuComponent/menuComponent";
import Checkout from "./components/Checkout/Checkout";
import FloatingCart from "./components/common/FloatingCart";
import Footer from "./components/common/Footer";
import ReservationForm from "./components/Reservations/ReservationForm";
import AdminDashboard from "./components/Admin/AdminDashboard";

import { useApp } from "./context/AppContext";
import { MESSAGES } from "./config/constants";
import "./styles.css";

import { useTranslation } from "react-i18next";

const App = () => {
  const { loading, config } = useApp();
  const { t, i18n } = useTranslation();

  // Estado para manejar el menú móvil (hamburguesa)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Si la app aún carga, mostramos el Loader
  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader size="large" content={MESSAGES.loading} />
      </Dimmer>
    );
  }

  // Opciones del selector de idioma
  const languageOptions = [
    { key: "es", value: "es", flag: "co", text: "Español" },
    { key: "en", value: "en", flag: "us", text: "English" },
    { key: "zh", value: "zh", flag: "cn", text: "中文" }
  ];

  // Cambiar idioma desde i18next
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>

      {/*  NAVBAR  */}
      <Menu fixed="top" inverted borderless size="large" className="navbar" stackable>
        <Container fluid className="navbar-inner">

          {/* Marca / Título del restaurante */}
          <Menu.Item
            as={NavLink}
            to={config.ROUTES.HOME}
            end
            header
            className="brand"
            active={false}
          >
            {config.RESTAURANT.name}
          </Menu.Item>

          {/* Menú desplegable (zona móvil + tablet) */}
          <Menu.Menu className={`nav-spreader ${isMenuOpen ? "open" : ""}`}>

            {/* Enlaces principales */}
            <Menu.Item
              as={NavLink}
              to={config.ROUTES.HOME}
              end
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.home")}
            </Menu.Item>

            <Menu.Item
              as={NavLink}
              to={config.ROUTES.MENU_COMPONENT}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.specialties")}
            </Menu.Item>

            <Menu.Item
              as={NavLink}
              to={config.ROUTES.PRODUCTS}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.products")}
            </Menu.Item>

            <Menu.Item
              as={NavLink}
              to={config.ROUTES.CONTACT}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.contact")}
            </Menu.Item>

            <Menu.Item
              as={NavLink}
              to={config.ROUTES.ABOUT}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navbar.about")}
            </Menu.Item>

            {/* Selector de idioma (visible también en móvil) */}
            <Dropdown
              item
              simple
              floating
              options={languageOptions}
              value={i18n.language}
              onChange={(e, { value }) => changeLanguage(value)}
              trigger={
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  <Icon name="globe" style={{ marginRight: "5px" }} />
                  {t("navbar.language")}
                </span>
              }
            />
          </Menu.Menu>

          {/* Icono de administrador a la derecha */}
          <Menu.Menu position="right">
            <Menu.Item
              as={NavLink}
              to={config.ROUTES.ADMIN}
              onClick={() => setIsMenuOpen(false)}
              title="Panel de Administrador"
            >
              <Icon name="user" size="large" color="orange" />
            </Menu.Item>
          </Menu.Menu>

      

          {/* Botón hamburguesa (solo móvil) */}
          <div className="hamburger-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Icon name={isMenuOpen ? "close" : "bars"} size="large" color="orange" />
          </div>

        </Container>
      </Menu>

      {/* CONTENIDO */}
      <div className="main-content">

        {/* Definición de rutas principales */}
        <Routes>
          <Route path={config.ROUTES.HOME} element={<Home />} />
          <Route path={config.ROUTES.PRODUCTS} element={<Products />} />
          <Route path={config.ROUTES.CONTACT} element={<ContactoUbicacion />} />
          <Route path={config.ROUTES.MENU_COMPONENT} element={<MenuComponent />} />
          <Route path={config.ROUTES.ABOUT} element={<AboutUs />} />
          <Route path={config.ROUTES.RESERVATION} element={<ReservationForm />} />
          <Route path={config.ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Carrito flotante siempre visible */}
        <FloatingCart />
      </div>

      {/* FOOTER  */}
      <Footer />
    </Router>
  );
};

export default App;
