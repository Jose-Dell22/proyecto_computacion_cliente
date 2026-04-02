import React, { useState, useEffect } from "react";
import { Button, Header, Segment } from "semantic-ui-react";

const defaultImages = [
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://st.depositphotos.com/1007254/2810/i/600/depositphotos_28101907-stock-photo-bbq-spare-ribs-with-herbs.jpg",
  "https://st4.depositphotos.com/19157714/25325/i/380/depositphotos_253257606-stock-photo-close-view-delicious-steak-rosemary.jpg",
  "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const HeroSection = ({
  title,
  subtitle,
  buttonText,
  backgroundImages = defaultImages,
  onButtonClick,
  intervalTime = 6000,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  // 🎞️ Cambio de imagen con efecto fade-in
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // comienza el fade-out
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        setFade(true); // vuelve a hacer fade-in
      }, 300); // duración del fade-out
    }, intervalTime);
    return () => clearInterval(interval);
  }, [backgroundImages, intervalTime]);

  return (
    <Segment
      textAlign="center"
      style={{
        position: "relative",
        padding: "10em 0",
        color: "white",
        overflow: "hidden",
        border: "none",
        backgroundImage: `url(${backgroundImages[currentImage]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "opacity 1.2s ease-in-out",
        opacity: fade ? 1 : 0,
      }}
    >
      {/* 🔹 Capa oscura sobre la imagen */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 1,
        }}
      ></div>

      {/* 🔹 Contenido principal */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Header
          as="h1"
          style={{
            fontSize: "4em",
            fontWeight: "bold",
            color: "white",
            textShadow: "1px 1px 20px rgba(149, 172, 190, 0.6)",
          }}
        >
          {title}
        </Header>

        <p
          style={{
            fontSize: "1.5em",
            marginBottom: "1.5em",
            color: "white",
            textShadow: "1px 1px 20px rgba(149, 172, 190, 0.5)",
          }}
        >
          {subtitle}
        </p>

        <Button
          size="large"
          color="orange"
          onClick={onButtonClick}
          style={{
            marginTop: "1em",
            padding: "0.8em 2em",
            background: "linear-gradient(45deg, #ff8800, #ff4500)",
            boxShadow: "0 0 18px rgba(255, 160, 0, 0.9)",
            textShadow: "0 0 5px rgba(0,0,0,0.4)",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 45px rgba(255, 180, 0, 1)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 160, 0, 0.9)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {buttonText}
        </Button>
      </div>
    </Segment>
  );
};

export default HeroSection;
