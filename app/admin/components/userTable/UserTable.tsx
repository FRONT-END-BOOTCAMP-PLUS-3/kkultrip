"use client";

import { GetUserListDto } from "@/application/usecases/admin/user/dto/GetUserListDto";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserTable.module.scss";

interface UserTableProps {
  users: GetUserListDto[];
}

type SortKey =
  | "id"
  | "nickname"
  | "email"
  | "isAdmin"
  | "createdAt"
  | "updatedAt";
type SortOrder = "asc" | "desc";

const UserTable = ({ users = [] }: UserTableProps) => {
  // Default value for users
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortKey] || "";
    const bValue = b[sortKey] || "";

    return typeof aValue === "boolean" && typeof bValue === "boolean"
      ? sortOrder === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue)
      : typeof aValue === "number" && typeof bValue === "number"
      ? sortOrder === "asc"
        ? aValue - bValue
        : bValue - aValue
      : sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {(
            [
              "id",
              "nickname",
              "email",
              "isAdmin",
              "createdAt",
              "updatedAt",
            ] as SortKey[]
          ).map((key) => (
            <th
              key={key}
              onClick={() => handleSort(key)}
              className={sortKey === key ? styles.sorted : ""}
            >
              {key === "id"
                ? "ID"
                : key === "nickname"
                ? "닉네임"
                : key === "email"
                ? "이메일"
                : key === "isAdmin"
                ? "관리자 여부"
                : key === "createdAt"
                ? "생성 날짜"
                : "수정 날짜"}
            </th>
          ))}
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              className={styles.tableRow}
            >
              <td>{user.id}</td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "관리자" : "유저"}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className={styles.noData}>
              데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
