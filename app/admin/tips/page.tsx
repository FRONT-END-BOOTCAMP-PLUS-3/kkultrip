"use client";

import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminTipsPage.module.scss";
import { Tip } from "@prisma/client";
import { useEffect, useState } from "react";
import TipTable from "../components/tipTable/TipTable";

const AdminTipsPage = () => {
  const [tips, setTips] = useState<(Tip & { spotName: string })[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/admin/tips");
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data: (Tip & { spotName: string })[] = await res.json();
        setTips(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
        <TipTable tips={tips} />
      </main>
    </div>
  );
};

export default AdminTipsPage;
