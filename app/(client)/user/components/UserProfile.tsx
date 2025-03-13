"use client";

import Image from "next/image";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import styles from "./UserProfile.module.scss";
import useUserStore from "@/store/useUserStore";

const UserProfile = () => {
  const { nickname, img, setNickname, setImg } = useUserStore();

  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [prevNickname, setPrevNickname] = useState(nickname);
  const [, setPrevImg] = useState(img);

  const handleEditToggle = async () => {
    if (isEdit) {
      try {
        const formData = new FormData();
        if (prevNickname) {
          formData.append("nickname", prevNickname as string);
        }
        if (file) formData.append("file", file);
        const response = await fetch("/api/user", {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) throw new Error("프로필 수정 실패");

        const updatedData = await response.json();

        setNickname(updatedData.user.nickname);
        setImg(updatedData.user.img);
      } catch (error) {
        console.error("프로필 수정 오류:", error);
      }
    } else {
      setPrevNickname(nickname);
      setPrevImg(img);
    }
    setIsEdit((prev) => !prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrevImg(URL.createObjectURL(file));
      setFile(file);
    }
  };

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
            value={prevNickname as string}
            onChange={(e) => setPrevNickname(e.target.value)}
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
