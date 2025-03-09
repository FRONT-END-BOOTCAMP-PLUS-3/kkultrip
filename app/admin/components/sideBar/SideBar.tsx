"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import styles from "./SideBar.module.scss";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가져오기
  const handleNavigation = (path: string) => {
    router.push(`/admin/${path}`);
  };

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>KKulTrip</h1>
      <nav>
        <ul className={styles.navList}>
          <li
            className={`${styles.navItem} ${
              pathname === "/admin/spots" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("spots")}
          >
            명소 관리
          </li>
          <li
            className={`${styles.navItem} ${
              pathname === "/admin/tips" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("tips")}
          >
            꿀팁 관리
          </li>
          <li
            className={`${styles.navItem} ${
              pathname === "/admin/users" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("users")}
          >
            유저 관리
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
