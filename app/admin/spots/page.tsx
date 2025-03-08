"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 추가
import { FaPlus } from "react-icons/fa";
import styles from "./AdminSpotsPage.module.scss";
import { Spot } from "@prisma/client";
import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import SpotTable from "../components/spotTable/SpotTable";

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
      <SideBar />
      <main className={styles.main}>
        <Header title="명소 관리" />
        <SpotTable spots={spots} />
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
