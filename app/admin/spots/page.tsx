"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserTable from "../components/UserTable";
import styles from "./AdminSpotsPage.module.scss";

const AdminSpotsPage = () => {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/admin/spots");
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data = await res.json();
        setSpots(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpots();
  }, []);

  console.log("Spot 데이터:", spots);

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="명소 관리" />
        <UserTable />
        <button className={styles.addButton}>
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default AdminSpotsPage;
