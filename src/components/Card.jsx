import React from "react";
import PropTypes from "prop-types";
import "./css/card.css";

function Card({
  children,
  title,
  spacing = 2,
  direction = "row",
  wrap = true,
}) {
  const style = {
    display: "flex",
    gap: `${spacing * 0.25}rem`,
    flexWrap: wrap ? "wrap" : "nowrap",
    flexDirection: direction,
  };
  return (
    <div className="storybook-card">
      <div className="storybook-card-titleSection">
        <h5 className="storybook-card-title">{title}</h5>
      </div>
      <div className="storybook-card-childSection">{children}</div>
    </div>
  );
}

Card.propTypes = {
  spacing: PropTypes.number,
  title: PropTypes.string,
  wrap: PropTypes.bool,
  direction: PropTypes.oneOf(["row", "column"]),
};

export default Card;
