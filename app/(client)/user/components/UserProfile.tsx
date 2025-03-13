"use client";

import Loading from "@/components/loading/Loading";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import styles from "./UserProfile.module.scss";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("사용자 정보를 불러올 수 없습니다.");

        const data = await response.json();
        setNickname(data.user.nickname);
        setImg(data.user.img);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditToggle = async () => {
    if (isEdit) {
      try {
        const formData = new FormData();
        formData.append("nickname", nickname);
        if (file) formData.append("file", file);
        const response = await fetch("/api/user", {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) throw new Error("프로필 수정 실패");

        const updatedData = await response.json();
        setImg(updatedData.user.img);
      } catch (error) {
        console.error("프로필 수정 오류:", error);
      }
    }
    setIsEdit((prev) => !prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
      setFile(file);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVICE_URL}${img}`}
          fill
          alt="profile image"
          sizes="10rem"
          className={styles.profileImage}
          priority
          unoptimized
        />
        {isEdit && (
          <>
            <label htmlFor="profileUpload" className={styles.cameraButton}>
              <FaCamera size={20} color="white" />
            </label>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className={styles.uploadInput}
              onChange={handleImageChange}
            />
          </>
        )}
      </div>

      <div className={styles.nickname}>
        {isEdit ? (
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.nicknameInput}
          />
        ) : (
          <span>{nickname}</span>
        )}
        <button className={styles.editButton} onClick={handleEditToggle}>
          {isEdit ? "저장" : "수정"}
        </button>
      </div>
    </div>
  );
};
export default UserProfile;
