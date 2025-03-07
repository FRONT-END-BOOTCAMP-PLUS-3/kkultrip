"use client";

import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import styles from "./SpotsPage.module.scss";

const Spots = () => {
  const spotsData = [
    {
      img: "/images/test.png",
      category: "음식점",
      name: "테스트중입니다.테스트중입니다.테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
    {
      img: "/images/test.png",
      category: "카페",
      name: "테스트중입니다.",
    },
  ];
  return (
    <div className={styles.spotsContainer}>
      {spotsData.map((spot, index) => (
        <SpotImageCard
          key={index}
          imageSrc={spot.img}
          spotCategory={spot.category}
          spotName={spot.name}
        />
      ))}
    </div>
  );
};

export default Spots;
