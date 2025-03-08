"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import Spottable from "../components/spotTable/SpotTable";
import styles from "./AdminSpotsPage.module.scss";
import { Spot } from "@prisma/client";

const AdminSpotsPage = () => {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch(`/api/admin/spots?page=${currentPage}`);
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data = await res.json();
        setSpots(data.spots);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpots();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="명소 관리" />
        <Spottable spots={spots} />
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
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
