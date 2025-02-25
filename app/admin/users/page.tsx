import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import UserTable from "../components/SpotTable/SpotTable";
import styles from "./AdminUsersPage.module.scss";

const AdminUsersPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="유저 관리" />
        <UserTable />
        <button className={styles.addButton}>
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default AdminUsersPage;
