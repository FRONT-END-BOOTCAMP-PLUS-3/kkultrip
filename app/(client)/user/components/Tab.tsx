"use client";

import { useState } from "react";
import styles from "./Tab.module.scss";
import Link from "next/link";

type TabProps = {
  tabs: { name: string; path: string }[];
};

const Tab = ({ tabs }: TabProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <Link href={tab.path} key={index} className={styles.tabLink}>
          <div
            className={activeTab === index ? styles.active : ""}
            onClick={() => handleTabClick(index)}
          >
            {tab.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Tab;
