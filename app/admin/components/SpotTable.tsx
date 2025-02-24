import { useRouter } from "next/navigation";
import styles from "./SpotTable.module.scss";
import { Spot } from "@prisma/client";

interface SpotTableProps {
  spots: Spot[];
}

const SpotTable = ({ spots }: SpotTableProps) => {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/admin/spots/${id}/edit`);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>번호</th>
          <th>이름</th>
          <th>주소</th>
          <th>카테고리</th>
          <th>평균가격</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {spots.length > 0 ? (
          spots.map((spot, index) => (
            <tr key={spot.id}>
              <td>{index + 1}</td>
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
