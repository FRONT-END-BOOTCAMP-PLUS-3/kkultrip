"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Category from "@/components/category/Category";
import Image from "next/image";
import styles from "./UsersPage.module.scss";
import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import { GetUserTipDto } from "@/application/usecases/users/dto/GetUserTipDto";

const UsersPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nickname = searchParams.get("nickname");
  const sort = (searchParams.get("sort") as "latest" | "popular") || "latest";

  const [tipsData, setTipsData] = useState<GetUserTipDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [filteredTips, setFilteredTips] = useState<GetUserTipDto[]>([]);

  const fetchUserTips = async (
    nickname: string,
    sort: "latest" | "popular"
  ) => {
    if (!nickname) return;

    try {
      const response = await fetch(
        `/api/users?nickname=${nickname}&sort=${sort}`
      );
      if (!response.ok) throw new Error("Failed to fetch tips");

      const data = await response.json();
      setTipsData(data.tips);
    } catch (error) {
      setTipsData([]);
    }
  };

  useEffect(() => {
    if (!nickname) return;
    fetchUserTips(nickname, sort);
  }, [nickname, sort]);

  useEffect(() => {
    if (selectedCategory === "전체") {
      setFilteredTips(tipsData);
    } else {
      setFilteredTips(
        tipsData.filter((tip) => tip.category === selectedCategory)
      );
    }
  }, [selectedCategory, tipsData]);

  const handleSortChange = (newSort: "latest" | "popular") => {
    router.push(`/users?nickname=${nickname}&sort=${newSort}`);
  };

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
          <p className={styles.name}>{nickname}</p>
          <p className={styles.tipCount}>
            꿀팁 수 <span>{tipsData.length}</span>개
          </p>
        </div>
      </div>
      <ul className={styles.sortWrapper}>
        <li>
          <button
            className={`${styles.sortButton} ${
              sort === "latest" ? styles.active : ""
            }`}
            onClick={() => handleSortChange("latest")}
          >
            • 최신순
          </button>
        </li>
        <li>
          <button
            className={`${styles.sortButton} ${
              sort === "popular" ? styles.active : ""
            }`}
            onClick={() => handleSortChange("popular")}
          >
            • 반응순
          </button>
        </li>
      </ul>
      <div className={styles.categoryWrapper}>
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <div className={styles.tipsWrapper}>
        {filteredTips.length === 0 ? (
          <p className={styles.noTipText}>작성된 꿀팁이 없습니다.</p>
        ) : (
          filteredTips.map((tip) => (
            <SpotImageCard
              key={tip.id}
              imageSrc={tip.spotImg}
              spotCategory={tip.category}
              spotName={tip.spotName}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UsersPage;
