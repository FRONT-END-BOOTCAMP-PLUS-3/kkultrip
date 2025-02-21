import { FaPlus } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";
import UserTable from "./UserTable";
import styles from "./AdminPage.module.scss";

const AdminPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="명소 관리" />
        <UserTable />
        <button className={styles.addButton}>
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default AdminPage;
