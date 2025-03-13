"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import TipTable from "../components/tipTable/TipTable";
import styles from "./AdminTipsPage.module.scss";
import { GetTipListDto } from "@/application/usecases/admin/tip/dto/GetTipListDto";
import SearchBar from "../components/searchBar/SearchBar";

const AdminTipsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [tips, setTips] = useState<(GetTipListDto & { spotName: string })[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch(`/api/admin/tips?page=${currentPage}&limit=10`);
        if (!res.ok) {
          throw new Error("Failed to fetch tips");
        }
        const data = await res.json();
        setTips(data.tips);
        setTotalPages(data.totalPages);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTips();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    router.push(`/admin/tips?page=${page}`);
  };

  const handleSearch = async (query: string, category: string) => {
    try {
      let url = "";

      if (category === "spot") {
        url = `/api/admin/tips/spot/search?spotName=${encodeURIComponent(
          query
        )}`;
      } else if (category === "user") {
        url = `/api/admin/tips/user/search?userName=${encodeURIComponent(
          query
        )}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      setTips(data.tips);
    } catch (error) {
      console.log(error);
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
        <SearchBar onSearch={handleSearch} options={["user", "spot"]} />
        <div className={styles.contentsContainer}>
          <TipTable tips={tips} />
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
    </div>
  );
};

const AdminTipsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminTipsPageContent />
    </Suspense>
  );
};

export default AdminTipsPage;
