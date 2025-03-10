"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminUsersPage.module.scss";
import { GetUserListDto } from "@/application/usecases/admin/user/dto/GetUserListDto";
import UserTable from "../components/userTable/UserTable";
import SearchBar from "../components/searchBar/SearchBar";

const AdminUsersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10); // URL에서 현재 페이지를 가져옴
  const [users, setUsers] = useState<GetUserListDto[]>([]);
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/admin/users?page=${currentPage}&limit=10`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data.users);

        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 다시 가져옴

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // 유효한 페이지 범위 체크
    setCurrentPage(page); // 페이지 변경

    // 페이지 번호를 URL에 반영
    router.push(`/admin/users?page=${page}`);
  };

  const handleSearch = async (query: string, category: string) => {
    try {
      let url = "";

      url = `/api/admin/users/user/search?userName=${encodeURIComponent(
        query
      )}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await res.json();
      // 데이터를 배열 형태로 처리
      setUsers(data.usera);
    } catch (error) {
      console.log(error);
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="유저 관리" />
        <SearchBar onSearch={handleSearch} />
        <div className={styles.contentsContainer}>
          <UserTable users={users} />
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

export default AdminUsersPage;
