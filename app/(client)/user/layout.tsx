"use client";

import Image from "next/image";
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
      <div className={styles.profile}>
        <Image
          src="/images/test.png"
          fill
          alt="profile image"
          className={styles.profileImage}
        />
      </div>
      <div className={styles.nickname}>
        <span>고독한 미식가</span>
      </div>
      <Tab tabs={tabs} pathname={pathname} />
      {children}
    </div>
  );
};

export default UserLayout;
