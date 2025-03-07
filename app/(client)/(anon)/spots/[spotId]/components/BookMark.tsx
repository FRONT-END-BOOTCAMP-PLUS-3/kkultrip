"use client";

import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import styles from "./BookMark.module.scss";

const BookMark = ({
    isBookMarked,
    spotId,
}: {
    isBookMarked: boolean;
    spotId: number;
}) => {
    const accessUserId = "7379a017-90cb-40da-9635-eb7eff4d8e83";

    const [isBookMark, setIsBookMark] = useState(isBookMarked);

    const handleBookMark = () => {
        setIsBookMark((prev) => !prev);
        if (!isBookMark) {
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessUserId: accessUserId || "defaultUserId",
                    }),
                }
            );
        } else {
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessUserId: accessUserId || "defaultUserId",
                    }),
                }
            );
        }
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
