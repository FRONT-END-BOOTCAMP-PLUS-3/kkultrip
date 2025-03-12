import React from "react";
import styles from "./ImageContainer.module.scss";
import { Image as PrismaImage } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

interface ImageContainerProps {
  images: (PrismaImage & { nickname: string; spotName: string })[];
}

const ImageContainer: React.FC<ImageContainerProps> = ({ images }) => {
  const router = useRouter();

  const handleImageClick = (tipId: number) => {
    router.push(`/admin/tips/${tipId}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/images/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.log("Error deleting user:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
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

            <div
              className={styles.closeIcon}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image.id);
              }}
            >
              <AiOutlineClose size={24} color="#fff" />
            </div>
          </div>
          <div className={styles.imageDetails}>
            <p>
              <strong>작성자:</strong> {image.nickname}
            </p>
            <p>
              <strong>명소 이름:</strong> {image.spotName}
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
