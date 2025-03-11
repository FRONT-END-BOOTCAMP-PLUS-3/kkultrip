"use client";

import { TipReactionDto } from "@/application/usecases/spot/tips/dto/TipReactionDto";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import Emotion from "./Emotion";
import styles from "./Reaction.module.scss";
import Report from "./Report";
import useUserStore from "@/store/useUserStore";

const Reaction = ({
  tipReaction,
  userId, // 작성자 아이디
  tipId,
}: {
  tipReaction: TipReactionDto[];
  userId: string;
  tipId: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [tipReactions, setTipReactions] =
    useState<TipReactionDto[]>(tipReaction);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const user = useUserStore();
  const accessUserId = user.id;

  const userReactionType = useMemo(() => {
    return tipReactions.find((reaction) => reaction.userId === accessUserId)
      ?.type;
  }, [tipReactions, accessUserId]);

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  const handleReactionClick = async (type: number) => {
    const button = document.getElementById(`reaction-button-${type}`);
    if (button) {
      button.classList.add(styles.shake);
      setTimeout(() => {
        button.classList.remove(styles.shake);
        setIsModalOpen(false);
      }, 1000);
    }

    if (userId === accessUserId) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 1000);
      return;
    }

    if (userReactionType) {
      if (userReactionType === type) {
        try {
          const response = await fetch(`/api/tips/${tipId}/reactions`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: accessUserId,
              type,
            }),
          });

          if (response.ok) {
            console.log("반응 삭제 성공");

            setTipReactions((prevReactions) =>
              prevReactions.filter((reaction) => reaction.type !== type)
            );
          } else {
            console.error("반응 삭제 실패", Error);
          }
        } catch (error) {
          console.error("Error while deleting reaction:", error);
        }
      } else {
        try {
          const response = await fetch(`/api/tips/${tipId}/reactions`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: accessUserId,
              type,
            }),
          });

          if (response.ok) {
            console.log("반응 수정 성공");

            setTipReactions((prevReactions) =>
              prevReactions.map((reaction) =>
                reaction.userId === accessUserId
                  ? { ...reaction, type }
                  : reaction
              )
            );
          } else {
            console.error("반응 수정 실패", Error);
          }
        } catch (error) {
          console.error("Error while updating reaction:", error);
        }
      }
    } else {
      try {
        const response = await fetch(`/api/tips/${tipId}/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: accessUserId,
            type,
          }),
        });

        if (response.ok) {
          const newReaction = await response.json();

          setTipReactions((prevReactions) => [...prevReactions, newReaction]);
          console.log("반응 남기기 성공");
        } else {
          console.error("반응 남기기 실패", Error);
        }
      } catch (error) {
        console.error("Error while creating reaction:", error);
      }
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const typeCounts = tipReactions.reduce((acc, { type }) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const reactions: Record<number, { name: string; image: string }> = {
    1: { name: "유익하네요", image: "/images/reaction-type1.png" },
    2: { name: "가고싶어요", image: "/images/reaction-type2.png" },
    3: { name: "실망이에요", image: "/images/reaction-type3.png" },
    4: { name: "재미있어요", image: "/images/reaction-type4.png" },
  };

  return (
    <div className={styles.reactionContainer}>
      <button className={styles.reactionButton} onClick={handleButtonClick}>
        <Image
          src="/images/reaction.png"
          alt="반응 남기기"
          width={16}
          height={16}
        />
        반응 남기기
      </button>

      {isModalOpen && (
        <div ref={modalRef} className={styles.modal}>
          {[1, 2, 3, 4].map((type) => (
            <button
              key={type}
              className={`${styles.emotionOption} ${
                userReactionType === type ? styles.emotionOptionYellow : ""
              }`}
              id={`reaction-button-${type}`}
              onClick={() => handleReactionClick(type)}
            >
              <Image
                src={reactions[type].image}
                alt={reactions[type].name}
                width={30}
                height={30}
              />
              <p>{reactions[type].name}</p>
            </button>
          ))}
          {showMessage && (
            <div className={styles.reactionMessage}>
              자신의 팁에는 반응은 남길 수 없습니다.
            </div>
          )}
        </div>
      )}

      <div className={styles.emotionWrapper}>
        {typeCounts[1] > 0 && <Emotion count={typeCounts[1]} type={1} />}
        {typeCounts[2] > 0 && <Emotion count={typeCounts[2]} type={2} />}
        {typeCounts[3] > 0 && <Emotion count={typeCounts[3]} type={3} />}
        {typeCounts[4] > 0 && <Emotion count={typeCounts[4]} type={4} />}
      </div>

      <Report tipId={tipId} userId={userId} />
    </div>
  );
};

export default Reaction;
