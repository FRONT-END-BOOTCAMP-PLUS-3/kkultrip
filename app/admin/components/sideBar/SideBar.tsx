"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import styles from "./SideBar.module.scss";
import useUserStore from "@/store/useUserStore";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const clearInfo = useUserStore((state) => state.clearInfo);
  const userLat = useUserStore((state) => state.userLat);
  const userLon = useUserStore((state) => state.userLon);
  const handleNavigation = (path: string) => {
    router.push(`/admin/${path}`);
  };

  const handleLogout = async () => {
    const confirmLogout = confirm("로그아웃하시겠습니까?");
    if (!confirmLogout) {
      return;
    }

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      clearInfo();
      document.cookie =
        "prevUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push(`/spots?lat=${userLat}&lon=${userLon}`);
    } catch (error) {
      console.log("로그아웃 에러:", error);
    }
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
              pathname === "/admin/images" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("images")}
          >
            꿀팁 사진 관리
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
      <button className={styles.logoutButton} onClick={handleLogout}>
        로그아웃
      </button>
    </aside>
  );
};

export default SideBar;
