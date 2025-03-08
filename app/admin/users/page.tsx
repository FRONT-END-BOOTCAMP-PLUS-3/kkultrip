"use client";

import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminUsersPage.module.scss";
import { Tip } from "@prisma/client";
import { useEffect, useState } from "react";
import UserTable from "../components/userTable/UserTable";

const AdminUsersPage = () => {
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
        console.error(error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
        <UserTable tips={tips} />
      </main>
    </div>
  );
};

export default AdminUsersPage;
