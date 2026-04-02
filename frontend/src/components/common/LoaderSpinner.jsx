
import React from "react";
import { Loader } from "semantic-ui-react";

const LoaderSpinner = ({ message = "Cargando..." }) => (
  <Loader active inline="centered" size="large">
    {message}
  </Loader>
);

export default LoaderSpinner;
