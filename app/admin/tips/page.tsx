import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import styles from "./AdminTipsPage.module.scss";

const AdminTipsPage = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <Header title="꿀팁 관리" />
        <button className={styles.addButton}>
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default AdminTipsPage;
