import React from "react";
import PropTypes from "prop-types";
import "./css/header.css";

function Header({ children, title }) {
  return (
    <header className="storybook-header">
      <h3 className="storybook-header-title">{title}</h3>
      <section className="storybook-header-childSection">{children}</section>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
