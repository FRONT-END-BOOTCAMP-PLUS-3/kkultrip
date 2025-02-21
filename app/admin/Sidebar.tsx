import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>HoneyTrip</h1>
      <nav>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${styles.active}`}>명소 관리</li>
          <li className={styles.navItem}>꿀팁 관리</li>
          <li className={styles.navItem}>유저 관리</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
