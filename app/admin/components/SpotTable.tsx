import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SpotTable.module.scss";
import { Spot } from "@prisma/client";

interface SpotTableProps {
  spots: Spot[];
}

type SortKey = "id" | "name" | "address" | "category" | "avgPrice";
type SortOrder = "asc" | "desc";

const SpotTable = ({ spots }: SpotTableProps) => {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const sortedSpots = [...spots].sort((a, b) => {
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

  const handleEdit = (id: string) => router.push(`/admin/spots/${id}/edit`);

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch("/api/admin/spots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting spot:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {(["id", "name", "address", "category", "avgPrice"] as SortKey[]).map(
            (key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className={sortKey === key ? styles.sorted : ""}
              >
                {key === "id"
                  ? "번호"
                  : key === "name"
                  ? "이름"
                  : key === "address"
                  ? "주소"
                  : key === "category"
                  ? "카테고리"
                  : "평균가격"}
              </th>
            )
          )}
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {sortedSpots.length > 0 ? (
          sortedSpots.map((spot) => (
            <tr key={spot.id}>
              <td>{spot.id}</td>
              <td>{spot.name}</td>
              <td>{spot.address}</td>
              <td>{spot.category}</td>
              <td>
                {spot.avgPrice
                  ? `${spot.avgPrice.toLocaleString()}원`
                  : "정보 없음"}
              </td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(spot.id.toString())}
                >
                  수정
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(spot.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className={styles.noData}>
              데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SpotTable;
