"use client";

import { GetTipDto } from "@/application/usecases/spot/tip/dto/GetTipDto";
import { ReactionDto } from "@/application/usecases/spot/tips/dto/ReactionDto";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./TipDetailPage.module.scss";

const TipDetailPage = () => {
  const { tipId } = useParams();
  const router = useRouter();
  const [tip, setTip] = useState<GetTipDto | null>(null);
  const [reaction, setReaction] = useState<ReactionDto | null>(null);

  const reactions: Record<number, { name: string; image: string }> = {
    1: { name: "유익하네요", image: "/images/reaction-type1.png" },
    2: { name: "가고싶어요", image: "/images/reaction-type2.png" },
    3: { name: "실망이에요", image: "/images/reaction-type3.png" },
    4: { name: "재미있어요", image: "/images/reaction-type4.png" },
  };

  useEffect(() => {
    if (!tipId) return;

    const fetchTip = async () => {
      try {
        const response = await fetch(`/api/admin/tips/${tipId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tip");
        }
        const data = await response.json();
        setTip(data.tip);
        setReaction(data.reaction);
      } catch (error) {
        console.error("❌ Error fetching tip or reaction:", error);
      }
    };

    fetchTip();
  }, [tipId]);

  const getReactionDetails = () => {
    if (!reaction || !reactions[reaction.type]) {
      return <p>등록한 반응이 없습니다</p>;
    }

    const reactionDetail = reactions[reaction.type];
    return (
      <>
        <p>{reactionDetail.name}</p>
        <Image
          src={reactionDetail.image}
          alt={reactionDetail.name}
          width={50}
          height={50}
        />
      </>
    );
  };

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
        <div className={styles.Container}>
          <div className={styles.contentsContainer}>
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
          </div>
          <div className={styles.imagesContainer}>
            <h2>이미지</h2>
            {tip.images.length > 0 ? (
              tip.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Tip Image ${index + 1}`}
                  width={500}
                  height={300}
                />
              ))
            ) : (
              <p>등록된 이미지가 없습니다</p>
            )}
          </div>
          <div className={styles.reaction}>
            <h2>사용자 반응</h2>
            {getReactionDetails()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TipDetailPage;
