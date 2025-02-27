"use client";

import { useEffect, useRef, useState } from "react";
import { PiSpeakerSimpleNoneBold } from "react-icons/pi";

import styles from "./docentContent.module.scss";
import SpeakerAnimation from "./SpeakerAnimation";

const DocentContent = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    const handleToggleText = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseFloat(
                getComputedStyle(contentRef.current).lineHeight
            );
            const maxHeight = lineHeight * 5;
            setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
        }
    }, [description]);

    return (
        <div className={styles.docentContainer}>
            <div className={styles.docentWrapper}>
                <h3>{title}</h3>

                {isPlaying ? (
                    <SpeakerAnimation setIsPlaying={setIsPlaying} />
                ) : (
                    <PiSpeakerSimpleNoneBold
                        size={24}
                        color="var(--primary-color)"
                        onClick={() => setIsPlaying(!isPlaying)}
                    />
                )}
            </div>
            <div className={styles.contentWrapper}>
                <p
                    ref={contentRef}
                    className={
                        isExpanded ? styles.expandedText : styles.clampedText
                    }
                >
                    {description}
                </p>
                {isOverflowing && (
                    <button
                        onClick={handleToggleText}
                        className={styles.moreButton}
                    >
                        {isExpanded ? "접기" : "더보기"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DocentContent;
