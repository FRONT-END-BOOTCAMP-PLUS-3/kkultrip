"use client";

import UserProfile from "./components/UserProfile";
import styles from "./UserLayout.module.scss";
import Tab from "./components/Tab";
import { usePathname } from "next/navigation";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const tabs = [
    { name: "나의 꿀팁", path: "/user/my-tips" },
    { name: "관심 명소", path: "/user/spots" },
    { name: "관심 꿀팁", path: "/user/tips" },
  ];

  return (
    <div className={styles.userContainer}>
      <UserProfile />
      <Tab tabs={tabs} pathname={pathname} />
      {children}
    </div>
  );
};

export default UserLayout;
