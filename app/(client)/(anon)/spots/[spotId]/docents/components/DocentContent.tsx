"use client";

import { useEffect, useRef, useState } from "react";
import { HiSpeakerWave } from "react-icons/hi2";
import styles from "./docentContent.module.scss";

const DocentContent = ({ content }: { content: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
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
    }, [content]);

    return (
        <div className={styles.docentContainer}>
            <div className={styles.docentBox}>
                <h3>불국사의 역사</h3>
                <HiSpeakerWave size={16} color="var(--primary-color)" />
            </div>
            <div className={styles.contentWrapper}>
                <p
                    ref={contentRef}
                    className={
                        isExpanded ? styles.expandedText : styles.clampedText
                    }
                >
                    {content}
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
