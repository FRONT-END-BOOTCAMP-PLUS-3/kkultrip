"use client";

import { GetUserDto } from "@/application/usecases/admin/user/dto/GetUserDto";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./UserDetailPage.module.scss";
import Image from "next/image";

const UserDetailPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<GetUserDto | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data: GetUserDto = await response.json();
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.push("/admin/users")}
      >
        뒤로가기
      </button>
      <h1 className={styles.title}>User 상세 정보</h1>
      {user && (
        <div className={styles.container}>
          <div className={styles.contentsContainer}>
            <p className={styles.detail}>ID: {user.id}</p>
            <p className={styles.detail}>닉네임: {user.nickname}</p>
            <p className={styles.detail}>이메일: {user.email}</p>
            <p className={styles.detail}>
              관리자: {user.isAdmin ? "네" : "아니오"}
            </p>
            <p className={styles.detail}>
              생성일: {new Date(user.createdAt).toLocaleString()}
            </p>
            <p className={styles.detail}>
              수정일: {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className={styles.imagesContainer}>
            <h2>프로필 이미지</h2>
            <Image
              src={user.img}
              alt="User Profile Image"
              width={400}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
