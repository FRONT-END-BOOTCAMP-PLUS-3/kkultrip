"use client";

import { Tip } from "@prisma/client";
import { useState } from "react";
import styles from "./TipTable.module.scss";

interface TipTableProps {
  tips: (Tip & { spotName: string })[];
}

type SortKey =
  | "id"
  | "spotId"
  | "spotName"
  | "userId"
  | "description"
  | "price"
  | "waitingTime"
  | "reportCnt"
  | "createdAt"
  | "updatedAt";
type SortOrder = "asc" | "desc";

const TipTable = ({ tips }: TipTableProps) => {
  // const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const sortedTips = [...tips].sort((a, b) => {
    const aValue = a[sortKey] || "";
    const bValue = b[sortKey] || "";

    return typeof aValue === "number" && typeof bValue === "number"
      ? sortOrder === "asc"
        ? aValue - bValue
        : bValue - aValue
      : sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch("/api/admin/tips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting tip:", error);
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
              "spotId",
              "spotName",
              "userId",
              "description",
              "price",
              "waitingTime",
              "reportCnt",
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
                ? "번호"
                : key === "spotId"
                ? "명소 ID"
                : key === "spotName"
                ? "명소 이름"
                : key === "userId"
                ? "사용자 ID"
                : key === "description"
                ? "설명"
                : key === "price"
                ? "가격"
                : key === "waitingTime"
                ? "대기 시간"
                : key === "reportCnt"
                ? "신고 횟수"
                : key === "createdAt"
                ? "생성 날짜"
                : "수정 날짜"}
            </th>
          ))}
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {sortedTips.length > 0 ? (
          sortedTips.map((tip) => (
            <tr key={tip.id}>
              <td>{tip.id}</td>
              <td>{tip.spotId}</td>
              <td>{tip.spotName}</td>
              <td>{tip.userId}</td>
              <td>{tip.description}</td>
              <td>{tip.price}</td>
              <td>{tip.waitingTime}</td>
              <td>{tip.reportCnt}</td>
              <td>{new Date(tip.createdAt).toLocaleDateString()}</td>
              <td>{new Date(tip.updatedAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(tip.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className={styles.noData}>
              데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TipTable;
