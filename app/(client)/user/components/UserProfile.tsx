"use client";

import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./UserProfile.module.scss";
import { FaCamera } from "react-icons/fa";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState("");
  const [img, setImg] = useState("");

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

  const handleEditToggle = () => {
    setIsEdit((prev) => !prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <Image
          src={img}
          fill
          alt="profile image"
          className={styles.profileImage}
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
