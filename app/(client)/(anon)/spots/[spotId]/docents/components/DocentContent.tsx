"use client";

import { useEffect, useRef, useState } from "react";
import { PiSpeakerSimpleNoneBold } from "react-icons/pi";

import styles from "./docentContent.module.scss";
import SpeakerAnimation from "./SpeakerAnimation";

const DocentContent = ({
    title,
    description,
    audioPath,
}: {
    title: string;
    description: string;
    audioPath: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioPath);
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [isPlaying, audioPath]);

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