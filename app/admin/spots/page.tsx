"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import SpotTable from "../components/spotTable/SpotTable";
import styles from "./AdminSpotsPage.module.scss";
import { Spot } from "@prisma/client";
import SearchBar from "../components/searchBar/SearchBar";

const AdminSpotsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl);
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
        console.log(error);
      }
    };

    fetchSpots();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    router.push(`/admin/spots?page=${page}`);
  };

  const handleSearch = async (query: string, category: string) => {
    try {
      let url = "";

      if (category === "spot") {
        url = `/api/admin/spots/spot/search?spotName=${encodeURIComponent(
          query
        )}`;
      } else if (category === "address") {
        url = `/api/admin/spots/address/search?address=${encodeURIComponent(
          query
        )}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      setSpots(data.spots);
    } catch (error) {
      console.log(error);
      alert("검색 결과가 없습니다.");
    }
  };
  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="명소 관리" />
        <SearchBar onSearch={handleSearch} options={["spot", "address"]} />
        <div className={styles.contentsContainer}>
          <SpotTable spots={spots} />
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? styles.active : ""}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </div>
      </main>
      <button
        className={styles.addButton}
        onClick={() => router.push("/admin/spots/create")}
      >
        <FaPlus />
      </button>
    </div>
  );
};

const AdminSpotsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminSpotsPageContent />
    </Suspense>
  );
};

export default AdminSpotsPage;
