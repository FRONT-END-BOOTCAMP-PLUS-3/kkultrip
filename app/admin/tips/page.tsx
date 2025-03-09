"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams 추가
import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import TipTable from "../components/tipTable/TipTable";
import styles from "./AdminTipsPage.module.scss";
import { Tip } from "@prisma/client";

const AdminTipsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10); // URL에서 현재 페이지를 가져옴
  const [tips, setTips] = useState<(Tip & { spotName: string })[]>([]);
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
        setTips(data.tips); // 서버에서 받은 데이터를 state에 저장
        setTotalPages(data.totalPages); // 총 페이지 수
      } catch (error) {
        console.log(error);
      }
    };

    fetchTips();
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옴

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // 유효한 페이지 범위 체크
    setCurrentPage(page); // 페이지 변경

    // 페이지 번호를 URL에 반영
    router.push(`/admin/tips?page=${page}`);
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
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

export default AdminTipsPage;
