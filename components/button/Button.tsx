"use client";

import styles from "./Button.module.scss";

type ButtonColor = "main" | "white" | "disabled";

type ButtonProps = {
  children?: string;
  type?: "button" | "submit" | "reset";
  isLong: boolean;
  color: ButtonColor;
  onClick?: (e: React.MouseEvent) => void;
};

const Button = ({
  children,
  isLong,
  color,
  onClick,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${isLong ? styles.long : styles.short} ${
        styles[color]
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
