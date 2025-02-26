"use client";

import Emotion from "./Emotion";
import styles from "./reaction.module.scss";
import Image from "next/image";
import { PiSirenFill } from "react-icons/pi";

const Reaction = () => {
    return (
        <div className={styles.reactionContainer}>
            <button className={styles.reactionButton}>
                <Image
                    src="data:image/png;base64,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"
                    alt="반응 남기기"
                    width={16}
                    height={16}
                />
                <p>반응 남기기</p>
            </button>
            <div className={styles.emotionWrapper}>
                <Emotion count={7} />
                <Emotion count={5} />
                <Emotion count={4} />
            </div>
            <button className={styles.sirenButton}>
                <PiSirenFill color="var(--red-1-color)" size={16} />
            </button>
        </div>
    );
};

export default Reaction;
