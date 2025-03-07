"use client";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import styles from "./AdminTipsPage.module.scss";
import { Tip } from "@prisma/client";
import { useEffect, useState } from "react";
import Tiptable from "../components/tiptable/Tiptable";

const AdminTipsPage = () => {
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/admin/tips");
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data: Tip[] = await res.json();
        setTips(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
        <Tiptable tips={tips} />
      </main>
    </div>
  );
};

export default AdminTipsPage;
