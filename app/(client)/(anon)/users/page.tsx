"use client";

import { GetUserTipDto } from "@/application/usecases/users/dto/GetUserTipDto";
import Category from "@/components/category/Category";
import Loading from "@/components/loading/Loading";
import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "./UsersPage.module.scss";

const UserTipsFetcher = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nickname = searchParams.get("nickname") || "";
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
      const data = await response.json();
      setTipsData(data.tips);
    } catch {
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
              spot={{
                id: tip.spotId,
                img: tip.spotImg,
                category: tip.category,
                name: tip.spotName,
              }}
              navigateTo="tips"
              tipId={tip.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

const UsersPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <UserTipsFetcher />
    </Suspense>
  );
};

export default UsersPage;
