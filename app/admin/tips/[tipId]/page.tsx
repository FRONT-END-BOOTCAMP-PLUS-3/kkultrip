"use client";

import { GetTipDto } from "@/application/usecases/spot/tip/dto/GetTipDto";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./TipDetailPage.module.scss";

const TipDetailPage = () => {
  const { tipId } = useParams();
  const router = useRouter();
  const [tip, setTip] = useState<GetTipDto | null>(null);

  useEffect(() => {
    console.log("tipId:", tipId); // 추가된 로그

    if (!tipId) return;

    const fetchTip = async () => {
      try {
        const response = await fetch(`/api/admin/tips/${tipId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tip");
        }
        const tipData: GetTipDto = await response.json();
        console.log(tipData);
        setTip(tipData);
      } catch (error) {
        console.error("❌ Error fetching tip:", error);
      }
    };

    fetchTip();
  }, [tipId]);

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.push("/admin/tips")}
      >
        뒤로가기
      </button>
      <h1 className={styles.title}>Tip 상세 정보</h1>
      {tip && (
        <div className={styles.content}>
          <p className={styles.detail}>ID: {tip.id}</p>
          <p className={styles.detail}>명소 ID: {tip.spotId}</p>
          <p className={styles.detail}>사용자 ID: {tip.userId}</p>
          <p className={styles.detail}>설명: {tip.description}</p>
          <p className={styles.detail}>가격: {tip.price}</p>
          <p className={styles.detail}>대기 시간: {tip.waitingTime}</p>
          <p className={styles.detail}>신고 횟수: {tip.reportCnt}</p>
          <p className={styles.detail}>
            생성일: {new Date(tip.createdAt).toLocaleString()}
          </p>
          <p className={styles.detail}>
            수정일: {new Date(tip.updatedAt).toLocaleString()}
          </p>
          <div className={styles.images}>
            <h2>이미지</h2>
            {tip.images.map((image, index) => (
              <img key={index} src={image} alt={`Tip Image ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TipDetailPage;