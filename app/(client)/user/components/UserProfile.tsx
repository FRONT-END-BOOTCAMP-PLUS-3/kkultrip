"use client";

import Image from "next/image";
import styles from "./UserProfile.module.scss";

const UserProfile = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile}>
        <Image
          src="/images/test.png"
          fill
          alt="profile image"
          className={styles.profileImage}
        />
      </div>
      <div className={styles.nickname}>
        <span>고독한 미식가</span>
      </div>
    </div>
  );
};
export default UserProfile;
