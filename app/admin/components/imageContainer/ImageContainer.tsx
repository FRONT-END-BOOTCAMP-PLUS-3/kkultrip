"use client";

import React from "react";
import styles from "./ImageContainer.module.scss";
import { Image } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ImageContainerProps {
  images: Image[];
}

const ImageContainer: React.FC<ImageContainerProps> = ({ images }) => {
  const router = useRouter();

  const handleImageClick = (tipId: number) => {
    router.push(`/admin/tips/${tipId}`);
  };

  return (
    <div className={styles.container}>
      {images.map((image) => (
        <div className={styles.imageCard} key={image.id}>
          <div
            className={styles.imageWrapper}
            onClick={() => handleImageClick(image.tipId)}
          >
            <img
              src={image.path!}
              alt={`Image ${image.id}`}
              className={styles.image}
            />
          </div>
          <div className={styles.imageDetails}>
            <p>
              <strong>꿀팁 ID:</strong> {image.tipId}
            </p>
            <p>
              <strong>생성 날짜:</strong>{" "}
              {new Date(image.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>이미지 경로:</strong> {image.path}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageContainer;
