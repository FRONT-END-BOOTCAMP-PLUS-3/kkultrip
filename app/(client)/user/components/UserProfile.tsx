"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./UserProfile.module.scss";
import useUserStore from "@/store/useUserStore";
import { FaCamera } from "react-icons/fa";

const UserProfile = () => {
  const { img, nickname } = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname as string);
  const [newImg, setNewImg] = useState(img as string);

  const handleEditToggle = () => {
    setIsEdit((prev) => !prev);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImg(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <Image
          src={newImg}
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
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
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
