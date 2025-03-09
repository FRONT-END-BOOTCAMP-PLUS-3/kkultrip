"use client";

import Image from "next/image";
import styles from "./UserProfile.module.scss";
import useUserStore from "@/store/useUserStore";

const UserProfile = () => {
  const { img, nickname } = useUserStore();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <Image
          src={img || "/images/default.png"}
          fill
          alt="profile image"
          className={styles.profileImage}
        />
      </div>
      <div className={styles.nickname}>
        <span>{nickname}</span>
      </div>
    </div>
  );
};
export default UserProfile;
