"use client";

import { GetBookmarkedSpotDto } from "@/application/usecases/user/dto/GetBookmarkedSpotDto";
import Loading from "@/components/loading/Loading";
import SpotImageCard from "@/components/spotImageCard/SpotImageCard";
import { useEffect, useState } from "react";
import styles from "./BookmarkedSpotsPage.module.scss";

const BookMarkedSpots = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedSpots();
  }, []);

  if (isLoading) {
    return <Loading size={45} color={"#fdbb09"} />;
  }

  return (
    <div className={styles.spotsContainer}>
      {bookmarkedSpotList.length === 0 ? (
        <p className={styles.noSpotText}>저장한 장소가 없습니다.</p>
      ) : (
        bookmarkedSpotList.map((spot) => (
          <SpotImageCard key={spot.id} spot={spot} navigateTo="info" />
        ))
      )}
    </div>
  );
};

export default BookMarkedSpots;
