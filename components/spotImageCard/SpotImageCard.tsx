"use client";

import React from "react";
import Image from "next/image";
import styles from "./SpotImageCard.module.scss";
import { useRouter } from "next/navigation";

type SpotImageCardProps = {
  spot: {
    id: number;
    img: string;
    category: string;
    name: string;
  };
  navigateTo: "info" | "tips";
  tipId?: number;
};

const SpotImageCard = ({ spot, navigateTo, tipId }: SpotImageCardProps) => {
  const router = useRouter();

  const handleImageClick = () => {
    if (navigateTo === "info") {
      router.push(`/spots/${spot.id}/info`);
    } else if (navigateTo === "tips" && tipId) {
      router.push(`/spots/${spot.id}/tips?sort=latest#${tipId}`);
    }
  };

  return (
    <div className={styles.spotImageCardContainer} onClick={handleImageClick}>
      <div className={styles.imageBox}>
        <Image
          src={spot.img}
          alt={spot.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="10rem"
          priority
        />
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.spotCategory}>{spot.category}</p>
        <p className={styles.spotName}>{spot.name}</p>
      </div>
    </div>
  );
};

export default SpotImageCard;
