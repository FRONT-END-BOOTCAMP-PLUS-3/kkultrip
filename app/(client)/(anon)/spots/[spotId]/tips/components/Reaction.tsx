"use client";

import Image from "next/image";
import { PiSirenFill } from "react-icons/pi";
import Emotion from "./Emotion";
import styles from "./reaction.module.scss";
import { TipReactionDto } from "@/application/usecases/spot/dto/TipReactionDto";

const Reaction = ({ tipReaction }: { tipReaction: TipReactionDto[] }) => {
    console.log(tipReaction);

    const typeCounts = tipReaction.reduce((acc, { type }) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);
    return (
        <div className={styles.reactionContainer}>
            <button className={styles.reactionButton}>
                <Image
                    src="/images/reaction.png"
                    alt="반응 남기기"
                    width={16}
                    height={16}
                />
                <p>반응 남기기</p>
            </button>
            <div className={styles.emotionWrapper}>
                {typeCounts[1] > 0 && (
                    <Emotion count={typeCounts[1]} type={1} />
                )}
                {typeCounts[2] > 0 && (
                    <Emotion count={typeCounts[2]} type={2} />
                )}
                {typeCounts[3] > 0 && (
                    <Emotion count={typeCounts[3]} type={3} />
                )}
                {typeCounts[4] > 0 && (
                    <Emotion count={typeCounts[4]} type={4} />
                )}
            </div>
            <button className={styles.sirenButton}>
                <PiSirenFill color="var(--red-1-color)" size={16} />
            </button>
        </div>
    );
};

export default Reaction;
