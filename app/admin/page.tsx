import { FaPlus } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UserTable from "./components/UserTable";
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
