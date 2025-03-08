"use client";

import { GetBookmarkedSpotDto } from "@/application/usecases/user/dto/GetBookmarkedSpotDto";
import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import { useEffect, useState } from "react";
import styles from "./SpotsPage.module.scss";

const Spots = () => {
  const [bookmarkedSpotList, setBookmarkedSpotList] = useState<
    GetBookmarkedSpotDto[]
  >([]);

  useEffect(() => {
    const fetchBookmarkedSpots = async () => {
      try {
        const response = await fetch("/api/user/bookmarked-spots");
        const data = await response.json();

        setBookmarkedSpotList(data.bookmarkedSpotList);
      } catch (error) {
        console.error("Error fetching reacted tips:", error);
      }
    };

    fetchBookmarkedSpots();
  }, []);
  return (
    <div className={styles.spotsContainer}>
      {bookmarkedSpotList.length === 0 ? (
        <p className={styles.noSpotText}>저장한 장소가 없습니다.</p>
      ) : (
        bookmarkedSpotList.map((spot, index) => (
          <SpotImageCard
            key={index}
            imageSrc={spot.img}
            spotCategory={spot.category}
            spotName={spot.name}
          />
        ))
      )}
    </div>
  );
};

export default Spots;
