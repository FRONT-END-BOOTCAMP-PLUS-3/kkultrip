"use client";

import styles from "./Spottable.module.scss";
import { Tip } from "@prisma/client";

const Tiptable = ({ spots }: SpotTableProps) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {(
            [
              "id",
              "name",
              "address",
              "phone",
              "category",
              "avgPrice",
            ] as SortKey[]
          ).map((key) => (
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
                : key === "phone"
                ? "전화번호"
                : key === "category"
                ? "카테고리"
                : "정보"}
            </th>
          ))}
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
              <td>{spot.phone}</td>
              <td>{spot.category}</td>
              <td>{spot.info}</td>
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

export default Tiptable;
