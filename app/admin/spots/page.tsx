import { FaPlus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import UserTable from "../components/UserTable";
import styles from "./AdminSpotsPage.module.scss";
import { prisma } from "@/lib/prisma";

const AdminSpotsPage = async () => {
  const spots = await prisma.spot.findMany(); // Spot 테이블 조회
  console.log("Spot 데이터:", spots); // 콘솔에 데이터 출력

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

export default AdminSpotsPage;
