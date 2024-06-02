// src/Components/ExampleCarouselImage.js
import React from "react";
import PropTypes from "prop-types";

const ExampleCarouselImage = ({ text }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        backgroundColor: "lightgray",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h3>{text}</h3>
    </div>
  );
};

ExampleCarouselImage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ExampleCarouselImage;
