"use client";

import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";

import { useState } from "react";
import styles from "./bookMark.module.scss";

const BookMark = () => {
    const [isBookMark, setIsBookMark] = useState(false);

    const handleBookMark = () => {
        setIsBookMark((prev) => !prev);
    };

    return (
        <button className={styles.bookmarkButton} onClick={handleBookMark}>
            {isBookMark ? (
                <FaBookmark size={24} color="var(--primary-color)" />
            ) : (
                <FaRegBookmark size={24} color="var(--primary-color)" />
            )}
        </button>
    );
};

export default BookMark;
