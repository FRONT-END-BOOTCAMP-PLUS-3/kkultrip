"use client";

import SideBar from "../components/sideBar/SideBar";
import Header from "../components/header/Header";
import styles from "./AdminUsersPage.module.scss";
import { GetUserListDto } from "@/application/usecases/admin/user/dto/GetUserListDto";
import { useEffect, useState } from "react";
import UserTable from "../components/userTable/UserTable";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<GetUserListDto[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: GetUserListDto[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <SideBar />
      <main className={styles.main}>
        <Header title="유저 관리" />
        <UserTable users={users} />
      </main>
    </div>
  );
};

export default AdminUsersPage;
