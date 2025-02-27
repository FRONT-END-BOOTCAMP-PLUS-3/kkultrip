"use client";

import React from "react";
import Image from "next/image";
import styles from "./SpotImageCard.module.scss";

type SpotImageCardProps = {
  imageSrc: string;
  spotCategory: string;
  spotName: string;
};

const SpotImageCard = ({
  imageSrc,
  spotCategory,
  spotName,
}: SpotImageCardProps) => {
  return (
    <div className={styles.spotImageCardContainer}>
      <div className={styles.imageBox}>
        <Image
          src={imageSrc}
          alt="spot image"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.spotCategory}>{spotCategory}</p>
        <p className={styles.spotName}>{spotName}</p>
      </div>
    </div>
  );
};

export default SpotImageCard;
