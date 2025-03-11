import React from "react";
import styles from "./ImageContainer.module.scss";
import { Image as PrismaImage } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai"; // Importing the X (close) icon

interface ImageContainerProps {
  images: (PrismaImage & { nickname: string; spotName: string })[];
}

const ImageContainer: React.FC<ImageContainerProps> = ({ images }) => {
  const router = useRouter();

  const handleImageClick = (tipId: number) => {
    router.push(`/admin/tips/${tipId}`);
  };

  const handleClose = (tipId: number) => {
    console.log(`Close image with tipId: ${tipId}`);
    // Add your image close/remove logic here
  };

  return (
    <div className={styles.container}>
      {images.map((image) => (
        <div className={styles.imageCard} key={image.id}>
          <div
            className={styles.imageWrapper}
            onClick={() => handleImageClick(image.tipId)}
          >
            <Image
              src={image.path!}
              alt={`Image ${image.id}`}
              className={styles.image}
              width={500}
              height={300}
            />
            {/* Close (X) Icon in the top-right corner */}
            <div
              className={styles.closeIcon}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the image click handler from firing
                handleClose(image.tipId);
              }}
            >
              <AiOutlineClose size={24} color="#fff" />
            </div>
          </div>
          <div className={styles.imageDetails}>
            <p>
              <strong>작성자:</strong> {image.nickname} {/* 작성자 이름 */}
            </p>
            <p>
              <strong>명소 이름:</strong> {image.spotName} {/* 명소 이름 */}
            </p>
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
