"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 추가
import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import Spottable from "../components/spottable/Spottable";
import styles from "./AdminSpotsPage.module.scss";
import { Spot } from "@prisma/client";

const AdminSpotsPage = () => {
  const router = useRouter(); // 추가
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/admin/spots");
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data: Spot[] = await res.json();
        setSpots(data);
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
        <Header title="명소 관리" />
        <Spottable spots={spots} />
        <button
          className={styles.addButton}
          onClick={() => router.push("/admin/spots/create")}
        >
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default AdminSpotsPage;
