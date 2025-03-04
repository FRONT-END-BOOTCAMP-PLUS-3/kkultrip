"use client";

import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import styles from "./bookMark.module.scss";

const BookMark = ({
    isBookMarked,
    spotId,
}: {
    isBookMarked: boolean;
    spotId: number;
}) => {
    const accessUserId = "de72be1d-a8ae-434a-a72c-610e49328f06";

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
