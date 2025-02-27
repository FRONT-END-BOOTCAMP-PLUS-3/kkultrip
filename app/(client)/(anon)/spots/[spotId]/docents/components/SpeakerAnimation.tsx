import { useState } from "react";
import { PiSpeakerSimpleNoneFill } from "react-icons/pi";

import styles from "./speakerAnimation.module.scss";

export default function SpeakerAnimation({
    setIsPlaying,
}: {
    setIsPlaying: (isPlaying: boolean) => void;
}) {
    const [isAnimating] = useState(true);

    return (
        <div className={styles.container} onClick={() => setIsPlaying(false)}>
            <PiSpeakerSimpleNoneFill
                className={styles.icon}
                color="var(--primary-color)"
            />
            {isAnimating && (
                <>
                    <span className={styles.wave1}>)</span>
                    <span className={styles.wave2}>)</span>
                    <span className={styles.wave3}>)</span>
                </>
            )}
        </div>
    );
}
