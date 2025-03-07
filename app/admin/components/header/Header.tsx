import styles from "./Header.module.scss";

const Header = ({ title }: { title: string }) => {
  return (
    <header className={styles.header}>
      <h2>{title}</h2>
    </header>
  );
};

export default Header;
