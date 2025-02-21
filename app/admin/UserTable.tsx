import styles from "./UserTable.module.scss";

const UserTable = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>번호</th>
          <th>아이디</th>
          <th>닉네임</th>
          <th>가입일</th>
          <th>수정일</th>
          <th>등록꿀팁</th>
        </tr>
      </thead>
      <tbody>{/* 유저 데이터가 들어갈 자리 */}</tbody>
    </table>
  );
};

export default UserTable;
