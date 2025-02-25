"use client";

import Link from "next/link";
import styles from "./Tab.module.scss";

type TabProps = {
  tabs: { name: string; path: string }[];
  pathname: string;
};

const Tab = ({ tabs, pathname }: TabProps) => {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <Link href={tab.path} key={index} className={styles.tabLink}>
          <div className={pathname === tab.path ? styles.active : ""}>
            {tab.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tab;
