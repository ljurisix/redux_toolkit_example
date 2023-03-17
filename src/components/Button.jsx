import React from "react";
import PropTypes from "prop-types";
import "./css/button.css";

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  danger,
  disabled,
  backgroundColor,
  size,
  label,
  ...props
}) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary";
  const warning = danger ? "storybook-button--danger" : "";
  const disable = disabled ? "storybook-button--disabled" : "";
  return (
    <button
      disabled={disabled}
      type="button"
      className={[
        "storybook-button",
        `storybook-button--${size}`,
        mode,
        warning,
        disable,
      ].join(" ")}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: undefined,
};
