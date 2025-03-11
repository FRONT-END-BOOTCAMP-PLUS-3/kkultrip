"use client";

import { useAudioStore } from "@/store/useAudioStore";
import { useEffect, useRef, useState } from "react";
import { PiSpeakerSimpleNoneBold } from "react-icons/pi";
import styles from "./DocentContent.module.scss";
import SpeakerAnimation from "./SpeakerAnimation";

const DocentContent = ({
  title,
  description,
  audioPath,
  docentId,
}: {
  title: string;
  description: string;
  audioPath: string;
  docentId: number;
}) => {
  const { currentAudioId, setCurrentAudioId } = useAudioStore();
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
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(audioPath);

    return () => {
      audioRef.current?.pause();
    };
  }, [audioPath]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.log("Audio play error:", error);
        }
      });
      setCurrentAudioId(docentId);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, docentId, setCurrentAudioId]);

  useEffect(() => {
    if (currentAudioId !== docentId && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentAudioId, docentId, isPlaying]);

  const handlePlayClick = () => {
    if (currentAudioId !== docentId) {
      setCurrentAudioId(docentId);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

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
            onClick={handlePlayClick}
          />
        )}
      </div>
      <div className={styles.contentWrapper}>
        <p
          ref={contentRef}
          className={isExpanded ? styles.expandedText : styles.clampedText}
        >
          {description}
        </p>
        {isOverflowing && (
          <button onClick={handleToggleText} className={styles.moreButton}>
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DocentContent;
