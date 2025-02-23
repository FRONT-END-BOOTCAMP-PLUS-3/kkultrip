import styles from "./UserTable.module.scss";
import { Spot } from "@/domain/entities/Spot";

interface UserTableProps {
  spots: Spot[];
}

const UserTable = ({ spots }: UserTableProps) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>번호</th>
          <th>이름</th>
          <th>주소</th>
          <th>카테고리</th>
          <th>평균가격</th>
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
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className={styles.noData}>
              데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
