"use client";

import Image from "next/image";
import styles from "./TipBox.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { GetMyTipDto } from "@/application/usecases/user/dto/GetMyTipDto";

type TipBoxProps = {
  tip: GetMyTipDto;
};

const TipBox = ({ tip }: TipBoxProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const reactions = [
    {
      src: "/images/reaction-type1.png",
      alt: "유익하네요",
      count: tip.tipReaction.useful,
    },
    {
      src: "/images/reaction-type2.png",
      alt: "가고싶어요",
      count: tip.tipReaction.wantToGo,
    },
    {
      src: "/images/reaction-type3.png",
      alt: "실망이에요",
      count: tip.tipReaction.disappointing,
    },
    {
      src: "/images/reaction-type4.png",
      alt: "재미있어요",
      count: tip.tipReaction.interesting,
    },
  ];

  const handleTipEditButtonClick = () => {
    router.push(`/spots/${tip.spotId}/tips/${tip.id}/edit`);
  };

  const handleTipDeleteButtonClick = async () => {
    try {
      const response = await fetch(`/api/tips/${tip.id}`, {
        method: "DELETE",
        body: JSON.stringify({ spotId: tip.spotId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete the tip");
      }

      alert("꿀팁이 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.log("팁 삭제 에러:", error);
    }
  };

  return (
    <div className={styles.tipBoxContainer}>
      <h3 className={styles.srOnly}>{tip.spotName} 꿀팁</h3>
      <div className={styles.tipBoxWrapper}>
        <figure className={styles.spotBox}>
          <Image
            src={tip.spotImage}
            alt={tip.spotName}
            width={36}
            height={36}
            className={styles.imageBorder}
          />
          <figcaption>
            <p>{tip.spotName}</p>
          </figcaption>
        </figure>
        {pathname === "/user/my-tips" && (
          <div className={styles.buttonBox}>
            <button
              className={styles.editButton}
              onClick={handleTipEditButtonClick}
            >
              수정
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleTipDeleteButtonClick}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <div className={styles.infoWrapper}>
        <p>
          1인 평균 비용
          <span>{tip.price}</span>원
        </p>
        |
        <p>
          대기 시간
          <span>
            {tip.waitingTime !== 0 ? (
              <span>
                {tip.waitingTime}
                <span className={styles.minute}>분</span>
              </span>
            ) : (
              "바로 입장"
            )}
          </span>
        </p>
        |<p>{tip.category}</p>
      </div>
      {tip.tipImages && tip.tipImages.length > 0 && (
        <div
          className={
            tip.tipImages.length === 2
              ? styles.imageFullWrapper
              : styles.imageWrapper
          }
        >
          {tip.tipImages.map((image, index) => (
            <div key={index}>
              <Image
                src={image?.path || ""}
                width={100}
                height={100}
                alt="spot image"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      )}
      <p>{tip.description}</p>
      <div className={styles.emotionWrapper}>
        {reactions.map((reaction, index) => (
          <div key={index} className={styles.emotionBox}>
            <Image
              src={reaction.src}
              alt={reaction.alt}
              width={16}
              height={16}
            />
            <p>{reaction.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipBox;
