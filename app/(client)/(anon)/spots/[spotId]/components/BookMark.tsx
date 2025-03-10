"use client";

import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import styles from "./BookMark.module.scss";

const BookMark = ({
    isBookMarked,
    spotId,
}: {
    isBookMarked: boolean;
    spotId: number;
}) => {
    const router = useRouter();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const [isBookMark, setIsBookMark] = useState(isBookMarked);

    const handleBookMark = () => {
        if (!isLoggedIn) {
            router.push("/login"); // 로그인 페이지로 이동
            return;
        }

        setIsBookMark((prev) => !prev);
        if (!isBookMark) {
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${spotId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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
                }
            );
        }
    };

    return (
        <button className={styles.bookmarkButton} onClick={handleBookMark}>
            {!isLoggedIn ? (
                <FaRegBookmark size={24} color="var(--primary-color)" />
            ) : isBookMark ? (
                <FaBookmark size={24} color="var(--primary-color)" />
            ) : (
                <FaRegBookmark size={24} color="var(--primary-color)" />
            )}
        </button>
    );
};

export default BookMark;
