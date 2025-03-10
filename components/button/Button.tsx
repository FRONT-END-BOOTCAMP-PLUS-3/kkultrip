"use client";

import styles from "./Button.module.scss";

type ButtonColor = "main" | "white" | "disabled";

type ButtonProps = {
  children?: string;
  type?: "button" | "submit" | "reset";
  isLong: boolean;
  color: ButtonColor;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

const Button = ({
  children,
  isLong,
  color,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${isLong ? styles.long : styles.short} ${
        styles[color]
      } ${disabled ? styles.disabled : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
