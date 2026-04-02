
import React from "react";
import { Card, Image } from "semantic-ui-react";

const ProductCard = ({ producto }) => (
  <Card>
    <Image src={producto.imagen} wrapped ui={false} alt={producto.nombre} />
    <Card.Content>
      <Card.Header>{producto.nombre}</Card.Header>
      <Card.Meta>{producto.categoria}</Card.Meta>
      <Card.Description>{producto.descripcion}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      <strong>${producto.precio.toLocaleString("es-CO")}</strong>
    </Card.Content>
  </Card>
);

export default ProductCard;
