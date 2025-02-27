"use client";

import Category from "@/components/category/Category";
import Image from "next/image";
import styles from "./Users.module.scss";
import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import { useState } from "react";

const UsersPage = () => {
  const [selectedSort, setSelectedSort] = useState("latest");
  const tipsData = [
    {
      id: 1,
      imageSrc: "/images/test.png",
      category: "음식점",
      name: "테스트중입니다.테스트중입니다.테스트중입니다.",
    },
    {
      id: 6,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 7,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 4,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 9,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 15,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 16,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 78,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 46,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 44,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      id: 59,
      imageSrc: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
  ];

  return (
    <div className={styles.usersContainer}>
      <div className={styles.profileWrapper}>
        <div className={styles.profile}>
          <Image
            src="/images/test.png"
            fill
            alt="profile image"
            className={styles.profileImage}
          />
        </div>
        <div className={styles.nickname}>
          <p className={styles.name}>고독한 미식가</p>
          <p className={styles.tipCount}>
            꿀팁 수 <span>3</span>개
          </p>
        </div>
      </div>
      <ul className={styles.sortWrapper}>
        <li>
          <button
            className={`${styles.sortButton} ${
              selectedSort === "latest" ? styles.active : ""
            }`}
            onClick={() => setSelectedSort("latest")}
          >
            • 최신순
          </button>
        </li>
        <li>
          <button
            className={`${styles.sortButton} ${
              selectedSort === "reaction" ? styles.active : ""
            }`}
            onClick={() => setSelectedSort("reaction")}
          >
            • 반응순
          </button>
        </li>
      </ul>
      <div className={styles.categoryWrapper}>
        <Category />
      </div>
      <div className={styles.tipsWrapper}>
        {tipsData.map((tip) => (
          <SpotImageCard
            key={tip.id}
            imageSrc={tip.imageSrc}
            spotCategory={tip.category}
            spotName={tip.name}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
