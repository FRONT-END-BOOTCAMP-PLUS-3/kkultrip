"use client";

import { useState, useRef } from "react";
import styles from "./DraggableBottomSheet.module.scss";
import { FaRegBookmark } from "react-icons/fa";
import { GiClothJar } from "react-icons/gi";
import { FaWonSign } from "react-icons/fa6";
import Link from "next/link";
import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";

const DraggableBottomSheet = ({ spots }: { spots: GetSpotsDTO[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY;
    setTranslateY(Math.max(0, deltaY));
  };

  const handleTouchEnd = () => {
    if (translateY > 100) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
    setTranslateY(0);
  };

  return (
    <div
      ref={sheetRef}
      className={`${styles.bottomSheet} ${isOpen ? styles.open : ""}`}
      style={{ transform: `translateY(${isOpen ? "0" : "80%"} )` }}
    >
      {/* 드래그 핸들 */}
      <div
        className={styles.wrapHandle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.handle}></div>
      </div>

      {/* 🔹 명소 정보가 없을 경우 메시지 표시 */}
      {Array.isArray(spots) && spots.length === 0 ? (
        <div className={styles.noSpots}>
          <p>주변에 명소 정보가 없습니다.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {spots.map((spot) => (
            <div key={spot.id} className={styles.spotItem}>
              <div className={styles.info}>
                <div className={styles.top}>
                  <Link href={`/spots/${spot.id}`} className={styles.name}>
                    {spot.name}
                  </Link>
                  <p className={styles.category}>{spot.category}</p>
                </div>
                <div className={styles["distance-time"]}>
                  <p className={styles.distance}>120m</p>
                  <p className={styles.time}>
                    {spot.time || "운영 시간 정보 없음"}
                  </p>
                </div>

                {/* 가격 & 북마크 & 방문자 수 */}
                <div className={styles.details}>
                  <span className={styles.bookmark}>
                    <FaRegBookmark className={styles.icon} />{" "}
                    {spot.bookmarkCnt || 0}
                  </span>
                  <span className={styles.visitors}>
                    <GiClothJar className={styles.icon} /> {spot.tipCnt || 0}
                  </span>
                  <span className={styles.price}>
                    <FaWonSign />{" "}
                    {spot.avgPrice?.toLocaleString() || "정보 없음"}원
                  </span>
                </div>
              </div>
              <Link href={`/spots/${spot.id}`} className={styles.image}>
                <img src={spot.img} alt={spot.name} className={styles.image} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableBottomSheet;
